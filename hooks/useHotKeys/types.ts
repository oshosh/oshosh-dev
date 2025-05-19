import { keyNameCodeMapping, modifierNameKeyCodeMapping } from './constants';

export type KeyName = keyof typeof keyNameCodeMapping;
export type ModifierName = keyof typeof modifierNameKeyCodeMapping;

/**
 * Hook에서 지원하는 Hook키의 interface를 정의 합니다.
 */
export type Hotkey = {
  /**
   * 일치하는 핫키를 누를때 callback이 트리거 되며 실행됩니다.
   */
  callback: (e: KeyboardEvent) => void;
  /**
   * shortcuts를 정의 하며 multi의 대체 키 리스로도 사용이 가능합니다.
   */
  match: string[] | string;
  /**
   * 텍스트 입력에 초점이 맞춰져 있는 동안 핫키가 실행되도록 허용합니다.
   */
  includeInputs?: boolean;
  /**
   * keydown 이벤트에서 PreventDefault를 호출하지 마세요.
   * 기본적으로 브라우저 이벤트 보다 더 상위로 동작 합니다.
   */
  skipPreventDefault?: boolean;
};

/**
 * 수정자 UnionType를 정의 합니다.
 */
export type ModifiersUnionType = 'command' | 'shift' | 'ctrl' | 'alt';

/**
 * 수정자는 한정된 컨디셔널 타입을 반환합니다.
 */
export type ChooseModifiersType<A> = A extends ModifiersUnionType
  ? Array<ModifiersUnionType>
  : never;
