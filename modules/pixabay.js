const fetch = require('node-fetch');
const Bluebird = require('bluebird');

const API_KEY = '15160981-07361fc839d99c9b73ae6ddcf'
fetch.Promise = Bluebird;

const url = `https://pixabay.com/api?key=${API_KEY}`

const fetchPixabay = (options) => { 
     return new Promise((resolve,reject) => {
          console.log(createUrl(options));
          
          fetch(createUrl(options))
               .then(res =>  res.json())
               .then(body => {
                    const result = [];

                    body.hits.forEach(element => {
                         result.push(Pixa(element))
                    });

                    resolve(result)
               }).catch(e => reject(e))
     })
}

const search = (query) => {
     return new Promise((resolve,reject) => {
          
          let _url = `${url}&q=${query}`

          fetch(_url).then(res =>  res.json())
                    .then(body => {
                         
                         
                         const result = []

                         body.hits.forEach(document => {
                              result.push(Pixa(document))
                         });

                         resolve(result)

                    }).catch(e => reject(e));
     })
}

function createUrl(options){
     if(!options.category && !options.color){
          return `${url}&page=${options.page}`
     }else if(!options.category && options.color){
          return `${url}&page=${options.page}&color=${options.color}`
     }else if(options.category && !options.color){
          return `${url}&page=${options.page}&category=${options.category}`
     }

     return `${url}&page=${options.page}&category=${options.category}&color=${options.color}`
}

const Pixa = (element) => {
     let tags = element.tags.split(',');

     return {
          original_id : element.id,
          width : element.imageWidth,
          height : element.imageHeight,
               description : "No description",
               alt_description : null,
               from: 'pixabay',
               tags: tags,
               color : null,
               likes : element.likes,
               img :{
                    high : element.largeImageURL,
                    low: element.webformatURL
               }

     }
}

module.exports = {
     fetchPixabay,
     search
}