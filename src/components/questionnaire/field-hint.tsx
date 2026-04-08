"use client";

import { useState, useRef, useEffect } from "react";

type FieldHintProps = {
  hint: string;
  glossary?: string; // English term for bilingual glossary
};

export function FieldHint({ hint, glossary }: FieldHintProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <span className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label="查看说明"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs text-vela-muted border border-vela-border hover:border-vela-primary hover:text-vela-primary transition-colors ml-1"
      >
        ?
      </button>
      {isOpen && (
        <div
          role="tooltip"
          className="absolute left-6 top-0 z-10 w-56 p-3 bg-vela-heading text-white text-sm rounded-md shadow-lg"
        >
          {glossary && (
            <p className="text-xs text-vela-muted mb-1 font-mono">{glossary}</p>
          )}
          <p>{hint}</p>
        </div>
      )}
    </span>
  );
}
