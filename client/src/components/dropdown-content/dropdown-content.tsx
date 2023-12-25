import { PropsWithChildren, RefObject, useRef } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import "./dropdown-content.scss";

interface DropdownContentProps {
  className?: string;
  show: boolean;
  outsideClickExclusions?: RefObject<HTMLElement>[];
  onOutsideClick: () => void;
}

export const DropdownContent = ({
  className = "",
  show = false,
  children,
  outsideClickExclusions = [],
  onOutsideClick,
}: PropsWithChildren<DropdownContentProps>) => {
  const contentRef = useRef(null);

  useOutsideClick([contentRef, ...outsideClickExclusions], () => onOutsideClick(), show);

  return (
    <>
      {show && (
        <div className={`c-dropdown-content ${className}`} ref={contentRef}>
          {children}
        </div>
      )}
    </>
  );
};
