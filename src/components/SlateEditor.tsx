import React from 'react'
import { Editor, RenderBlockProps } from 'slate-react'
import { Value, Editor as EditorParam } from 'slate'

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
  _editor: EditorParam,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (editorState: any) => void
}

const SlateEditor = ({ value, placeholder, onChange }: SlateEditorProps) => {
  console.log(value)
  return (
    <Editor
      className={'slate-editor'}
      readOnly={false}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      renderBlock={renderBlock}
    />
  )
}

export default SlateEditor
