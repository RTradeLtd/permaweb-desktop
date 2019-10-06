import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import SlateEditor, { defaultEditorValue } from './SlateEditor'

const newPostEntryControlPlaceholderText =
  'Share a thought, or write your next novel'

export default function NewPostEntryControl() {
  const [editorState, setEditorState] = useState(defaultEditorValue)

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ value }: { value: any }) => {
      setEditorState(value)
    },
    [setEditorState]
  )

  const handlePublish = useCallback(() => {
    setEditorState(defaultEditorValue)
  }, [setEditorState])

  return (
    <NewPostPanel>
      <ComposerPanel>
        <SlateEditor
          onChange={handleChange}
          placeholder={newPostEntryControlPlaceholderText}
          value={editorState}
        />
      </ComposerPanel>
      <PublishButtonRow>
        <div>
          <ActionButton>
            <i className="fas fa-image"></i>Photo or Video
          </ActionButton>
          <ActionButton>
            <i className="fas fa-laugh"></i>Emoji
          </ActionButton>
          <ActionButton>
            <i className="fas fa-user-friends"></i>Tag someone
          </ActionButton>
          <ActionButton>
            <i className="fas fa-file-image"></i>GIF
          </ActionButton>
        </div>
        <PublishButton onClick={handlePublish}>Post</PublishButton>
      </PublishButtonRow>
    </NewPostPanel>
  )
}

const NewPostPanel = styled.div`
  padding: 0.5rem;
  width: 100%;
  border-radius: 5px;
  background: white;
  margin-bottom: 20px;
`

const offblack = '#191919'

const ComposerPanel = styled.div`
  border: 1px lightgray solid;
  min-height: 4rem;
  margin-bottom: 5px;
  padding: 5px;
  .slate-editor {
    color: ${offblack};
    font-size: 18px;
  }
`

const PublishButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const lightblue = 'lightblue'
const slightlyDarkerBlue = '#94aeb7'

const ActionButton = styled.button`
  height: 25px;
  border: none;
  background: inherit;
  cursor: pointer;
  color: darkgray;
  line-height: 1rem;
  vertical-align: text-top;
  i {
    margin-right: 5px;
    vertical-align: top;
    font-size: 1rem;
  }
  &:hover {
    color: ${lightblue};
  }
  &:active {
    color: ${slightlyDarkerBlue};
  }
`

const PublishButton = styled.button`
  background: #395ca9;
  border-radius: 5px;
  border: none;
  color: white;
  width: 80px;
  height: 25px;
  cursor: pointer;
`
