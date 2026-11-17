"use client";

import { useEffect, useId, useRef, useState } from "react";
import { canonicalCity, iranCities, searchCities, type IranCity } from "@/data/iran-cities";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function CityField({ id, value, onChange, className }: Props) {
  const listId = useId();
  const box = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = open ? (query.trim() ? searchCities(query, 50) : iranCities) : [];

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function choose(city: IranCity) {
    onChange(city.label);
    setQuery(city.label);
    setOpen(false);
  }

  function commitQuery() {
    const city = canonicalCity(query);
    if (city) {
      onChange(city);
      setQuery(city);
      setOpen(false);
      return true;
    }
    return false;
  }

  return (
    <div ref={box} className="relative">
      <input
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        autoComplete="off"
        value={query}
        placeholder="نام شهر را بنویسید"
        className={className}
        onFocus={() => {
          setOpen(true);
          setActive(0);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          setActive(0);
          if (!next.trim()) onChange("");
          else if (canonicalCity(next)) onChange(canonicalCity(next) || "");
          else if (value) onChange("");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActive((index) => Math.min(index + 1, Math.max(matches.length - 1, 0)));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((index) => Math.max(index - 1, 0));
          } else if (event.key === "Enter" && open) {
            event.preventDefault();
            if (matches[active]) choose(matches[active]);
            else commitQuery();
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        onBlur={() => {
          window.setTimeout(() => {
            if (!commitQuery() && query.trim() && !canonicalCity(query)) setQuery(value);
            setOpen(false);
          }, 120);
        }}
        required
      />
      {open && (
        <ul id={listId} role="listbox" className="keep-contrast absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-[#c9a227]/40 bg-[#141210] p-1 text-white shadow-2xl">
          {matches.length === 0 && <li className="px-3 py-2 text-sm text-white/55">شهری با این نام در فهرست ایران نیست.</li>}
          {matches.map((city, index) => (
            <li key={`${city.label}-${city.county}`} role="option" aria-selected={city.label === value}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(city)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-right text-sm ${
                  index === active || city.label === value ? "bg-[#0e7c7b] text-white" : "text-white/85 hover:bg-white/10"
                }`}
              >
                <span className="font-bold">{city.name}</span>
                <span className="shrink-0 text-xs text-[#e8c766]">{city.province}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
