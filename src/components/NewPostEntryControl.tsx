import React, { useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import SlateEditor, { defaultEditorValue } from './SlateEditor'
import 'emoji-mart/css/emoji-mart.css'
import { Picker, BaseEmoji } from 'emoji-mart'
import { Editor } from 'slate-react'

const newPostEntryControlPlaceholderText =
  'Share a thought, or write your next novel'

const ToolbarButton = ({
  className,
  icon,
  onClick
}: {
  className?: string
  icon: string
  onClick?: () => void
}) => {
  const handleOnClick = onClick || (() => alert('Coming Soon'))

  return (
    <button className={className} onClick={handleOnClick}>
      <i className={`fas fa-${icon}`}></i>
    </button>
  )
}

export default function NewPostEntryControl() {
  const editorRef = useRef<Editor | null>(null)
  const [editorState, setEditorState] = useState(defaultEditorValue)
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)

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

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible)
  }

  const addEmojiToEditor = async (emoji: BaseEmoji) => {
    if (!editorRef || !editorRef.current || !emoji) {
      return
    }

    await editorRef.current.insertText(emoji.native)

    setEmojiPickerVisible(!emojiPickerVisible)
  }

  return (
    <NewPostPanel>
      <Toolbar>
        <ToolbarEditorBtn icon="bold" />
        <ToolbarEditorBtn icon="italic" />
        <ToolbarEditorBtn icon="underline" />
        <ToolbarEditorBtn icon="code" />
        <ToolbarEditorBtn icon="quote-right" />
        <ToolbarEditorBtn icon="list-ul" />
        <ToolbarEditorBtn icon="list-ol" />
        <ToolbarEditorBtn icon="link" />
        <ToolbarEditorBtn icon="check-square" />
      </Toolbar>
      <ComposerPanel>
        <SlateEditor
          ref={editorRef}
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
          <ActionButton onClick={toggleEmojiPicker}>
            <i className="fas fa-laugh"></i>Emoji
          </ActionButton>
          <ActionButton>
            <i className="fas fa-user-friends"></i>Tag someone
          </ActionButton>
          <ActionButton>
            <i className="fas fa-file-image"></i>GIF
          </ActionButton>
          {emojiPickerVisible ? (
            <Picker
              style={{ position: 'absolute', left: '460px' }}
              onSelect={addEmojiToEditor}
            />
          ) : null}
        </div>
        <PublishButton onClick={handlePublish}>Post</PublishButton>
      </PublishButtonRow>
    </NewPostPanel>
  )
}

const offblack = '#191919'
const buttonGray = 'darkgray'
const lightblue = 'lightblue'
const slightlyDarkerBlue = '#94aeb7'
const publishButtonBlue = '#395ca9'

const NewPostPanel = styled.div`
  padding: 0.5rem;
  width: 100%;
  border-radius: 5px;
  background: white;
  margin-bottom: 20px;
`

const Toolbar = styled.div`
  padding: 0.25rem;
`

const ToolbarEditorBtn = styled(ToolbarButton)`
  margin-right: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${buttonGray};
  &:hover {
    color: ${lightblue};
  }
  &:active {
    color: ${slightlyDarkerBlue};
  }
  &:focus {
    outline: none;
  }
`

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

const ActionButton = styled.button`
  height: 25px;
  border: none;
  background: inherit;
  cursor: pointer;
  color: ${buttonGray};
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
  &:focus {
    outline: none;
  }
`

const PublishButton = styled.button`
  background: ${publishButtonBlue};
  border-radius: 5px;
  border: none;
  color: white;
  width: 80px;
  height: 25px;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`
