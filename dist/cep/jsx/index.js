(function (thisObj) {// ----- EXTENDSCRIPT INCLUDES ------ //"object"!=typeof JSON&&(JSON={}),function(){"use strict";var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;r<u;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;r<u;r+=1)"string"==typeof rep[r]&&(o=str(n=rep[r],i))&&f.push(quote(n)+(gap?": ":":")+o);else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i))&&f.push(quote(n)+(gap?": ":":")+o);return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;n<r;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(void 0!==(n=walk(o,r))?o[r]=n:delete o[r]);return reviver.call(t,e,o)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();// ---------------------------------- //// ----- EXTENDSCRIPT PONYFILLS -----function __objectFreeze(obj) { return obj; }function __isArray(arr) { try { return arr instanceof Array; } catch (e) { return false; } };// ---------------------------------- //var version = "0.0.2";

var config = {
  version: version,
  id: "com.checkpoint.cep",
  displayName: "Checkpoint",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [{
    name: "ILST",
    version: "[0.0,99.9]"
  }],
  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 500,
  height: 550,
  panels: [{
    mainPath: "./main/index.html",
    name: "main",
    panelDisplayName: "Checkpoint",
    autoVisible: true,
    width: 300,
    height: 500,
    minWidth: 40,
    minHeight: 370,
    maxWidth: 350,
    maxHeight: 700
  }, {
    mainPath: "./main/index.html",
    name: "settings",
    autoVisible: false,
    type: "ModalDialog",
    width: 800,
    height: 650,
    minHeight: 600,
    minWidth: 600,
    maxHeight: 1200,
    maxWidth: 1200,
    startOnEvents: []
  }],
  build: {
    jsxBin: "off",
    sourceMap: true
  },
  zxp: {
    country: "US",
    province: "CA",
    org: "MyCompany",
    password: "mypassword",
    tsa: "http://timestamp.digicert.com/",
    sourceMap: false,
    jsxBin: "off"
  },
  installModules: ["showdown"],
  copyAssets: [],
  copyZipAssets: []
};

var ns = config.id;

var displayWarning = function displayWarning(options) {
  var dialogOpts = JSON.parse(options);
  var result = scriptConfirmation(dialogOpts);
  return result;
};

// Thanks Stephen
// https://github.com/MarshySwamp/ScriptUI-Confirm-Window
var scriptConfirmation = function scriptConfirmation(options) {
  var confirmationTitle = options.title,
    confirmationString2 = options.body;
  try {
    var confirmationWindow = new Window("dialog");
    confirmationWindow.text = confirmationTitle;
    confirmationWindow.preferredSize.width = 400;
    confirmationWindow.preferredSize.height = 60;
    confirmationWindow.orientation = "column";
    
    confirmationWindow.alignChildren = ["left", "top"];
    confirmationWindow.spacing = 15;
    confirmationWindow.margins = 20;
    var textGroup = confirmationWindow.add("group", undefined, {
      name: "textGroup"
    });
    textGroup.preferredSize.width = 400;
    textGroup.orientation = "column";
    textGroup.alignChildren = ["left", "center"];
    textGroup.spacing = 5;
    textGroup.margins = 0;
    var confirmationText2 = textGroup.add("statictext", undefined, undefined, {
      name: "confirmationText2",
      multiline: true
    });
    confirmationText2.text = confirmationString2;
    
    confirmationText2.graphics.font = "dialog:13";
    confirmationText2.alignment = ["left", "center"];
    confirmationText2.preferredSize.width = 400;
    var buttonGroup = confirmationWindow.add("group", undefined, {
      name: "buttonGroup"
    });
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["right", "top"];
    buttonGroup.spacing = 0;
    buttonGroup.margins = 10;
    buttonGroup.preferredSize.width = 400;
    var cancelButton = buttonGroup.add("button", undefined, undefined, {
      name: "cancelButton"
    });
    cancelButton.text = "CANCEL";
    cancelButton.justify = "right";
    var okButton = buttonGroup.add("button", undefined, undefined, {
      name: "okButton"
    });
    okButton.text = "OK";
    okButton.justify = "right";
    return confirmationWindow.show() === 1;
  } catch (err) {
    return false;
  }
};
var newRGB = function newRGB(color) {
  var temp = new RGBColor();
  temp.red = color.red;
  temp.green = color.green;
  temp.blue = color.blue;
  return temp;
};
var newCMYK = function newCMYK(color) {
  var temp = new CMYKColor();
  temp.cyan = color.cyan;
  temp.magenta = color.magenta;
  temp.yellow = color.yellow;
  temp.black = color.black;
  return temp;
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/__isArray

if (!__isArray) {
  
  __isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}

Array.prototype.map = function (callback) {
  var mappedParam = [];
  for (var i = 0; i < this.length; i++) mappedParam.push(callback(this[i], i, this));
  return mappedParam;
};

Array.prototype.filter = function (callback) {
  var filtered = [];
  for (var i = 0; i < this.length; i++) if (callback(this[i], i, this)) filtered.push(this[i]);
  return filtered;
};

Array.prototype.reduce = function (fn, initial) {
  var values = this;
  
  values.forEach(function (item) {
    initial = initial !== undefined ? fn(initial, item) : item;
  });
  return initial;
};

Array.prototype.forEach = function (callback) {
  for (var i = 0; i < this.length; i++) callback(this[i], i, this);
};

Array.prototype.every = function (callback) {
  var count = 0;
  for (var i = 0; i < this.length; i++) if (callback(this[i], i, this)) count++;
  return count == this.length;
};

Array.prototype.flat = function () {
  
  function flattenArrayOfArrays(a, r) {
    if (!r) r = [];
    for (var i = 0; i < a.length; i++)
    
    if (__isArray(a[i])) r.concat(flattenArrayOfArrays(a[i], r));else r.push(a[i]);
    return r;
  }
  
  return flattenArrayOfArrays(this);
};


Array.prototype.some = function (callback) {
  for (var i = 0; i < this.length; i++) if (callback(this[i], i, this)) return true;
  return false;
};


function get(type, parent, deep) {
  if (arguments.length == 1 || !parent) {
    parent = app.activeDocument;
    deep = true;
  }
  var result = [];
  if (!parent[type]) return [];
  for (var i = 0; i < parent[type].length; i++) {
    result.push(parent[type][i]);
    if (parent[type][i][type] && deep)
      
      result = [].concat(result, get(type, parent[type][i], deep));
  }
  return result;
}
var getColorFromPicker = function getColorFromPicker(previous) {
  var input = previous ? JSON.parse(previous) : null;
  var isRGB = app.activeDocument.documentColorSpace == DocumentColorSpace.RGB;
  var val = input;
  if (!val) val = isRGB ? {
    red: 50,
    green: 50,
    blue: 50
  } : {
    cyan: 50,
    magenta: 50,
    yellow: 50,
    black: 50
  };
  var colorValue = isRGB ? new RGBColor() : new CMYKColor();
  
  for (var key in val) colorValue[key] = val[key];
  var newResult = app.showColorPicker(colorValue);
  if (newResult) {
    
    for (var _key in newResult) newResult[_key] = Math.floor(newResult[_key]);
    return JSON.stringify(newResult);
  } else return null;
};
var startOutliner = function startOutliner(data) {
  var config = JSON.parse(data);
  // "Target layer cannot be modified" bug in scripting if a user has a locked
  // top layer. Really odd, I've literally never seen that before
  var topLayerLock = app.activeDocument.layers[0].locked;
  app.activeDocument.layers[0].locked = false;
  {
    var list = scanCurrentPageItems(config);
    convertListToOutlines(config, list);
    sortLayerContents();
  }
  app.activeDocument.layers[0].locked = topLayerLock;
  return "HELLO";
};
var overrideActiveLayerIfLocked = function overrideActiveLayerIfLocked() {
  var activeIsLocked = app.activeDocument.activeLayer.locked,
    
    freeLayers = get("layers").filter(function (layer) {
      return !layer.locked;
    });
  if (activeIsLocked) app.activeDocument.activeLayer.locked = false;
  if (activeIsLocked && freeLayers.length) {
    app.activeDocument.activeLayer = freeLayers[0];
  } else if (activeIsLocked && !freeLayers.length) {
    alert("Cannot run when all layers are locked");
  }
};
var runDiagnostic = function runDiagnostic() {
  overrideActiveLayerIfLocked();
  var dia = {
    paths: {
      count: app.activeDocument.pathItems.length,
      
      anchors: get("pathItems")
      
      .map(function (i) {
        return i.pathPoints.length;
      }).reduce(function (sum, a) {
        return sum + a;
      }, 0)
    },
    layerCount: app.activeDocument.layers.length,
    colorModel: /RGB/.test(app.activeDocument.documentColorSpace + "") ? "RGB" : "CMYK",
    name: app.activeDocument.name,
    
    path: File(app.activeDocument.fullName).parent.fsName
  };
  return JSON.stringify(dia);
};
var generateColor = function generateColor(color) {
  return color.model == "RGB" ? newRGB(color.RGB) : newCMYK(color.CMYK);
};
var scanCurrentPageItems = function scanCurrentPageItems(config) {
  if (!config.options.overrideComplex) {
    if (config.options.mergeClippingMasks) mergeClippingPaths();
    
    return filteredList(config, get("pathItems"));
  } else {
    return cloneAllPathItems(config);
  }
};
var filteredList = function filteredList(config, list) {
  
  return list.filter(function (i) {
    var didPassVisible = !config.options.ignoreHidden ? !getAncestryChain(i, "visible", true, [i.hidden])
    
    .some(function (i) {
      return !!i;
    }) : false;
    var didPassLock = !config.options.ignoreLocked ? !getAncestryChain(i, "locked", false, [i.locked])
    
    .some(function (i) {
      return !!i;
    }) : false;
    return didPassVisible && didPassLock && /^pathItem$/i.test(i.typename);
  });
};
var getAncestryChain = function getAncestryChain(item, prop, toggled, chain) {
  if (item.parent && !/document/i.test(item.parent.typename)) {
    var needSwitch = prop == "visible" && item.parent.uuid;
    var realProp = needSwitch ? "hidden" : prop;
    var realToggled = needSwitch ? !toggled : toggled;
    chain = [].concat(
    
    chain, realToggled ? !item.parent[realProp] : item.parent[realProp]);
    return getAncestryChain(item.parent, prop, toggled, chain);
  } else return chain;
};
var pathIsEquivalentToBackground = function pathIsEquivalentToBackground(config, path) {
  // Not yet implemented
  return false;
};
var convertListToOutlines = function convertListToOutlines(config, list) {
  for (var i = list.length - 1; i >= 0; i--) {
    var item = list[i];
    var parentage = item.name || item.parent.name || item.layer.name;
    item.name = config.options.renameGenericPaths ?
    
    rollName(config, parentage, item, item.layer) : parentage;
    if (item.stroked || item.filled) {
      replaceAppearance(config, item);
      var parentgroup = config.options.groupRelated ? app.activeDocument.groupItems.add() : null;
      if (config.options.groupRelated && parentgroup && !item.layer.locked) {
        if (!parentgroup.locked) {
          parentgroup.name = item.name + config.options.suffixes.parent;
          
          parentgroup.move(item.layer, ElementPlacement.PLACEATBEGINNING);
        }
      }
      if (item.pathPoints && item.pathPoints.length) for (var p = 0; p < item.pathPoints.length; p++) {
        var point = item.pathPoints[p];
        var pointName = item.name + "[" + p + "]";
        var group = config.options.groupRelated ?
        
        parentgroup.groupItems.add() : null;
        
        if (config.options.groupRelated) group.name = pointName;
        drawAnchor(config, point, item.layer, pointName, group);
        drawHandle(config, point, "left", item.layer, pointName, group);
        drawHandle(config, point, "right", item.layer, pointName, group);
        item.opacity = config.options.forceOpacity ? 100.0 : item.opacity;
      }
    }
  }
};
var drawAnchor = function drawAnchor(config, point, layer, name, group) {
  var root = config.options.groupRelated ? group : app.activeDocument;
  var anchor = root.pathItems.rectangle(point.anchor[1] + config.anchor.style.size / 2, point.anchor[0] - config.anchor.style.size / 2, config.anchor.style.size, config.anchor.style.size);
  anchor.name = name + config.anchor.label;
  if (!config.options.groupRelated && !layer.locked)
    
    anchor.move(layer, ElementPlacement.PLACEATBEGINNING);
  setAnchorAppearance(config, anchor, false, layer);
  return [anchor];
};
var drawHandle = function drawHandle(config, point, direction, layer, name, group) {
  if (Number(point.anchor[0]) !== Number(point[direction + "Direction"][0]) || Number(point.anchor[1]) !== Number(point[direction + "Direction"][1])) {
    var stick = config.options.groupRelated ? group.pathItems.add() : app.activeDocument.pathItems.add();
    stick.setEntirePath([point.anchor, point[direction + "Direction"]]);
    if (!config.options.groupRelated && !layer.locked)
      
      stick.move(layer, ElementPlacement.PLACEATBEGINNING);
    stick.name = name + "_" + direction.charAt(0).toUpperCase() + config.stick.label;
    setAnchorAppearance(config, stick, true, layer);
    var root = config.options.groupRelated ? group : app.activeDocument;
    var handle = root.pathItems.ellipse(point[direction + "Direction"][1] + config.handle.style.size / 2, point[direction + "Direction"][0] - config.handle.style.size / 2, config.handle.style.size, config.handle.style.size);
    if (!config.options.groupRelated && !layer.locked)
      
      handle.move(layer, ElementPlacement.PLACEATBEGINNING);
    handle.stroked = false;
    handle.filled = true;
    handle.name = name + "_" + direction.charAt(0).toUpperCase() + config.handle.label;
    handle.fillColor = config.options.useLayerLabelColor ? layer.color : generateColor(config.handle.style.color);
    return [stick, handle];
  }
};
var setAnchorAppearance = function setAnchorAppearance(config, item, isHandle, layer) {
  var realColor = config.options.useLayerLabelColor ? layer.color : generateColor(config.anchor.style.color);
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
var replaceAppearance = function replaceAppearance(config, item) {
  item.filled = false;
  item.stroked = true;
  item.strokeWidth = config.outline.style.width;
  item.strokeColor = generateColor(config.outline.style.color);
};

// Rearrange results per layer so anchor Groups are directly above their target path
var sortLayerContents = function sortLayerContents() {
  for (var i = 0; i < app.activeDocument.layers.length; i++) {
    var layer = app.activeDocument.layers[i];
    if (layer.locked) continue;
    for (var c = 0; c < layer.pathItems.length; c++) layer.pathItems[c].zOrder(ZOrderMethod.BRINGTOFRONT);
    var offset = layer.pathItems.length + 1;
    for (var _c = 0; _c < layer.groupItems.length; _c++) {
      var group = layer.groupItems[_c];
      offset = Number(offset) - Number(1);
      for (var z = 0; z < offset; z++) group.zOrder(ZOrderMethod.BRINGFORWARD);
    }
  }
};

// Generates a unique identifier for layer to use in children nodes
var rollName = function rollName(config, name, item, layer) {
  var siblingCount = 0;
  var nameRX = new RegExp(name + "\\[\\d\\].*");
  if (!config.options.generateIds) for (var i = 0; i < layer.pathItems.length; i++) if (nameRX.test(layer.pathItems[i].name) && layer.pathItems[i] !== item && !/group/i.test(layer.pathItems[i].typename)) siblingCount++;
  return config.options.generateIds ? name + "_" + shortId() + "_" : name + "[" + siblingCount + "]";
};

// Reconstruct all PathItems with basic data to override any complex appearances
var cloneAllPathItems = function cloneAllPathItems(config) {
  var list = [];
  var cloneProps = ["position", "left", "top", "name", "closed", "layer"];
  var pathProps = ["anchor", "leftDirection", "rightDirection", "pointType"];
  for (var i = app.activeDocument.pathItems.length - 1; i >= 0; i--) {
    var item = app.activeDocument.pathItems[i];
    var isHidden = checkAncestryForProp(item, "visible", true, [item.hidden
    
    ]).some(function (i) {
      return !!i;
    });
    var isLocked = checkAncestryForProp(item, "locked", false, [item.locked
    
    ]).some(function (i) {
      return !!i;
    });
    if (isHidden || isLocked) continue;
    var clone = {
      pathPoints: []
    };
    for (var v = 0; v < cloneProps.length; v++) {
      var prop = cloneProps[v];
      
      clone[prop] = item[prop];
    }
    for (var _v = 0; _v < item.pathPoints.length; _v++)
    
    clone.pathPoints.push(item.pathPoints[_v]);
    list.push(clone);
    item.remove();
  }
  list = filteredList(config, list);
  var dupes = [];
  for (var _i = 0; _i < list.length; _i++) {
    var schema = list[_i];
    var _item = app.activeDocument.pathItems.add();
    for (var _v2 = 0; _v2 < cloneProps.length; _v2++) {
      var _prop = cloneProps[_v2];
      
      if (_prop !== "layer") _item[_prop] = schema[_prop];
    }
    
    _item.move(schema.layer, ElementPlacement.PLACEATBEGINNING);
    for (var _v3 = 0; _v3 < schema.pathPoints.length; _v3++) {
      var point = schema.pathPoints[_v3];
      var newpoint = _item.pathPoints.add();
      for (var c = 0; c < pathProps.length; c++) {
        var _prop2 = pathProps[c];
        
        newpoint[_prop2] = point[_prop2];
      }
    }
    dupes.push(_item);
  }
  return dupes;
};
var mergeClippingPaths = function mergeClippingPaths() {
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
        // let tag = child.tags.add();
        // tag.name = "marked";
        siblings.push(child);
      }
    }
    if (siblings.length > 1) for (var _v4 = 1; _v4 < siblings.length; _v4++) {
      app.selection = null;
      var dupe = mask.duplicate();
      var sibling = siblings[_v4];
      sibling.name;
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
    siblings[0].name;
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
var intersectAction = function intersectAction() {
  if (app.documents.length == 0) {
    return;
  }
  var ActionString = "/version 3 /name [ 10 4578706f727454657374 ] /isOpen 1 /actionCount 1 /action-1 { /name [ 9 496e74657273656374 ] /keyIndex 0 /colorIndex 0 /isOpen 1 /eventCount 1 /event-1 { /useRulersIn1stQuadrant 0 /internalName (ai_plugin_pathfinder) /localizedName [ 10 5061746866696e646572 ] /isOpen 0 /isOn 1 /hasDialog 0 /parameterCount 1 /parameter-1 { /key 1851878757 /showInPalette -1 /type (enumerated) /name [ 9 496e74657273656374 ] /value 1 } } }";
  createAction(ActionString);
  app.doScript("Intersect", "ExportTest", false);
  app.unloadAction("ExportTest", "");
};
var createAction = function createAction(str) {
  var f = new File("~/ScriptAction.aia");
  f.open("w");
  f.write(str);
  f.close();
  app.loadAction(f);
  f.remove();
};
var randomInt = function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
var shortId = function shortId() {
  var str = "";
  var codex = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i <= 2; i++) str += codex.charAt(randomInt(0, codex.length - 1));
  return str.toUpperCase();
};

var ilst = /*#__PURE__*/__objectFreeze({
  __proto__: null,
  displayWarning: displayWarning,
  scriptConfirmation: scriptConfirmation,
  newRGB: newRGB,
  newCMYK: newCMYK,
  getColorFromPicker: getColorFromPicker,
  startOutliner: startOutliner,
  overrideActiveLayerIfLocked: overrideActiveLayerIfLocked,
  runDiagnostic: runDiagnostic,
  generateColor: generateColor,
  scanCurrentPageItems: scanCurrentPageItems,
  filteredList: filteredList,
  getAncestryChain: getAncestryChain,
  pathIsEquivalentToBackground: pathIsEquivalentToBackground,
  convertListToOutlines: convertListToOutlines,
  drawAnchor: drawAnchor,
  drawHandle: drawHandle,
  setAnchorAppearance: setAnchorAppearance,
  replaceAppearance: replaceAppearance,
  sortLayerContents: sortLayerContents,
  rollName: rollName,
  cloneAllPathItems: cloneAllPathItems,
  mergeClippingPaths: mergeClippingPaths,
  intersectAction: intersectAction,
  createAction: createAction,
  randomInt: randomInt,
  shortId: shortId
});

var main;
switch (BridgeTalk.appName) {
  case "illustrator":
  case "illustratorbeta":
    main = ilst;
    break;
}

var host = typeof $ !== "undefined" ? $ : window;
host[ns] = main;
})(this);