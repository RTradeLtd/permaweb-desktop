import React, { useState, useCallback } from 'react'
import { Editor, RenderBlockProps } from 'slate-react'
import { Value, Editor as EditorParam } from 'slate'
import './SlateEditor.css'

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'Create your article here...'
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
  onChange: (editorState: any) => void
}

const SlateEditor = ({ onChange }: SlateEditorProps) => {
  const [editorState, setEditorState] = useState(initialValue)
  const handleEditorChange = useCallback(
    ({ value }) => {
      setEditorState(value)
      onChange(value)
    },
    [setEditorState, onChange]
  )

  return (
    <div>
      <Editor
        value={editorState}
        onChange={handleEditorChange}
        renderBlock={renderBlock}
      />
    </div>
  )
}

export default SlateEditor
