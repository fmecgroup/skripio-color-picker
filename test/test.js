'use strict';
/* global ClipboardJS skripio */
import SkripioComponent from '../src/modules/component.js';

const RESPONSE_CODES_COLORS = {
  [skripio.lib.Emitter.codes.DEV_ERROR]: 'danger',
  [skripio.lib.Emitter.codes.USER_ERROR]: 'warning',
  [skripio.lib.Emitter.codes.RESULT]: 'success',
  [skripio.lib.Emitter.codes.DONE]: 'secondary'
};

const SKRIPIO_METHODS = [
  {
    name: 'initObject',
    args: [
      {
        type: 'input-element',
        name: 'objectName',
        default: 'colorPicker'
      },
      {
        type: 'editor-element',
        name: 'args',
        default: {
          ConstructorOptions: {
            spectrumOptions: {
              color: 'blue'
            }
          }
        }
      },
      {
        type: 'input-element',
        name: 'callback',
        default: 'initObject'
      }
    ]
  },
  {
    name: 'runObjectMethod',
    args: [
      {
        type: 'selector-element',
        name: 'object',
        options: () => {
          return Object.getOwnPropertyNames(skripio.objects);
        }
      },
      {
        type: 'selector-element',
        name: 'method',
        options: () => {
          let methods = Object.getOwnPropertyNames(SkripioComponent.prototype);
          methods = methods.filter((element) => {
            if (element !== 'constructor' && element[0] !== '_') {
              return true;
            } else {
              return false;
            }
          });
          return methods;
        }
      },
      {
        type: 'editor-element',
        name: 'methodArgs',
        default: {}
      },
      {
        type: 'input-element',
        name: 'callback',
        default: 'runObjectMethod'
      }
    ]
  },
  {
    name: 'toggleProgress',
    args: [
      {
        type: 'input-element',
        name: 'status',
        default: true
      },
      {
        type: 'input-element',
        name: 'callback',
        default: 'toggleProgress'
      }
    ]
  }
];

const IDS = {
  methodSelector: '#globalMethodSelector',
  methodArgs: '#methodArgs',
  clear: '#clear',
  sync: '#sync',
  async: '#async'
};

const delegatedClickHandler = (event) => {
  if (event.target.dataset.skripio === 'show-raw') {
    if (event.target.checked) {
      event.target.closest('.alert').querySelector('textarea[data-skripio="raw-result"]').classList.remove('d-none');
      event.target.closest('.alert').querySelector('div[data-skripio="formatted-result"]').classList.add('d-none');
      event.target.closest('.alert').querySelector('button[data-skripio="copy"]').removeAttribute('disabled');
    } else {
      event.target.closest('.alert').querySelector('textarea[data-skripio="raw-result"]').classList.add('d-none');
      event.target.closest('.alert').querySelector('div[data-skripio="formatted-result"]').classList.remove('d-none');
      event.target.closest('.alert').querySelector('button[data-skripio="copy"]').setAttribute('disabled', 'disabled');
    }
  }
};

const asyncResponseHandler = (event) => {
  emitLogItem(event.target.innerText, IDS.async);
};

const runMethodHandler = (event) => {
  if (document.querySelector(IDS.clear).checked) {
    document.querySelector(IDS.sync).innerHTML = '';
    document.querySelector(IDS.async).innerHTML = '';
  }
  const skripioMethodPickerElement = document.querySelector(IDS.methodSelector);
  const methodToRun = skripioMethodPickerElement.value;
  const methodToRunConfig = SKRIPIO_METHODS.find((element) => {
    if (element.name === methodToRun) {
      return true;
    }
    return false;
  });
  const methodToRunArgValues = [];

  for (const arg of methodToRunConfig.args) {
    if (arg.value() === '') {
      methodToRunArgValues.push(undefined);
      continue;
    }
    methodToRunArgValues.push(arg.value());
  }

  const result = window.skripio[methodToRun](...methodToRunArgValues);
  emitLogItem(result, IDS.sync);

  const resultObject = JSON.parse(result);
  if (resultObject.payload.response) {
    document.querySelector(`#${resultObject.payload.response}`).addEventListener('click', asyncResponseHandler);
  }
};

const selectMethodHandler = (event) => {
  const methodName = document.querySelector(IDS.methodSelector).value;
  const method = SKRIPIO_METHODS.find((element) => {
    if (element.name === methodName) {
      return true;
    }
    return false;
  });
  initSkripioMethodUi(method);
};

