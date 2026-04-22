import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { CtaButton } from "@/components/home/cta-button";

export function SearchBar() {
  return (
    <form className="searchbar" role="search">
      <Search className="searchbar-icon size-4" aria-hidden="true" />
      <Input
        type="search"
        aria-label="Search clothing"
        placeholder="Search shirts, dresses, coats..."
        className="searchbar-input"
      />
      <CtaButton type="submit" size="sm" className="searchbar-button">
        Search
      </CtaButton>
    </form>
  );
}