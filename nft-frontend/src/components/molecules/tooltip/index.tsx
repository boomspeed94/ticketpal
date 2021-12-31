import React from 'react';
import { hot } from 'react-hot-loader/root';
import ReactTooltip, { TooltipProps } from 'react-tooltip';
import { mapModifiers } from 'lib/component';

export const Tooltip: React.FC<TooltipProps> = props => {
  return (
    <div className={mapModifiers('m-tooltip', !props.children && 'boxshadow')}>
      <ReactTooltip {...props} type="light" delayShow={props.delayShow || 200} effect="solid">
        {props.children}
      </ReactTooltip>
    </div>
  );
};

export default hot(Tooltip);
