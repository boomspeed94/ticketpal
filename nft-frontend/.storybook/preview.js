
import '../src/app.scss';
import './story.scss';
import { addParameters } from '@storybook/react';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

addParameters({
  viewport: {
    viewports: {
      smallmobile: {
        name: 'Small mobile',
        styles: {
          width: '375px',
          height: '667px',
        },
      },
      largemobile: {
        name: 'Large Mobile',
        styles: {
          width: '414px',
          height: '896px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '834px',
          height: '1112px',
        },
      },
    },
  },
});

