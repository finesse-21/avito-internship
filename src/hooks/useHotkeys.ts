import { useEffect } from 'react';

type HotkeyHandler = (event: KeyboardEvent) => void;

interface HotkeyConfig {
  [key: string]: HotkeyHandler;
}

export const useHotkeys = (hotkeys: HotkeyConfig, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        target.tagName
      );

      if (isInputField && event.key !== '/') {
        return;
      }

      const handler = hotkeys[event.key.toLowerCase()];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hotkeys, enabled]);
};
