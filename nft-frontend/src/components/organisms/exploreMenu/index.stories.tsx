import React from 'react';
import { storiesOf } from '@storybook/react';
import { ExploreMenu } from './index';
import { Button } from 'components/atoms/button';
import { DropdownItem, DropdownMenu } from 'components/molecules/dropdownMenu';
import { TabButton } from 'components/molecules/tabButton';
import { TabList } from 'components/molecules/tabList';
import { Dropdown } from 'components/molecules/dropdown';
import { CheckInput } from 'components/atoms/checkInput';

storiesOf('Components|organisms/ExploreMenu', module).add('normal', () => (
  <ExploreMenu
    category={
      <TabList>
        <TabButton active>All</TabButton>
        <TabButton>Art</TabButton>
        <TabButton>Photography</TabButton>
        <TabButton>Game</TabButton>
        <TabButton>Metaverses</TabButton>
        <TabButton>Music</TabButton>
        <Dropdown position="right" trigger={<TabButton>&gt;</TabButton>}>
          <DropdownMenu>
            <DropdownItem>
              <CheckInput type="radio" name="type">
                Domain
              </CheckInput>
            </DropdownItem>
            <DropdownItem>
              <CheckInput type="radio" name="type">
                DeFi
              </CheckInput>
            </DropdownItem>
            <DropdownItem>
              <CheckInput type="radio" name="type">
                Memes
              </CheckInput>
            </DropdownItem>
            <DropdownItem>
              <CheckInput type="radio" name="type">
                Punks
              </CheckInput>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </TabList>
    }
    filterAndSort={
      <Dropdown trigger={<Button modifiers={['secondary']}>Filter & Sort</Button>}>
        <DropdownMenu groupName="Sort by">
          <DropdownItem>
            <CheckInput type="radio" name="type">
              Recently added
            </CheckInput>
          </DropdownItem>
          <DropdownItem>
            <CheckInput type="radio" name="type">
              Cheapest
            </CheckInput>
          </DropdownItem>
          <DropdownItem>
            <CheckInput type="radio" name="type">
              Highest price
            </CheckInput>
          </DropdownItem>
          <DropdownItem>
            <CheckInput type="radio" name="type">
              Most liked
            </CheckInput>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    }
  />
));
