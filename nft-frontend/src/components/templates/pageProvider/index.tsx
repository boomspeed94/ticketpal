import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store/index';
import { UseWalletProvider, ConnectionRejectedError } from 'use-wallet';
import { BscConnector, UserRejectedRequestError } from '@binance-chain/bsc-connector';
import Interceptor from 'components/templates/interceptor';
import { hot } from 'react-hot-loader/root';

export const PageProvider: React.FC = props => {
  return (
    <UseWalletProvider
      connectors={{
        injected: {
          web3ReactConnector() {
            return new BscConnector({ supportedChainIds: [56, 97] });
          },
          handleActivationError(err: any) {
            if (err instanceof UserRejectedRequestError) {
              return new ConnectionRejectedError();
            }
          },
        },
      }}
      chainId={97}
    >
      <Provider store={store}>
        <Interceptor>{props.children}</Interceptor>
      </Provider>
    </UseWalletProvider>
  );
};

export default hot(PageProvider);
