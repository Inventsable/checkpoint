import type {
  ColorValue,
  Config,
  DocumentDiagnostic,
} from "../../shared/shared";

// @ts-ignore
Array.prototype.map = function (callback) {
  var mappedParam = [];
  for (var i = 0; i < this.length; i++)
    mappedParam.push(callback(this[i], i, this));
  return mappedParam;
};
// @ts-ignore
Array.prototype.reduce = function (fn, initial) {
  var values = this;
  // @ts-ignore
  values.forEach(function (item: any) {
    initial = initial !== undefined ? fn(initial, item) : item;
  });
  return initial;
};
// @ts-ignore
Array.prototype.forEach = function (callback) {
  for (var i = 0; i < this.length; i++) callback(this[i], i, this);
};
function get(type: string, parent?: any, deep?: boolean): any[] {
  if (arguments.length == 1 || !parent) {
    parent = app.activeDocument;
    deep = true;
  }
  var result = [];
  if (!parent[type]) return [];
  for (var i = 0; i < parent[type].length; i++) {
    result.push(parent[type][i]);
    if (parent[type][i][type] && deep)
      // @ts-ignore
      result = [].concat(result, get(type, parent[type][i], deep));
  }
  return result;
}

export const helloWorld = () => {
  alert("Hello world");
};

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

export const startOutliner = (data: string): string => {
  // alert(JSON);
  const config = JSON.parse(data) as Config;
  alert(config.anchor.label);
  return "HELLO";
};

export const runDiagnostic = (): string => {
  const dia = {
    paths: {
      count: app.activeDocument.pathItems.length,
      anchors: get("pathItems")
        .map((i) => i.pathPoints.length)
        .reduce((sum: number, a: number) => sum + a, 0),
    },
    layerCount: app.activeDocument.layers.length,
    colorModel: /RGB/.test(app.activeDocument.documentColorSpace + "")
      ? "RGB"
      : "CMYK",
    name: app.activeDocument.name,
    // @ts-ignore
    path: File(app.activeDocument.fullName).parent.fsName,
  } as DocumentDiagonostic;
  return JSON.stringify(dia);
};
