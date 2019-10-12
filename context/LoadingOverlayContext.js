import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import LoadingOverlay from '../components/Loading/LoadingOverlay';

export const LoadingOverlayContext = React.createContext({});

export class LoadingOverlayProvider extends React.Component {
  componentDidMount() {
    if (this.props.displayRef) {
      this.props.displayRef(this.displayLoadingOverlay);
    }
  }

  displayLoadingOverlay = isVisible => {
    this.setState({ isVisibleLoadingOverlay: !!isVisible });
  };

  state = {
    isVisibleLoadingOverlay: false,
    displayLoadingOverlay: this.displayLoadingOverlay
  };

  render() {
    return (
      <LoadingOverlayContext.Provider value={this.state}>
        <LoadingOverlay isVisible={this.state.isVisibleLoadingOverlay} />
        {this.props.children}
      </LoadingOverlayContext.Provider>
    );
  }
}

export function connectLoadingOverlay(WrappedComponent) {
  const ConnectedLoadingOverlay = (props, context) => (
    <LoadingOverlayContext.Consumer>
      {context => <WrappedComponent {...context} {...props} />}
    </LoadingOverlayContext.Consumer>
  );

  return hoistStatics(ConnectedLoadingOverlay, WrappedComponent);
}
