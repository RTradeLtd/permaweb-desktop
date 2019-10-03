import React from 'react'

export default {
  title: 'Welcome'
}

export const toStorybook = () => (
  <div>
    <h2>Welcome to the Permaweb Storybook!</h2>
    <p>
      Collected here are the UI components that make up the Permaweb desktop app
      UI.
    </p>
  </div>
)

toStorybook.story = {
  name: 'to Storybook'
}
