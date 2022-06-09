'use strict';

import './styles/spectrum.css';
import './styles/custom.css';
import './modules/helper.jquery.js';
import 'spectrum-colorpicker2';
import ResponseEmitter from '@skripio/response-emitter';
import errorPhrases from './modules/dict.error.phrases.js';
import initObject from './modules/skripio.initObject.js';

/**
* skripio component namespace.
* @namespace skripio
*/
const skripio = {};

/**
* A namespace for instantiated skripio objects.
* @namespace _objects
* @memberof skripio
* @private
*/
const objects = {};

/**
* Globally available dictionaries.
* @namespace _dict
* @memberof skripio
* @property {object} errorPhrases    - Standard error phrases.
* @private
*/
const dict = {
  errorPhrases: errorPhrases
};

/**
* Globally available helpers.
* @namespace _lib
* @memberof skripio
* @property {object} Emitter    - Response Emitter library.
* @private
*/
const lib = {
  Emitter: ResponseEmitter
};

/**
* Globally available response emitter.
* @memberof skripio
* @private
*/
const skripioEmitter = new ResponseEmitter({
  responseElementId: 'skripio-response',
  responseElementClass: 'response'
});

skripio._objects = objects;
skripio._dict = dict;
skripio._lib = lib;
skripio._emitter = skripioEmitter;
skripio.initObject = initObject;

window.skripio = skripio;
