import React, {
  MutableRefObject,
  forwardRef,
  Ref,
  useRef,
  useImperativeHandle
} from 'react'
import { Editor, RenderBlockProps } from 'slate-react'
import { Value, Editor as InternalEditor } from 'slate'

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

const renderBlock = (
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

export interface SlateEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  placeholder?: string
  ref?: MutableRefObject<Editor | null>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (editorState: any) => void
}

const SlateEditor = (
  { value, placeholder, onChange }: SlateEditorProps,
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
    }
  }))

  return (
    <Editor
      className={'slate-editor'}
      ref={editorRef}
      readOnly={false}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      renderBlock={renderBlock}
    />
  )
}

export default forwardRef(SlateEditor)
