import { getFocusableChildren } from '@/utils/FocusableElements';

const FOCUSABLE_ELEMENT_IDS = [
  'focusable-anchor',
  'focusable-area',
  'focusable-input',
  'focusable-select',
  'focusable-textarea',
  'focusable-button',
  'focusable-iframe',
  'focusable-div',
  'focusable-contenteditable',
];

const NON_FOCUSABLE_ELEMENT_IDS = [
  'non-focusable-anchor-href',
  'non-focusable-anchor-tabindex',
  'non-focusable-area-href',
  'non-focusable-area-tabindex',
  'non-focusable-input-disabled',
  'non-focusable-input-tabindex',
  'non-focusable-select-disabled',
  'non-focusable-select-tabindex',
  'non-focusable-textarea-disabled',
  'non-focusable-textarea-tabindex',
  'non-focusable-button-disabled',
  'non-focusable-button-tabindex',
  'non-focusable-iframe-tabindex',
  'non-focusable-div-standard',
  'non-focusable-div-tabindex',
  'non-focusable-contenteditable-tabindex',
];

describe('FocusableElements', () => {
  afterEach(() => {
  });

  describe('getFocusableChildren', () => {
    it('Should return the focusable elements for the document if not passed a parent element', () => {
      mountAllElements(document.body);
      const focusableElements = getFocusableChildren();
      expect(focusableElements).toHaveLength(FOCUSABLE_ELEMENT_IDS.length);
      const focusableElementIds = [ ...focusableElements ].map((element) => element.getAttribute('data-test-id'));
      expect(FOCUSABLE_ELEMENT_IDS.every((id) => focusableElementIds.includes(id))).toBe(true);
      expect(NON_FOCUSABLE_ELEMENT_IDS.some((id) => focusableElementIds.includes(id))).toBe(false);
    });

    it('Should return the focusable elements for the document if passed a parent element', () => {
      const container = document.createElement('section');
      document.body.appendChild(container);
      mountAllElements(container);
      const focusableElements = getFocusableChildren(container);
      expect(focusableElements).toHaveLength(FOCUSABLE_ELEMENT_IDS.length);
      const focusableElementIds = [ ...focusableElements ].map((element) => element.getAttribute('data-test-id'));
      expect(FOCUSABLE_ELEMENT_IDS.every((id) => focusableElementIds.includes(id))).toBe(true);
      expect(NON_FOCUSABLE_ELEMENT_IDS.some((id) => focusableElementIds.includes(id))).toBe(false);
    });

    it('Should not return the focusable elements for another parent', () => {
      const container = document.createElement('section');
      document.body.appendChild(container);
      const container2 = document.createElement('section');
      document.body.appendChild(container2);
      mountAllElements(container);
      const focusableElements = getFocusableChildren(container2);
      expect(focusableElements).toHaveLength(0);
    });
  });
});

function mountAllElements (parent) {
  parent.appendChild(createFocusableAnchor());
  parent.appendChild(createNonFocusableAnchorByHref());
  parent.appendChild(createNonFocusableAnchorByTabindex());
  parent.appendChild(createFocusableArea());
  parent.appendChild(createNonFocusableAreaByHref());
  parent.appendChild(createNonFocusableAreaByTabindex());
  parent.appendChild(createFocusableInput());
  parent.appendChild(createNonFocusableInputByDisabled());
  parent.appendChild(createNonFocusableInputByTabindex());
  parent.appendChild(createFocusableSelect());
  parent.appendChild(createNonFocusableSelectByDisabled());
  parent.appendChild(createNonFocusableSelectByTabindex());
  parent.appendChild(createFocusableTextarea());
  parent.appendChild(createNonFocusableTextareaByDisabled());
  parent.appendChild(createNonFocusableTextareaByTabindex());
  parent.appendChild(createFocusableButton());
  parent.appendChild(createNonFocusableButtonByDisabled());
  parent.appendChild(createNonFocusableButtonByTabindex());
  parent.appendChild(createFocusableIframe());
  parent.appendChild(createNonFocusableIframeByTabindex());
  parent.appendChild(createDiv());
  parent.appendChild(createFocusableDiv());
  parent.appendChild(createNonFocusableDivTabindex());
  parent.appendChild(createFocusableContenteditable());
  parent.appendChild(createNonFocusableContenteditableTabindex());
}

