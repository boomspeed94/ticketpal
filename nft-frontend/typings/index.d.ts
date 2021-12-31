interface Window extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BinanceChain?: any;
  web3?: any;
  contract?: any;
}

/**
 ** workaround for loading images
 */
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}

declare module 'multiselect-react-dropdown';
