import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import Layout from 'components/templates/layout';
import { Section } from 'components/organisms/section';
import { RouteComponentProps } from '@reach/router';
import { Heading } from 'components/molecules/heading';

import { ItemList } from 'components/organisms/itemList';
import { SearchTabType, SearchTabs } from 'components/pages/search/constant';
import { Text } from 'components/atoms/text';
import { searchTickets, searchEvents, getEventsByCategory, getTicketsByCategory } from 'services/api';
import { TabButton } from 'components/molecules/tabButton';
import { TabList } from 'components/molecules/tabList';

export const View: React.FC<RouteComponentProps> = props => {
  const name = new URLSearchParams(props.location?.search).get('name');
  const category = new URLSearchParams(props.location?.search).get('category');

  const isLoading = false;
  const [selectedTab, setSelectedTab] = useState<SearchTabType>('Events');
  const error = false;
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (category) {
        try {
          const eventsRs = await getEventsByCategory(category);
          const ticketsRs = await getTicketsByCategory(category);
          setEvents(eventsRs?.data);
          setTickets(ticketsRs?.data);
        } catch (error) {
          console.log(error);
        }
      }
      if (name) {
        try {
          const ticketsRs = await searchTickets(name);
          const eventsRs = await searchEvents(name);
          setTickets(ticketsRs?.data);
          setEvents(eventsRs?.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [category, name]);
  return (
    <div className="p-search">
      <Layout title="Search">
        <Section className="p-search_main">
          <Heading type="h1">
            Search results for <span>{name}</span>
          </Heading>
          <div className="p-search_tabs">
            <TabList>
              {SearchTabs.map((tab: any) => (
                <TabButton key={tab} active={tab === selectedTab} handleClick={() => setSelectedTab(tab)}>
                  {tab}
                </TabButton>
              ))}
            </TabList>
          </div>
          <div className="p-search_products">
            {error ? (
              <Text modifiers={['center', 'error']}>{error}</Text>
            ) : selectedTab === 'Events' ? (
              <ItemList
                next={() => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                }}
                next_cursor=""
                isLoading={isLoading}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                searchBy={name!}
                list={events}
                type="event"
              />
            ) : (
              <ItemList next={() => {}} next_cursor="" isLoading={false} list={tickets} type="ticket" />
            )}
          </div>
        </Section>
      </Layout>
    </div>
  );
};
export default hot(View);
