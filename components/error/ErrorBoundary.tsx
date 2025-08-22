"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // ChunkLoadError인 경우 자동으로 페이지 새로고침
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk") ||
      error.message.includes("ChunkLoadError")
    ) {
      console.warn("ChunkLoadError caught by ErrorBoundary, reloading page");
      window.location.reload();
      return;
    }

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // ChunkLoadError의 경우 즉시 새로고침 (이 코드는 실행되지 않을 것)
      if (
        this.state.error?.name === "ChunkLoadError" ||
        this.state.error?.message.includes("Loading chunk") ||
        this.state.error?.message.includes("ChunkLoadError")
      ) {
        return (
          <div className="flex flex-col items-center justify-center h-64 px-6">
            <div className="text-gray-500 mb-4">
              페이지를 새로고침하는 중...
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center h-64 px-6">
          <div className="text-red-500 mb-4 text-center">
            문제가 발생했습니다
          </div>
          <div className="text-gray-600 mb-6 text-sm text-center">
            {this.state.error?.message || "알 수 없는 오류가 발생했습니다"}
          </div>
          <div className="space-y-3 w-full max-w-xs">
            <Button onClick={this.handleRetry} size="wide">
              다시 시도
            </Button>
            <button
              onClick={this.handleReload}
              className="w-full text-gray-500 text-sm underline"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
