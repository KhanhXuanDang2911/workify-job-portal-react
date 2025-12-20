import { useState, useRef, useEffect } from "react";
import {
  CircleSlash2,
  Copy,
  Edit,
  Edit2,
  GripVertical,
  HatGlasses,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/types/resume.type";
import { useResume } from "@/context/Resume/useResume";
import RichTextEditor from "@/components/RichTextEditor";

interface ProjectItemType extends ProjectItem {
  visible: boolean;
}

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { resume, setResume } = useResume();
  const [items, setItems] = useState<ProjectItemType[]>(() => {
    return (resume.projects || []).map((item) => ({
      ...item,
      visible: !item.isHidden,
    }));
  });

  const isLocalUpdate = useRef(false);

  useEffect(() => {
    if (isLocalUpdate.current) {
      isLocalUpdate.current = false;
      return;
    }

    const updatedItems = (resume.projects || []).map((item) => ({
      ...item,
      visible: !item.isHidden,
    }));
    setItems(updatedItems);
  }, [resume.projects]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const dragItemIndex = useRef<number | null>(null);

  const saveToContext = (updatedItems: ProjectItemType[]) => {
    isLocalUpdate.current = true;
    setResume({
      ...resume,
      projects: updatedItems.map(({ visible, ...rest }) => ({
        ...rest,
        isHidden: !visible,
      })),
    });
  };

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

  const saveItem = (data: Omit<ProjectItemType, "order">) => {
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
          <ProjectItem
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
        <Plus /> {t("resumeBuilder.actions.addItem")}
      </Button>

      <ProjectModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIndex(null);
        }}
        onSave={saveItem}
        defaultValues={editingIndex !== null ? items[editingIndex] : null}
      />
    </div>
  );
}

type ProjectItemProps = {
  item: ProjectItemType;
  onEdit: () => void;
  onCopy: () => void;
  onRemove: () => void;
  onToggleVisible: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

function ProjectItem({
  item,
  onEdit,
  onCopy,
  onRemove,
  onToggleVisible,
  ...dragProps
}: ProjectItemProps) {
  const { t } = useTranslation();
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
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">
                {item.startDate} - {item.endDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!item.visible && <CircleSlash2 className="text-gray-400 size-4" />}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white z-100">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisible();
                  }}
                >
                  <HatGlasses className="mr-2 h-4 w-4" />
                  {item.visible
                    ? t("resumeBuilder.actions.hide")
                    : t("resumeBuilder.actions.show")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("resumeBuilder.actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {t("resumeBuilder.actions.copy")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {t("resumeBuilder.actions.remove")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-white  z-100">
        <ContextMenuItem
          onClick={onToggleVisible}
          className="cursor-pointer hover:bg-gray-200"
        >
          <HatGlasses />
          {item.visible
            ? t("resumeBuilder.actions.hide")
            : t("resumeBuilder.actions.show")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onEdit}
          className="cursor-pointer hover:bg-gray-200"
        >
          <Edit />
          {t("resumeBuilder.actions.edit")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onCopy}
          className="cursor-pointer hover:bg-gray-200"
        >
          <Copy />
          {t("resumeBuilder.actions.copy")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onRemove}
          className="cursor-pointer hover:bg-gray-200 text-red-500"
        >
          <Trash /> {t("resumeBuilder.actions.remove")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

type ProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProjectItemType, "id" | "order">) => void;
  defaultValues: ProjectItemType | null;
};

const initialForm = {
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  isHidden: false,
  visible: true,
};

function ProjectModal({
  open,
  onClose,
  onSave,
  defaultValues,
}: ProjectModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<Omit<ProjectItemType, "order">>(initialForm);
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        const { order, ...rest } = defaultValues;
        setForm(rest);
      } else {
        setForm(initialForm);
      }
      setErrors({});
    }
  }, [open, defaultValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!form.title.trim()) {
      newErrors.title = t("resumeBuilder.validation.required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(form);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#F8F8F9]! flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex gap-1">
            {defaultValues ? (
              <>
                <Edit2 className="w-5 h-5" />
                {t("resumeBuilder.actions.editItem")}
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {t("resumeBuilder.actions.createItem")}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 grid grid-cols-2 gap-2 overflow-y-auto pb-1 text-base">
          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="title">
              {t("resumeBuilder.forms.projects.title")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder={t("resumeBuilder.forms.projects.title")}
              value={form.title}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-0 ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && (
              <span className="text-red-500 text-xs">{errors.title}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="startDate">
              {t("resumeBuilder.forms.projects.startDate")}
            </label>
            <input
              type="text"
              name="startDate"
              placeholder={t("resumeBuilder.forms.projects.startDate")}
              value={form.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="endDate">
              {t("resumeBuilder.forms.projects.endDate")}
            </label>
            <input
              type="text"
              name="endDate"
              placeholder={t("resumeBuilder.forms.projects.endDate")}
              value={form.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label>{t("resumeBuilder.forms.projects.description")}</label>
            <RichTextEditor
              value={form.description || ""}
              onChange={(value) => setForm({ ...form, description: value })}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("resumeBuilder.actions.cancel")}
          </Button>
          <Button
            variant={"default"}
            className="bg-sky-600"
            onClick={handleSave}
          >
            {t("resumeBuilder.actions.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
