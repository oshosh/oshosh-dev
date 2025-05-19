import { DependencyList, useCallback, useEffect, useMemo } from 'react';
import { modifiers } from './constants';
import { Hotkey } from './types';
import toArray, { isKeyPressed } from './util';

export function useHotkeys(hotkeys: Hotkey[], deps: DependencyList): void {
  const memoizedHotkeys = useMemo(() => hotkeys, deps);

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      for (const hotkey of memoizedHotkeys) {
        const preventDefault = !hotkey.skipPreventDefault;
        const keysets = toArray(hotkey.match).map((keys) => keys.toLowerCase());

        for (const keyset of keysets) {
          const keys = keyset.split('+');
          const unusedModifiers = modifiers.filter((modifier) => !keys.includes(modifier));

          const allKeysPressed =
            keys.every((key) => isKeyPressed(key, evt)) &&
            unusedModifiers.every((modifier) => !isKeyPressed(modifier, evt));

          const inputHasFocus =
            !hotkey.includeInputs && evt.target instanceof HTMLElement
              ? ['textarea', 'input'].includes(evt.target.tagName.toLowerCase())
              : false;

          if (allKeysPressed && !inputHasFocus) {
            if (preventDefault) {
              evt.preventDefault(); // submit일 경우 호출
            }
            hotkey.callback(evt);
            return;
          }
        }
      }
    },
    [memoizedHotkeys]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
}
