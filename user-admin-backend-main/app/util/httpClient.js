// eslint-disable-next-line import/no-unresolved
import rp from 'request-promise';

// eslint-disable-next-line no-unused-vars
function handleSuccess (response) {
  return response;
}

// eslint-disable-next-line no-unused-vars
function handleError (error) {
  throw new Error(error);
}

export const get = (url, options = {}) => {
  const requestOptions = {
    ...options,
    method: 'GET',
    uri: `${url}`
  };
  return rp(Object.assign(requestOptions, options));
};

export const post = (url, data, options = {}) => {
  console.log({ url });
  console.log('DATA: ', data);
  const requestOptions = {
    method: 'POST',
    uri: `${url}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: data,
    json: true,
    ...options
  };

  return rp(requestOptions);
};
