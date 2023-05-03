export const helloWorld = () => {
  alert("Hello world");
};

import type { ColorValue } from "../../shared/shared";
export const getColorFromPicker = (previous: string) => {
  const input: ColorValue | null = previous
    ? (JSON.parse(previous) as ColorValue)
    : null;
  const isRGB = app.activeDocument.documentColorSpace == DocumentColorSpace.RGB;
  let val = input;
  if (!val)
    val = isRGB
      ? {
          red: 50,
          green: 50,
          blue: 50,
        }
      : {
          cyan: 50,
          magenta: 50,
          yellow: 50,
          black: 50,
        };
  const colorValue = isRGB ? new RGBColor() : new CMYKColor();
  // @ts-ignore
  for (let key in val) colorValue[key] = val[key];
  const newResult = app.showColorPicker(colorValue);
  if (newResult) {
    // @ts-ignore
    for (let key in newResult) newResult[key] = Math.floor(newResult[key]);
    return JSON.stringify(newResult);
  } else return null;
};
