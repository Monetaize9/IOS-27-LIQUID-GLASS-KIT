"use client";

import { useRef, type InputHTMLAttributes, type Ref } from "react";
import { Glass } from "./Glass";
import { CloseIcon, SearchIcon } from "../lib/icons";
import { cn } from "../lib/cn";
import { mergeRefs } from "../lib/mergeRefs";
import { useControllableState } from "../lib/hooks";

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "onSubmit" | "size"> {
  ref?: Ref<HTMLInputElement>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called on Enter. */
  onSubmit?: (value: string) => void;
}

export function SearchField({
  ref,
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  className,
  placeholder = "Search",
  ...rest
}: SearchFieldProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Glass
      radius="capsule"
      className={cn("lg-search", className)}
      onClick={() => inputRef.current?.focus()}
    >
      <SearchIcon className="lg-search__icon" />
      <input
        ref={mergeRefs(inputRef, ref)}
        type="search"
        enterKeyHint="search"
        placeholder={placeholder}
        className="lg-search__input"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit?.(current);
          if (e.key === "Escape" && current) {
            e.stopPropagation();
            setCurrent("");
          }
        }}
        {...rest}
      />
      {current && (
        <button
          type="button"
          className="lg-search__clear"
          aria-label="Clear search"
          onClick={() => {
            setCurrent("");
            inputRef.current?.focus();
          }}
        >
          <CloseIcon />
        </button>
      )}
    </Glass>
  );
}
