module.exports = {
  parse: function ({ numFound, docs }) {
    const parsedDocs = docs.map(d => {

      return {
        ...d,
        author: [],
        pubdate: d.pubdate.split("-",2).join("/")
      };
    });

    return {
      numFound,
      docs: parsedDocs
    };
  }
}
