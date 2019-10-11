import { NavigationActions } from 'react-navigation';


// Navigation utils


let _navigator;
export const setTopLevelNavigator = navigatorRef => {
  _navigator = navigatorRef;
};

export const getCurrentRoute = () => {
  if (_navigator) {
    let navIterator = _navigator.state.nav;
    while (navIterator.index != null) {
      navIterator = navIterator.routes[navIterator.index];
    }
    return navIterator;
  }
  return undefined;
};

export const getCurrentRouteName = () => {
  const route = getCurrentRoute();
  return route ? route.routeName : null;
};

export const getCurrentRouteKey = () => {
  const route = getCurrentRoute();
  return route ? route.key : null;
};

export const navigate = (routeName, params, key) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      key
    })
  );
};

export default {
  setTopLevelNavigator,
  navigate,
  getCurrentRoute,
  getCurrentRouteKey,
  getCurrentRouteName
};

//
// Own navigation actions
//

export const navigateToConversation = (recipient, lastMessage) => {
  navigate(
    'Conversation',
    { recipient, lastMessage },
    recipient._id // key screen
  );
};

export const navigateToImageViewer = (images = []) => {
  if (images.length < 1) {
    return;
  }

  navigate('ImageViewer', { images });
};
