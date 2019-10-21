import React from 'react'
import { Group } from '../src/screens/Group'
import { MemoryRouter } from 'react-router-dom'
import NewPostEntryControl from '../src/components/NewPostEntryControl'
import { action } from '@storybook/addon-actions'
import { Post } from '../src/domain'
import PostCard from '../src/components/PostCard'

export default {
  title: 'Group'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addPostAction = async (editorState: any) => {
  action('Add Post Clicked')(editorState)
  return true
}

const deletePostAction = (block: string) => {
  action('Delete Post Clicked')(block)
}

const stringToSlateContent = (text: string) => {
  return {
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              text: text
            }
          ]
        }
      ]
    }
  }
}

const examplePost: Post = {
  postHash: '999',
  groupHash: '88887777766666',
  author: 'Shokunin',
  block: '123',
  content: stringToSlateContent('Hello World!'),
  lastModified: '2019-01-01T10:00:00Z',
  comments: [
    {
      commentHash: '5567',
      author: 'Akshay',
      content: 'Hello',
      lastModified: '2019-01-02T13:22:00Z'
    },
    {
      commentHash: '6567',
      author: 'kanej',
      content: 'More words',
      lastModified: '2019-01-03T22:12:00Z'
    }
  ],
  reactions: [
    {
      symbol: '👍',
      count: 3
    },
    {
      symbol: '😀',
      count: 2
    }
  ],
  shares: []
}

const StandardFrame: React.FC = ({ children }) => {
  return (
    <div
      style={{
        background: '#e9ebee',
        padding: '2rem'
      }}
    >
      {children}
    </div>
  )
}

export const publicGroup = () => (
  <MemoryRouter>
    <Group
      posts={[examplePost]}
      onPostClicked={addPostAction}
      onPostDelete={deletePostAction}
      onAddComment={(() => {}) as any}
    />
  </MemoryRouter>
)

publicGroup.story = {
  name: 'Public Group'
}

export const newPostEnryControl = () => (
  <NewPostEntryControl onPostClicked={addPostAction} />
)

newPostEnryControl.story = {
  name: 'New Post Entry Control'
}

export const shortPost = () => (
  <MemoryRouter>
    <StandardFrame>
      <PostCard
        onPostDelete={deletePostAction}
        post={examplePost}
        onAddComment={(() => {}) as any}
      />
    </StandardFrame>
  </MemoryRouter>
)
