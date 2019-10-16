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

const exampleShortPost: Post = {
  postHash: '999',
  groupHash: '88887777766666',
  author: 'Shokunin',
  block: '123',
  content: stringToSlateContent('Hello World!'),
  lastModified: '2019-01-01T10:00:00Z',
  comments: [],
  reactions: [],
  shares: []
}

export const publicGroup = () => (
  <MemoryRouter>
    <Group
      posts={[exampleShortPost]}
      onPostClicked={addPostAction}
      onPostDelete={deletePostAction}
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
    <PostCard onPostDelete={deletePostAction} post={exampleShortPost} />
  </MemoryRouter>
)
