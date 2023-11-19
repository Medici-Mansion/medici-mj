import { Elysia } from "elysia";

import { Stream } from "@elysiajs/stream";
import { main } from "mj";
const PORT = process.env.PORT || 3000;
const app = new Elysia()
  .get("/", (context) => {
    console.log(context.path, context.request.url);
    try {
      const { prompt } = context.query;
      if (context?.headers?.auth !== process.env.TOKEN || !prompt) {
        return;
      }
      return new Stream(async (stream) => main(stream, prompt));
    } catch (error) {
      context.set.status = 400;
      return {
        error: "Unkown Exception",
      };
    }
  })
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
