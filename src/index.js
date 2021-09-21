'use strict';

import './styles/spectrum.css';
import './styles/custom.css';
import './modules/jquery.js';
import 'spectrum-colorpicker2';
import ResponseEmitter from '@skripio/response-emitter';
import SkripioComponent from './modules/skripio.component.js';

window.ResponseEmitter = ResponseEmitter;
const re = new ResponseEmitter({
  responseElementId: 'init-response',
  responseElementClass: 'response'
});

/**
* **Instantiates skripio component object.**
* @param {string} objectName          - Component name to instantiate.
* @param {string} constructorArgs     - Serialized component constructor arguments object.
* @param {*}      callback            - 1C callback identifier of this wrapper function.
* @returns {string} <br>
* - `sync payload`  If successful a serialized object that contains instantiated **skripio component** object name and **DOM element id** which will receive async responses from this object will be returned. <br>
* - `async payload` None.
*/
window.initComponentObject = function (objectName, constructorArgs = '{}', callback = 'init') {
  try {
    constructorArgs = JSON.parse(constructorArgs);
  } catch (error) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, error.message);
  }

  constructorArgs.responseArgs = {
    responseElementId: objectName,
    responseElementClass: 'response'
  };

  if (!objectName) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `'${objectName}' is not a valid component object name.`);
  }

  if (objectName in window) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `Object '${objectName}' is already instantiated.`);
  }

  try {
    window[objectName] = new SkripioComponent(constructorArgs);
  } catch (error) {
    return re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, error.message);
  }

  return re.emitResponse(callback, ResponseEmitter.codes.RESULT, {
    name: objectName,
    response: objectName
  });
};
