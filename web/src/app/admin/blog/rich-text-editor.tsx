"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

function ToolbarBtn({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs font-medium disabled:opacity-40 ${
        active
          ? "bg-accent text-white"
          : "bg-white text-navy hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: Props) {
  const [mediaOpen, setMediaOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "Bắt đầu viết nội dung..." }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[420px] px-4 py-3 focus:outline-none " +
          "prose-headings:text-navy prose-p:leading-relaxed prose-a:text-accent",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== editor.getText()) {
      // Sync external resets (e.g. after load) without fighting typing
      if (!editor.isFocused) {
        editor.commands.setContent(value || "", { emitUpdate: false });
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[420px] rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted">
        Đang tải editor…
      </div>
    );
  }

  function setLink() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL liên kết", prev ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap gap-1 border-b border-border bg-[#f8fafc] px-2 py-2">
        <ToolbarBtn
          title="Đoạn văn"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </ToolbarBtn>
        <ToolbarBtn
          title="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          title="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarBtn>
        <ToolbarBtn
          title="H4"
          active={editor.isActive("heading", { level: 4 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          H4
        </ToolbarBtn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <ToolbarBtn
          title="Đậm"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarBtn>
        <ToolbarBtn
          title="Nghiêng"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarBtn>
        <ToolbarBtn
          title="Gạch chân"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </ToolbarBtn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <ToolbarBtn
          title="Danh sách"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarBtn>
        <ToolbarBtn
          title="Danh sách số"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarBtn>
        <ToolbarBtn
          title="Trích dẫn"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarBtn>
        <ToolbarBtn
          title="Đường kẻ ngang"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          HR
        </ToolbarBtn>
        <ToolbarBtn title="Liên kết" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarBtn>
        <ToolbarBtn title="Chèn ảnh" onClick={() => setMediaOpen(true)}>
          Ảnh
        </ToolbarBtn>
        <ToolbarBtn
          title="Bảng"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          Table
        </ToolbarBtn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <ToolbarBtn
          title="Hoàn tác"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </ToolbarBtn>
        <ToolbarBtn
          title="Làm lại"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </ToolbarBtn>
        <ToolbarBtn
          title="Xóa định dạng"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          Clear
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
      <MediaPicker
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        multiple={false}
        purpose="blog"
        title="Chèn ảnh vào bài viết"
        onSelect={(items) => {
          const item = items[0];
          if (!item?.url) return;
          const preset = item.altText?.trim() || "";
          const alt =
            window.prompt("Alt text (tuỳ chọn)", preset) ?? preset;
          editor
            .chain()
            .focus()
            .setImage({ src: item.url, alt: alt.trim() || undefined })
            .run();
        }}
      />
    </div>
  );
}
