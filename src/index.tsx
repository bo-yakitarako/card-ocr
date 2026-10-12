import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import type { PropsWithChildren } from "hono/jsx";

const Layout = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body class="min-h-screen bg-slate-100 text-slate-900">
      {children}
    </body>
  </html>
);

const app = new Hono();

app.use("/style.css", serveStatic({ root: "./public" }));

app.get("/", (c) => {
  return c.html(
    <Layout title="Card OCR">
      <main class="mx-auto flex max-w-2xl flex-col items-center gap-6 p-8">
        <h1 class="text-3xl font-bold tracking-tight">Card OCR</h1>
        <p class="text-slate-600">名刺を読み取ってテキストに変換いたしますわ。</p>
      </main>
    </Layout>,
  );
});

export default app;
