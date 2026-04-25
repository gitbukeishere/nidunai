import { getTranslations, setRequestLocale } from "next-intl/server";
import { DetectorForm } from "@/components/detector/detector-form";
import type { Locale } from "@/i18n/routing";

export default async function DetectorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          {t("hero.subtitle")}
        </p>
      </div>
      <DetectorForm locale={locale as Locale} />
    </div>
  );
}
