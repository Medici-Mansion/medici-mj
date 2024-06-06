import { Elysia, t } from "elysia";

import { Stream } from "@elysiajs/stream";
import { cors } from "@elysiajs/cors";

import { main } from "mj";
import { getPrompt } from "gen-prompt";
import { helmet } from "elysia-helmet";

const PORT = process.env.PORT || 3000;
const app = new Elysia()
  .use(helmet())
  .use(cors())
  .guard({
    headers: t.Object({
      auth: t.String({}),
    }),
  })
  .post("/image", (context) => {
    console.log(context.body, " [context]");
    console.log(typeof context.body, " [context]");
    console.log(context.body.prompt, " [context]");
    try {
      const { prompt } = context.body;
      console.log(context.headers.auth);
      console.log(process.env.TOKEN);
      console.log(prompt);
      if (context.headers.auth !== process.env.TOKEN || !prompt) {
        return "No Auth";
      }
      return new Stream(async (stream) => main(stream, prompt));
    } catch (error) {
      console.log(error, " !!!!ERROR");
      context.set.status = 400;
      return {
        error,
        message: "Unknown Exception",
      };
    }
  })
  .post(
    "/prompt",
    async (context) => {
      console.log(context.path, context.request.url);
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
          error,
          message: "Unknown Exception",
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
