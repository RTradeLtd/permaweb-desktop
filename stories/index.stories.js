import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import { Button, Welcome } from '@storybook/react/demo';
import shokuninAvatarImage from './images/shokunin.png'
import Sidebar from '../src/sidebar'
import FolderListing from '../src/folderListing'
import FileEntry from '../src/fileEntry'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Sidebar', module)
  .add('multiple categories', () => (
    <ThemeProvider theme={theme}>
      <Sidebar
        avatarImage={shokuninAvatarImage}
        categories={[
          { type: 'NOTES', label: 'Notes' },
          { type: 'NOTES', label: 'Textile' },
          { type: 'NOTES', label: 'Articles' },
          { type: 'NOTES', label: 'To-dos' },
          { type: 'TRASH', label: 'Trash' },
        ]}
        onOpenGroup={action('Clicked open category')}
        onCreateGroup={action('Clicked create group')} />
    </ThemeProvider>
  ))

const exampleFiles = [

]

storiesOf('FolderListing', module)
  .add('small list of files', () => (
    <ThemeProvider theme={theme}>
      <FolderListing>
        <FileEntry
          title="A beginner's roadmap to Becoming a full stack developer"
          latestEventDescription="Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" />
        <FileEntry
          title="How our team uses Textile"
          latestEventDescription="Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" />
        <FileEntry
          title="Notes from the meeting 6/6"
          latestEventDescription="Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" />
        <FileEntry
          title="How to make products for the DWeb (draft)"
          latestEventDescription="Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" />
      </FolderListing>
    </ThemeProvider>
  ))