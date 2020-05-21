const fetch = require('node-fetch');
const Bluebird = require('bluebird');


const API_KEY = '4WPvQuWCPTp2uJ8vliKRnASqFiIw4XJvaEWjM7Py2lM'
fetch.Promise = Bluebird;

const base_url = `https://api.unsplash.com`

const fetchPhotos = (page,orderBy) => {
     return new Promise((resolve,reject) => {
          let url = `${createUrlWithPage(page)}&order_by=${orderBy}`
          console.log(url);
          fetch(url).then(res =>  res.json())
                    .then(body => {
                         
                         const result = [];

                         body.forEach(document => {
                              result.push(Unsplash(document))
                         });
                         resolve(result)

                    }).catch(e => reject(e));
     })
}

const getAllCollections = (page) => {
     return new Promise((resolve,reject) => {
          fetch(createCollectionsUrl(page))
               .then(res =>  res.json())
               .then(body => {
                    const result = [];

                    body.forEach(collection => {
                         console.log(Collection(collection));
     
                         result.push(Collection(collection))
                    });
                    
                    resolve(result)
               }).catch(e => reject(e))
     })
}

const getPhotosOfCollection = (id,page) => {
     
     return new Promise((resolve,reject) => {
          fetch(createPhotosByCollectionUrl(id,page))
               .then(res =>  res.json())
               .then(body => {
                    const result = [];
                    
                    body.forEach(document => {
                         result.push(Unsplash(document))
                    })

                    resolve(result)
               }).catch(e => reject(e))
     })
}

const Collection = (document) => {
     return { 
          id : document.id,
          title : document.title,
          description : document.description,
          curated: document.curated,
          featured: document.featured,
          total_photos : document.total_photos,
          shared_key : document.shared_key,
          links : {
               html : document.links.html,
               related : document.links.related
          },
          user : {
               id : document.user.id,
               name : document.user.name,
               username: document.user.username,
               twitter_username : document.user.twitter_username,
               bio : document.user.bio,
               portfolio_url : document.user.portfolio_url,
               profile_image : document.user.profile_image.large,
               instagram_username : document.user.instagram_username,
               total_likes : document.user.total_likes,
               total_photos : document.user.total_photos,
               total_collections: document.user.total_collections
          },
          preview_photos : document.preview_photos

     }
}

const Unsplash = (document) => {
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
          },
          user: {
               id : document.user.id,
               name : document.user.name,
               username: document.user.username,
               twitter_username : document.user.twitter_username,
               bio : document.user.bio,
               portfolio_url : document.user.portfolio_url,
               profile_image : document.user.profile_image.large,
               instagram_username : document.user.instagram_username,
               total_likes : document.user.total_likes,
               total_photos : document.user.total_photos
          }
     }
}

function createCollectionsUrl(page) {
     return `${base_url}/collections?client_id=${API_KEY}&page=${page}`
}

function createUrlWithPage(page){
     return `${base_url}/photos?client_id=${API_KEY}&page=${page}`
}

function createPhotosByCollectionUrl(id,page){
     return `${base_url}/collections/${id}/photos?client_id=${API_KEY}&page=${page}`
}

module.exports = {
     fetchPhotos,
     getAllCollections,
     getPhotosOfCollection
}
