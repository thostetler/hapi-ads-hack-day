
// const MathJax = require('mathjax-node');
const HTMLEntities = require('html-entities').AllHtmlEntities;
const HTMLDecoder = new HTMLEntities();
// MathJax.config({
//   fontURL: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/fonts/HTML-CSS',
//   MathJax: {
//     messageStyle: 'none',
//     HTML: ["input/TeX", "output/HTML-CSS"],
//     TeX: {
//       extensions: ["AMSmath.js", "AMSsymbols.js"],
//       equationNumbers: { autoNumber: "AMS" }
//     },
//     extensions: ["tex2jax.js"],
//     jax: ["input/TeX", "output/HTML-CSS"],
//     tex2jax: {
//       inlineMath: [
//         ['$', '$'],
//         ["\\(", "\\)"]
//       ],
//       displayMath: [
//         ['$$', '$$'],
//         ["\\[", "\\]"]
//       ],
//       processEscapes: true
//     },
//     "HTML-CSS": {
//       availableFonts: ["TeX"],
//       linebreaks: { automatic: true }
//     }
//   }
// });
// MathJax.start();

module.exports = {
  parse: function ({ numFound, docs }) {
    const parsedDocs = docs.map(d => {

      return {
        ...d,
        pubdate: d.pubdate.split('-', 2).join('/'),
        author: d.author && d.author.slice(0, 9).join('; '),
        title: HTMLDecoder.decode(d.title[0])
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

      const decodedAbstract = HTMLDecoder.decode(d.abstract);

      // MathJax.typeset({
      //   math: decodedAbstract || '',
      //   format: 'TeX'
      // }, (data) => {
      //   console.log('datea', data);
      // });

      return {
        ...d,
        pubdate: parsed_date(d),
        author: d.author.slice(0, 9).join('; '),
        abstract: decodedAbstract,
        title: HTMLDecoder.decode(d.title[0])
      };
    });

    return {
      numFound,
      docs: parsedDocs
    };
  }
};
