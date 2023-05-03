export const example = () => {};

interface rgbColor {
  r: number;
  g: number;
  b: number;
  typename: string;
}
interface hslColor {
  h: number;
  s: number;
  l: number;
  typename: string;
}
interface cmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
  typename: string;
}
type ColorValue = rgbColor | hslColor | cmykColor;

export const getColorFromPicker = (previous: ColorValue) => {};
