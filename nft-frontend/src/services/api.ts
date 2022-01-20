/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
const isBrowser = typeof window !== 'undefined';
const apiEndpoint = 'https://ticketpal.store';
const axiosConfigWithToken = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${isBrowser && localStorage?.getItem('token')}`,
  },
};

export const login = async (address: any) => {
  try {
    const postData = {
      address: address,
    };
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: true,
    };
    const res = await axios.post(`${apiEndpoint}/api/v1/users/login`, postData, axiosConfig);
    return res;
  } catch (error) {
    console.log('error');
  }
};

export const hasSession = async () => {
  try {
    return await axios.get(`${apiEndpoint}/api/v1/users`, axiosConfigWithToken);
  } catch (error) {
    console.log(error);
  }
};

export const doAuth = async (address: any, trxId: any) => {
  try {
    const rs = await axios.post(
      `${apiEndpoint}/api/v1/users/auth`,
      { address: address, trxId: trxId },
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    isBrowser && localStorage.setItem('token', rs?.data?.token);
    return rs;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (formData: any, address: any) => {
  const pdata = new FormData();
  pdata.append('name', formData.name);
  pdata.append('file', formData.file);
  pdata.append('price', formData.price);
  pdata.append('location', formData.location);
  pdata.append('organizer', formData.organizer);
  pdata.append('path', formData.eventPath);
  pdata.append('amount', formData.quantity);
  pdata.append(
    'categories',
    formData.categories && JSON.stringify(formData.categories.map((category: any) => category.name))
  );
  pdata.append('description', formData.description);
  pdata.append('startAt', formData.startDay);
  pdata.append('endAt', formData.endDay);

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: isBrowser && `Bearer ${localStorage.getItem('token')}`,
    },
  };

  return await axios.post(`${apiEndpoint}/api/v1/events/${address}`, pdata, axiosConfig);
};

export const checkEventCreated = async (txHash: any) => {
  return axios.post(`${apiEndpoint}/api/v1/transaction/${txHash}`);
};
export const getAllTickets = async () => {
  return await axios.get(`${apiEndpoint}/api/v1/assets`, { withCredentials: true });
};

export const getTicketByEventAndTokenId = async (eventId: any, tokenId: any) => {
  try {
    return await axios.get(`${apiEndpoint}/api/v1/assets/${eventId}/${tokenId}`);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsByTokenId = async (tokenId: any) => {
  try {
    return await axios.get(`${apiEndpoint}/api/v1/transaction/nft/${tokenId}`);
  } catch (error) {
    console.log(error);
  }
};

export const getEventForSale = async () => {
  return await axios.get(`${apiEndpoint}/api/v1/events?for_sale=true`);
};

export const getTicketForSale = async () => {
  return await axios.get(`${apiEndpoint}/api/v1/assets?for_sale=true`);
};

export const getEventByAddress = async (address: any) => {
  try {
    return await axios.get(`${apiEndpoint}/api/v1/events?creator_address=${address}`);
  } catch (error) {
    console.log(error);
  }
};

export const getTicketsByAddress = async (address: any) => {
  try {
    return await axios.get(`${apiEndpoint}/api/v1/assets/${address}`);
  } catch (error) {
    console.log(error);
  }
};

export const getEventByPath = async (address: any, path: any) => {
  try {
    return await axios.get(`${apiEndpoint}/api/v1/events/${address}/${path}`);
  } catch (error) {
    console.log(error);
  }
};

export const getAssetByAddressAndPath = (address: string, path: string) => {
  try {
    return axios.get(`${apiEndpoint}/api/v1/events/${address}/${path}/assets`);
  } catch (error) {
    console.log(error);
  }
};
export const createTransaction = async (txHash: string) => {
  return axios.post(`${apiEndpoint}/api/v1/transaction/${txHash}`);
};

export const searchTickets = async (name: any) => {
  try {
    return axios.get(`${apiEndpoint}/api/v1/assets?name=${name}`);
  } catch (error) {
    console.log(error);
  }
};

export const searchEvents = async (name: any) => {
  try {
    return axios.get(`${apiEndpoint}/api/v1/events?name=${name}`);
  } catch (error) {
    console.log(error);
  }
};

export const publishEvent = async (txHash: any, eventPath: any) => {
  const postData = {
    eventPath: eventPath,
  };
  return axios.post(`${apiEndpoint}/api/v1/market/${txHash}`, postData, axiosConfigWithToken);
};

export const getEventsByCategory = async (category: any) => {
  try {
    return axios.get(`${apiEndpoint}/api/v1/events`, {
      params: {
        categories: `["${category}"]`,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTicketsByCategory = async (category: any) => {
  try {
    return axios.get(`${apiEndpoint}/api/v1/assets`, {
      params: {
        categories: `["${category}"]`,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
