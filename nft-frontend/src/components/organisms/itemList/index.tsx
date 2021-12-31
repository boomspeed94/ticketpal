import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Productcard, ProductProps } from 'components/organisms/productCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'components/atoms/spinner';
import { Text } from 'components/atoms/text';
import { Icon } from 'components/atoms/icon';
import { Button } from 'components/atoms/button';

interface Props {
  list: ProductProps[];
  next: () => void;
  next_cursor?: string;
  searchBy?: string;
  isLoading: boolean;
  type: any;
}

export const ItemList: React.FC<Props> = props => {
  const [isShowMore, setIsShowMore] = useState(false);

  useEffect(() => setIsShowMore(false), [props.searchBy]);

  return (
    <div className="o-itemlist">
      {props.isLoading ? (
        <Spinner modifiers="big" />
      ) : (
        <>
          <InfiniteScroll
            dataLength={props.list.length}
            hasMore={isShowMore && !!props.next_cursor}
            next={props.next}
            loader={<Spinner modifiers="big" />}
          >
            {props.list.length ? (
              <div className="o-itemlist_wrapper">
                {props.list.map((item, idx) => (
                  <div key={idx} className="o-itemlist_item">
                    <Productcard type={props.type} {...(item as ProductProps)}></Productcard>
                  </div>
                ))}
              </div>
            ) : (
              <div className="o-itemlist_noresult">
                <Icon iconName="search-not-found" />
                <Text size="28" modifiers={['darkPink']}>
                  Oops!
                </Text>
                <Text size="24" modifiers={['darkPink']}>
                  No matching search results for: {props.searchBy}.
                </Text>
              </div>
            )}
          </InfiniteScroll>
          {!isShowMore && props.next_cursor && <Button handleClick={() => setIsShowMore(true)}>Show more</Button>}
        </>
      )}
    </div>
  );
};

export default hot(ItemList);
