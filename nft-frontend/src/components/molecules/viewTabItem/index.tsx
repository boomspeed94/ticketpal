import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { UserAvatar } from '../userAvatar';
import { Text } from 'components/atoms/text';

type Modifier = 'foo' | 'bar';

export interface ViewTabItemProps {
  modifiers?: Modifier | Modifier[];
  image: string;
  alt?: string;
  lead: React.ReactNode | string;
  from?: string;
  to?: string;
  additionInfo?: React.ReactNode;
  hasTick?: boolean;
}

export const ViewTabItem: React.FC<ViewTabItemProps> = props => {
  return (
    <div className={mapModifiers('m-viewtabitem', props.modifiers)}>
      <UserAvatar src={props.image} alt="" hasTick={props.hasTick} modifiers="mid" />
      <div className="m-viewtabitem_info">
        {typeof props.lead === 'string' ? (
          <Text size="14" modifiers={['bold', 'gray']}>
            {props.lead}
          </Text>
        ) : (
          props.lead
        )}
        {props.from && (
          <Text size="14" modifiers={['lightgray']}>
            {props.from && 'from'}{' '}
            <Text inline size="14" modifiers="bold">
              {props.from}
            </Text>
          </Text>
        )}
        {props.to && (
          <Text size="14" modifiers={['lightgray']}>
            {props.to && 'to'}{' '}
            <Text inline size="14" modifiers="bold">
              {props.to}
            </Text>
          </Text>
        )}
        {props.additionInfo}
      </div>
    </div>
  );
};

export default hot(ViewTabItem);
