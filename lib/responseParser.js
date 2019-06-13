
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

      let parsedDate = function (d) {
         parsedDateArray = d.pubdate.split('-', 2);
         const monthNames = ["January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December"];
         month = monthNames[parseInt(parsedDateArray[1]-1,10)] || '';
         parsedDate = month.concat(' ').concat(parsedDateArray[0]);
         return parsedDate;
      };

      const decodedAbstract = HTMLDecoder.decode(d.abstract) || 'No abstract.';

      let sources = function (d) {
        const names = {
          'PUB_PDF': 'Publisher PDF',
          'EPRINT_PDF': 'arXiv PDF',
          'AUTHOR_PDF': 'Author-provided PDF',
          'ADS_PDF': 'ADS scanned PDF',
          'PUB_HTML': 'Publisher HTML',
          'EPRINT_HTML': 'arXiv page',
          'AUTHOR_HTML': 'Author-provided page',
          'ADS_SCAN': 'ADS scanned image',
          'GIF': 'ADS scanned image',
          'PREPRINT': 'arXiv page',
          'EJOURNAL': 'Publisher HTML'
        };
        if (d.esources) {
            let s = [];
            let parsedSources = d.esources.map(e => {
                s.push({name: names[e], type: e});
                return s
            });
            return parsedSources[0]
        } else {
          let parsedSources = [];
          return parsedSources
        }
      };

      // MathJax.typeset({
      //   math: decodedAbstract || '',
      //   format: 'TeX'
      // }, (data) => {
      //   console.log('datea', data);
      // });
      const parsedSources = sources(d);

      return {
        ...d,
        pubdate: parsedDate(d),
        abstract: decodedAbstract,
        title: HTMLDecoder.decode(d.title[0]),
        sources: parsedSources
      };
    });

    return {
      numFound,
      docs: parsedDocs
    };
  }
};
