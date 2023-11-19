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
  `Please use the word in "${sentence}" to write a more detailed animation-like description Please use the word in input to write a more detailed animation-like description in one line of English`;

export const getPrompt = async (sentence: string) => {
  const prompts = await openai.completions.create({
    model: "text-davinci-003",
    n: 5,
    prompt: makePrompt(sentence),
  });

  return prompts.choices.map((choice) => {
    const text = choice.text.replaceAll("\n\n", "");
    if (text.startsWith(".")) {
      text.replace(".", "");
    }
    return text;
  });
};
