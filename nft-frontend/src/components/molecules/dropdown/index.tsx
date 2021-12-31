import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import ReactTooltip, { Offset } from 'react-tooltip';
import { Tooltip } from 'components/molecules/tooltip';

interface Props {
  trigger?: React.ReactNode;
  id?: string;
  offset?: Offset;
}

export const Dropdown: React.FC<Props> = props => {
  return (
    <div className="m-dropdown" onBlur={() => ReactTooltip.hide()}>
      <div className="m-dropdown_trigger" data-tip data-for={props.id} data-event="click">
        {props.trigger}
      </div>
      {props.children && (
        <Tooltip id={props.id} clickable={true} offset={props.offset || { left: 15 }} place="bottom" delayHide={200}>
          {props.children}
        </Tooltip>
      )}
    </div>
  );
};

export default hot(Dropdown);
