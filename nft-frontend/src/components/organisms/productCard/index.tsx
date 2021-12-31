import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapSigns } from '@fortawesome/free-solid-svg-icons';
import { mapModifiers } from 'lib/component';
import { Text } from 'components/atoms/text';
import { Image, ImageProps } from 'components/atoms/image';
import { Link } from 'components/atoms/link';
import { UserAvatar } from 'components/molecules/userAvatar';
import { CheckInput } from 'components/atoms/checkInput';
import { UserType } from 'lib/constants';
import { Button } from 'components/atoms/button';
import { Tooltip } from 'components/molecules/tooltip';
import iconICX from 'assets/images/icon/icon-icx.png';
import expired from 'assets/images/expired-stamp.png';
import available from 'assets/images/available.png';
type Modifier = 'foo' | 'bar';

export type User = { src: string; alt: string; type: UserType; name: string };
export interface ProductProps extends Omit<ImageProps, 'modifiers'> {
  modifiers?: Modifier | Modifier[];
  title: string;
  location: string;
  organizer: string;
  price?: number;
  imageUrl: string;
  bidPrice?: string | number;
  userList?: User[];
  amount?: number;
  creatorAddress: string;
  name: string;
  path: string;
  collection?: string;
  isPreview?: boolean;
  availableForSale: boolean;
  id?: string | number;
  tokenId: any;
  eventId: any;
  mediaType?: 'gif' | 'png' | 'image';
  unit?: string;
  status?: 'created' | 'owned' | 'onsale' | 'view' | 'expired' | 'soldout' | 'available';
  type?: 'event' | 'ticket';
}

export const Productcard: React.FC<ProductProps> = props => {
  const [like, setLike] = useState({ isLike: false, amount: props.amount });
  const productLink =
    props.type === 'event'
      ? `/event?creator=${props.creatorAddress}&path=${props.path}`
      : `/view?event_id=${props.eventId}&id=${props.tokenId}`;
  return (
    <article className={mapModifiers('o-productcard', props.modifiers, props.isPreview && 'preview')}>
      {props.isPreview ? (
        <ProductPreview {...props} />
      ) : (
        <>
          <div className="o-productcard_control">
            <CheckInput
              iconName={like.isLike ? 'heart-active' : 'heart'}
              amount={like.amount}
              handleChange={() =>
                setLike({
                  isLike: !like.isLike,
                  amount: !like.isLike && typeof props.amount === 'number' ? props.amount + 1 : props.amount,
                })
              }
            />
            <div className="o-productcard_bmp">
              <ul className="o-productcard_userlist">
                {props.userList &&
                  props.userList.map((u, idx) => (
                    <li
                      key={idx}
                      className={`o-productcard_user o-productcard_user-${idx + 1}`}
                      data-tip={`${u.type}: ${u.name}`}
                    >
                      <UserAvatar {...u} modifiers="small" />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <Link href={productLink}>
            {props.status === 'expired' && (
              <div className="o-productcard_expired">
                <img height="100" width="200" src={expired} alt="exp" />
              </div>
            )}
            {props.status === 'available' && (
              <div className="o-productcard_available">
                <img height="60" width="60" src={available} alt="avai" />
              </div>
            )}
            <div className="o-productcard_media">
              <Image src={props.imageUrl} alt={props.alt} />
            </div>
          </Link>
          <div className="o-productcard_info">
            <div className="o-productcard_heading">
              <div className="o-productcard_lead">
                <Link href={productLink}>
                  <div>{props.name}</div>
                </Link>
                <div className="o-productcard_price">
                  <img height="18" src={iconICX} />
                  {props.price}
                </div>
              </div>
            </div>
            <span>
              <FontAwesomeIcon icon={faMapSigns} color="#0c090a59" size="1x" /> {props.location || 'Location'}
            </span>
            <span>
              <FontAwesomeIcon icon={faBuilding} color="#0c090a59" size="1x" /> {props.organizer || 'Organizer'}
            </span>
            <div className="o-productcard_buynow">
              {props.status === 'created' ? (
                <Button>Public</Button>
              ) : props.status === 'available' ? (
                <Button>Resell</Button>
              ) : props.status === 'view' ? (
                <Button>View</Button>
              ) : props.status === 'expired' ? (
                <Button>Resell</Button>
              ) : (
                <Link href={productLink}>
                  <Button>Detail</Button>
                </Link>
              )}
            </div>
          </div>
          <Tooltip />
        </>
      )}
    </article>
  );
};

const ProductPreview: React.FC<ProductProps> = props => {
  return (
    <>
      <div className="o-productcard_media">
        {(props.imageUrl && <Image src={props.imageUrl} alt={props.alt} />) || (
          <Text size="14" modifiers="lightgray">
            Event Review
          </Text>
        )}
      </div>
      <div className="o-productcard_info">
        <div className="o-productcard_heading">
          <div className="o-productcard_lead">
            <Link href="">
              <div>{props.name}</div>
            </Link>
            <div className="o-productcard_price">
              <img height="18" src={iconICX} />
              {props.price}
            </div>
          </div>
        </div>
        <div>at {props.location || 'Location'}</div>
        <div>by {props.organizer || 'Organizer'}</div>
      </div>
    </>
  );
};

export default hot(Productcard);
