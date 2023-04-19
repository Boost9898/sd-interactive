const prompt = "(((Rembrandt, Dutch oil painting)))"

const prompts = [
  `futuristic robot man at night, neon lights, ${prompt}`,
  `warrior princess, long red hair, hyperrealistic, ${prompt}`,
  `abstract person, vibrant colors, dreamlike, painterly style, sense of movement, ${prompt}`,
  `photo of a ultra realistic baby, trending on artstation, 4k, masterpiece, ${prompt}`,
  `head made of sponges, bright, colorful, texture, hyperrealistic, detailed, ${prompt}`,
];

export function randomPrompt() {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}