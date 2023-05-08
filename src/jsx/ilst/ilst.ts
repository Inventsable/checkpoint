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

export const displayWarning = (options: string) => {
  const dialogOpts = JSON.parse(options) as DialogOptions;
  const result = scriptConfirmation(dialogOpts);
  return result;
};

// Thanks Stephen
// https://github.com/MarshySwamp/ScriptUI-Confirm-Window
export const scriptConfirmation = (options: DialogOptions) => {
  var confirmationTitle = options.title,
    confirmationString2 = options.body;
  try {
    var confirmationWindow = new Window("dialog");
    confirmationWindow.text = confirmationTitle;
    confirmationWindow.preferredSize.width = 400;
    confirmationWindow.preferredSize.height = 60;
    confirmationWindow.orientation = "column";
    // @ts-ignore
    confirmationWindow.alignChildren = ["left", "top"];
    confirmationWindow.spacing = 15;
    confirmationWindow.margins = 20;
    var textGroup = confirmationWindow.add("group", undefined, {
      name: "textGroup",
    });
    textGroup.preferredSize.width = 400;
    textGroup.orientation = "column";
    textGroup.alignChildren = ["left", "center"];
    textGroup.spacing = 5;
    textGroup.margins = 0;
    var confirmationText2 = textGroup.add("statictext", undefined, undefined, {
      name: "confirmationText2",
      multiline: true,
    });
    confirmationText2.text = confirmationString2;
    // @ts-ignore
    confirmationText2.graphics.font = "dialog:13";
    confirmationText2.alignment = ["left", "center"];
    confirmationText2.preferredSize.width = 400;
    var buttonGroup = confirmationWindow.add("group", undefined, {
      name: "buttonGroup",
    });
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["right", "top"];
    buttonGroup.spacing = 0;
    buttonGroup.margins = 10;
    buttonGroup.preferredSize.width = 400;
    var cancelButton = buttonGroup.add("button", undefined, undefined, {
      name: "cancelButton",
    });
    cancelButton.text = "CANCEL";
    cancelButton.justify = "right";
    var okButton = buttonGroup.add("button", undefined, undefined, {
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
// @ts-ignore
Array.prototype.map = function (callback) {
  var mappedParam = [];
  for (var i = 0; i < this.length; i++)
    mappedParam.push(callback(this[i], i, this));
  return mappedParam;
};
// @ts-ignore
Array.prototype.filter = function (callback) {
  var filtered = [];
  for (var i = 0; i < this.length; i++)
    if (callback(this[i], i, this)) filtered.push(this[i]);
  return filtered;
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
// @ts-ignore
Array.prototype.every = function (callback) {
  var count = 0;
  for (var i = 0; i < this.length; i++) if (callback(this[i], i, this)) count++;
  return count == this.length;
};

// @ts-ignore
Array.prototype.some = function (callback) {
  for (var i = 0; i < this.length; i++)
    if (callback(this[i], i, this)) return true;
  return false;
};

export const get = (type: string, parent?: any, deep?: boolean): any[] => {
  // @ts-ignore
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

export const startOutliner = (data: string): string | boolean => {
  const asChunks = false;
  const config = JSON.parse(data) as Config;
  if (asChunks) {
    alert("Not currently supported");
    return false;
  } else {
    const list = scanCurrentPageItems(config);
    convertListToOutlines(config, list);
    sortLayerContents();
  }
  return "HELLO";
};

export const runDiagnostic = (): string => {
  const dia = {
    paths: {
      count: app.activeDocument.pathItems.length,
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
  var list = [];
  if (!config.options.overrideComplex) {
    if (config.options.mergeClippingMasks) mergeClippingPaths();
    for (var i = app.activeDocument.pathItems.length - 1; i >= 0; i--)
      list.push(app.activeDocument.pathItems[i]);
    return filteredList(config, list);
  } else {
    return cloneAllPathItems(config);
  }
};

export const filteredList = (config: Config, list: any[]): any[] => {
  // @ts-ignore
  return list.filter((i) => {
    const isBackgroundState = pathIsEquivalentToBackground(config, i);
    return (
      (!config.options.ignoreHidden ||
        !checkAncestryForProp(i, "visible", true, [i.hidden])
          // @ts-ignore
          .some((i) => !!i)) &&
      (!config.options.ignoreLocked ||
        !checkAncestryForProp(i, "locked", false, [i.locked])
          // @ts-ignore
          .some((i) => !!i))
    );
  });
};

export const checkAncestryForProp = (
  item: any,
  prop: string,
  toggled: boolean,
  chain: any[]
): any[] => {
  if (item.parent && !/document/i.test(item.parent.typename)) {
    chain = [].concat(
      // @ts-ignore
      chain,
      toggled ? !item.parent[prop] : item.parent[prop]
    );
    return checkAncestryForProp(item.parent, prop, toggled, chain);
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
  for (var i = list.length - 1; i >= 0; i--) {
    var item = list[i];
    const parentage = item.name || item.parent.name || item.layer.name;
    item.name = config.options.renameGenericPaths
      ? // @ts-ignore
        rollName(config, parentage, item, item.layer)
      : parentage;
    if (item.stroked || item.filled) {
      replaceAppearance(config, item);
      var parentgroup = config.options.groupRelated
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
        for (var p = 0; p < item.pathPoints.length; p++) {
          var point = item.pathPoints[p];
          var pointName = item.name + "[" + p + "]";
          var group = config.options.groupRelated
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
  var anchor = root.pathItems.rectangle(
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
    var stick = config.options.groupRelated
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

    var handle = root.pathItems.ellipse(
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
  var realColor = config.options.useLayerLabelColor
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
  for (var i = 0; i < app.activeDocument.layers.length; i++) {
    var layer = app.activeDocument.layers[i];
    if (layer.locked) continue;
    for (var c = 0; c < layer.pathItems.length; c++)
      layer.pathItems[c].zOrder(ZOrderMethod.BRINGTOFRONT);
    var offset = layer.pathItems.length + 1;
    for (var c = 0; c < layer.groupItems.length; c++) {
      var group = layer.groupItems[c];
      offset = Number(offset) - Number(1);
      for (var z = 0; z < offset; z++) group.zOrder(ZOrderMethod.BRINGFORWARD);
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
  var siblingCount = 0;
  var nameRX = new RegExp(name + "\\[\\d\\].*");
  if (!config.options.generateIds)
    for (var i = 0; i < layer.pathItems.length; i++)
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
  var list = [];
  var cloneProps = ["position", "left", "top", "name", "closed", "layer"];
  var pathProps = ["anchor", "leftDirection", "rightDirection", "pointType"];
  for (var i = app.activeDocument.pathItems.length - 1; i >= 0; i--) {
    var item = app.activeDocument.pathItems[i];
    const isHidden = checkAncestryForProp(item, "visible", true, [
      item.hidden,
      // @ts-ignore
    ]).some((i) => !!i);
    const isLocked = checkAncestryForProp(item, "locked", false, [
      item.locked,
      // @ts-ignore
    ]).some((i) => !!i);
    if (isHidden || isLocked) continue;
    var clone = {
      pathPoints: [],
    };
    for (var v = 0; v < cloneProps.length; v++) {
      var prop = cloneProps[v];
      // @ts-ignore
      clone[prop] = item[prop];
    }

    for (var v = 0; v < item.pathPoints.length; v++)
      // @ts-ignore
      clone.pathPoints.push(item.pathPoints[v]);
    list.push(clone);
    item.remove();
  }
  list = filteredList(config, list);
  var dupes = [];
  for (var i = 0; i < list.length; i++) {
    var schema = list[i];
    var item = app.activeDocument.pathItems.add();
    for (var v = 0; v < cloneProps.length; v++) {
      var prop = cloneProps[v];
      // @ts-ignore
      if (prop !== "layer") item[prop] = schema[prop];
    }
    // @ts-ignore
    item.move(schema.layer, ElementPlacement.PLACEATBEGINNING);
    for (var v = 0; v < schema.pathPoints.length; v++) {
      var point = schema.pathPoints[v];
      var newpoint = item.pathPoints.add();
      for (var c = 0; c < pathProps.length; c++) {
        var prop = pathProps[c];
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
  var masks = app.selection;
  if (app.selection.length < 1) return null;
  for (var i = 0; i < masks.length; i++) {
    var mask = masks[i];
    var parent = mask.parent;
    var siblings = [];
    for (var v = 0; v < parent.pathItems.length; v++) {
      var child = parent.pathItems[v];
      if (!child.clipping) {
        // var tag = child.tags.add();
        // tag.name = "marked";
        siblings.push(child);
      }
    }
    if (siblings.length > 1)
      for (var v = 1; v < siblings.length; v++) {
        app.selection = null;
        var dupe = mask.duplicate();
        var sibling = siblings[v];
        var lastname = sibling.name;
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
    var lastname = siblings[0].name;
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
  var ActionString =
    "/version 3 /name [ 10 4578706f727454657374 ] /isOpen 1 /actionCount 1 /action-1 { /name [ 9 496e74657273656374 ] /keyIndex 0 /colorIndex 0 /isOpen 1 /eventCount 1 /event-1 { /useRulersIn1stQuadrant 0 /internalName (ai_plugin_pathfinder) /localizedName [ 10 5061746866696e646572 ] /isOpen 0 /isOn 1 /hasDialog 0 /parameterCount 1 /parameter-1 { /key 1851878757 /showInPalette -1 /type (enumerated) /name [ 9 496e74657273656374 ] /value 1 } } }";
  createAction(ActionString);
  var ActionString = "";
  app.doScript("Intersect", "ExportTest", false);
  app.unloadAction("ExportTest", "");
};
export const createAction = (str: string): void => {
  var f = new File("~/ScriptAction.aia");
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
  var str = "";
  var codex = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i <= 2; i++)
    str += codex.charAt(randomInt(0, codex.length - 1));
  return str.toUpperCase();
};

// Shorthand for testing against silent script failure
export const helloWorld = () => {
  alert("Hello world");
};
