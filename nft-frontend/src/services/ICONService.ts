/* eslint-disable @typescript-eslint/ban-ts-comment */
import IconService from 'icon-sdk-js';
import { sleep } from 'util/util';
import { login, doAuth, uploadFile, checkEventCreated, publishEvent } from './api';
const { IconConverter, IconBuilder, IconAmount } = IconService;
const isBrowser = typeof window !== 'undefined';

export const NETWORKS = {
  sejong: {
    name: 'Sejong Testnet',
    endpoint: 'https://sejong.net.solidwallet.io/api/v3',
    nid: '0x53',
  },
  ICONMainnet: {
    name: 'ICON Mainnet',
    endpoint: 'https://ctz.solidwallet.io/api/v3',
    nid: '1',
  },
};

const isTest = true;

// const { IcxTransactionBuilder, CallTransactionBuilder } = IconBuilder;
// const { serialize } = IconUtil;

const ADDRESS = 'ADDRESS';
const BALANCE = 'BALANCE';

const NFT_CONTRACT_ADDRESS = 'cx901c6b3846534c99863e6452cfd43e2fa271526b';
const MARKET_CONTRACT_ADDRESS = 'cx428780b232090d13d55dffc9fc3bf6d0b3fc2a8c';
const NETWORK_ID = NETWORKS.sejong.nid;

const currentAddress = isBrowser ? localStorage.getItem(ADDRESS) : '';

const iconService = new IconService(
  new IconService.HttpProvider(isTest ? NETWORKS.sejong.endpoint : NETWORKS.ICONMainnet.endpoint)
);

export const hashShortener = (hashStr: any) => {
  if (!hashStr) return '';
  const len = hashStr.length;
  if (len <= 10) {
    return hashStr;
  }
  return `${hashStr.substring(0, 6)}...${hashStr.substring(len - 4)}`;
};

export const convertToICX = (balance: any) => {
  return IconService.IconAmount.of(balance, IconService.IconAmount.Unit.LOOP)
    .convertUnit(IconService.IconAmount.Unit.ICX)
    .toString();
};

export const getBalance = (address: any) => {
  // https://github.com/icon-project/icon-sdk-js/issues/26#issuecomment-843988076
  return iconService
    .getBalance(address || localStorage.getItem('ADDRESS'))
    .execute()
    .then(balance => {
      return convertToICX(balance);
    });
};

// export const hasHanaAccount = () => {
//   const customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
//     detail: {
//       type: 'REQUEST_HAS_ACCOUNT',
//     },
//   });
//   window.dispatchEvent(customEvent);

//   const eventHandler = (event: any) => {
//     const { type, payload } = event.detail;
//     if (type === 'RESPONSE_HAS_ACCOUNT') {
//       if (payload) {
//         isBrowser && sessionStorage.setItem('isConnected', 'connected');
//       } // true or false
//     }
//   };
//   window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
// };

export const loginWithWallet = async (setIsLogin: any) => {
  const fromAddress = currentAddress || localStorage.getItem(ADDRESS);
  try {
    const res = await login(fromAddress);
    const callTransactionData = new IconBuilder.MessageTransactionBuilder()
      .from(fromAddress || '')
      .to(fromAddress || '')
      .stepLimit(IconConverter.toBigNumber(100000))
      .nid(IconConverter.toBigNumber(83))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp(new Date().getTime() * 1000)
      // @ts-ignore
      .data(IconConverter.fromUtf8(`${res?.data?.sessionId}`))
      .build();
    const transaction = {
      jsonrpc: '2.0',
      method: 'icx_sendTransaction',
      params: IconConverter.toRawTransaction(callTransactionData),
      id: 50889,
    };
    window.dispatchEvent(
      new CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
          type: 'REQUEST_JSON-RPC',
          payload: transaction,
        },
      })
    );
    const eventHandler = (event: any) => {
      const { type, payload } = event.detail;
      if (type === 'RESPONSE_JSON-RPC') {
        if (payload && payload.result && payload.result.startsWith('0x')) {
          doAuth(fromAddress, payload.result);
          setIsLogin(true);
        } // true or false
      }
    };
    window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
  } catch (error) {
    console.log(error);
  }
};

