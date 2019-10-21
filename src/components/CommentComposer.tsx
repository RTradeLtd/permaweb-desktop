import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

interface CommentComposerProps {
  author: string
  postHash: string
  onAddComment: (postHash: string, comment: string) => Promise<boolean>
}

const CommentComposer: React.FC<CommentComposerProps> = ({
  author,
  postHash,
  onAddComment
}: CommentComposerProps) => {
  const [text, setText] = useState<string>('')

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value)
    },
    [setText]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()

        const result = onAddComment(postHash, text)

        if (!result) {
          return
        }

        setText('')
      }
    },
    [onAddComment, postHash, text]
  )

  return (
    <TextArea
      placeholder={`Reply to ${author}`}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  )
}

const TextArea = styled.textarea`
  width: 100%;
  resize: vertical;
`

export default CommentComposer
