import React from 'react';
import { storiesOf } from '@storybook/react';
import { TabList } from './index';
import { TabButton } from 'components/molecules/tabButton';

storiesOf('Components|molecules/TabList', module).add('normal', () => (
  <TabList>
    <TabButton active>All</TabButton>
    <TabButton>Art</TabButton>
    <TabButton>Phôtgraphy</TabButton>
    <TabButton>Game</TabButton>
    <TabButton>Metaverses</TabButton>
    <TabButton>Music</TabButton>
    <TabButton>&gt;</TabButton>
  </TabList>
));
