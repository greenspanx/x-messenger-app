import React from 'react';
import { View } from 'react-native';
import hoistStatics from 'hoist-non-react-statics';

import Modals from '../modalize';

export const ModalContext = React.createContext({
  toggleModal: () => {},
  modalName: 'MODAL_DEFAULT',
  isOpen: false
});

export class ModalizeProvider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      test: '',
      openModalize: this.openModalize,
      modalName: '',
      isOpen: false,
      payload: {}
    };
  }

  modal = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isOpen !== this.state.isOpen && this.modal.current) {
      setTimeout(() => {
        this.modal.current.open();
      }, 100);
    }
  }

  openModalize = (id, payload) => {
    if (!id) return;

    this.setState({
      modalName: id,
      isOpen: true,
      payload: payload || {}
    });
  };

  onClosed = () => {
    setTimeout(() => {
      this.setState({
        modalName: '',
        isOpen: false,
        payload: {}
      });
    }, 200);
  };

  renderModalize() {
    const { modalName, payload } = this.state;
    const CurrentModal = Modals[modalName];

    if (!CurrentModal) {
      return <View />;
    }

    return (
      <CurrentModal
        payload={payload}
        context={{
          ref: this.modal,
          onClosed: this.onClosed
        }}
      />
    );
  }

  render() {
    return (
      <ModalContext.Provider value={this.state}>
        {this.props.children}
        {this.renderModalize()}
      </ModalContext.Provider>
    );
  }
}

export function connectModalize(WrappedComponent) {
  const Connected = (props, context) => (
    <ModalContext.Consumer>
      {context => <WrappedComponent {...context} {...props} />}
    </ModalContext.Consumer>
  );

  return hoistStatics(Connected, WrappedComponent);
}