const emitLogItem = (resultString, logContainer) => {
  const resultObject = JSON.parse(resultString);
  const color = RESPONSE_CODES_COLORS[resultObject.code];
  const formatter = new window.JSONFormatter(resultObject, 2, {
    hoverPreviewEnabled: true,
    hoverPreviewArrayCount: 100,
    hoverPreviewFieldCount: 5,
    theme: '',
    animateOpen: true,
    animateClose: true,
    useToJSON: true
  }).render();
  formatter.setAttribute('data-skripio', 'formatted-result');
  formatter.classList.add('small', 'overflow-auto');

  const logItem = document.getElementById('log-item').content.cloneNode(true);
  const now = new Date();

  logItem.querySelector('textarea[data-skripio="raw-result"]').innerText = resultString;
  logItem.querySelector('[data-skripio="timestamp"]').innerText = `${now.getMinutes()} - ${now.getSeconds()} - ${now.getMilliseconds()}`;
  logItem.querySelector('.alert').classList.add(`alert-${color}`);
  logItem.querySelector('.alert').appendChild(formatter);

  document.querySelector(logContainer).appendChild(logItem);
};

const initSkripioMethodUi = function (methodObject) {
  const argsContainer = document.querySelector(IDS.methodArgs);
  argsContainer.innerHTML = '';
  for (const arg of methodObject.args) {
    arg.value = INIT_ELEMENT[arg.type](arg, argsContainer);
  }
};

const initEditorElement = function (arg, argsContainer) {
  const editorElement = document.getElementById('editor-element').content.cloneNode(true);

  const labelContainer = editorElement.querySelector('[data-skripio="editor-label"]');
  labelContainer.innerText = `${arg.name}:`;

  argsContainer.appendChild(editorElement);

  const editorContainer = argsContainer.querySelector('[data-skripio="editor-container"]');
  const options = {
    mode: 'code',
    modes: ['code', 'form', 'text', 'tree', 'view', 'preview'] // allowed modes
  };
  const editor = new window.JSONEditor(editorContainer, options);
  editor.set(arg.default);

  return function () {
    try {
      return JSON.stringify(editor.get());
    } catch (error) {
      return editor.getText();
    }
  };
};

const initMethodSelectorElement = function (arg, argsContainer) {
  const inputElement = document.getElementById('selector-element').content.cloneNode(true);
  const optionsArray = arg.options().sort();

  for (const element of optionsArray) {
    const option = document.createElement('option');
    option.value = element;
    option.innerText = element;
    if (optionsArray.indexOf(element) === 0) {
      option.setAttribute('selected', 'selected');
    }
    inputElement.querySelector('select').appendChild(option);
  }

  inputElement.querySelector('select').setAttribute('data-skripio-arg-name', arg.name);
  inputElement.querySelector('label').innerText = `${arg.name}:`;
  argsContainer.appendChild(inputElement);

  return function () {
    return document.querySelector(IDS.methodArgs).querySelector(`[data-skripio-arg-name="${arg.name}"]`).value;
  };
};

const initInputElement = function (arg, argsContainer) {
  const inputElement = document.getElementById('input-element').content.cloneNode(true);

  inputElement.querySelector('input').value = arg.default;
  inputElement.querySelector('input').setAttribute('data-skripio-arg-name', arg.name);

  inputElement.querySelector('label').innerText = `${arg.name}:`;

  argsContainer.appendChild(inputElement);

  return function () {
    return document.querySelector(IDS.methodArgs).querySelector(`[data-skripio-arg-name="${arg.name}"]`).value;
  };
};

const initSkripioMethodPicker = function () {
  const skripioMethodPickerElement = document.querySelector(IDS.methodSelector);
  for (const method of SKRIPIO_METHODS) {
    const option = document.createElement('option');
    option.value = method.name;
    option.innerText = method.name;
    if (SKRIPIO_METHODS.indexOf(method) === 0) {
      option.setAttribute('selected', 'selected');
      initSkripioMethodUi(method);
    }
    skripioMethodPickerElement.appendChild(option);
  }
};

const initClipboardJS = function () {
  new ClipboardJS('button[data-skripio="copy"]', { // eslint-disable-line
    target: function (trigger) {
      return trigger.closest('.alert').querySelector('textarea[data-skripio="raw-result"]');
    }
  });
};

document.addEventListener('DOMContentLoaded', function (event) {
  initClipboardJS();
  initSkripioMethodPicker();
  document.addEventListener('click', delegatedClickHandler);
  document.querySelector('#init-response').addEventListener('click', asyncResponseHandler);
  document.querySelector('#run').addEventListener('click', runMethodHandler);
  document.querySelector(IDS.methodSelector).addEventListener('change', selectMethodHandler);
});

const INIT_ELEMENT = {
  'editor-element': initEditorElement,
  'input-element': initInputElement,
  'selector-element': initMethodSelectorElement
};
