import type {
  ColorPackage,
  ColorValue,
  Config,
  DocumentDiagonostic,
  cmykColor,
  rgbColor,
} from "../../shared/shared";

interface DialogOptions {
  title: string;
  header: string;
  body: string;
}
interface PathPoint {
  anchor: number[];
  leftDirection: number[];
  parent: any;
  pointType: any;
  selected: boolean;
  rightDirection: number[];
  typename: string;
  remove: () => void;
}

const DEBUG = false;

export const displayWarning = (options: string) => {
  const dialogOpts = JSON.parse(options) as DialogOptions;
  const result = scriptConfirmation(dialogOpts);
  return result;
};

// Thanks Stephen
// https://github.com/MarshySwamp/ScriptUI-Confirm-Window
export const scriptConfirmation = (options: DialogOptions) => {
  let confirmationTitle = options.title,
    confirmationString2 = options.body;
  try {
    let confirmationWindow = new Window("dialog");
    confirmationWindow.text = confirmationTitle;
    confirmationWindow.preferredSize.width = 400;
    confirmationWindow.preferredSize.height = 60;
    confirmationWindow.orientation = "column";
    // @ts-ignore
    confirmationWindow.alignChildren = ["left", "top"];
    confirmationWindow.spacing = 15;
    confirmationWindow.margins = 20;
    let textGroup = confirmationWindow.add("group", undefined, {
      name: "textGroup",
    });
    textGroup.preferredSize.width = 400;
    textGroup.orientation = "column";
    textGroup.alignChildren = ["left", "center"];
    textGroup.spacing = 5;
    textGroup.margins = 0;
    let confirmationText2 = textGroup.add("statictext", undefined, undefined, {
      name: "confirmationText2",
      multiline: true,
    });
    confirmationText2.text = confirmationString2;
    // @ts-ignore
    confirmationText2.graphics.font = "dialog:13";
    confirmationText2.alignment = ["left", "center"];
    confirmationText2.preferredSize.width = 400;
    let buttonGroup = confirmationWindow.add("group", undefined, {
      name: "buttonGroup",
    });
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["right", "top"];
    buttonGroup.spacing = 0;
    buttonGroup.margins = 10;
    buttonGroup.preferredSize.width = 400;
    let cancelButton = buttonGroup.add("button", undefined, undefined, {
      name: "cancelButton",
    });
    cancelButton.text = "CANCEL";
    cancelButton.justify = "right";
    let okButton = buttonGroup.add("button", undefined, undefined, {
      name: "okButton",
    });
    okButton.text = "OK";
    okButton.justify = "right";
    return confirmationWindow.show() === 1;
  } catch (err) {
    return false;
  }
};

