import { keyNameCodeMapping, modifierNameKeyCodeMapping } from './keyMaps';

export type KeyName = keyof typeof keyNameCodeMapping;
export type ModifierName = keyof typeof modifierNameKeyCodeMapping;

export type Hotkey = {
  callback: (e: KeyboardEvent) => void;
  match: string[] | string;
  includeInputs?: boolean;
  skipPreventDefault?: boolean;
};

export type ModifiersUnionType = 'command' | 'shift' | 'ctrl' | 'alt';

export type ChooseModifiersType<A> = A extends ModifiersUnionType
  ? Array<ModifiersUnionType>
  : never;
