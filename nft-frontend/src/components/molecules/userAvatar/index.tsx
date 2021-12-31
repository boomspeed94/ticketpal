import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Image, ImageProps } from 'components/atoms/image';
import { Icon } from 'components/atoms/icon';
import avatar from 'assets/images/avatar.png';

type Modifier = 'small' | 'mid';

interface Props extends Omit<ImageProps, 'modifiers'> {
  modifiers?: Modifier | Modifier[];
  hasTick?: boolean;
}

export const UserAvatar: React.FC<Props> = props => {
  return (
    <div className={mapModifiers('m-useravatar', props.modifiers)}>
      <Image src={props.src || avatar} alt={props.alt} modifiers="small" />
      {props.hasTick && (
        <i className="m-useravatar_icon">
          <Icon iconName="tick" />
        </i>
      )}
    </div>
  );
};

export default hot(UserAvatar);
