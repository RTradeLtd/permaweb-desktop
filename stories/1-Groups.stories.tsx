import React from 'react'
import { Group } from '../src/screens/Group'
import { MemoryRouter } from 'react-router-dom'
import NewPostEntryControl from '../src/components/NewPostEntryControl'

export default {
  title: 'Groups'
}

export const publicGroup = () => (
  <MemoryRouter>
    <Group groupId={'1'} />
  </MemoryRouter>
)

publicGroup.story = {
  name: 'Public Group'
}

export const newPostEnryControl = () => <NewPostEntryControl />

newPostEnryControl.story = {
  name: 'New Post Entry Control'
}
