import Stream from "@elysiajs/stream";
import { Midjourney } from "freezer-midjourney-api";

export * from "./midjourney";
export * from "./discord.message";
export * from "./discord.ws";
export * from "./interfaces/index";
export * from "./midjourne.api";
export * from "./command";
export * from "./verify.human";
export * from "./banned.words";
export * from "./face.swap";

let client: Midjourney;

/**
 *
 * a simple example of using the imagine api with ws
 * ```
 * npx tsx example/imagine-ws.ts
 * ```
 */
export async function main(stream: Stream<any>, prompt: string) {
  client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    // HuggingFaceToken: <string>process.env.HUGGINGFACE_TOKEN,
    Debug: true,
    Ws: true, // required  `Only you can see this`
  });
  try {
    function getProgress(uri: string, progress: string) {
      console.log("Imagine.loading", uri, "progress", progress);
      console.log(uri, progress, "<<<<!=============================");
      stream.send(JSON.stringify({ uri, progress }));
    }
    await client?.Connect(); // required
    const image = await client?.Imagine(
      // "Describe a live-action battle sequence featuring Iron Man and another Marvel hero of your choice. --turbo",
      `${prompt} --turbo`,
      getProgress
    );
    if (image) {
      stream.send(JSON.stringify(image));
    }
  } catch (error) {
    console.log(`[IMAGINE ERROR]: ${error}`);
  } finally {
    stream.close();
    client.Close();
  }
  // if (!Imagine) {
  //   return;
  // }
  // const reroll = await client.Reroll({
  //   msgId: <string>Imagine.id,
  //   hash: <string>Imagine.hash,
  //   flags: Imagine.flags,
  //   loading: (uri: string, progress: string) => {
  //     console.log("Reroll.loading", uri, "progress", progress);
  //   },
  // });
  // console.log({ reroll });

  // const Variation = await client.Variation({
  //   index: 2,
  //   msgId: <string>Imagine.id,
  //   hash: <string>Imagine.hash,
  //   flags: Imagine.flags,
  //   loading: (uri: string, progress: string) => {
  //     console.log("Variation.loading", uri, "progress", progress);
  //   },
  // });

  // console.log({ Variation });
  // if (!Variation) {
  //   return;
  // }
  // const Upscale = await client.Upscale({
  //   index: 2,
  //   msgId: <string>Variation.id,
  //   hash: <string>Variation.hash,
  //   flags: Variation.flags,
  //   loading: (uri: string, progress: string) => {
  //     console.log("Upscale.loading", uri, "progress", progress);
  //   },
  // });
  // console.log({ Upscale });
}
// main()
//   .then(() => {
//     // console.log("finished");
//     // process.exit(0);
//   })
//   .catch((err) => {
//     console.log("finished");
//     console.error(err);
//     process.exit(1);
//   });
