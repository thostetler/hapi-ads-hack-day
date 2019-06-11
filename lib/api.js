const axios = require('axios');

module.exports = {
  search: async function (params) {
    try {
      const { q, s } = params;

      const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/search/query', {
        headers: {
          Authorization: 'Bearer:hVcXTmois719BIFI00oqQ3j4pczrHpD8JI5b9yfM'
        },
        params: {
          q: q,
          sort: s + ', bibcode desc',
          debug: 'timing',
          fl: 'title,abstract,bibcode,author,keyword,id,citation_count,pubdate'
        }
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  abstractSearch: async function (params) {
    try {
      const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/search/query', {
        headers: {
          Authorization: 'Bearer:hVcXTmois719BIFI00oqQ3j4pczrHpD8JI5b9yfM'
        },
        params: {
          q: 'identifier:'+params,
          fl: 'title,bibcode,author,id,pubdate,abstract,keyword,pub_raw'
        }
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};
