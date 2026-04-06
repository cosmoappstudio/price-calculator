"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const linkCls = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <h1 className="text-lg font-bold text-foreground">Finansal Hesaplayıcı</h1>
        <div className="flex gap-2">
          <Link href="/" className={linkCls(pathname === "/")}>
            Ana Hesaplayıcı
          </Link>
          <Link href="/price-finder" className={linkCls(pathname === "/price-finder")}>
            Fiyat Belirle
          </Link>
        </div>
      </div>
    </nav>
  );
}
