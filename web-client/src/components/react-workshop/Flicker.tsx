import React, { ChangeEvent, useCallback } from 'react';
import { TextColor, useTextColor } from './text-color-context';

interface IProps {
  doFlicker: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Flicker: () => React.JSX.Element = () => {
  const { setTextColor } = useTextColor();

  const updateColorWithCache = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTextColor(e.target.checked ? TextColor.RED : TextColor.BLACK);
    },
    [setTextColor]
  );

  console.log('My name is Flicker and I am rendered.');
  return (
    <label>
      <input type="checkbox" onChange={updateColorWithCache} />
      Update text
    </label>
  );
};

export const MemoizedFlicker = React.memo(Flicker);
