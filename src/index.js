'use strict';

import './styles/custom.css';
import ResponseEmitter from '@skripio/response-emitter';
import SkripioComponent from './modules/skripio.component.js';

const RESPONSE_DOM_ELEMENT_ID = '#response';
const re = new ResponseEmitter(RESPONSE_DOM_ELEMENT_ID);

/**
* **Downloads assets required for component to function.**
* @param {string}   args                      - Serialized method args object.
* @param {*}        [args.callback = 'none']  - Any callback value.
* @param {boolean}  [args.click = false]      - If truthy then click event will be emitted for sync results.
* @returns {*} <br>
* - `sync`  [Describe sync results here]. <br>
* - `async` [Describe async results here].
*/
window.downloadAssets = function (args = '{}') {
  try {
    args = JSON.parse(args);
  } catch (error) {
    return re.emitResponse('none', ResponseEmitter.codes.DEV_ERROR, error.message);
  }
  const {
    callback = 'none',
    click = false
  } = args;
  /*
  * Place here any code that will download any assets and libraries required for skripio component
  * that are not packaged in component bundle.
  * Amend argument object parameters set as required.
  */
  return re.emitResponse(callback, ResponseEmitter.codes.DONE, 'DONE', click);
};

/**
* **Instantiates skripio component object.**
* @param {string}   args                                         - Serialized method args object.
* @param {string}   args.objectName                              - Skripio component object name.
* @param {object}   [args.constructorArgs = {}]                  - Component constructor args object.
* @param {string}   [args.responseElementSelector = '#response'] - DOM element selector that will receive async responses.
* @param {*}        [args.callback = 'none']                     - Any callback value.
* @param {boolean}  [args.click = false]                         - If truthy then click event will be emitted for sync results.
* @returns {string} <br>
* - `sync`  If successful a serialized object that contains the instantiated **skripio** object name and **response DOM element selector** of a DOM element which will receive async responses from this object will be returned. <br>
* - `async` None.
*/
window.initComponent = function (args = '{}') {
  try {
    args = JSON.parse(args);
  } catch (error) {
    return re.emitResponse('none', ResponseEmitter.codes.DEV_ERROR, error.message);
  }

  const {
    objectName,
    constructorArgs = {},
    responseElementSelector = RESPONSE_DOM_ELEMENT_ID,
    callback = 'none',
    click = false
  } = args;

  if (!objectName) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `'${objectName}' is not a valid objectName parameter.`, click);
  }

  if (objectName in window) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `Object '${objectName}' is already initialized.`, click);
  }

  try {
    window[objectName] = new SkripioComponent(constructorArgs);
  } catch (error) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, error.message, click);
  }

  return re.emitResponse(callback, ResponseEmitter.codes.RESULT, {
    name: objectName,
    response: responseElementSelector
  }, click);
};

/**
* **Executes skripio component methods.**
* @param {string}   args                      - Serialized method args object.
* @param {string}   args.object               - Skripio component object name.
* @param {string}   args.method               - Skripio component method name.
* @param {object}   [args.methodArgs = {}]    - Skripio component method arguments object.
* @param {*}        [args.callback = 'none']  - Any callback value.
* @param {boolean}  [args.click = false]      - If truthy then click event will be emitted for sync results.
* @returns {*} <br>
* - `sync`  See component method docs. <br>
* - `async` See component method docs.
*/
window.execComponentMethod = function (args = '{}') {
  try {
    args = JSON.parse(args);
  } catch (error) {
    return re.emitResponse('none', ResponseEmitter.codes.DEV_ERROR, error.message);
  }

  const {
    object,
    method,
    methodArgs = {},
    callback = 'none',
    click = false
  } = args;

  if (!object) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `'${object}' is not a valid object name.`, click);
  }
  if (!method) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `'${method}' is not a valid method name.`, click);
  }
  if (!(window[object] instanceof SkripioComponent)) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `'${object}' is not a valid skripio component.`, click);
  }
  if (!(typeof window[object][method] === 'function')) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `'${method}' is not a valid skripio component method.`, click);
  }

  return window[object][method](methodArgs);
};
