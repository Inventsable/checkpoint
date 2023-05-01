export type ThemeLookupManager = Record<string, AppLookupItem>;
export type AppLookupItem = Record<string, LookupVariableList>;
export type LookupVariableList = LookupVariableListItem[];
export interface LookupVariableListItem {
  title: string;
  delta?: string | Number;
  value?: string | Number;
  hex?: string;
}

export interface RGBColor {
  r?: Number;
  g?: Number;
  b?: Number;
  red?: Number;
  green?: Number;
  blue?: Number;
}

export type LookupList = LookupListItem[];
export interface LookupListItem {
  key: string;
  mask: string;
}

export type ThemeMaskManager = Record<string, AppMaskItem>;
export type AppMaskItem = Record<string, MaskVariableList>;
export type MaskVariableList = MaskVariableListItem[];
export type MaskVariableListItem = Record<string, String | Number>;
