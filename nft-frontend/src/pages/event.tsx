/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RouteComponentProps } from '@reach/router';
import { toast } from 'react-toastify';
import { Button } from 'components/atoms/button';
import { CheckInput } from 'components/atoms/checkInput';
import { Icontext } from 'components/atoms/icontext';
import { Image } from 'components/atoms/image';
import { Label } from 'components/atoms/label';
import { Spinner } from 'components/atoms/spinner';
import { Tag } from 'components/atoms/tag';
import { Text } from 'components/atoms/text';
import { Textfield } from 'components/atoms/textfield';
import { ButtonContainer } from 'components/molecules/buttonContainer';
import { Fieldrow } from 'components/molecules/fieldrow';
import { Heading } from 'components/molecules/heading';
import { ModalHeader } from 'components/molecules/modalHeader';
import { Toast } from 'components/molecules/toast';
import { Modal } from 'components/organisms/modal';
import { Section } from 'components/organisms/section';
import Layout from 'components/templates/layout';
import { Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { amountDollarWithServiceFee } from 'util/amount';
import { StepItem } from 'components/molecules/stepItem';
import { Steps } from 'components/organisms/steps';
import { createTransaction, getAssetByAddressAndPath, getEventByPath } from 'services/api';
import { buyNft, setApproveForAll, addMultipleNFTsToMarket, hashShortener } from 'services/ICONService';
import { sleep } from 'util/util';
import { UserAvatar } from 'components/molecules/userAvatar';

export const Event: React.FC<RouteComponentProps> = props => {
  const creatorAddress = new URLSearchParams(props.location?.search).get('creator');
  const path = new URLSearchParams(props.location?.search).get('path');

  //const { isApproved, isSuccess, product, isGetDone } = useSelector(getBuyStore);
  const isApproved = false;
  const isSuccess = false;
  const isGetDone = true;
  const productExp = {
    id: '0',
    pricePerTicket: 100,
    upload_file:
      'https://media-cdn.laodong.vn/storage/newsportal/2020/12/5/859890/Blackpink.jpg?w=960&crop=auto&scale=both',
    title: 'Blackpink: The Show',
    quote_token: 'ICX',
    description: 'Don’t miss this. Blackpink live concert. Enjoy your Concert.Thank You!',
    category: 'Concert/Theater',
    token_id: 1,
    status: 'onSale',
    location: 'Zoom',
    organizer: 'YG Entertaiment',
    availableForSale: true,
    amountOfTickets: 10,
  };
  const [product, setProduct] = useState<any>({});
  const balance = 0;
  const productPrice = Number(product?.pricePerTicket) || 0;
  const eventPath = product.path || '';
  const fee = (Number(productPrice) * Number(process.env.SERVICE_FEE)) / 100;
  const totalPrice: number = Number(productPrice) + Number(fee);
  const [like, setLike] = useState({ isLike: false, amount: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalWaiting, setModalWaiting] = useState(false);
  const [currentStep, setCurrentStep] = useState({ number: 0, status: '' });
  const [tokenIds, setTokenIds] = useState([]);
  const [address, setAddress] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [friction] = useState(1 / 200);
  useEffect(() => {
    setAddress(localStorage.getItem('ADDRESS') || '');
    const fetchData = async () => {
      setIsProcessing(true);
      const rs: any = await getEventByPath(creatorAddress, path);
      const ticketsRs: any = await getAssetByAddressAndPath(creatorAddress || '', path || '');
      setProduct(rs.data);
      setTokenIds(ticketsRs.data.map((ticket: any) => String(ticket.tokenId)));
      if (!rs.data) {
        setProduct(productExp);
      }
      setIsProcessing(false);
    };
    if (creatorAddress === 'undefined') {
      setProduct(productExp);
    } else {
      fetchData();
    }
    // animation
    const mouseMove = function (e: any) {
      const followX = window.innerWidth / 2 - e.clientX;
      const followY = window.innerHeight / 2 - e.clientY;

      let x = 0,
        y = 0;
      x += (-followX - x) * friction;
      y += (followY - y) * friction;
      setOffsetX(x);
      setOffsetY(y);
    };

    document.addEventListener('mousemove', mouseMove);
  }, []);

  const PublishSteps = [
    {
      description: 'Approve perfoming transactions with your wallet',
      title: 'Approve for all',
      handleClick: async () => {
        const res = await setApproveForAll();
        if (res) {
          setCurrentStep({ number: 1, status: 'success' });
        }
      },
    },
    {
      description: 'Sign to add all tickets to market',
      title: 'Add tickets to market',
      handleClick: async () => {
        const res = await addMultipleNFTsToMarket(
          { tokenIds: tokenIds, priceICX: productPrice, eventPath: eventPath },
          creatorAddress,
          setModalWaiting
        );
        if (res) {
          setIsPublished(true);
          toast.success('Publish event success!');
          setCurrentStep({ number: 2, status: '' });
        }
      },
    },
  ];
  // offset animation
  const offset = {
    transform: `perspective(600px)
                rotateY(${offsetX}deg)
                rotateX(${offsetY}deg)`,
  };

  const buyTicket = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('You need to login first!');
      return;
    }
    if (creatorAddress && path && creatorAddress !== 'undefined' && path !== 'undefined') {
      try {
        //@ts-ignore
        const rs: any = await getAssetByAddressAndPath(creatorAddress, path);
        if (rs.length == 0) {
          toast.error('This event not available to buy');
          return;
        }
        const ticketReadyToBy = rs?.data?.find((item: any) => !!item.orderId);
        if (!ticketReadyToBy) {
          toast.error('This event not available to buy');
          return;
        }
        const txHash = await buyNft({ orderId: ticketReadyToBy.orderId, priceICX: ticketReadyToBy.priceICX }, address);

        await toast.promise(sleep(5000), {
          pending: 'Waiting for buying NFT...',
          success: 'Process completed!',
          error: 'Process failed!',
        });

        await createTransaction(txHash);
        toast.success('Ticket buying  success');
      } catch (error) {
        toast.error(JSON.stringify(error));
      }
    } else {
      toast.error('This event not available to buy');
    }
  };
  return (
    <div className="p-view">
      <Layout title="View Event">
        <Section className="p-view_main">
          {isGetDone ? (
            product?.id ? (
              <>
                <div className="p-view_control">
                  <div className="p-view_fnc">
                    <CheckInput
                      modifiers="border"
                      iconName={like.isLike ? 'heart-active' : 'heart'}
                      amount={like.amount}
                      handleChange={() =>
                        setLike({
                          isLike: !like.isLike,
                          amount: like.isLike ? like.amount - 1 : like.amount + 1,
                        })
                      }
                    />
                  </div>
                </div>
                <article className="p-view_product">
                  <div className="p-view_item">
                    <div className="p-view_media">
                      <Image src={product.imageUrl || product.upload_file} alt="" modifiers="big" style={offset} />
                    </div>
                  </div>
                  <div className="p-view_info">
                    <div className="p-view_detailheading">
                      <Modal isOpen={modalOpen} handleClose={() => setModalOpen(false)}>
                        <ModalHeader title="FOLLOW STEPS" handleClose={() => setModalOpen(false)} />
                        <Steps>
                          {PublishSteps.map((step, idx) => {
                            const iconName =
                              currentStep.number > idx
                                ? 'tick-success'
                                : currentStep.number === idx
                                ? currentStep.status
                                : 'tick-step';
                            return <StepItem key={idx} iconName={iconName} {...step} handleClick={step.handleClick} />;
                          })}
                        </Steps>
                      </Modal>
                      <div className="p-view_headSection">
                        <Heading type="h1" title={product.name}>
                          {product.name}
                        </Heading>
                        {product.availableForSale ? (
                          <Button modifiers="buy" handleClick={() => buyTicket()}>
                            Buy
                          </Button>
                        ) : (
                          <Button
                            modifiers="buy"
                            handleClick={() => {
                              setModalOpen(true);
                            }}
                            disabled={isPublished}
                          >
                            Publish
                          </Button>
                        )}
                      </div>
                      <div className="p-view_price"></div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold', 'darkPink']} inline unit={product.quote_token}>
                          {productPrice ? `${productPrice} ICX / ticket` : 'Price unset'}
                        </Text>
                      </div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold']} inline>
                          By: {product.organizer || 'Organizer'}
                        </Text>
                      </div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold']} inline>
                          At: {product.location || 'Location'}
                        </Text>
                      </div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold']} inline>
                          December 31,2021 2PM KTS
                        </Text>
                      </div>
                    </div>
                    <div className="p-view_detail">
                      <div className="p-view_lead">
                        <Text size="14" modifiers="gray">
                          Only {product.amountOfTickets} tickets
                        </Text>
                        <Text size="14" modifiers="gray">
                          Meta: {product.metaReference}
                        </Text>
                        <Text size="14" modifiers="gray">
                          {product.description}
                        </Text>
                      </div>
                      <div className="p-view_tags">
                        <Tag key={product.category}>{product.category || 'Concert/Theater'}</Tag>
                      </div>
                      <div className="p-view_seller">
                        <Text size="14" modifiers="gray">
                          Seller:
                        </Text>
                        <UserAvatar modifiers="mid" />
                        <div className="p-view_sellerName">
                          <Text size="14" modifiers="gray">
                            {hashShortener(product.creatorAddress)}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className="p-view_buydialog">
                      <p className="p-view_receipt">
                        <Text inline modifiers="gray" size="18">
                          Service fee
                          <Text inline modifiers="gray" size="18">
                            {process.env.SERVICE_FEE}%
                          </Text>
                        </Text>
                        <Text inline modifiers="darkPink" size="18" unit={product.quote_token}>
                          {Number(totalPrice)}
                        </Text>
                        <Text inline modifiers="gray" size="18">
                          ～${Number(amountDollarWithServiceFee(Number(productPrice)))}
                        </Text>
                      </p>
                    </div>
                  </div>
                </article>
                <Modal isOpen={isApproved} handleClose={() => {}} modifiers="overflowy">
                  {isSuccess ? (
                    <Toast handleClose={() => {}}>Success purchase!</Toast>
                  ) : (
                    <>
                      <ModalHeader handleClose={() => {}} title="CHECKOUT" />
                      <div className="p-view_modalbody">
                        <div className="p-view_balance">
                          <div className="p-view_accountinfo">
                            <Text size="18" modifiers="bold">
                              Your balance
                            </Text>
                          </div>
                        </div>
                        <div className="p-view_modaldescription">
                          <Text>
                            You are about to purchare{' '}
                            <Text inline modifiers="bold">
                              {product.title}
                            </Text>{' '}
                            from{' '}
                            <Text inline modifiers="bold">
                              luanvg
                            </Text>
                          </Text>
                          <Icontext iconName="coin">
                            <Text modifiers={['bold', 'darkPink']} unit={product.quote_token}>
                              {productPrice}
                            </Text>
                          </Icontext>
                        </div>
                        <Formik initialValues={{ quantity: 1 }} onSubmit={() => {}}>
                          {() => {
                            return (
                              <Form className="p-view_modalform">
                                <Fieldrow fieldName="Quantity">
                                  <Textfield name="quantity" placeholder="1" useFormik readonly />
                                </Fieldrow>
                                <div className="p-view_modalreceipt">
                                  <Label>You will pay</Label>
                                  <div className="p-view_totalpay">
                                    <Text size="14">Total</Text>
                                    <Text size="14" unit={product.quote_token}>
                                      {totalPrice}
                                    </Text>
                                  </div>
                                  <ul className="p-view_receiptdetail">
                                    <li>
                                      - Product:
                                      <Text unit={product.quote_token} size="14" inline>
                                        {productPrice}
                                      </Text>
                                    </li>
                                    <li>
                                      - Fee:
                                      <Text unit={product.quote_token} size="14" inline>
                                        {fee}
                                      </Text>
                                    </li>
                                  </ul>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                        {product && totalPrice > balance && (
                          <p className="p-view_errormessage">You don't have enough money to buy it.</p>
                        )}

                        <ButtonContainer>
                          <Button modifiers="bid" handleClick={() => {}}>
                            Cancel
                          </Button>
                          <Button modifiers="buy" disabled={product && totalPrice > balance} handleClick={() => {}}>
                            Payment
                          </Button>
                        </ButtonContainer>
                      </div>
                    </>
                  )}
                </Modal>
              </>
            ) : (
              <></>
            )
          ) : (
            <Spinner />
          )}
        </Section>
      </Layout>
      {isProcessing && <Spinner modifiers="screen" label="Processing" />}
      <Modal isOpen={modalWaiting} handleClose={() => {}}>
        <ModalHeader title="" cannotClose={true} />
        <div className="p-create_center">
          <Spinner modifiers="big" />
        </div>
        <div className="p-create_center p-create_waiting"> Please wait a moment.</div>
      </Modal>
    </div>
  );
};
export default hot(Event);