export const connectWallet = (setIsConnected: any) => {
  if (window) {
    const customEvent = new CustomEvent('ICONEX_RELAY_REQUEST', {
      detail: {
        type: 'REQUEST_ADDRESS',
      },
    });
    window.dispatchEvent(customEvent);
    const eventHandler = (event: any) => {
      const { type, payload } = event?.detail;
      if (type === 'RESPONSE_ADDRESS') {
        localStorage.setItem(ADDRESS, payload);
        getAccountInfo();
        sessionStorage.setItem('isConnected', 'connected');
        setIsConnected(true);
      }
    };
    window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);
  }
};

export const getAccountInfo = async () => {
  try {
    const address = currentAddress;
    const balance = +(await getBalance(address));
    isBrowser && localStorage.setItem(BALANCE, balance.toString());
  } catch (err) {
    console.log('Err: ', err);
  }
};

export const sendTransaction = async (transaction: any) => {
  return new Promise((resolve, reject) => {
    window.dispatchEvent(
      new CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
          type: 'REQUEST_JSON-RPC',
          payload: transaction,
        },
      })
    );

    window.addEventListener(
      'ICONEX_RELAY_RESPONSE',
      function (event: any) {
        const type = event.detail.type;
        const payload = event.detail.payload;
        if (type === 'RESPONSE_JSON-RPC') {
          resolve(payload);
        }
      },
      { once: true }
    );
  });
};

export const createEvent = async (data: { quantity: number; eventPath: string }, address: any, openLoading: any) => {
  const res = await uploadFile(data, address);
  const callTransactionData = new IconBuilder.CallTransactionBuilder()
    .from(address)
    .to(NFT_CONTRACT_ADDRESS)
    .value(IconAmount.of(0.01, IconAmount.Unit.ICX).toLoop())
    .nid(NETWORK_ID)
    .timestamp(new Date().getTime() * 1000)
    .stepLimit(IconConverter.toBigNumber(1000000))
    .version(IconConverter.toBigNumber(3))
    // @ts-ignore
    .method('createNFT')
    .params({
      _evn: data.eventPath,
      _qtt: String(data.quantity),
      _uri: res.data.imageUrl,
    })
    .build();
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(callTransactionData),
    id: 50889,
  };
  const { creatorAddress, path } = res.data;
  const transactionRes: any = await sendTransaction(transaction);

  if (transactionRes) {
    openLoading(true);
    await sleep(4000);
    openLoading(false);
    const rs = await checkEventCreated(transactionRes.result);
    if (rs) {
      window.location.replace(`/event?creator=${creatorAddress}&path=${path}`);
    } else {
      alert('Failed to create event!');
    }
    return transactionRes.result;
  } else {
    return false;
  }
};

export const setApproveForAll = async () => {
  const callTransactionData = new IconBuilder.CallTransactionBuilder()
    .from(currentAddress || '')
    .to(NFT_CONTRACT_ADDRESS)
    .nid(NETWORK_ID)
    .timestamp(new Date().getTime() * 1000)
    .stepLimit(IconConverter.toBigNumber(1000000))
    .version(IconConverter.toBigNumber(3))
    // @ts-ignore
    .method('setApprovalForAll')
    .params({
      _operator: MARKET_CONTRACT_ADDRESS,
      _approved: String(1),
    })
    .build();
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(callTransactionData),
    id: 50889,
  };
  const transactionRes: any = await sendTransaction(transaction);
  if (transactionRes) {
    // window.location.replace('/event?id=0');
    return transactionRes.result;
  }
};

