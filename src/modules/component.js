'use strict';
/* global skripio $ */

/**
* **skripio.ComponentOptions** interface. <br>
* ComponentOptions object used to define properties that can be set on spectrum color picker.
* @name ComponentOptions
* @param {object}   componentOptions                          - Options used to instantiate a component object.
* @param {object}   componentOptions.spectrumOptions          - Options used to instantiate spectrum object. For complete list of options see [Spectrum options](https://seballot.github.io/spectrum/#options).
* @param {string}   componentOptions.colorFormat              - Function name that defines output color format. For complete list of supported output formats see [Spectrum color outputs](https://seballot.github.io/spectrum/#details-acceptedColorInputs).
* @param {string}   componentOptions.spectrumEvent            - Spectrum event name that will trigger color responses. For complete list of supported events see [Spectrum events](https://seballot.github.io/spectrum/#events).
* @param {*}        componentOptions.callback                 - Callback returned by component at color response event.
* @returns {string} <br>
* - `sync payload`  None <br>
* - `async payload` Color selected by user at each componentOptions.spectrumEvent event fired.
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
      this._re = new skripio._lib.Emitter(responseArgs);
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
        this._re.emitResponse(callback, skripio._lib.ResponseEmitter.codes.DEV_ERROR, `${skripio._dict.errorPhrases.BAD_ARGUMENT}. '${colorFormat}' is not a valid color format function name.`, true);
        return;
      }

      this._re.emitResponse(callback, skripio._lib.Emitter.codes.RESULT, color[colorFormat](), true);
    });
  }
}
