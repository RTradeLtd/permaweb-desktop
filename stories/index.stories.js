import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import { Welcome } from '@storybook/react/demo';
import shokuninAvatarImage from './images/shokunin.png'
import Sidebar from '../src/components/Sidebar'
import FolderListing from '../src/components/FolderListing'
import FileEntry from '../src/components/FileEntry'
import Screen from '../src/screen'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const exampleCategories = [
  { type: 'NOTES', label: 'Notes' },
  { type: 'NOTES', label: 'Textile' },
  { type: 'NOTES', label: 'Articles' },
  { type: 'NOTES', label: 'To-dos' },
  { type: 'TRASH', label: 'Trash' },
]

const exampleFiles = [
  { id: '1', title: "A beginner's roadmap to Becoming a full stack developer", latestEventDescription: "Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" },
  { id: '2', title: "How our team uses Textile", latestEventDescription: "Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" },
  { id: '3', title: "Notes from the meeting 6/6", latestEventDescription: "Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" },
  { id: '4', title: "How to make products for the DWeb (draft)", latestEventDescription: "Ashkay: I recommend this tutorial! Cheeck out this link https://example.com" },
]

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Navigation', module)
  .add('inside category', () => (
    <div style={{ background: 'red', width: '100%', height: '100%' }}>
      <ThemeProvider theme={theme}>
        <Screen
          avatarImage={shokuninAvatarImage}
          categories={exampleCategories}
          folderListing={exampleFiles}
          onOpenGroup={action('Clicked open category')}
          onCreateGroup={action('Clicked create group')}
          onFileOpen={action('Clicked file open')}
          onAddFile={action('Add new file clicked')} />
      </ThemeProvider>
    </div>
  ))

storiesOf('Components/Sidebar', module)
  .add('multiple categories', () => (
    <ThemeProvider theme={theme}>
      <Sidebar
        avatarImage={shokuninAvatarImage}
        categories={exampleCategories}
        onOpenGroup={action('Clicked open category')}
        onCreateGroup={action('Clicked create group')} />
    </ThemeProvider>
  ))

storiesOf('Components/FolderListing', module)
  .add('small list of files', () => (
    <ThemeProvider theme={theme}>
      <FolderListing>
        {exampleFiles.map(file => (
          <FileEntry
            {...file}
            onClick={action('Clicked entry')}
            onCopyLink={action('Clicked Copy Link')}
            onShowHistory={action('Clicked Show History')}
            onDelete={action('Clicked Delete')}
          />
        ))}
      </FolderListing>
    </ThemeProvider>
  ))
