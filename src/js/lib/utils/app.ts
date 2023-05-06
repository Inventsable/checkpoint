import {
  cmykColor,
  rgbColor,
  hsbColor,
  ColorValue,
} from "../../../shared/shared";

export const convertCMYKToRGB = (cmyk: cmykColor): rgbColor => {
  const { cyan, magenta, yellow, black } = cmyk as cmykColor;
  const red = Math.round(255 * (1 - cyan / 100) * (1 - black / 100));
  const green = Math.round(255 * (1 - magenta / 100) * (1 - black / 100));
  const blue = Math.round(255 * (1 - yellow / 100) * (1 - black / 100));
  return { red, green, blue } as rgbColor;
};

export const setCSS = (prop: string, data: string): void => {
  document.documentElement.style.setProperty(prop, data);
};

export function rgbToHsb(rgb: rgbColor): hsbColor {
  const r = rgb.red / 255;
  const g = rgb.green / 255;
  const b = rgb.blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let v = max;

  if (delta !== 0) {
    s = delta / max;
    if (max === r) {
      h = (g - b) / delta + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h /= 6;
  }

  h *= 360;
  s *= 100;
  v *= 100;
  return { hue: h, saturation: s, brightness: v } as hsbColor;
}
