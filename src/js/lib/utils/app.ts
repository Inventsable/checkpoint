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

export const convertRGBToCMYK = (rgb: rgbColor): cmykColor => {
  const { red, green, blue } = rgb;
  const redRatio = red / 255,
    greenRatio = green / 255,
    blueRatio = blue / 255;
  const black = Math.round(1 - Math.max(redRatio, greenRatio, blueRatio)),
    cyan = Math.round(((1 - redRatio - black) / (1 - black)) * 100),
    magenta = Math.round(((1 - greenRatio - black) / (1 - black)) * 100),
    yellow = Math.round(((1 - blueRatio - black) / (1 - black)) * 100);
  return { cyan, magenta, yellow, black: black * 100 } as cmykColor;
};

export const convertRGBToHex = (rgb: rgbColor): string => {
  const { red, green, blue } = rgb;
  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
};

export const setCSS = (prop: string, data: string): void => {
  document.documentElement.style.setProperty(prop, data);
};

export function convertRGBToHSB(rgb: rgbColor): hsbColor {
  const r = rgb.red / 255,
    g = rgb.green / 255,
    b = rgb.blue / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    delta = max - min;
  let h = 0,
    s = 0,
    v = max;
  if (delta !== 0) {
    s = delta / max;
    if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h /= 6;
  }
  h *= 360;
  s *= 100;
  v *= 100;
  return {
    hue: Math.round(h),
    saturation: Math.round(s),
    brightness: Math.ceil(v),
  } as hsbColor;
}
