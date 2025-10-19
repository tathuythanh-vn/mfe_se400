import React from 'react';

interface SafeComponentProps {
  children: React.ReactNode;
}

interface SafeComponentState {
  hasError: boolean;
}

export default class SafeComponent extends React.Component<
  SafeComponentProps,
  SafeComponentState
> {
  constructor(props: SafeComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SafeComponentState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {}

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
