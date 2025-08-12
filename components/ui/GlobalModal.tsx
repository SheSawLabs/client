"use client";

import React from "react";
import { useModal } from "@/components/providers/ModalProvider";
import { X } from "lucide-react";

export const GlobalModal: React.FC = () => {
  const { isOpen, content, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white rounded-3xl flex flex-col">
      {/* 헤더 - X 버튼 */}
      <div className="flex justify-end p-6 pb-0">
        <button
          onClick={closeModal}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-6 pb-6 overflow-y-auto flex-1 break-words">
        {content}
      </div>
    </div>
  );
};
