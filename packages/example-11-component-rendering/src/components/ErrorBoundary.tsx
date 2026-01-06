import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
  label: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px solid #fca5a5",
            backgroundColor: "#fee2e2",
          }}
        >
          <strong style={{ display: "block", marginBottom: "0.35rem" }}>
            {this.props.label}에서 오류가 발생했습니다.
          </strong>
          <p style={{ marginTop: 0, marginBottom: "0.75rem", color: "#7f1d1d" }}>
            {this.state.error?.message ?? "예상치 못한 오류"}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            리셋
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
