module.exports = {
  parse: function ({ numFound, docs }) {
    const parsedDocs = docs.map(d => {

      return {
        ...d,
        author: []
      };
    });

    return {
      numFound,
      docs: parsedDocs
    };
  }
}
