import { Button } from 'components/atoms/button';
import { Icon } from 'components/atoms/icon';
import { Link } from 'components/atoms/link';
import { TextFieldFormik } from 'components/atoms/textfield';
import { Heading } from 'components/molecules/heading';
import { Mywallet } from 'components/molecules/mywallet';
import { Sidebar } from 'components/molecules/sidebar';
import { Form, Formik } from 'formik';
import { navigate } from 'gatsby-link';
import { throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import menuIcon from 'assets/images/icon/icon-menu.svg';

import { MenuChunk } from './chunk';
//import { logo } from 'assets/images/logo.png';

export const Header: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSticky, setSticky] = useState(false);
  const [openHambugerMenu, setOpenHambugerMenu] = useState(false);
  useEffect(() => {
    setIsConnected(sessionStorage?.getItem('isConnected') === 'connected');
    setAddress(localStorage.getItem('ADDRESS') || '');
    setBalance(localStorage.getItem('BALANCE') || '');
    const handleScroll = throttle(() => {
      const header = document.querySelector('.o-header');
      const layout = document.querySelector('.t-layout');
      const isSticky = (header && window.pageYOffset > header.getBoundingClientRect().top) || false;
      const onTop = window.pageYOffset === 0;
      setSticky(isSticky);
      layout?.classList.toggle('u-sticky', isSticky && !onTop);
    }, 150);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onClosed = () => {
    setIsMenuOpen(false);
  };
  return (
    <header className={`o-header ${isSticky ? 'u-sticky' : ''}`}>
      <img src={menuIcon} className="menu" alt="menu icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
      <div className={isMenuOpen ? 'menu-open' : 'menu-close'}>
        <Sidebar close={onClosed}></Sidebar>
      </div>
      <div className="logo">
        <Heading modifiers="white">
          <Link href="/">TicketPal</Link>
        </Heading>
      </div>
      <div className="o-header_main">
        <img src={menuIcon} className="menu" alt="menu icon" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <Formik
          initialValues={{ search: '' }}
          onSubmit={values => {
            navigate(`/search?name=${values.search}`);
          }}
        >
          <Form className="o-header_search">
            <TextFieldFormik modifiers="search" placeholder="Search" type="text" name="search" />
          </Form>
        </Formik>
        <MenuChunk setIsConnected={setIsConnected} isConnected={isConnected} address={address} balance={balance} />
        <div className="o-header_hambuger">
          <Button
            modifiers={['icon', 'noBorder', 'noBackground']}
            handleClick={() => setOpenHambugerMenu(!openHambugerMenu)}
          >
            <Icon iconName="wallet" />
          </Button>
        </div>
      </div>
      {openHambugerMenu && (
        <div className="o-header_hambugermenu">
          <div className="o-header_head">
            <Heading modifiers="white">TicketPal</Heading>
            <Button
              modifiers={['icon', 'noBackground', 'noBorder']}
              handleClick={() => setOpenHambugerMenu(!openHambugerMenu)}
            >
              <Icon iconName="close" />
            </Button>
          </div>
          {isConnected && (
            <Mywallet
              open={true}
              walletAccount={address || ''}
              balanceICX={Number(balance)}
              hideDisconnect
              modifiers="fullwidth"
            />
          )}
          <ul className="o-header_menu">
            <li>
              <Link href="/">Explore</Link>
            </li>
          </ul>
          <MenuChunk setIsConnected={setIsConnected} isConnected={isConnected} address={address} balance={balance} />
        </div>
      )}
    </header>
  );
};

export default hot(Header);
