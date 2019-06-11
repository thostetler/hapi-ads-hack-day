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
          sort: 'date desc',
          fl: 'title,abstract,bibcode,author,keyword,id,citation_count,pubdate'
        }
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};
