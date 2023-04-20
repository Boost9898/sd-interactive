export function toggleGenerateButton(buttonType, currentlyGenerating) {
  const buttonMap = {
    txt2img: {
      defaultText: 'Generate txt2img',
      generatingText: 'Generating txt2img',
      bgColor: '#3aa23a',
      generatingBgColor: '#3573bb'
    },
    img2img: {
      defaultText: 'Generate img2img',
      generatingText: 'Generating img2img',
      bgColor: '#3aa23a',
      generatingBgColor: '#3573bb'
    }
  };

  const button = document.getElementById(`generate-${buttonType}-button`);
  const { defaultText, generatingText, bgColor, generatingBgColor } = buttonMap[buttonType];

  if (currentlyGenerating) {
    button.textContent = generatingText;
    button.style.color = '#ffffff';
    button.style.backgroundColor = generatingBgColor;
  } else {
    button.textContent = defaultText;
    button.style.color = '#ffffff';
    button.style.backgroundColor = bgColor;
  }
}
