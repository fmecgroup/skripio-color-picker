'use strict';
/* global $ ResponseEmitter */

/**
* **Skripio color picker object.**
* @param {object}   constructorArgs                          - Component constructor arguments object.
* @param {object}   constructorArgs.spectrumOptions          - Spectrum options. For complete list of options see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {string}   constructorArgs.pickerElementSelector    - DOM element selector where picker will be located.
* @param {string}   constructorArgs.colorFormat              - Function name that defines output color format. For complete list of supported formats see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {string}   constructorArgs.spectrumEvent            - Spectrum event name that will trigger color responses. For complete list of supported events see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {*}        constructorArgs.callback                 - Callback returned by component at color response event.
* @param {string}   constructorArgs.responseArgs             - !Reserved! ResponseEmitter params.
* @returns {string} <br>
* - `sync payload`  None <br>
* - `async payload` Color selected by user at each triggered constructorArgs.spectrumEvent event.
*/
export default class SkripioComponent {
  constructor ({
    spectrumOptions = {},
    pickerElementSelector = '.picker',
    colorFormat = 'toHexString',
    spectrumEvent = 'move.spectrum',
    callback = 'component',
    responseArgs
  }) {
    try {
      this._re = new ResponseEmitter(responseArgs);
    } catch (error) {
      throw new Error(error.message);
    }

    try {
      $(pickerElementSelector).spectrum(spectrumOptions);
    } catch (error) {
      throw new Error(error.message);
    }

    $(pickerElementSelector).on(spectrumEvent, (event, color) => {
      if (!(colorFormat in color)) {
        this._re.emitResponse(callback, ResponseEmitter.codes.DEV_ERROR, `'${colorFormat}' is not a valid color format function name.`, true);
        return;
      }

      this._re.emitResponse(callback, ResponseEmitter.codes.RESULT, color[colorFormat](), true);
    });
  }
}
