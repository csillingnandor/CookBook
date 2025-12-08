import { useEffect } from "preact/hooks";

/**
 * @remarks Testreszabott hook a body görgetésének zárolásához vagy feloldásához.
 * @param locked ha true, a body görgetése zárolva van
 */

export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
};
