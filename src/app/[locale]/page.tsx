import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      <span className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
        EN · RU · MN
      </span>
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {t("hero.title")}
      </h1>
      <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
        {t("hero.subtitle")}
      </p>
      <div className="mt-10">
        <Link
          href="/detector"
          className={cn(buttonVariants({ size: "lg" }), "gap-2 px-5")}
        >
          {t("cta")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
