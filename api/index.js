import axios from 'axios';
import Config from './config';

let user = {};
export function setUserAPI(userFromStore) {
  user = userFromStore;
}

export default (async function API(method, query = {}, opts = {}) {
  const url = `${Config.apiHost}${method}`;

  const params = {
    ...query,
    ...(user.access_token &&
      !opts.withoutToken && {
        access_token: user.access_token
      })
  };

  return axios
    .post(url, params)
    .then(({ data }) => {
      if (data.stack) {
        console.log('API STACKTRACE:');
        console.log(data.debug.error);
        console.log('_________________');
      }

      if (data.error) {
        throw data.error;
      }

      console.log('API - request, method: ', method);
      return data.response;
    })
    .catch(error => {
      throw error;
    });
});
