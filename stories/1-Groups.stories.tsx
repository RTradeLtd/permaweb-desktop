import React from 'react'
import { Group } from '../src/screens/Group'
import { MemoryRouter } from 'react-router-dom'
import NewPostEntryControl from '../src/components/NewPostEntryControl'

const Frame = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div>
      <link
        href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
        type="text/css"
      />
      {children}
    </div>
  )
}

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

export const newPostEnryControl = () => (
  <Frame>
    <NewPostEntryControl />
  </Frame>
)

newPostEnryControl.story = {
  name: 'New Post Entry Control'
}
