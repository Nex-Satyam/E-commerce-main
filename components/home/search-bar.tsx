
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { CtaButton } from "@/components/home/cta-button";

const searchSchema = z.object({
  query: z.string().trim().min(2, "Type at least 2 characters.").max(80, "Search is too long."),
});

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = searchSchema.safeParse({ query });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Enter a search term.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    router.push(`/search?q=${encodeURIComponent(result.data.query)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="searchbar-wrapper" style={{ position: "relative" }}>
      <form className="searchbar" role="search" onSubmit={handleSubmit} autoComplete="off">
        <Search className="searchbar-icon size-4" aria-hidden="true" />
        <Input
          ref={inputRef}
          type="search"
          aria-label="Search clothing"
          placeholder="Search shirts, dresses, coats..."
          className="searchbar-input"
          value={query}
          aria-invalid={Boolean(error)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
            setShowSuggestions(true);
          }}
          onFocus={() => query && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <CtaButton type="submit" size="sm" className="searchbar-button">
          Search
        </CtaButton>
      </form>
      {error && <small className="form-error searchbar-error">{error}</small>}
      {showSuggestions && (
        <ul className="search-suggestions" style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          zIndex: 10,
          border: "1px solid #eee",
          borderRadius: "0 0 8px 8px",
          maxHeight: 240,
          overflowY: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
        
        </ul>
      )}
    </div>
  );
}
