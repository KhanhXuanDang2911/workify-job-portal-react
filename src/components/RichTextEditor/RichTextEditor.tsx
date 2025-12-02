import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  // Toolbar chỉ giữ các chức năng bạn cần
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"], // in đậm, in nghiêng, gạch chân
      [{ list: "bullet" }, { list: "ordered" }], // danh sách bullet & ordered
    ],
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={["bold", "italic", "underline", "list"]}
      className="[&_.ql-editor]:min-h-[200px] [&_.ql-editor]:max-h-[200px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-[14px] [&_.ql-editor]:bg-transparent"
    />
  );
}
