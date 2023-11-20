import { Elysia, t } from "elysia";

import { Stream } from "@elysiajs/stream";
import { cors } from "@elysiajs/cors";

import { main } from "mj";
import { getPrompt } from "gen-prompt";
import { helmet } from "elysia-helmet";

const PORT = process.env.PORT || 3000;
const app = new Elysia()
  .use(cors())
  .use(helmet())
  .guard({
    headers: t.Object({
      auth: t.String({}),
    }),
  })
  .get("/image", (context) => {
    console.log(context.path, context.request.url);
    try {
      const { prompt } = context.query;
      if (context.headers.auth !== process.env.TOKEN || !prompt) {
        return;
      }
      return new Stream(async (stream) => main(stream, prompt));
    } catch (error) {
      context.set.status = 400;
      return {
        error: "Unknown Exception",
      };
    }
  })
  .post(
    "/prompt",
    async (context) => {
      try {
        const body = context.body;
        if (context.headers.auth !== process.env.TOKEN) {
          return { ok: false };
        }
        if (!body?.sentence) {
          return { ok: false };
        }
        const data = await getPrompt(body.sentence);
        return { ok: true, data };
      } catch (error) {
        context.set.status = 400;
        return {
          error: "Unknown Exception",
        };
      }
    },
    {
      body: t.Object({
        sentence: t.String(),
      }),
    }
  )
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
