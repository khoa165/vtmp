import { createContext, useContext, useMemo, useState } from 'react';

export enum TextColor {
  BLACK = 'black',
  RED = 'red',
}

interface ITextColorContext {
  textColor: TextColor;
  setTextColor: (color: TextColor) => void;
}

const DefaultTextColorContext: ITextColorContext = {
  textColor: TextColor.BLACK,
  setTextColor: () => {},
};

export const TextColorContext = createContext<ITextColorContext>(
  DefaultTextColorContext
);

export const useTextColor = (): ITextColorContext => {
  const context = useContext(TextColorContext);
  if (!context) {
    throw new Error(
      'useTextColor must be used within a TextColorContextProvider'
    );
  }
  return context;
};

export const TextColorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [textColor, setTextColor] = useState(TextColor.BLACK);

  const contextValue = useMemo(() => {
    return { textColor, setTextColor };
  }, [textColor]);

  return (
    <TextColorContext.Provider value={contextValue}>
      {children}
    </TextColorContext.Provider>
  );
};
