import React, { useState, useEffect } from 'react';
import { Button } from 'components/atoms/button';
import { Icon } from 'components/atoms/icon';
import { Link } from 'components/atoms/link';
import { Dropdown } from 'components/molecules/dropdown';
import { Mywallet } from 'components/molecules/mywallet';
import { connectWallet, loginWithWallet, hashShortener, getAccountInfo } from 'services/ICONService';
import { hasSession } from 'services/api';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  isConnected: boolean;
  address: any;
  balance: any;
  setIsConnected: any;
}
export const MenuChunk: React.FC<Props> = ({ setIsConnected, isConnected, address, balance }) => {
  const [isOpenMywallet, setIsOpenMywallet] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const rs = await hasSession();
      if (rs?.data?.address) {
        getAccountInfo();
        setIsLogin(true);
      }
    };
    checkLogin();
  }, []);
  const handleDisconnect = () => {
    sessionStorage.removeItem('isConnected');
    localStorage.removeItem('ADDRESS');
    localStorage.removeItem('BALANCE');
    localStorage.removeItem('token');
    setIsConnected(false);
  };
  return (
    <div className="o-header_buttons">
      <Button modifiers={['noBackground']} anchor={{ href: '/create' }}>
        Create an event
      </Button>
      {!isConnected ? (
        <Button modifiers={['noBackground']} handleClick={() => connectWallet(setIsConnected)}>
          Connect wallet
        </Button>
      ) : (
        <>
          <Dropdown
            trigger={
              <Button
                modifiers={['icon', 'noPadding', 'noBackground']}
                handleClick={() => setIsOpenMywallet(!isOpenMywallet)}
              >
                <Icon iconName="wallet" />
              </Button>
            }
            id="wallet"
            offset={{ left: 105 }}
          >
            <Mywallet
              open={isOpenMywallet}
              walletAccount={address}
              balanceICX={balance}
              handleDisconnect={handleDisconnect}
            />
          </Dropdown>
          <Button modifiers="noBackground" handleClick={handleDisconnect}>
            Disconnect
          </Button>
          {isLogin ? (
            <div className="link-to-profile">
              <Link href="/profile">{hashShortener(address)}</Link>
            </div>
          ) : (
            <div className="login-link" onClick={() => loginWithWallet(setIsLogin)}>
              Login with wallet
            </div>
          )}
        </>
      )}
    </div>
  );
};
