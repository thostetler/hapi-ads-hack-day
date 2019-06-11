const axios = require('axios');

module.exports = {
  search: async function (params) {
    try {
      const response = await axios.get('https://devapi.adsabs.harvard.edu/v1/search/query', {
        headers: {
          Authorization: 'Bearer:hVcXTmois719BIFI00oqQ3j4pczrHpD8JI5b9yfM'
        },
        params: {
          ...params,
          fl: 'title,abstract,bibcode,author,keyword,id,links_data,property,esources,data,citation_count,[citations],pub,aff,email,volume,pubdate,doi,doctype,identifier'
        }
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};
