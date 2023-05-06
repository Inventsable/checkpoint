import config from "../../cep.config";
export const ns = config.id;

export interface cmykColor {
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
  typename?: string;
}
export interface rgbColor {
  red: number;
  green: number;
  blue: number;
  typename?: string;
}
export interface hsbColor {
  hue: number;
  saturation: number;
  brightness: number;
  typename?: string;
}

export interface ColorPackage {
  RGB: rgbColor;
  HSB: hsbColor;
  CMYK: cmykColor;
  hex: string;
  model: string;
}

export type ColorValue = rgbColor | cmykColor | hsbColor;
