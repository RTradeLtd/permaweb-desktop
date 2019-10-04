import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

const newPostEntryControlPlaceholderText =
  'Share a thought, or write your next novel'

export default function NewPostEntryControl() {
  const [text, setText] = useState('')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value)
    },
    [setText]
  )

  const handlePublish = useCallback(() => {
    setText('')
  }, [setText])

  return (
    <NewPostPanel>
      <TextArea
        autoFocus={true}
        rows={3}
        placeholder={newPostEntryControlPlaceholderText}
        onChange={handleChange}
        value={text}
      />
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

const TextArea = styled.textarea`
  resize: vertical;
  width: 100%;
  margin-bottom: 0.25rem;
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
