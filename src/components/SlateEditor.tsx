import React, {
  MutableRefObject,
  forwardRef,
  Ref,
  useRef,
  useImperativeHandle
} from 'react'
import { Editor, RenderBlockProps, RenderMarkProps } from 'slate-react'
import {
  Value,
  Editor as InternalEditor,
  Mark,
  MarkProperties,
  MarkJSON
} from 'slate'

export const defaultEditorValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: ''
          }
        ]
      }
    ]
  }
})

export interface SlateEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  placeholder?: string
  ref?: MutableRefObject<Editor | null>
  readOnly?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (editorState: any) => void
}

var renderBlock = (
  props: RenderBlockProps,
  _editor: InternalEditor,
  next: () => JSX.Element
): JSX.Element => {
  switch (props.node.type) {
    case 'paragraph':
      return (
        <div className="editor-paragraph" {...props.attributes}>
          {props.children}
        </div>
      )
    default:
      return next()
  }
}

const renderMark = (
  props: RenderMarkProps,
  _editor: InternalEditor,
  next: () => JSX.Element
) => {
  const { children, mark, attributes } = props

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'code':
      return <code {...attributes}>{children}</code>
    case 'italic':
      return <em {...attributes}>{children}</em>
    case 'underline':
      return <u {...attributes}>{children}</u>
    default:
      return next()
  }
}

const SlateEditor = (
  { value, placeholder, readOnly, onChange }: SlateEditorProps,
  ref: Ref<Editor>
) => {
  const editorRef = useRef<Editor>(null)

  useImperativeHandle(ref, () => ({
    // @ts-ignore
    insertText: (text: string) => {
      if (!editorRef.current) {
        throw new Error('Editor not set')
      }

      editorRef.current.insertText(text)

      return editorRef.current
    },
    // @ts-ignore
    toggleMark: (mark: string | Mark | MarkProperties | MarkJSON) => {
      if (!editorRef.current) {
        throw new Error('Editor not set')
      }

      editorRef.current.toggleMark(mark)

      return editorRef.current
    }
  }))

  return (
    <Editor
      className={'slate-editor'}
      ref={editorRef}
      readOnly={readOnly}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      renderBlock={renderBlock}
      renderMark={renderMark}
    />
  )
}

export default forwardRef(SlateEditor)
