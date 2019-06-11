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
  },
  parseAbstract: function ({ numFound, docs }) {
    const parsedDocs = docs.map(d => {

      let parsed_date = function (d) {
         parsed_date_array = d.pubdate.split('-', 2);
         parsed_date = parsed_date_array.join('/');
         return parsed_date;
      }
      return {
        ...d,
        pubdate: parsed_date(d),
        author: d.author.slice(0, 9).join('; ')
      };
    });

    return {
      numFound,
      docs: parsedDocs
    };
  }
}
