import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BaseModal from "@/components/BaseModal/BaseModal";
import { Pencil } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface AboutCompanyModalProps {
  currentAbout?: string;
  onSave?: (about: string) => void;
}

function AboutCompanyModal ({ currentAbout = "", onSave }: AboutCompanyModalProps)  {
  const [aboutContent, setAboutContent] = useState(currentAbout);

  const handleSave = (onClose: () => void) => {
    onSave?.(aboutContent !== "<p><br></p>" ? aboutContent : "");
    onClose();
  };

  const handleCancel = (onClose: () => void) => {
    setAboutContent(currentAbout);
    onClose();
  };

  return (
    <BaseModal
      title="About company"
      trigger={
        <Button variant="ghost" size="sm" className="border border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2]">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      }
      footer={(onClose) => (
        <>
          <Button
            variant="outline"
            onClick={() => handleCancel(onClose)}
            className="border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2] hover:border-[#1967d2] w-28 bg-transparent"
          >
            Cancel
          </Button>
          <Button className="bg-[#1967d2] w-28 hover:bg-[#1251a3]" onClick={() => handleSave(onClose)}>
            Update
          </Button>
        </>
      )}
    >
      <div className="min-w-[700px]">
        <Label htmlFor="company-profile" className="mb-2 block">
          Company profile <span className="text-red-500">*</span>
        </Label>
        <ReactQuill
          theme="snow"
          value={aboutContent}
          onChange={setAboutContent}
          className="bg-white [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:max-h-[250px] [&_.ql-editor]:overflow-y-auto"
        />
      </div>
    </BaseModal>
  );
};

export default AboutCompanyModal;
