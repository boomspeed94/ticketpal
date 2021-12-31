import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';

type Modifier =
  | 'lightbold'
  | 'bold'
  | 'lightgray'
  | 'gray'
  | 'blue'
  | 'lightblue'
  | 'active'
  | 'center'
  | 'error'
  | 'darkPink';

interface Props {
  modifiers?: Modifier | Modifier[];
  size?: '12' | '14' | '16' | '18' | '24' | '28';
  unit?: string;
  inline?: boolean;
}

export const Text: React.FC<Props> = props => {
  return props.inline ? (
    <span className={mapModifiers('a-text', props.modifiers, props.size)}>
      {props.children} {props.unit && <span className="a-text_unit">{props.unit}</span>}
    </span>
  ) : (
    <p className={mapModifiers('a-text', props.modifiers, props.size)}>
      {props.children} {props.unit && <span className="a-text_unit">{props.unit}</span>}
    </p>
  );
};

export default hot(Text);
