'use strict';

import './styles/spectrum.css';
import './styles/custom.css';
import './modules/jquery.js';
import 'spectrum-colorpicker2';
import ResponseEmitter from '@skripio/response-emitter';
import SkripioComponent from './modules/component.js';
import errorPhrases from './modules/dict.error.phrases.js';

/**
* skripio component namespace.
* @namespace skripio
*/
const skripio = {};

/**
* A namespace for instantiated skripio objects.
* @namespace objects
* @memberof skripio
* @private
*/
const objects = {};

/**
* Globally available dictionaries.
* @namespace dict
* @memberof skripio
* @private
*/
const dict = {
  errorPhrases: errorPhrases
};

/**
* Globally available helpers.
* @namespace lib
* @memberof skripio
* @property {object} Emitter    - Response Emitter library.
* @private
*/
const lib = {
  Emitter: ResponseEmitter
};

skripio.objects = objects;
skripio.dict = dict;
skripio.lib = lib;

const initRE = new skripio.lib.Emitter({
  responseElementId: 'init-response',
  responseElementClass: 'response'
});

/**
* **Instantiates skripio component object.**
* @param {string} objectName                - Component name to instantiate.
* @param {string} args                      - Serialized arguments object.
* @param {object} args.ConstructorOptions   - Component constructor options interface object. See component docs for details.
* @param {*}      callback                  - 1C callback identifier of this wrapper function.
* @returns {string} <br>
* - `sync payload`  If successful a serialized object that contains instantiated **skripio component** object name and **DOM element id** which will receive async responses from this object will be returned. <br>
* - `async payload` None.
*/
skripio.initObject = function (objectName, args = '{}', callback = 'initObject') {
  try {
    args = JSON.parse(args);
  } catch (error) {
    return initRE.emitResponse(
      callback,
      skripio.lib.Emitter.codes.DEV_ERROR,
      error.message);
  }

  const {
    ConstructorOptions = {}
  } = args;

  ConstructorOptions[Symbol.for('pickerDOMElementSelector')] = '.picker';
  ConstructorOptions[Symbol.for('responseArgs')] = {
    responseElementId: `${objectName}-response`,
    responseElementClass: 'response'
  };

  if (!objectName) {
    return initRE.emitResponse(
      callback,
      skripio.lib.Emitter.codes.DEV_ERROR,
      `${errorPhrases.BAD_ARGUMENT}. '${objectName}' is not a valid component object name.`);
  }

  if (Object.keys(skripio.objects).includes(objectName)) {
    return initRE.emitResponse(
      callback,
      skripio.lib.Emitter.codes.DEV_ERROR,
      `${errorPhrases.BAD_ARGUMENT}. Object '${objectName}' has already been instantiated.`);
  }

  try {
    skripio.objects[objectName] = new SkripioComponent(ConstructorOptions);
  } catch (error) {
    return initRE.emitResponse(
      callback,
      skripio.lib.Emitter.codes.DEV_ERROR,
      error.message);
  }

  return initRE.emitResponse(
    callback,
    skripio.lib.Emitter.codes.RESULT,
    {
      name: objectName,
      response: `${objectName}-response`
    });
};

window.skripio = skripio;
