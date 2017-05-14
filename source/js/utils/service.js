import queryString from 'query-string';
//import fetch from 'isomorphic-fetch';
import formData from 'form-urlencoded';

function handleResponse(promise, url, method) {
  return promise
    .then(res => res.json())
    .then(({ code, data, message }) => {
      if (code === 0) {
        return data;
      }

      console.log('network error', { code, message, url, method });

      throw Object({ code, message, url, method });
    });
}

function formatApiParams(api, params) {
  let newApi = api;
  const newParams = params;

  if (params) {
    Object.keys(params).forEach(key => {
      const r = new RegExp(`\{${key}\}`);

      if (r.test(api)) {
        newApi = newApi.replace(r, params[key]);
        delete newParams[key];
      }
    });
  }

  return {
    newApi,
    newParams
  };
}

export default {
  get(api, params) {
    const { newApi, newParams } = formatApiParams(api, params);

    const url = newParams
      ? `${newApi}?${queryString.stringify(newParams)}`
      : newApi;

    return handleResponse(
      fetch(url, {
        credentials: 'include'
      }),
      url,
      'get'
    );
  },

  post(api, params) {
    const { newApi, newParams } = formatApiParams(api, params);

    return handleResponse(
      fetch(newApi, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData(newParams),
      }),
      newApi,
      'post'
    );
  },

  put(api, params) {
    const { newApi, newParams } = formatApiParams(api, params);

    return handleResponse(
      fetch(newApi, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData(newParams),
      }),
      newApi,
      'put'
    );
  },

  delete(api, params) {
    const { newApi, newParams } = formatApiParams(api, params);

    const url = newParams
      ? `${newApi}?${queryString.stringify(newParams)}`
      : newApi;

    return handleResponse(
      fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData(newParams),
      }),
      newApi,
      'put'
    );
  },

  postImage(api, param) {
    const data = new FormData();
    data.append('file', param);
    return handleResponse(
      fetch(api, {
        method: 'POST',
        credentials: 'include',
        body: data,
      }),
      api,
      'post'
    );
  },

  genUrl(api, params) {
    return params ?
    `${api}?${queryString.stringify(params)}`
    : api;
  },
};
