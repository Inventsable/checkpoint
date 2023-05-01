import lookup from "./lookup.json";
import mask from "./mask.json";
import type {
  ThemeLookupManager,
  AppLookupItem,
  LookupVariableList,
  LookupVariableListItem,
  LookupList,
  LookupListItem,
  ThemeMaskManager,
  AppMaskItem,
  MaskVariableList,
  MaskVariableListItem,
  RGBColor,
} from "./types";

/**
 * Method for invoking theme listener and generating base CSS vars for all components, both for app and web versions
 * @param delta Flat value for RGB array mock between 35 and 75 to generate a mock UI in web version.
 */
export const initializeTheme = (delta?: Number): void => {
  if (window.__adobe_cep__) {
    // If in Adobe, set a listener to repaint any time the UI changes color
    window.__adobe_cep__.addEventListener(
      "com.adobe.csxs.events.ThemeColorChanged",
      appThemeChanged
    );
    // Since appThemeChanged calculates standalone, we can call it standalone for initial paint:
    appThemeChanged();
  }
  // Otherwise if this is web, we use the delta prop or fallback to 35 (darkest PPRO UI value)
  // else
  //   stylesheet.forEach((cssVar: LookupListItem) => {
  //     setCSS(cssVar.title, getValue(cssVar, Array(3).fill(delta || 35)));
  //   });
};

export const appThemeChanged = (): void => {
  const panelBG = getPanelBGColor();
  getStyleSheet().forEach((maskItem: any) => {
    const cssVar = decodeMaskItem(maskItem);
    setCSS(cssVar.title, getValue(cssVar, panelBG));
  });
};

const decodeMaskItem = (maskItem: LookupListItem): LookupVariableListItem => {
  let temp = {} as LookupVariableListItem;
  Object.keys(maskItem)
    .map((key) => {
      return {
        mask: key,
        value: lookupDecoded(key),
      };
    })
    .forEach((key) => {
      if (key.value == "title")
        temp[key.value] = lookupDecoded(maskItem[key.mask]);
      else temp[key.value] = maskItem[key.mask];
    });
  return temp;
};

const getStyleSheet = (): MaskVariableList => {
  const appMask = lookupEncoded(
    // @ts-ignore
    JSON.parse(window.__adobe_cep__.getHostEnvironment()).appName
  );
  const appSheet = mask[appMask];
  if (Object.keys(appSheet).length == 1)
    return appSheet[lookupEncoded("gradient")];
  else {
    // @ts-ignore
    const alpha = JSON.parse(window.__adobe_cep__.getHostEnvironment())
      .appSkinInfo.panelBackgroundColor.color.red;
    return appSheet[
      lookupEncoded(
        alpha > 220
          ? "lightest"
          : alpha > 150
          ? "light"
          : alpha > 80
          ? "dark"
          : "darkest"
      )
    ];
  }
};

const lookupEncoded = (key: string, debugInfo?: string): string => {
  try {
    return lookup.find(
      (maskItem: LookupListItem): boolean => maskItem.key == key
    ).mask;
  } catch (err) {
    console.error(`Could not find key of ${key}`, debugInfo);
  }
};

const lookupDecoded = (mask: string): string => {
  return lookup.find(
    (maskItem: LookupListItem): boolean => maskItem.mask == mask
  ).key;
};

export const getColorFromDeltaOffset = (color: any, delta: string | Number) => {
  return rgbToHex(
    color.map((col) => {
      return Number(col) + Number(delta);
    })
  );
};

const getValue = (
  item: LookupVariableListItem,
  color: any
): string | Number => {
  if (item.delta || item.delta <= 0)
    return Number(item.delta) + Number(color[0]) >= 255
      ? "#ffffff"
      : getColorFromDeltaOffset(color, item.delta);
  else if (item.hex) return item.hex;
  else if (item.value) return item.value;
};

export const getPanelBGColor = (): Number[] => {
  return getRGBArray(
    // @ts-ignore: Arg of type '{}' is not assignable to string
    JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo
      .panelBackgroundColor.color
  );
};

export const getRGBArray = (color: RGBColor): Number[] => {
  return [color.red || color.r, color.green || color.g, color.blue || color.b];
};

const getCSS = (prop: string): string => {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(`${/^\-\-/.test(prop) ? prop : "--" + prop}`);
};

const setCSS = (prop: string, data: any): void => {
  document.documentElement.style.setProperty(
    `--${prop.replace(/^--/, "")}`,
    data
  );
};

const rgbToHex = (rgbArray: any): string => {
  !(rgbArray instanceof Array)
    ? [
        rgbArray.r || rgbArray.red,
        rgbArray.g || rgbArray.green,
        rgbArray.b || rgbArray.blue,
      ]
    : rgbArray;
  while (rgbArray.length > 3) rgbArray.pop();
  return `#${rgbArray
    .map((c: any) => {
      c = c <= 255 ? Math.abs(Math.floor(c)).toString(16) : 0;
      return c.length < 2 ? `0${c}` : c;
    })
    .join("")}`;
};
