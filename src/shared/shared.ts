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
  name?: string;
}

export type ColorValue = rgbColor | cmykColor | hsbColor;

export interface DocumentDiagonostic {
  paths: {
    count: number;
    anchors: number;
  };
  layerCount: number;
  colorModel: string;
  name: string;
  path: string;
}

interface StyleSetting {
  width: number;
  size: number;
  color: ColorValue | ColorPackage;
  filled: boolean;
}

export interface Config {
  anchor: {
    style: StyleSetting;
    label: string;
  };
  handle: {
    style: StyleSetting;
    label: string;
  };
  stick: {
    style: {
      width: number;
    };
    label: string;
  };
  outline: {
    style: {
      width: number;
      color: ColorValue | ColorPackage;
    };
  };
  options: {
    useLayerLabelColor: boolean;
    overrideComplex: boolean;
    forceOpacity: boolean;
    renameGenericPaths: boolean;
    generateIds: boolean;
    groupRelated: boolean;
    scaleFactor: number;
    ignoreBackgrounds: boolean;
    warnForComplexArt: boolean;
    mergeClippingMasks: boolean;
    createAsCopy: boolean;
    copySuffix: string;
    ignoreCMYKColorAlerts: boolean;
    displayBG: {
      include: boolean;
      color: ColorValue;
    };
    chunks: {
      size: number;
      enabled: boolean;
      maxAnchors: number;
    };
  };
}
