module.exports = {
  parse: function ({ numFound, docs }) {
    const parsedDocs = docs.map(d => {

      return {
        ...d,
        pubdate: d.pubdate.split('-', 2).join('/'),
        author: d.author.slice(0, 9).join('; ')
      };
    });

    return {
      numFound,
      docs: parsedDocs
    };
  }
}
