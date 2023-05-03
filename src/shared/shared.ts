import config from "../../cep.config";
export const ns = config.id;

export interface rgbColor {
  red: number;
  green: number;
  blue: number;
  typename?: string;
}
export interface cmykColor {
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
  typename?: string;
}
export type ColorValue = rgbColor | hslColor | cmykColor;
