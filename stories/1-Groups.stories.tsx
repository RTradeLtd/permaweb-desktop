import React from 'react'
import { Group } from '../src/screens/Group'
import { MemoryRouter } from 'react-router-dom'

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
