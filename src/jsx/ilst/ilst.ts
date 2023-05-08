import type {
  ColorValue,
  Config,
  DocumentDiagonostic,
} from "../../shared/shared";

interface DialogOptions {
  title: string;
  header: string;
  body: string;
}

export const displayWarning = (options: string) => {
  const dialogOpts = JSON.parse(options) as DialogOptions;
  const result = scriptConfirmation(dialogOpts);
  return result;
};

// Thanks Stephen
// https://github.com/MarshySwamp/ScriptUI-Confirm-Window
function scriptConfirmation(options: DialogOptions) {
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
    if (confirmationWindow.show() === 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    alert("If you see this message an unexpected error has occurred!");
    return false;
  }
}
// @ts-ignore
RGBColor.prototype.set = function (color: rgbColor): rgbColor {
  this.red = color.red;
  this.green = color.green;
  this.blue = color.blue;
  return this;
};
// @ts-ignore
CMYKColor.prototype.set = function (color: cmykColor): cmykColor {
  this.cyan = color.cyan;
  this.magenta = color.magenta;
  this.yellow = color.yellow;
  this.black = color.black;
  return this;
};
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

export const startOutliner = (data: string, asChunks?: boolean): string => {
  // alert(JSON);
  const config = JSON.parse(data) as Config;
  if (asChunks) {
    //
  } else {
    //
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

// Reconstruct all PathItems with basic data to override any complex appearances
function cloneAllPathItems() {
  var list = [];
  var cloneProps = ["position", "left", "top", "name", "closed"];
  var pathProps = ["anchor", "leftDirection", "rightDirection", "pointType"];
  for (var i = app.activeDocument.pathItems.length - 1; i >= 0; i--) {
    var item = app.activeDocument.pathItems[i];
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
  var dupes = [];
  for (var i = 0; i < list.length; i++) {
    var schema = list[i];
    var item = app.activeDocument.pathItems.add();
    for (var v = 0; v < cloneProps.length; v++) {
      var prop = cloneProps[v];
      // @ts-ignore
      item[prop] = schema[prop];
    }
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
}

function mergeClippingPaths() {
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
}

// Thanks Qwertyfly
// https://community.adobe.com/t5/illustrator/js-cs6-executemenucommand/m-p/5904772#M19673
function intersectAction(): void {
  if (app.documents.length == 0) {
    return;
  }
  var ActionString =
    "/version 3 /name [ 10 4578706f727454657374 ] /isOpen 1 /actionCount 1 /action-1 { /name [ 9 496e74657273656374 ] /keyIndex 0 /colorIndex 0 /isOpen 1 /eventCount 1 /event-1 { /useRulersIn1stQuadrant 0 /internalName (ai_plugin_pathfinder) /localizedName [ 10 5061746866696e646572 ] /isOpen 0 /isOn 1 /hasDialog 0 /parameterCount 1 /parameter-1 { /key 1851878757 /showInPalette -1 /type (enumerated) /name [ 9 496e74657273656374 ] /value 1 } } }";
  createAction(ActionString);
  var ActionString = "";
  app.doScript("Intersect", "ExportTest", false);
  app.unloadAction("ExportTest", "");
  function createAction(str: string): void {
    var f = new File("~/ScriptAction.aia");
    f.open("w");
    f.write(str);
    f.close();
    app.loadAction(f);
    f.remove();
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shortId(): string {
  var str = "";
  var codex = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i <= 2; i++)
    str += codex.charAt(randomInt(0, codex.length - 1));
  return str.toUpperCase();
}
