import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResume } from "@/context/Resume/useResume";
import { ArrowDownToLine, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type ToolbarProps = {
  onDownload: () => Promise<void>;
  isDownloading?: boolean;
};
import { useTranslation } from "@/hooks/useTranslation";

export default function Toolbar({
  onDownload,
  isDownloading = false,
}: ToolbarProps) {
  const { t } = useTranslation();
  const {
    resumeName,
    setResumeName,
    saveResume,
    isSaving,
    resumeId,
    validateResume,
  } = useResume();
  const [openDialogConfirmDownload, setOpenDialogConfirmDownload] =
    useState(false);
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const [tempResumeName, setTempResumeName] = useState(resumeName);
  const isEditMode = !!resumeId;

  const handleClickedDownloadButton = () => {
    if (!resumeName) {
      toast(t("resumeBuilder.toolbar.toast.downloadNameRequired"), {
        position: "top-right",
      });
      return;
    }
    setOpenDialogConfirmDownload(true);
  };

  const handleClickedSaveButton = async () => {
    if (!validateResume()) {
      return;
    }

    if (isEditMode) {
      await saveResume();
      return;
    }

    setTempResumeName(resumeName);
    setOpenDialogSave(true);
  };

  const handleSaveResumeName = async () => {
    if (!tempResumeName.trim()) {
      toast(t("resumeBuilder.toolbar.toast.nameRequired"), {
        position: "top-right",
      });
      return;
    }
    setResumeName(tempResumeName);
    setOpenDialogSave(false);
    await saveResume();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-full px-4 py-2 flex items-center gap-2 border border-neutral-200 select-none z-100">
      {/* Download PDF */}
      <>
        <button
          className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleClickedDownloadButton}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ArrowDownToLine />
          )}
          <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
            {isDownloading
              ? t("resumeBuilder.toolbar.downloading")
              : t("resumeBuilder.toolbar.downloadPdf")}
          </div>
        </button>

        <Dialog
          open={openDialogConfirmDownload}
          onOpenChange={setOpenDialogConfirmDownload}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                {t("resumeBuilder.toolbar.confirmDownload.title")}
              </DialogTitle>
              <DialogDescription>
                {t("resumeBuilder.toolbar.confirmDownload.description")}{" "}
                <span className="text-orange-500">{resumeName}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpenDialogConfirmDownload(false)}
                disabled={isDownloading}
              >
                {t("resumeBuilder.toolbar.confirmDownload.cancel")}
              </Button>
              <Button
                onClick={async () => {
                  await onDownload();
                  setOpenDialogConfirmDownload(false);
                }}
                className="bg-cyan-950 hover:bg-cyan-700"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("resumeBuilder.toolbar.downloading")}
                  </>
                ) : (
                  t("resumeBuilder.toolbar.confirmDownload.confirm")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>

      {/* Save */}
      <button
        className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleClickedSaveButton}
        disabled={isSaving}
      >
        <Save />
        <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
          {t("resumeBuilder.toolbar.save")}
        </div>
      </button>

      <Dialog open={openDialogSave} onOpenChange={setOpenDialogSave}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {t("resumeBuilder.toolbar.saveDialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("resumeBuilder.toolbar.saveDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input
              type="text"
              value={tempResumeName}
              onChange={(e) => setTempResumeName(e.target.value)}
              placeholder={t("resumeBuilder.toolbar.saveDialog.placeholder")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveResumeName();
                }
              }}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialogSave(false)}>
              {t("resumeBuilder.toolbar.saveDialog.cancel")}
            </Button>
            <Button
              onClick={handleSaveResumeName}
              className="bg-cyan-950 hover:bg-cyan-700"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : t("resumeBuilder.toolbar.saveDialog.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
