import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import shokuninAvatarImage from './images/shokunin.png'
import Sidebar from '../src/sidebar'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Sidebar', module)
  .add('multiple categories', () => (
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
      onCreateGroup={action('Clicked create group')} />))