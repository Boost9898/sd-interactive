import { api } from './main.js';

export async function showModels() {
  try {
    const response = await fetch(`${api}/sdapi/v1/sd-models`);
    const models = await response.json();
    console.log(models);
  } catch (error) {
    console.error(error);
  }
}