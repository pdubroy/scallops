import { FC } from "jsr:@hono/hono/jsx";
import { Hono } from "jsr:@hono/hono";

import { ulid } from "jsr:@std/ulid";
import { html } from "jsr:@hono/hono/html";

const kv = await Deno.openKv();

interface StoryData {
  id: string;
  url?: string;
  title?: string;
  text?: string;
  tags?: string;
}

// Helpers
// -------

function checkNotNull<T>(x: T | null): NonNullable<T> {
  if (x == null) {
    throw new Error(`Expected non-null value: ${x}`);
  }
  return x;
}

function checkNumber(x: unknown): number {
  if (typeof x !== "number") {
    throw new Error(`Expected number: ${x}`);
  }
  return x;
}

function dedent(text: string): string {
  const lines = text.split("\n");
  const minSpaces = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0]?.length ?? 0)
    .reduce((min, curr) => Math.min(min, curr), Infinity);
  return lines.map((l: string) => l.slice(minSpaces)).join("\n");
}

async function mapValuesAsync<T, V>(
  iter: Deno.KvListIterator<T>,
  fn: (value: T) => V
): Promise<V[]> {
  const arr = [];
  for await (const x of iter) {
    arr.push(fn(x.value));
  }
  return arr;
}

function story(data: StoryData) {
  const url = data.url || `/stories/${data.id}`;
  const title = data.title || "(no title)";
  return (
    <li>
      <a href={url}>{title}</a>
    </li>
  );
}

// Views
// -----

const Layout: FC = ({ children }) => {
  return (
    <>
      {html`<!DOCTYPE html>`}
      <html lang="en">
        <head>
          <title>Scallops</title>
        </head>
        <body>{children}</body>
      </html>
    </>
  );
};

// Handlers
// --------

const app = new Hono();

app.get("/", async (c) => {
  const storyArr = kv.list<StoryData>(
    { prefix: ["stories"] },
    { reverse: true }
  );
  const stories = await mapValuesAsync(storyArr, story);
  return c.html(
    <Layout>
      <h1>Scallops</h1>
      <ul>{stories}</ul>
    </Layout>
  );
});

app.get("/submit", (c) => {
  return c.html(
    <Layout>
      <h1>Submit</h1>
      <form action="/stories" method="post">
        <label>URL:</label>
        <br />
        <input type="url" name="url" />
        <br />

        <label>Title:</label>
        <br />
        <input type="text" name="title" />
        <br />

        <label>Tags (comma-separated):</label>
        <br />
        <input type="text" name="tags" />
        <br />

        <label>Text:</label>
        <br />
        <textarea name="text" rows={5}></textarea>
        <br />

        <input type="submit" value="Submit" />
      </form>
    </Layout>
  );
});

app.post("/stories", async (c) => {
  const formData = await c.req.formData();
  const id = ulid();
  await kv.set(["stories", id], { id, ...Object.fromEntries(formData) });
  return new Response(`Submitted! Thanks.`, {
    status: 200,
  });
});

// Main
// ----

Deno.serve(app.fetch);
