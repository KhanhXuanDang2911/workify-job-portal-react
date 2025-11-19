import { useResume } from "@/context/ResumeContext/useResume";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
function InterestsSection() {
  const { resume, setResume } = useResume();

  const handleChange = (value: string) => {
    setResume((prev) => ({
      ...prev,
      interests: value,
    }));
  };
  return (
    <div>
      <ReactQuill
        theme="snow"
        value={resume.interests ?? ""}
        onChange={handleChange}
        className="[&_.ql-editor]:min-h-[200px] [&_.ql-editor]:max-h-[200px] [&_.ql-editor]:overflow-y-auto"
      />
    </div>
  );
}

export default InterestsSection;
