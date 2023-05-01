export interface Route {
  path?: string;
  name: string;
  label: string;
  disabled?: boolean;
  callback?: any;
}
export type Routes = Route[];
export interface Tab {
  active: boolean;
  hover: boolean;
  index: number;
  path: string;
  name: string;
  label: string;
  callback?: any;
}
export type Tabs = Tab[];
