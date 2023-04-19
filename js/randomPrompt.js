const prompt = "Rembrandt, Dutch oil painting, greg rutkowski"

const prompts = [
  `android, at night, neon lights, ${prompt}`,
  `warrior, red hair, hyperrealistic, ${prompt}`,
  `male, bright colors, dreamlike, ${prompt}`,
  `baby, ultra realistic, trending on artstation, 4k, masterpiece, ${prompt}`,
  `cartoon, bright, colorful, texture, hyperrealistic, detailed, ${prompt}`,
];

export function randomPrompt() {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}