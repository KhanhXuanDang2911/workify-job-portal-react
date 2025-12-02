import RichTextEditor from "@/components/RichTextEditor";
import { useResume } from "@/context/ResumeContext/useResume";
function ObjectiveSection() {
  const { resume, setResume } = useResume();

  const handleChange = (value: string) => {
    setResume((prev) => ({
      ...prev,
      objective: {
        description: value,
      },
    }));
  };

  return (
    <div>
      <RichTextEditor
        value={resume.objective?.description ?? ""}
        onChange={handleChange}
      />
    </div>
  );
}

export default ObjectiveSection;
