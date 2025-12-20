import RichTextEditor from "@/components/RichTextEditor";
import { useResume } from "@/context/Resume/useResume";
function InterestsSection() {
  const { resume, setResume } = useResume();

  const handleChange = (value: string) => {
    setResume((prev) => ({
      ...prev,
      interests: {
        isHidden: prev.interests?.isHidden ?? false,
        description: value,
      },
    }));
  };
  return (
    <div>
      <RichTextEditor
        value={resume.interests?.description ?? ""}
        onChange={handleChange}
      />
    </div>
  );
}

export default InterestsSection;
