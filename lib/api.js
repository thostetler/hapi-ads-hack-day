const axios = require('axios');
let session = {};

module.exports = {
  search: async function (params) {
    try {
      const { q, s } = params;

      const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/search/query', {
        headers: {
          Authorization: `Bearer:${ session.get('tokenData').access_token }`
        },
        params: {
          q: q,
          sort: s + ', bibcode desc',
          rows: 100,
          debug: 'timing',
          fl: 'title,abstract,bibcode,author,keyword,id,citation_count,pubdate'
        }
      });
      return response.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  abstractSearch: async function (params) {
    try {
      const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/search/query', {
        headers: {
          Authorization: `Bearer:${ session.get('tokenData').access_token }`
        },
        params: {
          q: 'identifier:'+params,
          fl: 'title,bibcode,author,id,pubdate,abstract,keyword,pub_raw,citation_count,esources'
        }
      });
      return response.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  exportSearch: async function (params) {
    let headers = {headers: {Authorization: `Bearer:${ session.get('tokenData').access_token }`}};
    let data = {bibcode: Array(params)};
    try {
      const response = await axios.post('https://devapi.adsabs.harvard.edu/v1/export/bibtex', data, headers);
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
      }
    },
  confirmSessionToken: async function (yar) {
    session = yar;
    const token = yar.get('tokenData');
    if (token && token.access_token && token.expire_in) {
      return true;
    }

    const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/accounts/bootstrap', {
      headers: {
        Authorization: ''
      }
    });
    const { access_token, expire_in } = response.data;

    console.log('REDEFINING TOKEN', access_token);
    yar.set('tokenData', { access_token, expire_in });
  }
};
