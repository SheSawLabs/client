"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BottomSheetConfig {
  defaultHeight?: string;
  minHeight?: string;
  maxHeight?: string;
}

interface BottomSheetContextType {
  isOpen: boolean;
  content: ReactNode | null;
  config: BottomSheetConfig;
  openBottomSheet: (content: ReactNode, config?: BottomSheetConfig) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [config, setConfig] = useState<BottomSheetConfig>({
    defaultHeight: "40%",
    minHeight: "15%",
    maxHeight: "90%",
  });

  const openBottomSheet = (
    newContent: ReactNode,
    newConfig?: BottomSheetConfig,
  ) => {
    setContent(newContent);
    setConfig({
      defaultHeight: "30%",
      minHeight: "15%",
      maxHeight: "90%",
      ...newConfig,
    });
    setIsOpen(true);
  };

  const closeBottomSheet = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        isOpen,
        content,
        config,
        openBottomSheet,
        closeBottomSheet,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};
