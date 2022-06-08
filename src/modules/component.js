'use strict';
/* global skripio $ */

/**
* **Skripio color picker object.**
* @param {object}   constructorArgs                          - Component constructor arguments object.
* @param {object}   constructorArgs.spectrumOptions          - Spectrum options. For complete list of options see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {string}   constructorArgs.colorFormat              - Function name that defines output color format. For complete list of supported formats see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {string}   constructorArgs.spectrumEvent            - Spectrum event name that will trigger color responses. For complete list of supported events see [Spectrum docs](https://seballot.github.io/spectrum/).
* @param {*}        constructorArgs.callback                 - Callback returned by component at color response event.
* @returns {string} <br>
* - `sync payload`  None <br>
* - `async payload` Color selected by user at each triggered constructorArgs.spectrumEvent event.
*/
export default class SkripioComponent {
  constructor ({
    [Symbol.for('pickerDOMElementSelector')]: pickerDOMElementSelector,
    [Symbol.for('responseArgs')]: responseArgs,
    spectrumOptions = {},
    colorFormat = 'toHexString',
    spectrumEvent = 'move.spectrum',
    callback = 'colorSelected'
  }) {
    try {
      this._re = new skripio.lib.Emitter(responseArgs);
    } catch (error) {
      throw new Error(error.message);
    }

    try {
      $(pickerDOMElementSelector).spectrum(spectrumOptions);
    } catch (error) {
      throw new Error(error.message);
    }

    $(pickerDOMElementSelector).on(spectrumEvent, (event, color) => {
      if (!(colorFormat in color)) {
        this._re.emitResponse(callback, skripio.lib.ResponseEmitter.codes.DEV_ERROR, `${skripio.dict.errorPhrases.BAD_ARGUMENT}. '${colorFormat}' is not a valid color format function name.`, true);
        return;
      }

      this._re.emitResponse(callback, skripio.lib.Emitter.codes.RESULT, color[colorFormat](), true);
    });
  }
}
