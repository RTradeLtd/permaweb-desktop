import React, { useState, useCallback } from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'

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
      <h2>Editor</h2>
      <Editor value={editorState} onChange={handleEditorChange} />
    </div>
  )
}

export default SlateEditor
