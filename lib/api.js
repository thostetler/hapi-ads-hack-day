const axios = require('axios');

module.exports = {
  search: async function (params) {
    try {
      const { q, s } = params;

      const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/search/query', {
        headers: {
          Authorization: 'Bearer:wdr84sxQ58asoe4AGRiaHubqcvNOflApsW3Pn220'
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
          Authorization: 'Bearer:wdr84sxQ58asoe4AGRiaHubqcvNOflApsW3Pn220'
        },
        params: {
          q: 'identifier:'+params,
          fl: 'title,bibcode,author,id,pubdate,abstract,keyword,pub_raw,citation_count'
        }
      });

      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  exportSearch: async function (params) {
    let headers = {headers: {Authorization: 'Bearer:hVcXTmois719BIFI00oqQ3j4pczrHpD8JI5b9yfM'}};
    let data = {bibcode: Array(params)};
    try {
      const response = await axios.post('https://devapi.adsabs.harvard.edu/v1/export/bibtex', data, headers);
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
      }
    },
  sourceSearch: async function (params) {
    try {
      const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/resolver/' + params + '/esource', {
        headers: {
          Authorization: 'Bearer:wdr84sxQ58asoe4AGRiaHubqcvNOflApsW3Pn220'
        }});
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
      }
  },
  exportSearch: async function (params) {
    let headers = {headers: {Authorization: 'Bearer:hVcXTmois719BIFI00oqQ3j4pczrHpD8JI5b9yfM'}};
    let data = {bibcode: Array(params)};
    try {
      const response = await axios.post('https://devapi.adsabs.harvard.edu/v1/export/bibtex', data, headers);
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
      }
    }
};
