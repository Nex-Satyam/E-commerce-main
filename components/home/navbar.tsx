import { navItems } from "@/components/home/home-data";

export function Navbar() {
  return (
    <nav className="main-nav" aria-label="Primary">
      {navItems.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}