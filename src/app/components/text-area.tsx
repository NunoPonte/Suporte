"use client";

import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";

import styles from "./text-area.module.css";

interface TextAreaProps {
  value?: string;
  setOutput?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function TextArea({
  value = "",
  setOutput,
  className,
  onKeyDown,
}: TextAreaProps) {
  const lastValue = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {},
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: styles.textArea,
      },
      handleDOMEvents: {
        paste: (view, event) => {
          const clipboardData = (event as ClipboardEvent).clipboardData;
          if (clipboardData) {
            const items = clipboardData.items;
            let handled = false;
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.indexOf("image") !== -1) {
                const file = item.getAsFile();
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = reader.result;
                    editor
                      ?.chain()
                      .focus()
                      .setImage({ src: base64 as string })
                      .run();
                  };
                  reader.readAsDataURL(file);
                  handled = true;
                }
              }
            }
            if (handled) {
              event.preventDefault();
              event.stopPropagation();
              return true;
            }
          }
          return false;
        },
      },
    },
  });

  // Only update content if value prop changes from outside
  useEffect(() => {
    if (editor && value !== lastValue.current) {
      editor.commands.setContent(value);
      lastValue.current = value;
    }
  }, [value, editor]);

  // Update parent on editor change
  useEffect(() => {
    if (setOutput && editor) {
      editor.on("update", () => {
        const html = editor.getHTML();
        lastValue.current = html;
        setOutput(html);
      });
    }
  }, [setOutput, editor]);

  return (
    <EditorContent
      editor={editor}
      className={className}
      onKeyDown={onKeyDown}
      tabIndex={0}
    />
  );
}
