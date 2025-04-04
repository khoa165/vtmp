import React, { useContext } from 'react';

import { TextColor, useTextColor } from './text-color-context';

export const ChangingColorText = () => {
  const retrievedContext = useTextColor();

  const textColor = retrievedContext.textColor;

  return (
    <div style={{ color: textColor === TextColor.BLACK ? 'black' : 'red' }}>
      Color should be changed
    </div>
  );
};
