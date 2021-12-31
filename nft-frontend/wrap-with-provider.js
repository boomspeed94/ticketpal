import './src/app.scss';
import React from 'react';
import { PageProvider as Provider } from './src/components/templates/pageProvider/index';
// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
  return <Provider>{element}</Provider>;
};
