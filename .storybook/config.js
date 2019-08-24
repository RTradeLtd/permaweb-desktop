import { configure } from '@storybook/react'
import { addParameters } from '@storybook/react'

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

addParameters({
  backgrounds: [
    { name: 'dark', value: 'rgb(66, 66, 66)', default: true },
  ],
});

configure(loadStories, module);
