import React from 'react'
import { Group } from '../src/screens/Group'
import { MemoryRouter } from 'react-router-dom'
import NewPostEntryControl from '../src/components/NewPostEntryControl'
import { action } from '@storybook/addon-actions'
import { Post } from '../src/domain'

export default {
  title: 'Groups'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addPostAction = async (editorState: any) => {
  action('Add Post Clicked')(editorState)
  return true
}

const deletePostAction = (block: string) => {
  action('Delete Post Clicked')(block)
}

const examplePosts: Post[] = [
  {
    postHash: '999',
    groupHash: '88887777766666',
    author: 'Shokunin',
    block: '123',
    content: 'Hello World!',
    lastModified: '',
    comments: [],
    reactions: [],
    shares: []
  }
]

export const publicGroup = () => (
  <MemoryRouter>
    <Group
      posts={examplePosts}
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
