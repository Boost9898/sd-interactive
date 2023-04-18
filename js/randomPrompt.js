const prompts = [
  "futuristic cityscape at night, with neon lights, flying cars, and tall skyscrapers reaching towards the sky, cinematic, atmospheric",
  "portrait of a warrior princess, with long flowing hair, wearing armor and carrying a sword, hyperrealistic, detailed, sharp focus, dynamic lighting",
  "abstract landscape, vibrant colors, surreal, dreamlike, otherworldly, painterly style, sense of movement.",
  "photo of a ultra realistic sailing ship, dramatic light, cinematic, low angle, trending on artstation, 4k, hyper realistic, focused, unreal engine 5, cinematic, masterpiece",
  "still life of a fruit bowl, variety of fruits in different colors, bright, colorful, texture, hyperrealistic, detailed, depth.",
];

export function randomPrompt() {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}