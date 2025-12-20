import RichTextEditor from "@/components/RichTextEditor";
import { useResume } from "@/context/Resume/useResume";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

function ObjectiveSection() {
  const { resume, setResume, validationErrors, setValidationErrors } =
    useResume();
  const { t } = useTranslation();

  const handleChange = (value: string) => {
    setResume((prev) => ({
      ...prev,
      objective: {
        description: value,
      },
    }));

    if (validationErrors.objective) {
      setValidationErrors((prev) => ({ ...prev, objective: false }));
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <label className="text-sm font-medium">
          {t("resumeBuilder.forms.objective.objective")}
        </label>
        <span className="text-red-500">*</span>
      </div>
      <div
        className={cn(
          "rounded",
          validationErrors.objective && "ring-1 ring-red-500"
        )}
      >
        <RichTextEditor
          value={resume.objective?.description ?? ""}
          onChange={handleChange}
        />
      </div>
      {validationErrors.objective && (
        <span className="text-red-500 text-xs">
          {t("resumeBuilder.validation.required")}
        </span>
      )}
    </div>
  );
}

export default ObjectiveSection;
