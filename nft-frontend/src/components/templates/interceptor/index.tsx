import React, { useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { hot } from 'react-hot-loader/root';
import Web3 from 'web3';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'components/atoms/button';
import { Modal } from 'components/organisms/modal';
import { Text } from 'components/atoms/text';
import { connectWallet } from 'services/ICONService';
import { ButtonContainer } from 'components/molecules/buttonContainer';
import ReactModal from 'react-modal';

const Interceptor: React.FC = props => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // if (window && typeof window.BinanceChain !== 'undefined') {
    //   window.web3 = new Web3(window.BinanceChain);
    //   if (sessionStorage.getItem('isConnected') === 'connected') {
    //     wallet.connect('injected');
    //   }
    // } else sessionStorage.setItem('isConnected', '');
    // document && ReactModal.setAppElement(document.body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // return isLoading ? <Spinner /> : <>{props.children}</>;
  return (
    <>
      {props.children}
      <Modal
        isOpen={false}
        handleClose={() => {
        }}
        modifiers="error"
      >
        {/* <ModalHeader handleClose={() => dispatch(closeConnectModal())} modifiers="closeonly" /> */}
        <Text modifiers={['bold', 'center']}>{}</Text>
        <ButtonContainer>
          <Button modifiers="bid" handleClick={() => {}}>
            Close
          </Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};
export default hot(Interceptor);
