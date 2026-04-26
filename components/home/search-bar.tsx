
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CtaButton } from "@/components/home/cta-button";
import { products } from "@/components/home/home-data";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredProducts =
    query.length > 0
      ? products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    router.push(`/search?q=${encodeURIComponent(name)}`);
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
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => query && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <CtaButton type="submit" size="sm" className="searchbar-button">
          Search
        </CtaButton>
      </form>
      {showSuggestions && filteredProducts.length > 0 && (
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
          {filteredProducts.slice(0, 6).map((p) => (
            <li
              key={p.slug}
              style={{ padding: "8px 16px", cursor: "pointer" }}
              onMouseDown={() => handleSuggestionClick(p.name)}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}