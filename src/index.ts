import { Elysia } from "elysia";
import { main } from "../mj";
import { Stream } from "@elysiajs/stream";
const app = new Elysia()
  .get("/", (context) => {
    const { prompt } = context.query;
    return new Stream(async (stream) => main(stream, prompt));
  })
  // .get('/', () => new Stream(async (stream) => {
  //     stream.send('hello')

  //     await stream.wait(1000)
  //     stream.send('world')

  //     stream.close()
  // }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
