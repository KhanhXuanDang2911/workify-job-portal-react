import { useState, useRef, useEffect } from "react";
import {
  CircleSlash2,
  Copy,
  Edit,
  Edit2,
  GripVertical,
  HatGlasses,
  Plus,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import type { EducationItem } from "@/types/resume.type";
import { useResume } from "@/context/ResumeContext/useResume";

interface EducationItemType extends EducationItem {
  visible: boolean;
}

export default function EducationSection() {
  const { resume, setResume } = useResume();
  const [items, setItems] = useState<EducationItemType[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (
      !isInitialized.current &&
      resume.education &&
      resume.education.length > 0
    ) {
      isInitialized.current = true;
      const updatedItems = resume.education.map((item) => ({
        ...item,
        visible: true,
      }));
      setItems(updatedItems);
    }
  }, [resume.education]);

  const saveToContext = (updatedItems: EducationItemType[]) => {
    setResume({
      ...resume,
      education: updatedItems
        .filter((i) => i.visible)
        .map(({ visible, ...rest }) => rest),
    });
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);

  const onDragStart = (index: number) => (dragItemIndex.current = index);
  const onDragEnter = (index: number) => {
    const dragging = dragItemIndex.current;
    if (dragging === null || dragging === index) return;
    const newItems = [...items];
    const draggedItem = newItems.splice(dragging, 1)[0];
    newItems.splice(index, 0, draggedItem);
    dragItemIndex.current = index;

    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setItems(updatedItems);
    saveToContext(updatedItems);
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };
  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const saveItem = (data: Omit<EducationItemType, "order">) => {
    const updatedItems = [...items];
    if (editingIndex !== null) {
      updatedItems[editingIndex] = { ...updatedItems[editingIndex], ...data };
    } else {
      updatedItems.push({ ...data, order: items.length + 1, visible: true });
    }
    setItems(updatedItems);
    saveToContext(updatedItems);
    setModalOpen(false);
  };

  const removeItem = (index: number) => {
    const updatedItems = items
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, order: idx + 1 }));
    setItems(updatedItems);
    saveToContext(updatedItems);
  };

  const copyItem = (index: number) => {
    const item = items[index];
    const newItem = { ...item, order: items.length + 1 };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveToContext(updatedItems);
  };

  const toggleVisible = (order: number) => {
    const updatedItems = items.map((item) =>
      item.order === order ? { ...item, visible: !item.visible } : item
    );
    setItems(updatedItems);
    saveToContext(updatedItems);
  };

  return (
    <div className="max-w-xl mx-auto space-y-3">
      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <ExperienceItem
            key={item.order}
            item={item}
            onEdit={() => openEditModal(idx)}
            onCopy={() => copyItem(idx)}
            onRemove={() => removeItem(idx)}
            onToggleVisible={() => toggleVisible(item.order)}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragEnter={() => onDragEnter(idx)}
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full border-dashed border-gray-400 py-6 hover:bg-gray-200 hover:border-gray-600 cursor-pointer"
        onClick={openAddModal}
      >
        <Plus /> Add a new item
      </Button>

      <EducationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveItem}
        defaultValues={editingIndex !== null ? items[editingIndex] : null}
      />
    </div>
  );
}

type EducationItemProps = {
  item: EducationItemType;
  onEdit: () => void;
  onCopy: () => void;
  onRemove: () => void;
  onToggleVisible: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

function ExperienceItem({
  item,
  onEdit,
  onCopy,
  onRemove,
  onToggleVisible,
  ...dragProps
}: EducationItemProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          {...dragProps}
          className={cn(
            "bg-gray-50 border relative rounded p-3 flex justify-between items-start cursor-pointer",
            !item.visible && "opacity-50 bg-gray-100"
          )}
        >
          <div className="flex gap-2 items-center">
            <GripVertical className="cursor-move text-gray-400" />
            <div>
              <p className="font-medium">{item.institution}</p>
              <p className="text-sm text-gray-500">{item.studyType}</p>
            </div>
          </div>
          {!item.visible && (
            <CircleSlash2 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-white  z-100">
        <ContextMenuItem
          onClick={onToggleVisible}
          className="cursor-pointer hover:bg-gray-200"
        >
          <HatGlasses />
          {item.visible ? "Hide" : "Show"}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onEdit}
          className="cursor-pointer hover:bg-gray-200"
        >
          <Edit />
          Edit
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onCopy}
          className="cursor-pointer hover:bg-gray-200"
        >
          <Copy />
          Copy
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onRemove}
          className="cursor-pointer hover:bg-gray-200 text-red-500"
        >
          <Trash /> Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

type EducationModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<EducationItemType, "id" | "order">) => void;
  defaultValues: EducationItemType | null;
};

function EducationModal({
  open,
  onClose,
  onSave,
  defaultValues,
}: EducationModalProps) {
  const [form, setForm] = useState<Omit<EducationItemType, "id" | "order">>({
    institution: "",
    score: "",
    studyType: "",
    dateRange: "",
    website: "",
    visible: true,
  });

  useEffect(() => {
    if (defaultValues) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { order, ...rest } = defaultValues;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(rest);
    }
  }, [defaultValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#F8F8F9]! flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex gap-1">
            {defaultValues ? (
              <>
                <Edit2 className="w-5 h-5" />
                Edit item
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create a new item
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 grid grid-cols-2 gap-2 overflow-y-auto pb-1 text-base">
          <div className="flex flex-col gap-1">
            <label htmlFor="institution">Institution</label>
            <input
              type="text"
              name="institution"
              placeholder="Institution"
              value={form.institution}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="typeOfStudy">Type Of Study</label>
            <input
              type="text"
              name="typeOfStudy"
              placeholder="Type Of Study"
              value={form.studyType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={form.dateRange}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="score">Score</label>
            <input
              type="text"
              name="score"
              placeholder="Score"
              value={form.score}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              name="website"
              placeholder="website"
              value={form.website}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={"default"}
            className="bg-sky-600"
            onClick={() => onSave(form)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
