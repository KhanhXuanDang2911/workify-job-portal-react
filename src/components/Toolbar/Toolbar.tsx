import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResume } from "@/context/ResumeContext/useResume";
import {
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowDownToLine,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type ToolbarProps = {
  onDownload: () => void;
  onResetSize: () => void;
};

export default function Toolbar({ onDownload, onResetSize }: ToolbarProps) {
  const { resumeName, resume } = useResume();
  const [openDialogConfirmDownload, setOpenDialogConfirmDownload] =
    useState(false);

  const handleClickedDownloadButton = () => {
    if (!resumeName) {
      toast("Vui lòng đặt tên cho CV trước khi tải về!", {
        position: "top-right",
      });
      return;
    }
    setOpenDialogConfirmDownload(true);
  };

  const handleClickedSaveButton = () => {
    if (
      resume.basicInfo.fullName.trim() === "" ||
      resume.basicInfo.email.trim() === "" ||
      resume.basicInfo.phone.trim() === "" ||
      resume.basicInfo.position.trim() === "" ||
      resume.basicInfo.location.trim() === ""
    ) {
      toast("Vui lòng điền đầy đủ thông tin cơ bản trước khi lưu!", {
        position: "top-right",
      });
      return;
    }

    if (!resumeName) {
      toast("Vui lòng đặt tên cho CV trước khi lưu", {
        position: "top-right",
      });
      return;
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-full px-4 py-2 flex items-center gap-2 border border-neutral-200 select-none z-100">
      {/* Undo */}
      <button className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer">
        <Undo />
        <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
          Undo
        </div>
      </button>

      {/* Redo */}
      <button className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer">
        <Redo />
        <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
          Redo
        </div>
      </button>

      {/* Zoom In */}
      <button className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer">
        <ZoomIn />
        <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
          Zoom In
        </div>
      </button>

      {/* Zoom Out */}
      <button className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer">
        <ZoomOut />
        <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
          Zoom Out
        </div>
      </button>

      {/* Reset Size */}
      <button
        className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer"
        onClick={onResetSize}
      >
        <RotateCcw />
        <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
          Reset Size
        </div>
      </button>

      {/* Download PDF */}
      <>
        <button
          className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer"
          onClick={handleClickedDownloadButton}
        >
          <ArrowDownToLine />
          <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
            Download PDF
          </div>
        </button>

        <Dialog
          open={openDialogConfirmDownload}
          onOpenChange={setOpenDialogConfirmDownload}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Download</DialogTitle>
              <DialogDescription>
                Are you sure you want to download the PDF with file name{" "}
                <span className="text-orange-500">{resumeName}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpenDialogConfirmDownload(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onDownload();
                  setOpenDialogConfirmDownload(false);
                }}
                className="bg-cyan-950 hover:bg-cyan-700"
              >
                Yes, Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>

      {/* Save */}
      <button
        className="p-2 hover:bg-neutral-100 rounded-xl transition flex items-center justify-center relative group cursor-pointer"
        onClick={handleClickedSaveButton}
      >
        <Save />
        <div className="absolute -top-11 opacity-0 translate-x-[-10px] group-hover:opacity-100 pointer-events-none group-hover:translate-x-0 transition-all duration-200 ease-out bg-gray-900 text-white text-sm text-center py-1 px-3 rounded-sm whitespace-nowrap shadow-lg">
          Save
        </div>
      </button>
    </div>
  );
}
