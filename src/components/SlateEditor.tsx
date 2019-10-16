import React, {
  MutableRefObject,
  forwardRef,
  Ref,
  useRef,
  useImperativeHandle
} from 'react'
import { isKeyHotkey } from 'is-hotkey'
import { Editor, RenderBlockProps, RenderMarkProps } from 'slate-react'
import {
  Value,
  Editor as InternalEditor,
  Mark,
  MarkProperties,
  MarkJSON
} from 'slate'

export const defaultEditorValue = Value.fromJSON({
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
})

export interface SlateEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  placeholder?: string
  ref?: MutableRefObject<Editor | null>
  readOnly?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (editorState: any) => void
}

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

var renderBlock = (
  props: RenderBlockProps,
  _editor: InternalEditor,
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

const renderMark = (
  props: RenderMarkProps,
  _editor: InternalEditor,
  next: () => JSX.Element
) => {
  const { children, mark, attributes } = props

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'code':
      return <code {...attributes}>{children}</code>
    case 'italic':
      return <em {...attributes}>{children}</em>
    case 'underline':
      return <u {...attributes}>{children}</u>
    default:
      return next()
  }
}

const onKeyDown = (
  // eslint-disable-next-line
  event: any,
  editor: InternalEditor,
  next: () => JSX.Element
) => {
  let mark

  if (isBoldHotkey(event)) {
    mark = 'bold'
  } else if (isItalicHotkey(event)) {
    mark = 'italic'
  } else if (isUnderlinedHotkey(event)) {
    mark = 'underlined'
  } else if (isCodeHotkey(event)) {
    mark = 'code'
  } else {
    return next()
  }

  event.preventDefault()
  editor.toggleMark(mark)
  return next()
}

const SlateEditor = (
  { value, placeholder, readOnly, onChange }: SlateEditorProps,
  ref: Ref<Editor>
) => {
  const editorRef = useRef<Editor>(null)

  useImperativeHandle(ref, () => ({
    // @ts-ignore
    insertText: (text: string) => {
      if (!editorRef.current) {
        throw new Error('Editor not set')
      }

      editorRef.current.insertText(text)

      return editorRef.current
    },
    // @ts-ignore
    toggleMark: (mark: string | Mark | MarkProperties | MarkJSON) => {
      if (!editorRef.current) {
        throw new Error('Editor not set')
      }

      editorRef.current.toggleMark(mark)

      return editorRef.current
    },
    // @ts-ignore
    focus: () => {
      if (!editorRef.current) {
        throw new Error('Editor not set')
      }

      editorRef.current.focus()

      return editorRef.current
    }
  }))

  return (
    <Editor
      autoFocus
      className={'slate-editor'}
      ref={editorRef}
      readOnly={readOnly}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      renderBlock={renderBlock}
      renderMark={renderMark}
    />
  )
}

export default forwardRef(SlateEditor)
