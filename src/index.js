'use strict';

import './styles/spectrum.css';
import './styles/custom.css';
import './modules/jquery.js';
import 'spectrum-colorpicker2';
import ResponseEmitter from '@skripio/response-emitter';
import SkripioComponent from './modules/skripio.component.js';

window.ResponseEmitter = ResponseEmitter;
const re = new ResponseEmitter('#init-response');

/**
* **Wrapper function that instantiates SkripioComponent object.**
* @name window.initComponent
* @param {string}   args                                                                    - Serialized method args object.
* @param {string}   args.objectName                                                         - Skripio component object name.
* @param {object}   [args.constructorArgs = ...]                                            - Component constructor args object.
* @param {string}   [args.constructorArgs.pickerElementSelector = '#color-picker']          - Default DOM element selector where picker will be located.
* @param {string}   [args.constructorArgs.responseElementSelector = '#component-response']  - Default DOM element selector where picker will emit responses.
* @param {string}   [args.constructorArgs.spectrumEvent = 'move.spectrum']                  - Default Spectrum event name that will trigger color responses. For complete list of supported events see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {string}   [args.constructorArgs.colorFormat = 'toHexString']                      - Default Function name that defines output color format. For complete list of supported formats see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {*}        [args.constructorArgs.callback = 'component']                           - Default Callback returned by component at color response event.
* @param {object}   [args.constructorArgs.spectrumOptions = ...]                            - Default Spectrum options. For complete list of options see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {string}   [args.constructorArgs.spectrumOptions.type = 'flat']                    - Default spectrum option.
* @param {boolean}  [args.constructorArgs.spectrumOptions.showInput = true]                 - Default spectrum option.
* @param {boolean}  [args.constructorArgs.spectrumOptions.showAlpha = false]                - Default spectrum option.
* @param {boolean}  [args.constructorArgs.spectrumOptions.allowEmpty = false]               - Default spectrum option.
* @param {boolean}  [args.constructorArgs.spectrumOptions.showButtons = false]              - Default spectrum option.
* @param {boolean}  [args.constructorArgs.spectrumOptions.showInitial = true]               - Default spectrum option.
* @param {*}        [args.callback = 'init']                                                - Callback returned by init function.
* @param {boolean}  [args.click = false]                                                    - If truthy then sync responses fill be accompanied with async ones.
* @returns {string} <br>
* - `sync payload`  If successful an object that contains the instantiated **component** object name and **response DOM element selector** of a DOM element which will receive responses emitted from this object will be returned. <br>
* - `async payload` None.
* @example
* // Component init response structure
* {
*  "name":"picker",
*  "response":"#component-response"
* }
*/
window.initComponent = function (args = '{}') {
  try {
    args = JSON.parse(args);
  } catch (error) {
    return re.emitResponse('none', ResponseEmitter.codes.DEV_ERROR, error.message);
  }

  const {
    objectName,
    constructorArgs = {
      pickerElementSelector: '#color-picker',
      responseElementSelector: '#component-response',
      spectrumEvent: 'move.spectrum',
      colorFormat: 'toHexString',
      callback: 'component',
      spectrumOptions: {
        type: 'flat',
        showInput: true,
        showAlpha: false,
        allowEmpty: false,
        showButtons: false,
        showInitial: true
      }
    },
    callback = 'init',
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
    response: constructorArgs.responseElementSelector
  }, click);
};
