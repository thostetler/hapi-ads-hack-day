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
         const monthNames = ["January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December"];
         month = monthNames[parseInt(parsed_date_array[1]-1,10)];
         parsed_date = month.concat(' ').concat(parsed_date_array[0]);
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
};
