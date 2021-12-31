import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Button } from 'components/atoms/button';

import copy from 'assets/images/icon/copy.svg';
import avatar from 'assets/images/avatar.png';
import hana from 'assets/images/hana.jpeg';

type Modifier = 'fullwidth';

interface Props {
  modifiers?: Modifier | Modifier[];
  open?: boolean;
  handleDisconnect?: () => void;
  walletAccount: string;
  balanceICX: number;
  hideDisconnect?: boolean;
}

const hashShortener = (hashStr: any) => {
  if (!hashStr) return '';
  const len = hashStr.length;
  if (len <= 10) {
    return hashStr;
  }

  return `${hashStr.substring(0, 6)}...${hashStr.substring(len - 4)}`;
};

export const Mywallet: React.FC<Props> = props => {
  return (
    <div className={mapModifiers('m-mywallet', props.modifiers, props.open && 'open')}>
      <span className="title center">
        <img height="24px" src={hana}></img>Hana Wallet
      </span>
      <div className="network-name center">ICON Mainnet</div>
      <div className="center">
        <img height="60px" className="avatar" src={avatar}></img>
      </div>
      <div className="balance center">{parseFloat(props.balanceICX.toString()).toFixed(4)} ICX</div>
      <div className="address center">
        {hashShortener(props.walletAccount || localStorage.getItem('BALANCE'))}
        <img className="copy" height="40px" src={copy}></img>
      </div>
      {!props.hideDisconnect && (
        <div className="m-mywallet_disconnect">
          <Button modifiers="bid" handleClick={props.handleDisconnect}>
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default hot(Mywallet);
