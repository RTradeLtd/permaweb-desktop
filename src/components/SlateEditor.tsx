import React, { useState, useCallback } from 'react'
import { Editor, RenderBlockProps } from 'slate-react'
import { Value, Editor as EditorParam } from 'slate'
import './SlateEditor.css'

export const defaultEditorValue = {
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
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue: any
  isReadOnly: boolean
}

const SlateEditor = ({
  onChange,
  initialValue,
  isReadOnly
}: SlateEditorProps) => {
  const [editorState, setEditorState] = useState(
    Value.fromJSON(initialValue || defaultEditorValue)
  )
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
        readOnly={isReadOnly}
        value={editorState}
        placeholder={'Create your article here...'}
        onChange={handleEditorChange}
        renderBlock={renderBlock}
      />
    </div>
  )
}

export default SlateEditor
