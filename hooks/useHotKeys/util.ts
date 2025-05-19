import { keyNameCodeMapping, modifierNameKeyCodeMapping } from './constants';

export default function toArray<T>(val: T | T[]) {
  return Array.isArray(val) ? val : [val];
}

export const isKeyPressed = (key: string, evt: KeyboardEvent): boolean => {
  const keyCode = getKeyCode(key);
  switch (keyCode) {
    case getKeyCode('command'):
      return evt.metaKey;
    case getKeyCode('shift'):
      return evt.shiftKey;
    case getKeyCode('ctrl'):
      return evt.ctrlKey;
    case getKeyCode('alt'):
      return evt.altKey;
    default:
      return keyCode === evt.keyCode;
  }
};

export const getKeyCode = (x: string): number =>
  keyNameCodeMapping[x.toLowerCase()] ||
  modifierNameKeyCodeMapping[x.toLowerCase()] ||
  x.toUpperCase().charCodeAt(0);
