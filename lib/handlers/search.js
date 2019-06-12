const sortOptions = require('../config/sort');
const responseParser = require('../responseParser');
const api = require('../api');

module.exports = async (request, h) => {
  await api.confirmSessionToken(request.yar);
  if (Object.keys(request.query).length === 0) {
    return h.redirect('/');
  }
  const response = await api.search(request.query);

  if (!response.response) {
    return h.redirect('/');
  }

  const selectedSort = sortOptions.find(s => request.query.s.startsWith(s.id)).id;

  const { numFound, docs } = responseParser.parse(response.response);
  return h.view('search', {
    query: request.query,
    title: request.query.q + ' | Search',
    timing: response.debug.timing.time,
    page: 'search',
    sortOptions,
    selectedSort,
    selectedSortDir: request.query.s.split(' ')[1],
    numFound,
    docs
  });
}
