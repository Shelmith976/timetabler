import React from "react";

export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		// Report error to reporting service
		console.log({ error: error.message, info });
	}

	render() {
		if (this.state.hasError)
			return (
				<div className="py-16">
					<div className="bg-warning/40 my-16 text-error font-bold tracking-wide rounded-md mx-auto max-w-xl flex py-6 items-center justify-center flex-col p-4 text-da">
						<p className="text-center text-sm">
							An unexpected error has occurred that prevents the application
							from running. We are looking into the issue. Please go ahead and
							try refreshing the page
						</p>
					</div>
				</div>
			);

		return this.props.children;
	}
}
