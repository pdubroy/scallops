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
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
          />
          <title>Scallops</title>
        </head>
        <body>
          <main class="container">{children}</main>
        </body>
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
