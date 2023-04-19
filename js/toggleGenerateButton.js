export function toggleGenerateButton(button, currentlyGenerating) {
  const generateTxt2imgButton = document.getElementById('generate-txt2img-button');
  const generateImg2imgButton = document.getElementById('generate-img2img-button');

  if (button === 'txt2img') {
    if (currentlyGenerating === true) {
      generateTxt2imgButton.textContent = 'Generating txt2img';
      generateTxt2imgButton.style.color = '#ffffff';
      generateTxt2imgButton.style.backgroundColor = '#3573bb';
    } else {
      generateTxt2imgButton.textContent = 'Generate';
      generateTxt2imgButton.style.color = '#ffffff';
      generateTxt2imgButton.style.backgroundColor = '#3aa23a';
    }
  } else if (button === 'img2img') {
    if (currentlyGenerating === true) {
      generateImg2imgButton.textContent = 'Generating img2img';
      generateImg2imgButton.style.color = '#ffffff';
      generateImg2imgButton.style.backgroundColor = '#3573bb';
    } else {
      generateImg2imgButton.textContent = 'Generate';
      generateImg2imgButton.style.color = '#ffffff';
      generateImg2imgButton.style.backgroundColor = '#3aa23a';
    }
  } else {
    console.log('Oepsiewoepsie')
  }
}
