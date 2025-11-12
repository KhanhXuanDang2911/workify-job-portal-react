import BaseModal from "@/components/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload, Lightbulb } from "lucide-react";

import React from "react";

interface UploadNewCVModalProps {
  trigger: React.ReactNode;
  cvName: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setCvName: (name: string) => void;
  handleUploadCV: (onClose: () => void) => void;
  selectedFile: File | null;
  handleFileSelect: (file: File | null) => void;
}

function UploadNewCVModal({
  trigger,
  handleUploadCV,
  cvName,
  setCvName,
  fileInputRef,
  selectedFile,
  handleFileSelect,
}: UploadNewCVModalProps) {
  return (
    <BaseModal
      title="Add Cv/Resume"
      trigger={trigger}
      footer={(onClose) => (
        <>
          <Button
            variant="outline"
            onClick={() => {
              setCvName("");
              handleFileSelect(null);
              onClose();
            }}
            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1967d2] hover:bg-[#1557b0]"
            onClick={() => handleUploadCV(onClose)}
          >
            Add Cv/Resume
          </Button>
        </>
      )}
      className="!max-w-[500px]"
    >
      <div className="space-y-4 py-4">
        <div>
          <Label
            htmlFor="cv-name"
            className="text-sm font-medium text-gray-700"
          >
            Cv/Resume Name
          </Label>
          <div className="flex gap-2 items-center my-2">
            <Lightbulb className="text-green-400" />
            <p className="text-xs text-gray-500">
              Việc đặt tên cho CV sẽ khiến việc quản lý CV trở nên dễ dàng hơn.
            </p>
          </div>
          <Input
            id="cv-name"
            value={cvName}
            onChange={(e) => setCvName(e.target.value)}
            placeholder="Nhập tên CV/Resume"
            className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Upload your Cv/Resume
          </Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#1967d2] hover:bg-[#e3eefc] group transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <CloudUpload className="w-10 h-10 group-hover:text-[#1967d2]" />
              <p className="text-sm text-gray-600 font-medium">
                {selectedFile ? selectedFile.name : "Browse file or drop here"}
              </p>
              <p className="text-xs text-gray-400">
                Only PDF format available. Max file size 12 MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) =>
              handleFileSelect(
                e.target.files && e.target.files[0] ? e.target.files[0] : null
              )
            }
            className="hidden"
          />
        </div>
      </div>
    </BaseModal>
  );
}

export default UploadNewCVModal;
