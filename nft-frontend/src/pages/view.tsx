import React, { useEffect, useState } from 'react';
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
import { TextFieldFormik } from 'components/atoms/textfield';
import { ButtonContainer } from 'components/molecules/buttonContainer';
import { Fieldrow } from 'components/molecules/fieldrow';
import { Heading } from 'components/molecules/heading';
import { ModalHeader } from 'components/molecules/modalHeader';
import { Toast } from 'components/molecules/toast';
import { UserAvatar } from 'components/molecules/userAvatar';
import { ViewTabItem } from 'components/molecules/viewTabItem';
import { Modal } from 'components/organisms/modal';
import { Section } from 'components/organisms/section';
import Layout from 'components/templates/layout';
import avatar from 'assets/images/avatar.png';
import { Form, Formik } from 'formik';
import { hot } from 'react-hot-loader/root';
import { amountDollarWithServiceFee } from 'util/amount';
import { fakeUsers } from 'dummy/dummy';
import { createTransaction, getTicketByEventAndTokenId, getTransactionsByTokenId } from 'services/api';
import { buyNft, hashShortener, addNftToMarket } from 'services/ICONService';
import { sleep } from 'util/util';

export const View: React.FC<RouteComponentProps> = props => {
  const id = new URLSearchParams(props.location?.search).get('id');
  const event_id = new URLSearchParams(props.location?.search).get('event_id');

  const [product, setProduct] = useState({} as any);
  const [history, setHistory] = useState([]);
  const [canResell, setCanReSell] = useState(false);

  //const { isApproved, isSuccess, product, isGetDone } = useSelector(getBuyStore);
  const isApproved = false;
  const isSuccess = false;
  const isGetDone = true;
  const balance = 0;
  const productPrice = Number(product?.priceICX) || 0;
  const fee = (Number(productPrice) * Number(process.env.SERVICE_FEE)) / 100;
  const totalPrice: number = Number(productPrice) + Number(fee);
  const [like, setLike] = useState({ isLike: false, amount: 0 });
  const [isProcessing, setIsProcessing] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [friction] = useState(1 / 200);
  const [address, setAddress] = useState('');
  const [modalWaiting, setModalWaiting] = useState(false);
  const [modalResell, setModalResell] = useState(false);

  useEffect(() => {
    setAddress(localStorage.getItem('ADDRESS') || '');
    const getTicketDetails = async () => {
      const rs = await getTicketByEventAndTokenId(event_id, id);
      if (rs?.data) {
        setProduct(rs?.data);
        setCanReSell(
          rs?.data?.ownerAddress === localStorage.getItem('ADDRESS') && !product.availableForSale && !product.orderId
        );
      }
      const historyRS = await getTransactionsByTokenId(id);
      setHistory(historyRS?.data);
      setIsProcessing(false);
    };
    if (id && event_id) {
      getTicketDetails();
    } else {
      // dummy data
      setHistory([]);
    }

    // 3d animation
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
    if (product.orderId) {
      try {
        const txHash = await buyNft({ orderId: product.orderId, priceICX: product.priceICX }, address);
        await toast.promise(sleep(5000), {
          pending: 'Waiting for buying NFT...',
          success: 'Process completed!',
          error: 'Process failed!',
        });
        await createTransaction(txHash);
        toast.success('Ticket buying success!');
      } catch (error) {
        toast.error(JSON.stringify(error));
      }
    } else {
      toast.error('Ticket are not available');
    }
  };

  const resellTicket = async (values: any) => {
    try {
      const txHash = await addNftToMarket(
        { tokenId: product.tokenId, priceICX: values.price, eventPath: product.path },
        localStorage.getItem('ADDRESS'),
        setModalWaiting
      );
      if (txHash) {
        toast.success('Resell ticket success!');
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  return (
    <div className="p-view">
      <Layout title="View Ticket">
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
                      <div className="p-view_headSection">
                        <Heading type="h1" title={product.name}>
                          {product.name}
                        </Heading>
                        <Modal isOpen={modalWaiting} handleClose={() => {}}>
                          <ModalHeader title="" cannotClose={true} />
                          <div className="p-create_center">
                            <Spinner modifiers="big" />
                          </div>
                          <div className="p-create_center p-create_waiting"> Please wait a moment.</div>
                        </Modal>
                        <Modal
                          isOpen={modalResell}
                          handleClose={() => {
                            setModalResell(false);
                          }}
                        >
                          <ModalHeader
                            title=""
                            cannotClose={false}
                            handleClose={() => {
                              setModalResell(false);
                            }}
                          />
                          <div className="p-create_center">
                            <Formik
                              initialValues={{}}
                              onSubmit={values => {
                                resellTicket(values);
                              }}
                            >
                              {() => {
                                return (
                                  <Form>
                                    <Fieldrow fieldName="Input new price to resell" name="price">
                                      <TextFieldFormik type="tel" name="price" placeholder="Price in ICX" />
                                    </Fieldrow>
                                    <Button type="submit" modifiers="buy">
                                      Resell
                                    </Button>
                                  </Form>
                                );
                              }}
                            </Formik>
                          </div>
                          <div className="p-create_center p-create_waiting"></div>
                        </Modal>
                        {canResell ? (
                          <Button
                            modifiers="buy"
                            handleClick={() => setModalResell(true)}
                            disabled={!product.tokenId || isSuccess}
                          >
                            Resell
                          </Button>
                        ) : (
                          <Button
                            modifiers="buy"
                            handleClick={() => buyTicket()}
                            disabled={!product.tokenId || isSuccess}
                          >
                            {isSuccess ? 'Sold out' : 'Buy now'}
                          </Button>
                        )}
                      </div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold', 'darkPink']} inline unit={product.quote_token}>
                          {productPrice} ICX
                        </Text>
                      </div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold']} inline>
                          By {product.organizer || 'Organizer'}
                        </Text>
                      </div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold']} inline>
                          December 31,2021 2PM KTS
                        </Text>
                      </div>
                      <div className="p-view_price">
                        <Text size="18" modifiers={['bold']} inline>
                          at {product.location || 'Location'}
                        </Text>
                      </div>
                    </div>
                    <div className="p-view_detail">
                      <div className="p-view_lead">
                        <Text size="14" modifiers="gray">
                          Meta: {product.metaReference}
                        </Text>
                      </div>
                      <div className="p-view_lead">
                        <Text size="14" modifiers="gray">
                          {product.description}
                        </Text>
                      </div>
                      <div className="p-view_tags">
                        <Tag key={product.category}>{product.category || 'Concert/Theater'}</Tag>
                      </div>
                      <div className="p-view_seller">
                        <Text size="14" modifiers="gray">
                          Re-seller:
                        </Text>
                        <UserAvatar {...fakeUsers[0]} modifiers="mid" />
                        <div className="p-view_sellerName">
                          <Text size="14" modifiers="gray">
                            {hashShortener(product.ownerAddress)}
                          </Text>
                        </div>
                      </div>
                      <div className="p-view_seller">
                        <Text size="14" modifiers="gray">
                          Seller:
                        </Text>
                        <UserAvatar {...fakeUsers[0]} modifiers="mid" />
                        <div className="p-view_sellerName">
                          <Text size="14" modifiers="gray">
                            {hashShortener(product.creatorAddress)}
                          </Text>
                        </div>
                      </div>

                      <div className="p-view_tabs">
                        <div className="p-view_tabcontent">
                          <div className="p-view_wrapper">
                            <div className="history-text">
                              <Text size="18" modifiers="darkPink">
                                History
                              </Text>
                            </div>
                            <ul>
                              {history.map((item: any, idx) => (
                                <li className="p-view_tabitem" key={idx}>
                                  <ViewTabItem
                                    image={avatar}
                                    lead={
                                      <Text size="14" modifiers="gray">
                                        <>
                                          <span> Sale with price </span>
                                          <Text size="14" modifiers="bold" inline unit={product.quote_token}>
                                            {item.priceICX}
                                          </Text>
                                          <span> {item.date} </span>
                                        </>
                                      </Text>
                                    }
                                    from={hashShortener(item.fromAddress)}
                                    to={hashShortener(item.toAddress)}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
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
                              Xtantin4
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
    </div>
  );
};
export default hot(View);
