import Color from 'color';

const keySat = 'saturation';
const keyVal = 'value';

function difference(setA, setB) {
  let diff = new Set([...setA, ...setB]);
  for (let elem of Array.from(setB)) {
    diff.delete(elem);
  }
  return diff;
}

class ColorCast {
  constructor(config) {
    this._config = {};
    this._huePoints = [];
    this._namedConfigs = [];
    this._validateConfig(config);
  }

  fromHue(hueIn) {
    let hue = ((hueIn % 360) + 360) % 360;
    let leftHue = this._huePoints.reduce((acc, next) => (next <= hue ? next : acc));
    let rightHue = this._huePoints.reduceRight((acc, next) => (next >= hue ? next : acc));

    let numerator = hue - leftHue;
    let denomiator = rightHue - leftHue;
    let factor = numerator / denomiator;

    // If the denomiator is 0 that means left and right hue are the same.
    // So the left and right config will be the same so any factor from 0 -> 1 will give the same results.
    if (denomiator === 0) {
      factor = 1;
    }

    let leftConfig = this._config[leftHue];
    let rightConfig = this._config[rightHue];
    let interpolated = {};

    for (let configName of Array.from(this._namedConfigs)) {
      let leftSettings = leftConfig[configName];
      let rightSettings = rightConfig[configName];
      let settings = {};

      for (let component of [keySat, keyVal]) {
        settings[component] =
          (rightSettings[component] - leftSettings[component]) * factor + leftSettings[component];
      }

      let newColor = new Color();
      newColor = newColor.hue(hue);
      newColor = newColor.saturationv(settings[keySat]);
      newColor = newColor.value(settings[keyVal]);

      interpolated[configName] = newColor.hex();
    }

    return interpolated;
  }

  fromColor(color) {
    let parsedColor = new Color(color);
    return this.fromHue(parsedColor.hue());
  }

  _validateConfig(config) {
    if (typeof config !== 'object') {
      throw new Error('Config must be an object.');
    }

    let namedConfigs;
    let huePointSet = new Set([]);
    let hues = Object.keys(config);

    if (hues.length < 1) {
      throw new Error('Must have at least one hue in the configuration.');
    }

    for (let hue of hues) {
      let hueValue = Number(hue);

      if (Number.isNaN(hueValue)) {
        throw new Error(`Hues must be numbers. Got ${hue} which is not a number.`);
      }

      if (hueValue < 0 || hueValue >= 360) {
        throw new Error(`Hue values must be >= 0 and < 360. Got ${hueValue}`);
      }

      if (typeof config[hue] !== 'object') {
        throw new Error(`Hue config entries must be objects. Got ${typeof config[hue]} instead.`);
      }

      let names = Object.keys(config[hue]);
      if (namedConfigs === undefined) {
        namedConfigs = new Set(names);
      } else {
        let dif = difference(names, namedConfigs);
        if (dif.size > 0) {
          throw new Error('Config for hue does not have consistant config names.');
        }
      }

      for (let name of names) {
        [keySat, keyVal].map(component => {
          let compValue = Number(config[hue][name][component]);

          if (Number.isNaN(compValue)) {
            throw new Error(
              `Value of ${component} must be a number. ${hue}:${name}:${component} is ${compValue}.`
            );
          }

          if (compValue < 0 || compValue > 100) {
            throw new Error(
              `Value of ${component} must be in the range of 0 to 100. ${hue}:${name}:${component} is ${compValue}.`
            );
          }
        });
      }

      this._namedConfigs = Array.from(namedConfigs);
      huePointSet.add(hueValue);
      this._config[hueValue] = config[hue];
    }

    let min = Math.min(...huePointSet);
    let max = Math.max(...huePointSet);

    let newMin = max - 360;
    huePointSet.add(newMin);
    this._config[newMin] = this._config[max];

    let newMax = min + 360;
    huePointSet.add(newMax);
    this._config[newMax] = this._config[min];

    this._huePoints = Array.from(huePointSet).sort((a, b) => a - b); // For ascending sort
  }
}

export default ColorCast;
