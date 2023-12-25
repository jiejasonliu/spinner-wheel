import { RefObject, useEffect } from "react";

/**
 * Perform an action (callback) whenever a click occurs outside of the ref object.
 *
 * @param refs an array of references to HTMLElement(s), attach object from `useRef` to this
 * @param action callback handler after a click outside occurs
 * @param active conditionally enable this hook (default: true [always enabled])
 * @param extraDeps extra dependencies to rehook; do NOT include types in `active`
 */
export const useOutsideClick = (
  refs: RefObject<HTMLElement>[],
  action: (event: MouseEvent) => void,
  active = true,
  ...extraDeps: unknown[]
): void => {
  useEffect(() => {
    if (!active || refs.length === 0) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (refs.some((ref) => ref.current?.contains(event.target as Node))) {
        return;
      }
      action(event);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    // destructor; called when component using this hook gets destroyed or a dependency changes
    return () => {
      if (!active || refs.length === 0) return;
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [refs, action, active, ...extraDeps]);
};
