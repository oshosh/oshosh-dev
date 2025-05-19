import { keyNameCodeMapping, modifierNameKeyCodeMapping } from './constants';
import { KeyName, ModifierName } from './types';

export default function toArray<T>(val: T | T[]) {
  return Array.isArray(val) ? val : [val];
}

function isKeyName(key: string): key is KeyName {
  return key in keyNameCodeMapping;
}

function isModifierName(key: string): key is ModifierName {
  return key in modifierNameKeyCodeMapping;
}

export const getKeyCode = (x: string): number => {
  const lowerKey = x.toLowerCase();

  if (isKeyName(lowerKey)) {
    return keyNameCodeMapping[lowerKey];
  }

  if (isModifierName(lowerKey)) {
    return modifierNameKeyCodeMapping[lowerKey];
  }

  return x.toUpperCase().charCodeAt(0);
};

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
