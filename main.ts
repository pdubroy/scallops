import { ulid } from "jsr:@std/ulid";

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
  fn: (value: T) => V,
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
  return `<li><a href="${url}">${title}</a></li>`;
}

// Handlers
// --------

export async function get_index(_req: Request): Promise<Response> {
  const storyArr = kv.list<StoryData>(
    { prefix: ["stories"] },
    { reverse: true },
  );
  const stories = await mapValuesAsync(storyArr, story);
  return new Response(
    dedent(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Scallops</h1>
          <ul>${stories.join("\n")}</ul>
        </body>
      </html>`),
    {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    },
  );
}

export function get_submit(_req: Request): Response {
  return new Response(
    `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Submit</h1>
          <form action="/stories" method="post">
            <label>URL:</label><br />
            <input type="url" name="url" /><br />

            <label>Title:</label><br />
            <input type="text" name="title" /><br />

            <label>Tags (comma-separated):</label><br />
            <input type="text" name="tags" /><br />

            <label>Text:</label><br />
            <textarea name="text" rows="5"></textarea><br />

            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
      `,
    {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    },
  );
}

export async function post_stories(req: Request): Promise<Response> {
  const formData = await req.formData();
  const id = ulid();
  await kv.set(["stories", id], { id, ...Object.fromEntries(formData) });
  return new Response(`Submitted! Thanks.`, {
    status: 200,
  });
}

// Main
// ----

function main() {
  Deno.serve(async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    switch (url.pathname) {
      case "/":
        return get_index(req);
      case "/submit":
        if (req.method === "GET") return get_submit(req);
        break;
      case "/stories":
        if (req.method === "POST") return post_stories(req);
        break;
    }

    return new Response("!found", { status: 404 });
  });
}

main();
