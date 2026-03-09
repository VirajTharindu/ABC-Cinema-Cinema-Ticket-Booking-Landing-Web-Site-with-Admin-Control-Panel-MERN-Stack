import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("3D Scene Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center p-20 bg-obsidian text-crimson font-mono text-center">
                    <div className="max-w-md border border-crimson/30 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Theater temporarily closed</h2>
                        <p className="text-gray-400">Our projectors encountered a technical glitch while loading the show. Please refresh or try again later.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-crimson text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                            Return to Lobby
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
