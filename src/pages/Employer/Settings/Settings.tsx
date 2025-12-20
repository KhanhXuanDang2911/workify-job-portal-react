import LoginSecurityTab from "@/pages/Employer/Settings/components/LoginSecurityTab";
import { useTranslation } from "@/hooks/useTranslation";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function Settings() {
  const { t } = useTranslation();
  return (
    <div className="bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      <PageTitle title={t("pageTitles.settings")} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 bg-white px-6 py-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-[#1967d2] mb-2">
            {t("employer.settings.title")}
          </h1>
          <p className="text-gray-600">{t("employer.settings.description")}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <LoginSecurityTab />
        </div>
      </div>
    </div>
  );
}
