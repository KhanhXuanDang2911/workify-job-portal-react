import TabNavigationAction from "@/components/CV/TabNavigationAction";
import TabNavigationTool from "@/components/CV/TabNavigationTool/TabNavigationTool";
import { CVProvider } from "@/context";
import {
  BookOpenText,
  Plus,
  Eye,
  FileText,
  GalleryHorizontalEnd,
  LayoutGrid,
  Palette,
  PenTool,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "design_and_font", label: "Thiết kế & Font", icon: Palette },
  { id: "add_block", label: "Thêm mục", icon: Plus },
  { id: "change_layout", label: "Bố cục", icon: LayoutGrid },
  { id: "change_template", label: "Đổi mẫu CV", icon: GalleryHorizontalEnd },
  { id: "suggest", label: "Gợi ý viết CV", icon: PenTool },
  { id: "cv_sample", label: "Thư viện CV", icon: BookOpenText },
];

function CVBuilder() {
  const [activeTab, setActiveTab] = useState("design_and_font");
  return (
    <CVProvider>
      <div
        className="flex flex-col h-screen"
        style={{
          background:
            "linear-gradient(90deg,#FCD1C0 0%,#BBDFD5 43%,#88D5D6 100%)",
        }}
      >
        {/*Header */}
        <div className="px-10 py-1.5 flex items-center justify-between bg-white text-sm">
          {/*Header Title*/}
          <div className="flex flex-row items-center gap-3">
            <FileText />
            <input
              type="text"
              className="bg-white text-xl font-semibold h-[46px] pl-4 rounded-lg w-[200px] outline-0 focus-visible:border focus-visible:border-green-600"
              placeholder="CV chưa đặt tên"
            />
          </div>
          {/*Header Tool*/}
          <div className=" flex flex-row items-center justify-between gap-3 font-semibold">
            {/* Undo Redo */}
            <div className="space-x-3">
              <button className="cursor-pointer">
                <Undo2 />
              </button>
              <button className="cursor-pointer">
                <Redo2 />
              </button>
            </div>
            <div className="">
              <button className="px-3 py-1.5 rounded-3xl bg-green-100 flex items-center cursor-pointer gap-2">
                <Eye />
                <span>Xem trước</span>
              </button>
            </div>
            <div className="">
              <button className="px-3 py-1.5 rounded-3xl bg-green-400 flex items-center cursor-pointer text-white gap-2">
                <Save />
                <span>Lưu CV</span>
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="mt-5 px-4 flex flex-row">
          <div className="flex flex-row gap-4">
            <TabNavigationTool
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />
            {activeTab && (
              <TabNavigationAction
                activeTab={activeTab}
                onClose={() => setActiveTab("")}
              />
            )}
          </div>
        </div>
      </div>
    </CVProvider>
  );
}

export default CVBuilder;
