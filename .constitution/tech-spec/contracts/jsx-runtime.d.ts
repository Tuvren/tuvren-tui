import type { ComponentType, View, ViewChildren, ViewNode } from "./shared";

export const Fragment: unique symbol;
export function jsx(
  type: string | ComponentType<never> | typeof Fragment,
  props: Readonly<Record<string, unknown>> | null,
  key?: string | number,
): ViewNode;
export const jsxs: typeof jsx;
export const jsxDEV: typeof jsx;

export namespace JSX {
  type Element = View;
  interface ElementChildrenAttribute {
    children: ViewChildren;
  }
  interface IntrinsicAttributes {
    key?: string | number;
  }
}
