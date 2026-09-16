"use client";

import { type Editor } from "@tiptap/react";
import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  LinkIcon,
  TextHOneIcon,
  TextHTwoIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  CodeIcon,
  QuotesIcon,
  EraserIcon,
  SmileyIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-accent text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  function setLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const [emojiOpen, setEmojiOpen] = useState(false);

  const COMMON_EMOJI = [
    "😀",
    "😂",
    "😍",
    "👍",
    "👎",
    "🎉",
    "🔥",
    "💡",
    "✅",
    "❌",
    "⚠️",
    "❤️",
    "🚀",
    "👀",
    "🙌",
    "💯",
  ];

  return (
    <div className="flex items-center gap-1 border-b border-border pb-2">
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <TextHOneIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <TextHTwoIcon size={16} />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <TextBIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <TextItalicIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <TextUnderlineIcon size={16} />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletsIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListNumbersIcon size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <TextAlignLeftIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <TextAlignCenterIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <TextAlignRightIcon size={16} />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      <div className="relative">
        <ToolbarButton
          label="Insert emoji"
          active={emojiOpen}
          onClick={() => setEmojiOpen((prev) => !prev)}
        >
          <SmileyIcon size={16} />
        </ToolbarButton>
        {emojiOpen && (
          <div className="absolute left-0 top-full z-10 mt-1 grid w-48 grid-cols-8 gap-1 rounded-lg border border-border bg-popover p-2 shadow-md">
            {COMMON_EMOJI.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="rounded p-1 text-lg hover:bg-accent"
                onClick={() => {
                  editor.chain().focus().insertContent(emoji).run();
                  setEmojiOpen(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuotesIcon size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Clear formatting"
        active={false}
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <EraserIcon size={16} />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <LinkIcon size={16} />
      </ToolbarButton>
    </div>
  );
}
