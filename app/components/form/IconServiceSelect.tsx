"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandInput } from "../ui/command";
import { Command as Cmdk } from "cmdk";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  Shield,
  Globe,
  BarChart3,
  AppWindow,
  Zap,
  Star,
  Check,
  ChevronsUpDown,
} from "lucide-react";

type Item = { value: string; label: string; icon?: string };

function iconFor(key?: string) {
  switch ((key || "").toLowerCase()) {
    case "shield":
      return <Shield className="size-4" />;
    case "globe":
      return <Globe className="size-4" />;
    case "chart":
      return <BarChart3 className="size-4" />;
    case "app":
      return <AppWindow className="size-4" />;
    case "ai":
      return <Zap className="size-4" />;
    case "design":
      return <Star className="size-4" />;
    default:
      return <Star className="size-4" />;
  }
}

export function IconServiceSelect({
  name,
  label,
  placeholder = "Search services…",
  fetchUrl,
  options,
  multi = true,
  value,
  onChange,
  ariaInvalid,
  disabled,
}: {
  name?: string;
  label?: string;
  placeholder?: string;
  fetchUrl?: string;
  options?: Item[];
  multi?: boolean;
  value: string[] | string | undefined;
  onChange: (v: string[] | string) => void;
  ariaInvalid?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item[]>(options || []);

  useEffect(() => {
    if (!fetchUrl) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(fetchUrl, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        const list: Item[] =
          json?.items?.map((x: any) => ({
            value: x.value || x.slug || x.id,
            label: x.label || x.name || x.title,
            icon: x.icon,
          })) || [];
        if (!cancelled) setItems(list);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchUrl]);

  const selected = useMemo<string[]>(() => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  }, [value]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q));
  }, [items, query]);

  const toggle = (v: string) => {
    if (multi) {
      const next = selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v];
      onChange(next);
    } else {
      onChange(v);
      setOpen(false);
    }
  };

  const displayLabel = () => {
    if (multi) return selected.length ? `${selected.length} selected` : "Select services";
    const found = items.find((i) => i.value === selected[0]);
    return found ? found.label : "Select service";
  };

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700" id={`${name}-label`}>
          {label}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={`${name}-listbox`}
            aria-labelledby={label ? `${name}-label` : undefined}
            aria-invalid={ariaInvalid ? "true" : "false"}
            disabled={disabled}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              {multi && selected.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selected.slice(0, 3).map((s) => {
                    const it = items.find((i) => i.value === s);
                    return (
                      <Badge key={s} variant="secondary" className="flex items-center gap-1">
                        {iconFor(it?.icon)}
                        {it?.label || s}
                      </Badge>
                    );
                  })}
                  {selected.length > 3 && <Badge variant="secondary">+{selected.length - 3}</Badge>}
                </div>
              ) : (
                displayLabel()
              )}
            </span>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-80" align="start">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={query}
              onValueChange={setQuery}
              aria-label={placeholder}
            />
            <div role="listbox" id={`${name}-listbox`} aria-multiselectable={multi || undefined}>
              {loading && (
                <div className="p-3 text-sm text-gray-500">Loading…</div>
              )}
              {error && !loading && (
                <div className="p-3 text-sm text-red-600">{error}</div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="p-3 text-sm text-gray-500">No results</div>
              )}
              {!loading && !error && filtered.length > 0 && (
                <Cmdk.List>
                  <Cmdk.Group>
                    {filtered.map((it) => {
                      const active = selected.includes(it.value);
                      return (
                        <Cmdk.Item
                          key={it.value}
                          value={it.value}
                          onSelect={() => toggle(it.value)}
                          role="option"
                          aria-selected={active}
                          className="flex items-center gap-2 px-2 py-2 cursor-pointer aria-selected:bg-accent rounded-sm"
                        >
                          <Checkbox checked={active} className="pointer-events-none" />
                          {iconFor(it.icon)}
                          <span className="text-sm">{it.label}</span>
                          {active && <Check className="ml-auto size-4" />}
                        </Cmdk.Item>
                      );
                    })}
                  </Cmdk.Group>
                </Cmdk.List>
              )}
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default IconServiceSelect;
