import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { Layout } from 'components/templates/layout';
import { Section } from 'components/organisms/section';
import { TabList } from 'components/molecules/tabList';
import { TabButton } from 'components/molecules/tabButton';
import { ItemList } from 'components/organisms/itemList';
import { CollectionTabType, CollectionTabs } from 'components/pages/profile/constant';
import { getEventByAddress, getTicketsByAddress } from 'services/api';
import avatar from 'assets/images/avatar.png';

export const Profile: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<CollectionTabType>('Events');
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [address, setAddress] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      setAddress(localStorage.getItem('ADDRESS') || '');
      const myEvents = await getEventByAddress(localStorage.getItem('ADDRESS') || '');
      const myTickets = await getTicketsByAddress(localStorage.getItem('ADDRESS') || '');
      if (myEvents && myTickets) {
        setEvents(myEvents.data);
        setTickets(myTickets.data);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="p-profile">
      <Layout title="My Profile">
        <Section className="p-profile_main">
          <div className="profile-center">
            <img className="p-profile_avatar" height="100px" src={avatar}></img>
          </div>
          <div className="profile-center p-profile_address">{address}</div>
          <div className="p-search_tabs">
            <TabList>
              {CollectionTabs.map(tab => (
                <TabButton key={tab} active={tab === selectedTab} handleClick={() => setSelectedTab(tab)}>
                  {tab}
                </TabButton>
              ))}
            </TabList>
          </div>
          <div className="p-search_products">
            {selectedTab === 'Events' ? (
              <ItemList
                next={() => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                }}
                isLoading={false}
                list={events}
                type="event"
              />
            ) : (
              <ItemList next={() => {}} isLoading={false} list={tickets} type="ticket" />
            )}
          </div>
        </Section>
      </Layout>
    </div>
  );
};

export default hot(Profile);
