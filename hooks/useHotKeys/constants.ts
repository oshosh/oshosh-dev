import { keyNameCodeMapping as keyMap, modifierNameKeyCodeMapping as modifierMap } from './keyMaps';
import { ChooseModifiersType, KeyName, ModifierName, ModifiersUnionType } from './types';

export const keyNameCodeMapping: Readonly<Record<KeyName, number>> = keyMap;

export const modifierNameKeyCodeMapping: Readonly<Record<ModifierName, number>> = modifierMap;

export const modifiers: ChooseModifiersType<ModifiersUnionType> = [
  'command',
  'shift',
  'ctrl',
  'alt',
];
