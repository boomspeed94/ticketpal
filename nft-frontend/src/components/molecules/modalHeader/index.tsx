import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Heading } from 'components/molecules/heading';
import { Button } from 'components/atoms/button';
import { Icon } from 'components/atoms/icon';

type Modifier = 'closeonly';

interface Props {
  modifiers?: Modifier | Modifier[];
  title: string;
  handleClose?: () => void;
  cannotClose: boolean;
}

export const ModalHeader: React.FC<Props> = props => {
  return (
    <div className={mapModifiers('m-modalheader', props.modifiers)}>
      {/* {props.title && <Heading>{props.title}</Heading>} */}
      <Heading>{props.title}</Heading>
      {!props.cannotClose && (
        <Button modifiers={['icon']} handleClick={props.handleClose}>
          <Icon iconName="close-modal" />
        </Button>
      )}
    </div>
  );
};

export default hot(ModalHeader);
