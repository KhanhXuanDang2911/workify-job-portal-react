import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import EmployerSidebar from "../EmployerSideBar";

interface MenuSheetProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

function MenuSheet({ isMobileSidebarOpen, setIsMobileSidebarOpen }: MenuSheetProps) {
  return (
    <>
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <div className="p-4">
          <SheetTrigger asChild>
            <Button variant="outline" className=" fixed top-4 left-4 z-50 flex items-center gap-2 border-[#e2e7f5] bg-white">
              <Menu size={16} />
              <span>Menu</span>
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="w-64 bg-[#e9ebfd] p-0">
          {/* <EmployerSidebar /> */}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MenuSheet;
