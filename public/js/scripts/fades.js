// ************************************************** \\
// LOADER FADE IN/FADE OUT
// ************************************************** \\
export function fadeIn(element, duration) {
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  element.classList.add("show");
}

export function fadeOut(element, duration) {
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  element.classList.remove("show");
}
