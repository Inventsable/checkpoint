import { cmykColor, rgbColor } from "../../../shared/shared";

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
