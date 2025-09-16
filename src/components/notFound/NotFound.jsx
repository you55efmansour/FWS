import React from "react";
import { useTranslation } from "react-i18next";   // ✅ add i18n

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("notFound.title")}</h2>
      <p>{t("notFound.message")}</p>
    </div>
  );
}
