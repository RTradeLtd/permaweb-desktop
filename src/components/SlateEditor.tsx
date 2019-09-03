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

const SlateEditor = () => {
  const [editorState, setEditorState] = useState(initialValue)
  const handleEditorChange = useCallback(
    ({ value }) => {
      return setEditorState(value)
    },
    [setEditorState]
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
