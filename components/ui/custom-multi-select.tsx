// custom-multi-select.tsx
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = React.useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = React.useState(0);

  const updateVisibleItems = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth - 100; // Reserve space for clear button
    let totalWidth = 0;
    const newVisibleItems = [];
    let hidden = 0;

    for (const item of selected) {
      const itemWidth = item.length * 8 + 60; // Approximate width based on character count
      if (totalWidth + itemWidth > containerWidth) {
        hidden++;
      } else {
        newVisibleItems.push(item);
        totalWidth += itemWidth;
      }
    }

    setVisibleItems(newVisibleItems);
    setHiddenCount(hidden);
  };

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    updateVisibleItems();
  }, [selected]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        ref={containerRef}
        className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 items-center gap-1 overflow-hidden">
          {selected.length > 0 ? (
            <>
              {visibleItems.map((value) => (
                <Badge
                  key={value}
                  variant="secondary"
                  className="flex items-center gap-1 shrink-0"
                >
                  <span className="truncate max-w-[100px]">{value}</span>
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(selected.filter((item) => item !== value));
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
              {hiddenCount > 0 && (
                <Badge variant="secondary" className="shrink-0">
                  +{hiddenCount} more
                </Badge>
              )}
            </>
          ) : (
            <span className="text-muted-foreground truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {selected.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 rounded-full text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md z-50">
          {options.map((option) => (
            <div
              key={option}
              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleSelect(option)}
            >
              <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                {selected.includes(option) && <Check className="h-4 w-4" />}
              </span>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};