// a
function createFocusableAnchor() {
  const element = document.createElement('a');
  element.setAttribute('href', 'https://test.reedsy.local');
  element.setAttribute('data-test-id', 'focusable-anchor');
  return element;
}

function createNonFocusableAnchorByHref() {
  // An anchor that does not have href is not focusable
  const element = document.createElement('a');
  element.setAttribute('data-test-id', 'non-focusable-anchor-href');
  return element;
}

function createNonFocusableAnchorByTabindex() {
  const element = createFocusableAnchor();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-anchor-tabindex');
  return element;
}

// area
function createFocusableArea() {
  const element = document.createElement('area');
  element.setAttribute('href', 'https://test.reedsy.local');
  element.setAttribute('data-test-id', 'focusable-area');
  return element;
}

function createNonFocusableAreaByHref() {
  // An area that does not have href is not focusable
  const element = document.createElement('area');
  element.setAttribute('data-test-id', 'non-focusable-area-href');
  return element;
}

function createNonFocusableAreaByTabindex() {
  const element = createFocusableArea();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-area-tabindex');
  return element;
}

// input
function createFocusableInput() {
  const element = document.createElement('input');
  element.setAttribute('data-test-id', 'focusable-input');
  return element;
}

function createNonFocusableInputByDisabled() {
  const element = createFocusableInput();
  element.setAttribute('disabled', 'disabled');
  element.setAttribute('data-test-id', 'non-focusable-input-disabled');
  return element;
}

function createNonFocusableInputByTabindex() {
  const element = createFocusableInput();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-input-tabindex');
  return element;
}

// select
function createFocusableSelect() {
  const element = document.createElement('select');
  element.setAttribute('data-test-id', 'focusable-select');
  return element;
}

function createNonFocusableSelectByDisabled() {
  const element = createFocusableSelect();
  element.setAttribute('disabled', 'disabled');
  element.setAttribute('data-test-id', 'non-focusable-select-disabled');
  return element;
}

function createNonFocusableSelectByTabindex() {
  const element = createFocusableSelect();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-select-tabindex');
  return element;
}

// textarea
function createFocusableTextarea() {
  const element = document.createElement('textarea');
  element.setAttribute('data-test-id', 'focusable-textarea');
  return element;
}

function createNonFocusableTextareaByDisabled() {
  const element = createFocusableTextarea();
  element.setAttribute('disabled', 'disabled');
  element.setAttribute('data-test-id', 'non-focusable-textarea-disabled');
  return element;
}

function createNonFocusableTextareaByTabindex() {
  const element = createFocusableTextarea();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-textarea-tabindex');
  return element;
}

// button
function createFocusableButton() {
  const element = document.createElement('button');
  element.setAttribute('data-test-id', 'focusable-button');
  return element;
}

function createNonFocusableButtonByDisabled() {
  const element = createFocusableButton();
  element.setAttribute('disabled', 'disabled');
  element.setAttribute('data-test-id', 'non-focusable-button-disabled');
  return element;
}

function createNonFocusableButtonByTabindex() {
  const element = createFocusableButton();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-button-tabindex');
  return element;
}

// iframe
function createFocusableIframe() {
  const element = document.createElement('iframe');
  element.setAttribute('data-test-id', 'focusable-iframe');
  return element;
}

function createNonFocusableIframeByTabindex() {
  const element = createFocusableIframe();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-iframe-tabindex');
  return element;
}

// div (represents non-standard focusable elements)
function createDiv () {
  const element = document.createElement('div');
  element.setAttribute('data-test-id', 'non-focusable-div-standard');
  return element;
}

function createFocusableDiv () {
  const element = createDiv();
  element.setAttribute('tabindex', '0');
  element.setAttribute('data-test-id', 'focusable-div');
  return element;
}

function createNonFocusableDivTabindex () {
  const element = createDiv();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-div-tabindex');
  return element;
}

// contenteditable
function createFocusableContenteditable () {
  const element = createDiv();
  element.setAttribute('contenteditable', 'true');
  element.setAttribute('data-test-id', 'focusable-contenteditable');
  return element;
}

function createNonFocusableContenteditableTabindex () {
  const element = createFocusableContenteditable();
  element.setAttribute('tabindex', '-1');
  element.setAttribute('data-test-id', 'non-focusable-contenteditable-tabindex');
  return element;
}
