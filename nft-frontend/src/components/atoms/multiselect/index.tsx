import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Multiselect } from 'multiselect-react-dropdown';
import { useFormikContext } from 'formik';
import { ref } from 'yup';

type Modifier = 'foo' | 'bar';
type Category = {
  id: number;
  name: string;
};

interface Props {
  modifiers?: Modifier | Modifier[];
  options: Category[];
  selectedValues?: Category[];
  onBlur: () => void;
  name: string;
}

export const MultiSelect: React.FC<Props> = ({ modifiers, options, selectedValues, name, onBlur }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const inputElement = document.querySelector('.a-multiselect input') as HTMLInputElement;
    inputElement.onblur = onBlur;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={mapModifiers('a-multiselect', modifiers)}>
      <Multiselect
        options={options}
        selectedValues={selectedValues}
        onSelect={(selectedList: Category[]) => {
          setFieldValue(name, selectedList);
        }}
        onRemove={(selectedList: Category[]) => {
          setFieldValue(name, selectedList);
        }}
        displayValue="name"
        // name={name}
        closeIcon="circle"
      />
    </div>
  );
};

export default hot(MultiSelect);
