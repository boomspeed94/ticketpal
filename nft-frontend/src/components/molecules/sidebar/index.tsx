import React from 'react';
import { hot } from 'react-hot-loader/root';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProductCategories } from 'components/pages/explore/form';
import { Link } from 'components/atoms/link';

export const navbarItems = ProductCategories.map((category, idx) => {
  return { path: '#', label: category };
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  close: () => void;
}

export const Sidebar: React.FC<Props> = props => {
  return (
    <div className="m-sidebar">
      <ul>
        {navbarItems.map(({ path, label }, idx) => (
          <li key={idx}>
            <Link href={`/search?category=${label}`}>{label}</Link>
          </li>
        ))}
      </ul>
      <div className="close-btn" onClick={props.close}>
        <FontAwesomeIcon icon={faTimes} size="2x" />
      </div>
    </div>
  );
};

export default hot(Sidebar);
