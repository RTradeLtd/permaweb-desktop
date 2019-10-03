import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

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
        placeholder={
          'Tell the world what it needs to hear (unless its about Dune, nobody cares about Dune)...'
        }
        onChange={handleChange}
        value={text}
      />
      <PublishButtonRow>
        <PublishButton onClick={handlePublish}>Publish</PublishButton>
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
  height: 1.5rem;
`

const PublishButton = styled.button`
  float: right;
  height: 1.5rem;
`