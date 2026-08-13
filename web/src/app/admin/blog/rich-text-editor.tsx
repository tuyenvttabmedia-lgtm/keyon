"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { cleanPastedHtml } from "@/lib/clean-pasted-html";

type Props = {
  value: string;
  onChange: (html: string) => void;
  /** Media library purpose tag */
  mediaPurpose?: "blog" | "cms" | "product" | "brand" | "general";
  placeholder?: string;
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
      className={`rounded-md px-2 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
        active
          ? "bg-accent text-white shadow-sm"
          : "text-navy hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 self-center bg-border" />;
}

async function uploadMediaFile(
  file: File,
  purpose: string,
): Promise<{ url: string; alt?: string } | null> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("purpose", purpose);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok || !data?.url) return null;
    return { url: data.url as string, alt: data.altText as string | undefined };
  } catch {
    return null;
  }
}

export function RichTextEditor({
  value,
  onChange,
  mediaPurpose = "blog",
  placeholder = "Bắt đầu viết… Dán từ Word/Google Docs sẽ được làm sạch định dạng.",
}: Props) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);
  const [pasteHint, setPasteHint] = useState<string | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const purposeRef = useRef(mediaPurpose);
  purposeRef.current = mediaPurpose;
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const showPasteHint = useCallback((msg: string) => {
    queueMicrotask(() => {
      setPasteHint(msg);
      window.setTimeout(() => setPasteHint(null), 3500);
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: "keyon-yt" },
      }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "keyon-editor-prose focus:outline-none",
      },
      transformPastedHTML(html) {
        showPasteHint("Đã làm sạch định dạng từ clipboard (Word / Docs).");
        return cleanPastedHtml(html);
      },
      handleDrop: (_view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const file = files[0];
        if (!file?.type.startsWith("image/")) return false;
        event.preventDefault();
        void uploadMediaFile(file, purposeRef.current).then((picked) => {
          const ed = editorRef.current;
          if (!picked || !ed) return;
          ed.chain()
            .focus()
            .setImage({ src: picked.url, alt: picked.alt })
            .run();
        });
        return true;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;
            event.preventDefault();
            void uploadMediaFile(file, purposeRef.current).then((picked) => {
              const ed = editorRef.current;
              if (!picked || !ed) return;
              ed.chain()
                .focus()
                .setImage({ src: picked.url, alt: picked.alt })
                .run();
              showPasteHint("Đã upload ảnh từ clipboard vào Media.");
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current(ed.getHTML());
    },
  });

  editorRef.current = editor;

  useEffect(() => {
    if (!editor || htmlMode) return;
    const current = editor.getHTML();
    if (value !== current && !editor.isFocused) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [value, editor, htmlMode]);

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL liên kết", prev ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  function insertYoutube() {
    if (!editor) return;
    const url = window.prompt("URL YouTube", "https://www.youtube.com/watch?v=");
    if (!url?.trim()) return;
    editor.commands.setYoutubeVideo({ src: url.trim() });
  }

  if (!editor && !htmlMode) {
    return (
      <div className="min-h-[420px] rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted">
        Đang tải editor…
      </div>
    );
  }

  return (
    <div className="keyon-editor-shell w-full min-w-0 max-w-none overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="sticky top-0 z-10 flex w-full flex-wrap items-center gap-0.5 border-b border-border bg-[#f8fafc] px-2 py-1.5">
        {!htmlMode && editor ? (
          <>
            <ToolbarBtn
              title="Đoạn văn"
              active={editor.isActive("paragraph")}
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </ToolbarBtn>
            <ToolbarBtn
              title="Tiêu đề H2"
              active={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </ToolbarBtn>
            <ToolbarBtn
              title="Tiêu đề H3"
              active={editor.isActive("heading", { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              H3
            </ToolbarBtn>
            <ToolbarBtn
              title="Tiêu đề H4"
              active={editor.isActive("heading", { level: 4 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
            >
              H4
            </ToolbarBtn>
            <Divider />
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
            <ToolbarBtn
              title="Gạch ngang"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              S
            </ToolbarBtn>
            <Divider />
            <ToolbarBtn
              title="Căn trái"
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              Trái
            </ToolbarBtn>
            <ToolbarBtn
              title="Căn giữa"
              active={editor.isActive({ textAlign: "center" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              Giữa
            </ToolbarBtn>
            <ToolbarBtn
              title="Căn phải"
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              Phải
            </ToolbarBtn>
            <ToolbarBtn
              title="Căn đều"
              active={editor.isActive({ textAlign: "justify" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
            >
              Đều
            </ToolbarBtn>
            <Divider />
            <ToolbarBtn
              title="Danh sách"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              •
            </ToolbarBtn>
            <ToolbarBtn
              title="Danh sách số"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1.
            </ToolbarBtn>
            <ToolbarBtn
              title="Trích dẫn"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              “
            </ToolbarBtn>
            <ToolbarBtn
              title="Khối mã"
              active={editor.isActive("codeBlock")}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              {"<>"}
            </ToolbarBtn>
            <ToolbarBtn
              title="Đường kẻ ngang"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              —
            </ToolbarBtn>
            <Divider />
            <ToolbarBtn
              title="Liên kết"
              active={editor.isActive("link")}
              onClick={setLink}
            >
              🔗
            </ToolbarBtn>
            <ToolbarBtn title="Chèn ảnh" onClick={() => setMediaOpen(true)}>
              🖼
            </ToolbarBtn>
            <ToolbarBtn title="YouTube" onClick={insertYoutube}>
              ▶
            </ToolbarBtn>
            <ToolbarBtn
              title="Bảng 3×3"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              ⊞
            </ToolbarBtn>
            <Divider />
            <ToolbarBtn
              title="Hoàn tác"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              ↶
            </ToolbarBtn>
            <ToolbarBtn
              title="Làm lại"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              ↷
            </ToolbarBtn>
            <ToolbarBtn
              title="Xóa định dạng"
              onClick={() =>
                editor.chain().focus().unsetAllMarks().clearNodes().run()
              }
            >
              Clear
            </ToolbarBtn>
          </>
        ) : (
          <span className="px-2 text-xs font-medium text-muted">
            Chế độ HTML nguồn
          </span>
        )}
        <ToolbarBtn
          title="Bật/tắt chế độ HTML"
          active={htmlMode}
          onClick={() => {
            if (htmlMode && editor) {
              editor.commands.setContent(value || "<p></p>", {
                emitUpdate: false,
              });
            }
            setHtmlMode((v) => !v);
          }}
        >
          {"</>"}
        </ToolbarBtn>
      </div>

      {pasteHint ? (
        <p className="border-b border-accent/20 bg-accent-soft px-3 py-1.5 text-xs text-accent">
          {pasteHint}
        </p>
      ) : null}

      {htmlMode ? (
        <div className="grid gap-3 p-3 lg:grid-cols-2">
          <textarea
            className="min-h-[420px] w-full rounded-lg border border-border bg-white p-3 font-mono text-[12px] leading-relaxed outline-none focus:border-accent"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
          />
          <div className="min-h-[420px] overflow-auto rounded-lg border border-dashed border-border bg-surface p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Xem trước
            </p>
            <div
              className="keyon-editor-prose"
              dangerouslySetInnerHTML={{ __html: value || "<p></p>" }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full min-w-0 bg-white">
          <EditorContent editor={editor} className="w-full min-w-0" />
        </div>
      )}

      <MediaPicker
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        multiple={false}
        purpose={mediaPurpose}
        title="Chèn ảnh vào nội dung"
        onSelect={(items) => {
          const item = items[0];
          if (!item?.url || !editor) return;
          const preset = item.altText?.trim() || "";
          const alt = window.prompt("Alt text (tuỳ chọn)", preset) ?? preset;
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
