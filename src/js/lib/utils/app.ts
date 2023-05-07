import {
  cmykColor,
  rgbColor,
  hsbColor,
  ColorValue,
  ColorPackage,
  DocumentDiagonostic,
  Config,
} from "../../../shared/shared";

export const getVerbosePackage = (
  val: ColorValue,
  colorModel?: string
): ColorPackage => {
  if (!colorModel) {
    if (Object.keys(val).includes("cyan")) colorModel = "CMYK";
    else if (Object.keys(val).includes("hue")) colorModel = "HSB";
    else if (Object.keys(val).includes("red")) colorModel = "RGB";
    else colorModel = "UNKNOWN";
  }
  const result = {
    RGB: {
      red: 50,
      green: 50,
      blue: 50,
    } as rgbColor,
    HSB: {
      hue: 1,
      saturation: 1,
      brightness: 1,
    } as hsbColor,
    CMYK: {
      cyan: 40,
      magenta: 40,
      yellow: 40,
      black: 40,
    } as cmykColor,
    hex: "#ff0000",
    model: colorModel,
  };
  if (colorModel == "CMYK") {
    result.CMYK = val as cmykColor;
    result.RGB = convertCMYKToRGB(val as cmykColor);
    result.HSB = convertRGBToHSB(result.RGB as rgbColor);
    result.hex = convertRGBToHex(result.RGB as rgbColor);
  } else if (colorModel == "RGB") {
    result.RGB = val as rgbColor;
    result.HSB = convertRGBToHSB(val as rgbColor);
    result.CMYK = convertRGBToCMYK(val as rgbColor);
    result.hex = convertRGBToHex(val as rgbColor);
  }
  return result;
};

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

interface ColorError {
  name: string;
  msg: string;
  value: ColorValue;
}

export type ColorErrors = ColorError[];

interface DiagnosticReport {
  colorErrors?: ColorErrors;
  chunkWarning?: {
    anchorMax: number;
    anchorReal: number;
  };
  hasErrors: boolean;
}

export const checkDiagnostic = (
  diagnostic: DocumentDiagonostic,
  settings: Config
) => {
  const colorProps = ["anchor", "handle", "outline"];
  const colors = [
    settings.anchor.style.color as ColorPackage,
    settings.handle.style.color as ColorPackage,
    settings.outline.style.color as ColorPackage,
  ]
    .map((i, index) => {
      let temp = Object.assign({}, i);
      temp["name"] = colorProps[index];
      return temp;
    })
    .filter((i) => i.model !== diagnostic.colorModel)
    .map((i): ColorError => {
      return {
        name: i.name as string,
        value: i[i.model],
        msg: `${i.name} value is ${i.model} but document is ${diagnostic.colorModel}`,
      } as ColorError;
    });
  const result = {
    colorErrors: colors as ColorErrors,
    hasErrors: true,
  } as DiagnosticReport;
  if (!colors.length) {
    result.hasErrors = false;
    delete result.colorErrors;
  }
  if (diagnostic.paths.anchors > settings.options.chunks.maxAnchors) {
    result.hasErrors = true;
    result["chunkWarning"] = {
      anchorMax: settings.options.chunks.maxAnchors,
      anchorReal: diagnostic.paths.anchors,
    };
  }
  return result;
};
