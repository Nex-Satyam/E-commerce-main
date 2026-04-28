import Link from "next/link";

import  HeaderActions  from "@/components/home/header-actions";
import { SearchBar } from "@/components/home/search-bar";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-top">
        <div className="brand-block">
          <div className="brand-lockup">
            <Link href="/" className="brand-logo-link" aria-label="Go to home page">
              <div className="brand-logo" aria-hidden="true">
                <span>ASR</span>
              </div>
            </Link>
          </div>
        </div>

        <SearchBar />

        <HeaderActions />
      </div>
    </header>
  );
}