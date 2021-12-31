import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { StepIcon } from 'components/molecules/stepItem';

export type IconName =
  | StepIcon
  | 'arrow'
  | 'arrow-down'
  | 'bid'
  | 'close'
  | 'close-modal'
  | 'cross'
  | 'coin'
  | 'hambuger'
  | 'heart'
  | 'heart-active'
  | 'more'
  | 'search'
  | 'search-not-found'
  | 'share'
  | 'tick'
  | 'top1'
  | 'top2'
  | 'top3'
  | 'wallet';

interface Props {
  iconName: IconName;
}

export const Icon: React.FC<Props> = props => {
  return <span className={mapModifiers('a-icon', props.iconName)}>{props.children}</span>;
};

export default hot(Icon);