export const addNftToMarket = async (
  data: { tokenId: string; priceICX: number; eventPath: string },
  address: any,
  setModalWaiting: any
) => {
  const callTransactionData = new IconBuilder.CallTransactionBuilder()
    .from(address)
    .to(MARKET_CONTRACT_ADDRESS)
    .nid(NETWORK_ID)
    .timestamp(new Date().getTime() * 1000)
    .stepLimit(IconConverter.toBigNumber(1000000))
    .version(IconConverter.toBigNumber(3))
    // @ts-ignore
    .method('addToMarket')
    .params({
      _id: String(data.tokenId),
      _price: String(IconAmount.of(data.priceICX, IconAmount.Unit.ICX).toLoop()),
    })
    .build();
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(callTransactionData),
    id: 50889,
  };
  const transactionRes: any = await sendTransaction(transaction);
  if (transactionRes) {
    setModalWaiting(true);
    await sleep(4000);
    setModalWaiting(false);
    await publishEvent(transactionRes.result, data.eventPath);
    return transactionRes.result;
  }
};

export const addMultipleNFTsToMarket = async (
  data: { tokenIds: Array<string>; priceICX: number; eventPath: any },
  address: any,
  setModalWaiting: any
) => {
  const callTransactionData = new IconBuilder.CallTransactionBuilder()
    .from(address)
    .to(MARKET_CONTRACT_ADDRESS)
    .nid(NETWORK_ID)
    .timestamp(new Date().getTime() * 1000)
    .stepLimit(IconConverter.toBigNumber(1000000))
    .version(IconConverter.toBigNumber(3))
    // @ts-ignore
    .method('addMultipleToMarket')
    .params({
      _ids: data.tokenIds,
      _price: String(IconAmount.of(data.priceICX, IconAmount.Unit.ICX).toLoop()),
    })
    .build();
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(callTransactionData),
    id: 50889,
  };
  const transactionRes: any = await sendTransaction(transaction);
  if (transactionRes) {
    setModalWaiting(true);
    await sleep(4000);
    setModalWaiting(false);
    await publishEvent(transactionRes.result, data.eventPath);
    // window.location.replace('/event?id=0');
    return transactionRes.result;
  }
};

export const removeNftFromMarket = async (data: { orderId: string; tokenId: string }, address: any) => {
  const callTransactionData = new IconBuilder.CallTransactionBuilder()
    .from(address)
    .to(MARKET_CONTRACT_ADDRESS)
    .nid(NETWORK_ID)
    .timestamp(new Date().getTime() * 1000)
    .stepLimit(IconConverter.toBigNumber(1000000))
    .version(IconConverter.toBigNumber(3))
    // @ts-ignore
    .method('removeFromMarket')
    .params({
      _id: data.tokenId,
      _orderId: data.orderId,
    })
    .build();
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(callTransactionData),
    id: 50889,
  };
  const transactionRes: any = await sendTransaction(transaction);
  if (transactionRes) {
    // window.location.replace('/event?id=0');
    return transactionRes.result;
  }
};

export const buyNft = async (data: { orderId: string; priceICX: number }, address: any) => {
  const callTransactionData = new IconBuilder.CallTransactionBuilder()
    .from(address)
    .to(MARKET_CONTRACT_ADDRESS)
    .value(IconAmount.of(data.priceICX, IconAmount.Unit.ICX).toLoop())
    .nid(NETWORK_ID)
    .timestamp(new Date().getTime() * 1000)
    .stepLimit(IconConverter.toBigNumber(1000000))
    .version(IconConverter.toBigNumber(3))
    // @ts-ignore
    .method('purchase')
    .params({
      _orderId: data.orderId,
    })
    .build();
  const transaction = {
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(callTransactionData),
    id: 50889,
  };
  const transactionRes: any = await sendTransaction(transaction);
  if (transactionRes) {
    console.log('transactionRes', transactionRes);
    // window.location.replace('/event?id=0');
    return transactionRes.result;
  }
};
