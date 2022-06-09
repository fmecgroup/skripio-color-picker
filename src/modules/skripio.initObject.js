'use strict';
/* global skripio */

import SkripioComponent from './component.js';

/**
* **Instantiates SkripioComponent.**
* @param {string} objectName                      - Component name to instantiate.
* @param {string} initOptions                     - Method options.
* @param {object} initOptions.componentOptions    - SkripioComponent options.
* @param {*}      callback                        - 1C callback identifier of this wrapper function.
* @returns {string} <br>
* - `sync payload`  If successful the response object that contains instantiated **skripio component** object name and **DOM element id** which will receive async responses from this object will be returned. <br>
* - `async payload` None.
*/
export default function (objectName, initOptions = '{}', callback = 'initObject') {
  try {
    initOptions = JSON.parse(initOptions);
  } catch (error) {
    return skripio._emitter.emitResponse(
      callback,
      skripio._lib.Emitter.codes.DEV_ERROR,
      error.message);
  }

  const {
    componentOptions = {}
  } = initOptions;

  componentOptions[Symbol.for('pickerDOMElementSelector')] = '.picker';
  componentOptions[Symbol.for('responseArgs')] = {
    responseElementId: `${objectName}-response`,
    responseElementClass: 'response'
  };

  if (!objectName) {
    return skripio._emitter.emitResponse(
      callback,
      skripio._lib.Emitter.codes.DEV_ERROR,
      `${skripio._dict.errorPhrases.BAD_ARGUMENT}. '${objectName}' is not a valid component object name.`);
  }

  if (Object.keys(skripio._objects).includes(objectName)) {
    return skripio._emitter.emitResponse(
      callback,
      skripio._lib.Emitter.codes.DEV_ERROR,
      `${skripio._dict.BAD_ARGUMENT}. Object '${objectName}' has already been instantiated.`);
  }

  try {
    skripio._objects[objectName] = new SkripioComponent(componentOptions);
  } catch (error) {
    return skripio._emitter.emitResponse(
      callback,
      skripio._lib.Emitter.codes.DEV_ERROR,
      error.message);
  }

  return skripio._emitter.emitResponse(
    callback,
    skripio._lib.Emitter.codes.RESULT,
    {
      name: objectName,
      response: `${objectName}-response`
    });
}
