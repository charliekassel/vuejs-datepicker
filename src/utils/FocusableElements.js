// Adapted from https://stackoverflow.com/a/30753870
const FOCUSABLE_ELEMENTS_SELECTOR = `
  a[href]:not([tabindex^='-']),
  area[href]:not([tabindex^='-']),
  input:not([disabled]):not([tabindex^='-']),
  select:not([disabled]):not([tabindex^='-']),
  textarea:not([disabled]):not([tabindex^='-']),
  button:not([disabled]):not([tabindex^='-']),
  iframe:not([tabindex^='-']),
  [tabindex]:not([tabindex^='-']),
  [contentEditable=true]:not([tabindex^='-'])
`;

export function getFocusableChildren(parent = document.body) {
  return parent.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
}
