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
  // Copies non-react specific statics from a child component to a parent
  // component. Similar to Object.assign
  // https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
  // {/*hoistNonReactStatics(targetComponent, sourceComponent);*/}
  return hoistStatics(ConnectedLoadingOverlay, WrappedComponent);
}

/*
*Static Methods Must Be Copied Over:
*When you apply a HOC to a component, though, the original component is wrapped
*with a container component. That means the new component does not have any
*of the static methods of the original component.
*/
