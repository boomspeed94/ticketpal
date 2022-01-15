import { RouteComponentProps } from '@reach/router';
import { Text } from 'components/atoms/text';

import { TabButton } from 'components/molecules/tabButton';
import { TabList } from 'components/molecules/tabList';
import { ItemList } from 'components/organisms/itemList';
import { Section } from 'components/organisms/section';
import { Unit } from 'components/pages/create/form';
import Slider from 'react-slick';
import { MainTabType, MainTabs } from 'components/pages/index/constant';
import { ExploreSchema, exploreSchema, SortDefaultValue } from 'components/pages/explore/form';
import { Layout } from 'components/templates/layout';
import { Form, Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { getEventForSale, getTicketForSale } from 'services/api';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const Home: React.FC<RouteComponentProps> = props => {
  const params = new URLSearchParams(props.location?.search);
  // const [showUserType, setShowUserType] = useState(false);
  // const [showDateType, setShowDateType] = useState(false);
  const [selectedTab, setSelectedTab] = useState<MainTabType>('Event Listing');
  const store = false;
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
  };

  const initialValue: ExploreSchema = useMemo(
    () => ({
      unit: Unit[0],
      productCategory: params.get('category') || 'All',
      productSort: params.get('sort') || SortDefaultValue,
      verify: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getProducts = (req: any) => {};

  useEffect(() => {
    const fetchData = async () => {
      const myEvents = await getEventForSale();
      const myTickets = await getTicketForSale();
      setEvents(myEvents?.data);
      setTickets(myTickets?.data.filter((ticket: any) => ticket.creatorAddress !== ticket.ownerAddress));
    };
    fetchData();
  }, []);

  return (
    <div className="p-explore">
      <Layout title="TicketPal">
        <>
          <Slider {...settings}>
            <div className="slider-cover">
              <img
                max-height="400px"
                width="100%"
                src="https://pbs.twimg.com/media/FJEyWSIWQAgP-3v?format=jpg&name=4096x4096"
                alt="blockchain"
              ></img>
            </div>
            <div className="slider-cover">
              <img
                max-height="400px"
                width="100%"
                src="https://wallpaperaccess.com/full/1099678.jpg"
                alt="blackpink"
              ></img>
            </div>
            <div className="slider-cover">
              <img
                max-height="400px"
                width="100%"
                src="https://e00-marca.uecdn.es/assets/multimedia/imagenes/2021/04/10/16180452817704.jpg"
                alt="br"
              ></img>
            </div>
            <div className="slider-cover">
              <img
                max-height="400px"
                width="100%"
                src="https://www.teahub.io/photos/full/176-1767757_tecnologa-blockchain.png"
                alt="mamamoo"
              ></img>
            </div>
          </Slider>
          <Formik initialValues={initialValue} validationSchema={exploreSchema} onSubmit={() => {}}>
            {({ values }) => {
              return (
                <Form>
                  <Section className="p-explore_main">
                    <div className="p-search_tabs">
                      <TabList>
                        {MainTabs.map(tab => (
                          <TabButton key={tab} active={tab === selectedTab} handleClick={() => setSelectedTab(tab)}>
                            {tab}
                          </TabButton>
                        ))}
                      </TabList>
                    </div>
                    <div className="p-explore_products">
                      {store ? (
                        <Text modifiers={['center', 'error']}>Empty!</Text>
                      ) : selectedTab === 'Event Listing' ? (
                        <ItemList
                          next={() =>
                            getProducts({
                              cursor: '',
                            })
                          }
                          isLoading={false}
                          searchBy={values.productCategory}
                          next_cursor=""
                          list={events}
                          type="event"
                        />
                      ) : (
                        <ItemList
                          next={() =>
                            getProducts({
                              cursor: '',
                            })
                          }
                          isLoading={false}
                          searchBy={values.productCategory}
                          next_cursor=""
                          list={tickets}
                          type="ticket"
                        />
                      )}
                    </div>
                  </Section>
                </Form>
              );
            }}
          </Formik>
        </>
      </Layout>
    </div>
  );
};
export default hot(Home);
