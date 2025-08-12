"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalConfig {
  [key: string]: unknown;
}

interface ModalContextType {
  isOpen: boolean;
  content: ReactNode | null;
  context: ModalConfig | null;
  openModal: (content: ReactNode, context?: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [context, setContext] = useState<ModalConfig | null>(null);

  const openModal = (newContent: ReactNode, newContext?: ModalConfig) => {
    setContent(newContent);
    setContext(newContext || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
    setContext(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        content,
        context,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
