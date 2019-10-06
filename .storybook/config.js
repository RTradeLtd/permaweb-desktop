import React from 'react'
import { configure, addDecorator } from '@storybook/react'

const StorybookFrame = storyFn => {
  return (
    <div>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css"
        rel="stylesheet"
        type="text/css"
      />
      {storyFn()}
    </div>
  )
}

addDecorator(StorybookFrame)

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.(js|tsx)$/), module)
