const fetch = require('node-fetch');
const Bluebird = require('bluebird');

const API_KEY = '4WPvQuWCPTp2uJ8vliKRnASqFiIw4XJvaEWjM7Py2lM'
fetch.Promise = Bluebird;

const url = `https://api.unsplash.com/photos?client_id=${API_KEY}`

const fetchUnsplash = (page) => {
     return new Promise((resolve,reject) => {
          let url = createUrlWithPage(page)

          fetch(url).then(res =>  res.json())
                    .then(body => {
                         
                         const result = []

                         body.forEach(document => {
                              result.push(unsplash(document))
                         });
                         resolve(result)

                    }).catch(e => reject(e));
     })
}

const unsplash = (document) => {
     return {
          original_id : document.id,
          width : document.width,
          height : document.height,
          description : document.description,
          alt_description : document.alt_description,
          from: 'unsplash',
          tags: null,
          color : document.color,
          likes : document.likes,
          img :{
               high : document.urls.full,
               low: document.urls.regular
          }
     }
}

function createUrlWithPage(page){
     return `${url}&page=${page}`
}

module.exports = fetchUnsplash
