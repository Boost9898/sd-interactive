export function toggleGenerateButton(params) {
  const generateButton = document.getElementById('generate-button');
  if (arg === true) {
    generateButton.textContent = 'Generating';
    generateButton.style.color = '#ffffff';
    generateButton.style.backgroundColor = '#3573bb';
  } else {
    generateButton.textContent = 'Generate';
    generateButton.style.color = '#ffffff';
    generateButton.style.backgroundColor = '#3aa23a';
  }
}