export const newRGB = (color: rgbColor): rgbColor => {
  const temp = new RGBColor() as rgbColor;
  temp.red = color.red;
  temp.green = color.green;
  temp.blue = color.blue;
  return temp;
};
export const newCMYK = (color: cmykColor): cmykColor => {
  const temp = new CMYKColor() as cmykColor;
  temp.cyan = color.cyan;
  temp.magenta = color.magenta;
  temp.yellow = color.yellow;
  temp.black = color.black;
  return temp;
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
// @ts-ignore
if (!Array.isArray) {
  // @ts-ignore
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
// @ts-ignore
Array.prototype.map = function (callback) {
  let mappedParam = [];
  for (let i = 0; i < this.length; i++)
    mappedParam.push(callback(this[i], i, this));
  return mappedParam;
};
// @ts-ignore
Array.prototype.filter = function (callback) {
  let filtered = [];
  for (let i = 0; i < this.length; i++)
    if (callback(this[i], i, this)) filtered.push(this[i]);
  return filtered;
};
// @ts-ignore
Array.prototype.reduce = function (fn, initial) {
  let values = this;
  // @ts-ignore
  values.forEach(function (item: any) {
    initial = initial !== undefined ? fn(initial, item) : item;
  });
  return initial;
};
// @ts-ignore
Array.prototype.forEach = function (callback) {
  for (let i = 0; i < this.length; i++) callback(this[i], i, this);
};
// @ts-ignore
Array.prototype.every = function (callback) {
  let count = 0;
  for (let i = 0; i < this.length; i++) if (callback(this[i], i, this)) count++;
  return count == this.length;
};
// @ts-ignore
Array.prototype.flat = function () {
  // @ts-ignore
  function flattenArrayOfArrays(a, r) {
    if (!r) r = [];
    for (let i = 0; i < a.length; i++)
      // @ts-ignore
      if (Array.isArray(a[i])) r.concat(flattenArrayOfArrays(a[i], r));
      else r.push(a[i]);
    return r;
  }
  // @ts-ignore
  return flattenArrayOfArrays(this);
};

// @ts-ignore
Array.prototype.some = function (callback) {
  for (let i = 0; i < this.length; i++)
    if (callback(this[i], i, this)) return true;
  return false;
};

// @ts-ignore
function get(type, parent, deep) {
  if (arguments.length == 1 || !parent) {
    parent = app.activeDocument;
    deep = true;
  }
  let result = [];
  if (!parent[type]) return [];
  for (let i = 0; i < parent[type].length; i++) {
    result.push(parent[type][i]);
    if (parent[type][i][type] && deep)
      // @ts-ignore
      result = [].concat(result, get(type, parent[type][i], deep));
  }
  return result;
}

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

export const startOutliner = (data: string): string | boolean => {
  const asChunks = false;
  const config = JSON.parse(data) as Config;
  // "Target layer cannot be modified" bug in scripting if a user has a locked
  // top layer. Really odd, I've literally never seen that before
  const topLayerLock = app.activeDocument.layers[0].locked;
  app.activeDocument.layers[0].locked = false;
  if (asChunks) {
    alert("Not currently supported");
    return false;
  } else {
    const list = scanCurrentPageItems(config);
    convertListToOutlines(config, list);
    sortLayerContents();
  }
  app.activeDocument.layers[0].locked = topLayerLock;
  return "HELLO";
};

export const overrideActiveLayerIfLocked = (): void => {
  const activeIsLocked = app.activeDocument.activeLayer.locked,
    // @ts-ignore
    freeLayers = get("layers").filter((layer) => !layer.locked);
  if (activeIsLocked) app.activeDocument.activeLayer.locked = false;
  if (activeIsLocked && freeLayers.length) {
    app.activeDocument.activeLayer = freeLayers[0];
  } else if (activeIsLocked && !freeLayers.length) {
    alert("Cannot run when all layers are locked");
  }
};

export const runDiagnostic = (): string => {
  overrideActiveLayerIfLocked();
  const dia = {
    paths: {
      count: app.activeDocument.pathItems.length,
      // @ts-ignore
      anchors: get("pathItems")
        // @ts-ignore
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

export const generateColor = (color: ColorPackage) => {
  return color.model == "RGB" ? newRGB(color.RGB) : newCMYK(color.CMYK);
};

export const scanCurrentPageItems = (config: Config): any[] => {
  let list = [];
  if (!config.options.overrideComplex) {
    if (config.options.mergeClippingMasks) mergeClippingPaths();
    // @ts-ignore
    return filteredList(config, get("pathItems"));
  } else {
    return cloneAllPathItems(config);
  }
};

export const filteredList = (config: Config, list: any[]): any[] => {
  // @ts-ignore
  return list.filter((i) => {
    // TODO - Items matching color of designated background should be filtered
    const isBackgroundState = pathIsEquivalentToBackground(config, i);
    let didPassVisible = !config.options.ignoreHidden
      ? !getAncestryChain(i, "visible", true, [i.hidden])
          // @ts-ignore
          .some((i) => !!i)
      : false;
    let didPassLock = !config.options.ignoreLocked
      ? !getAncestryChain(i, "locked", false, [i.locked])
          // @ts-ignore
          .some((i) => !!i)
      : false;
    return didPassVisible && didPassLock && /^pathItem$/i.test(i.typename);
  });
};

export const getAncestryChain = (
  item: any,
  prop: string,
  toggled: boolean,
  chain: any[]
): any => {
  if (item.parent && !/document/i.test(item.parent.typename)) {
    let needSwitch = prop == "visible" && item.parent.uuid;
    let realProp = needSwitch ? "hidden" : prop;
    let realToggled = needSwitch ? !toggled : toggled;
    chain = [].concat(
      // @ts-ignore
      chain,
      realToggled ? !item.parent[realProp] : item.parent[realProp]
    );
    return getAncestryChain(item.parent, prop, toggled, chain);
  } else return chain;
};

export const pathIsEquivalentToBackground = (
  config: Config,
  path: any
): boolean => {
  // Not yet implemented
  return false;
};

export const convertListToOutlines = (config: Config, list: any[]) => {
  for (let i = list.length - 1; i >= 0; i--) {
    let item = list[i];
    if (DEBUG) {
      alert(item);
    }
    const parentage = item.name || item.parent.name || item.layer.name;
    item.name = config.options.renameGenericPaths
      ? // @ts-ignore
        rollName(config, parentage, item, item.layer)
      : parentage;
    if (item.stroked || item.filled) {
      replaceAppearance(config, item);
      let parentgroup = config.options.groupRelated
        ? app.activeDocument.groupItems.add()
        : null;
      if (config.options.groupRelated && parentgroup && !item.layer.locked) {
        if (!parentgroup.locked) {
          parentgroup.name = item.name + config.options.suffixes.parent;
          // @ts-ignore
          parentgroup.move(item.layer, ElementPlacement.PLACEATBEGINNING);
        }
      }
      if (item.pathPoints && item.pathPoints.length)
        for (let p = 0; p < item.pathPoints.length; p++) {
          let point = item.pathPoints[p];
          let pointName = item.name + "[" + p + "]";
          let group = config.options.groupRelated
            ? // @ts-ignore
              parentgroup.groupItems.add()
            : null;
          // @ts-ignore
          if (config.options.groupRelated) group.name = pointName;
          drawAnchor(config, point, item.layer, pointName, group);
          drawHandle(config, point, "left", item.layer, pointName, group);
          drawHandle(config, point, "right", item.layer, pointName, group);
          item.opacity = config.options.forceOpacity ? 100.0 : item.opacity;
        }
    }
  }
};

export const drawAnchor = (
  config: Config,
  point: PathPoint,
  layer: any,
  name: string,
  group: any
) => {
  const root = config.options.groupRelated ? group : app.activeDocument;
  let anchor = root.pathItems.rectangle(
    point.anchor[1] + config.anchor.style.size / 2,
    point.anchor[0] - config.anchor.style.size / 2,
    config.anchor.style.size,
    config.anchor.style.size
  );
  anchor.name = name + config.anchor.label;
  if (!config.options.groupRelated && !layer.locked)
    // @ts-ignore
    anchor.move(layer, ElementPlacement.PLACEATBEGINNING);
  setAnchorAppearance(config, anchor, false, layer);
  return [anchor];
};

export const drawHandle = (
  config: Config,
  point: PathPoint,
  direction: string,
  layer: any,
  name: string,
  group: any
) => {
  if (
    Number(point.anchor[0]) !==
      Number(point[(direction + "Direction") as keyof PathPoint][0]) ||
    Number(point.anchor[1]) !==
      Number(point[(direction + "Direction") as keyof PathPoint][1])
  ) {
    let stick = config.options.groupRelated
      ? group.pathItems.add()
      : app.activeDocument.pathItems.add();
    stick.setEntirePath([
      point.anchor,
      point[(direction + "Direction") as keyof PathPoint],
    ]);
    if (!config.options.groupRelated && !layer.locked)
      // @ts-ignore
      stick.move(layer, ElementPlacement.PLACEATBEGINNING);
    stick.name =
      name + "_" + direction.charAt(0).toUpperCase() + config.stick.label;

    setAnchorAppearance(config, stick, true, layer);

    const root = config.options.groupRelated ? group : app.activeDocument;

    let handle = root.pathItems.ellipse(
      point[(direction + "Direction") as keyof PathPoint][1] +
        config.handle.style.size / 2,
      point[(direction + "Direction") as keyof PathPoint][0] -
        config.handle.style.size / 2,
      config.handle.style.size,
      config.handle.style.size
    );
    if (!config.options.groupRelated && !layer.locked)
      // @ts-ignore
      handle.move(layer, ElementPlacement.PLACEATBEGINNING);
    handle.stroked = false;
    handle.filled = true;
    handle.name =
      name + "_" + direction.charAt(0).toUpperCase() + config.handle.label;
    handle.fillColor = config.options.useLayerLabelColor
      ? layer.color
      : generateColor(config.handle.style.color as ColorPackage);
    return [stick, handle];
  }
};

export const setAnchorAppearance = (
  config: Config,
  item: any,
  isHandle: boolean,
  layer: any
): void => {
  let realColor = config.options.useLayerLabelColor
    ? layer.color
    : generateColor(config.anchor.style.color as ColorPackage);
  if (!isHandle) {
    item.filled = config.anchor.style.filled;
    item.stroked = !config.anchor.style.filled;
    if (!config.anchor.style.filled) {
      item.strokeWidth = config.anchor.style.width;
      item.strokeColor = realColor;
    } else {
      item.fillColor = realColor;
    }
  } else {
    item.filled = false;
    item.stroked = true;
    item.strokeWidth = config.anchor.style.width;
    item.strokeColor = realColor;
  }
};

export const replaceAppearance = (config: Config, item: any) => {
  item.filled = false;
  item.stroked = true;
  item.strokeWidth = config.outline.style.width;
  item.strokeColor = generateColor(config.outline.style.color as ColorPackage);
};

// Rearrange results per layer so anchor Groups are directly above their target path
export const sortLayerContents = () => {
  for (let i = 0; i < app.activeDocument.layers.length; i++) {
    let layer = app.activeDocument.layers[i];
    if (layer.locked) continue;
    for (let c = 0; c < layer.pathItems.length; c++)
      layer.pathItems[c].zOrder(ZOrderMethod.BRINGTOFRONT);
    let offset = layer.pathItems.length + 1;
    for (let c = 0; c < layer.groupItems.length; c++) {
      let group = layer.groupItems[c];
      offset = Number(offset) - Number(1);
      for (let z = 0; z < offset; z++) group.zOrder(ZOrderMethod.BRINGFORWARD);
    }
  }
};

// Generates a unique identifier for layer to use in children nodes
export const rollName = (
  config: Config,
  name: string,
  item: any,
  layer: any
): string => {
  let siblingCount = 0;
  let nameRX = new RegExp(name + "\\[\\d\\].*");
  if (!config.options.generateIds)
    for (let i = 0; i < layer.pathItems.length; i++)
      if (
        nameRX.test(layer.pathItems[i].name) &&
        layer.pathItems[i] !== item &&
        !/group/i.test(layer.pathItems[i].typename)
      )
        siblingCount++;
  return config.options.generateIds
    ? name + "_" + shortId() + "_"
    : name + "[" + siblingCount + "]";
};

// Reconstruct all PathItems with basic data to override any complex appearances
export const cloneAllPathItems = (config: Config) => {
  let list = [];
  let cloneProps = ["position", "left", "top", "name", "closed", "layer"];
  let pathProps = ["anchor", "leftDirection", "rightDirection", "pointType"];
  for (let i = app.activeDocument.pathItems.length - 1; i >= 0; i--) {
    let item = app.activeDocument.pathItems[i];
    const isHidden = getAncestryChain(item, "visible", true, [
      item.hidden,
      // @ts-ignore
    ]).some((i) => !!i);
    const isLocked = getAncestryChain(item, "locked", false, [
      item.locked,
      // @ts-ignore
    ]).some((i) => !!i);
    if (isHidden || isLocked) continue;
    let clone = {
      pathPoints: [],
    };
    for (let v = 0; v < cloneProps.length; v++) {
      let prop = cloneProps[v];
      // @ts-ignore
      clone[prop] = item[prop];
    }

    for (let v = 0; v < item.pathPoints.length; v++)
      // @ts-ignore
      clone.pathPoints.push(item.pathPoints[v]);
    list.push(clone);
    item.remove();
  }
  list = filteredList(config, list);
  let dupes = [];
  for (let i = 0; i < list.length; i++) {
    let schema = list[i];
    let item = app.activeDocument.pathItems.add();
    for (let v = 0; v < cloneProps.length; v++) {
      let prop = cloneProps[v];
      // @ts-ignore
      if (prop !== "layer") item[prop] = schema[prop];
    }
    // @ts-ignore
    item.move(schema.layer, ElementPlacement.PLACEATBEGINNING);
    for (let v = 0; v < schema.pathPoints.length; v++) {
      let point = schema.pathPoints[v];
      let newpoint = item.pathPoints.add();
      for (let c = 0; c < pathProps.length; c++) {
        let prop = pathProps[c];
        // @ts-ignore
        newpoint[prop] = point[prop];
      }
    }
    dupes.push(item);
  }
  return dupes;
};

export const mergeClippingPaths = () => {
  app.selection = null;
  app.executeMenuCommand("Clipping Masks menu item");
  let masks = app.selection;
  if (app.selection.length < 1) return null;
  for (let i = 0; i < masks.length; i++) {
    let mask = masks[i];
    let parent = mask.parent;
    let siblings = [];
    for (let v = 0; v < parent.pathItems.length; v++) {
      let child = parent.pathItems[v];
      if (!child.clipping) {
        // let tag = child.tags.add();
        // tag.name = "marked";
        siblings.push(child);
      }
    }
    if (siblings.length > 1)
      for (let v = 1; v < siblings.length; v++) {
        app.selection = null;
        let dupe = mask.duplicate();
        let sibling = siblings[v];
        let lastname = sibling.name;
        dupe.selected = true;
        sibling.selected = true;
        intersectAction();
        //
        // TODO
        // If path has name, doing intersect creates a new path and this reference is lost.
        //
      }
    app.selection = null;
    mask.selected = true;
    siblings[0].selected = true;
    let lastname = siblings[0].name;
    intersectAction();
    app.selection = null;
    //
    // Fix name transfer
    //
    parent.selected = true;
    app.executeMenuCommand("ungroup");
    app.selection = null;
  }
};

// Thanks Qwertyfly
// https://community.adobe.com/t5/illustrator/js-cs6-executemenucommand/m-p/5904772#M19673
export const intersectAction = (): void => {
  if (app.documents.length == 0) {
    return;
  }
  let ActionString =
    "/version 3 /name [ 10 4578706f727454657374 ] /isOpen 1 /actionCount 1 /action-1 { /name [ 9 496e74657273656374 ] /keyIndex 0 /colorIndex 0 /isOpen 1 /eventCount 1 /event-1 { /useRulersIn1stQuadrant 0 /internalName (ai_plugin_pathfinder) /localizedName [ 10 5061746866696e646572 ] /isOpen 0 /isOn 1 /hasDialog 0 /parameterCount 1 /parameter-1 { /key 1851878757 /showInPalette -1 /type (enumerated) /name [ 9 496e74657273656374 ] /value 1 } } }";
  createAction(ActionString);
  app.doScript("Intersect", "ExportTest", false);
  app.unloadAction("ExportTest", "");
};
export const createAction = (str: string): void => {
  let f = new File("~/ScriptAction.aia");
  f.open("w");
  f.write(str);
  f.close();
  app.loadAction(f);
  f.remove();
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const shortId = (): string => {
  let str = "";
  let codex = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i <= 2; i++)
    str += codex.charAt(randomInt(0, codex.length - 1));
  return str.toUpperCase();
};
