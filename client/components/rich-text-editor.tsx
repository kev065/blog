"use client"

import { useEffect, useRef } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  height?: number
}

export function RichTextEditor({ value, onChange, height = 400 }: RichTextEditorProps) {
  const editorRef = useRef<any>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      initialized.current = true

      // Dynamically import TinyMCE
      import("tinymce/tinymce").then(() => {
        import("tinymce/themes/silver")
        import("tinymce/plugins/advlist")
        import("tinymce/plugins/autolink")
        import("tinymce/plugins/lists")
        import("tinymce/plugins/link")
        import("tinymce/plugins/image")
        import("tinymce/plugins/charmap")
        import("tinymce/plugins/preview")
        import("tinymce/plugins/anchor")
        import("tinymce/plugins/searchreplace")
        import("tinymce/plugins/visualblocks")
        import("tinymce/plugins/code")
        import("tinymce/plugins/fullscreen")
        import("tinymce/plugins/insertdatetime")
        import("tinymce/plugins/media")
        import("tinymce/plugins/table")
        import("tinymce/plugins/help")
        import("tinymce/plugins/wordcount")

        const { tinymce } = window as any

        tinymce.init({
          target: editorRef.current,
          height,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }",
          setup: (editor: any) => {
            editor.on("init", () => {
              editor.setContent(value)
            })
            editor.on("change keyup", () => {
              onChange(editor.getContent())
            })
          },
        })
      })
    }

    return () => {
      if (typeof window !== "undefined" && (window as any).tinymce) {
        ;(window as any).tinymce.remove(editorRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).tinymce && editorRef.current) {
      const editor = (window as any).tinymce.get(editorRef.current.id)
      if (editor && editor.getContent() !== value) {
        editor.setContent(value)
      }
    }
  }, [value])

  return <textarea ref={editorRef} />
}
