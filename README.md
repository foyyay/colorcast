Started with https://github.com/krasimir/webpack-library-starter

Given a configuration of hue points to named saturation and value entries you can provide a hue and the saturation and value will be interpolated and the resulting color returned as a hex string.

Install

```
npm install colorcast;
```

Import

```
import ColorCast from 'colorcast';
```

An example config could look like:

```JSON
{
  "0": {
    "primary": { "saturation": 80, "value": 70 },
    "accent": { "saturation": 75, "value": 85 }
  },
  "180": {
    "primary": { "saturation": 40, "value": 50 },
    "accent": { "saturation": 80, "value": 90 }
  }
}
```

So given a hue of 90 the you'll get back an object with two keys, "primary", and "accent". The hue for both colors will be 90, the saturation for primary will be 60 and the value will be 60.

You may add as many hue values from 0 to < 360 as you want. You can add as many named configs as you want.

Use it

```
let cast = new ColorCast(config);
let colors = cast.fromHue(90);
// or
colors = cast.fromColor('#87D936');
```
