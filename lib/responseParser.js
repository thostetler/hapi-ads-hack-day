module.exports = {
  parse: function ({ numFound, docs }) {
    const parsedDocs = docs.map(d => {

      return d;
    });

    return {
      numFound,
      docs: parsedDocs
    };
  }
}
