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
  flex-direction: column;
`

const PublishButton = styled.button`
  align-self: flex-end;
  background: #395ca9;
  border-radius: 5px;
  border: none;
  color: white;
  width: 80px;
  height: 25px;
`
