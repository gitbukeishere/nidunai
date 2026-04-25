import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

export function Nav() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Nidun AI
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/detector"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            {t("detector")}
          </Link>
          <Link
            href="/pricing"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            {t("login")}
          </Link>
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
