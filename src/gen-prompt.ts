import OpenAI from "openai";
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
// const makePrompt = (sentence: string) => `
// Create prompts for Midjourney AI with the following conditions:
// 1. Must be based on a specific input sentence "${sentence}".
// 2. Should be formulated as a single line in English.
// 3. Must be written in English.
// 4. No words or sentences other than the Ordered List should appear.
// 5. Display in an Ordered List format.
// 6. There should be five results.
// `;
const makePrompt = (sentence: string) =>
  `Please use the word in "${sentence}" to write a more detailed animation-like description Please use the word in input to write a more detailed animation-like description in one line of English 

  - make 5 prompts
  - Remove unexpected words or phrases from the prompt.
  - List based on line breaks
  - The maximum number of words must be 15 words or less.
  - Make the most of the sentences inside the ""
  `;

export const getPrompt = async (sentence: string) => {
  // const prompts = await openai.completions.create({
  //   model: "",
  //   n: 5,
  //   prompt: makePrompt(sentence),
  // });
  // return prompts.choices.map((choice) => {

  //   const text = choice.text.replaceAll("\n\n", "");
  //   if (text.startsWith(".")) {
  //     text.replace(".", "");
  //   }
  //   return text;
  // });
  const prompts = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [{ role: "user", content: makePrompt(sentence) }],
  });

  let message: string[] = [];
  const content = prompts.choices[0].message.content;
  if (content) {
    content.replaceAll("\n", "");
    message = content.split("\n").map((text) => {
      let re = text.replace("-", "").replaceAll('"', "").trim();
      if (re.endsWith(".")) {
        re = re.substring(0, re.length - 1);
      }
      return re;
    });
  }
  return message;
};
