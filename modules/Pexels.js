var fetch = require('node-fetch');
const api_key = "563492ad6f91700001000001c26f1dd1c63c47639f43dceaab7669db"
var BASE_URL = "https://api.pexels.com/";
var DIRECTORY = {
    SEARCH_URL: BASE_URL + "v1/search",
    POPULAR_URL: BASE_URL + "v1/popular",
    CURATED_URL: BASE_URL + "v1/curated",
    VIDEO_SEARCH_URL: BASE_URL + "videos/search",
    POPULAR_VIDEO_URL: BASE_URL + "videos/popular",
    PHOTO_URL: BASE_URL + "v1/photos/"
};

/**
 * Pexels API wrapper which exposes Promise factories to interact with the Pexels API endpoints
 * @param {string} apiKey API Key provided by Pexels (Required)
 */
function PexelsApi() {
    var self = this;
    self.headers = {
        'Authorization': api_key
    };
}

/**
 * Prepare Pexels API request url and parameters
 * @param {string} directory
 * @param {string} query
 * @param {number} perPage
 * @param {number} page
 * @returns {string}
 */
function prepareUrl(directory, query, perPage, page) {
    var search = query ? "query=" + (query ? encodeURIComponent(query) : "") : "";
    return directory + "?" + search +
        "&per_page=" + (perPage && !isNaN(perPage) ? +perPage : 10) +
        "&page=" + (page && !isNaN(page) ? +page : 1);
}

/**
 * Send request to Pexels API and return response
 * @param {PexelsApi} self
 * @param {string} url
 * @returns {Promise}
 */
function request(self, url) {
    return fetch(url, {
        headers: self.headers
    })
        .then(function (res) {
            return res.json()
        })
        .then(body => Pexels(body))
        .catch(function (err) {
            return Promise.reject(err);
        });
}

/**
 * Mapper
 */
function Pexels(result) {
     const modified = [];

     result.photos.forEach(document => {
          modified.push({
               original_id : document.id.toString(),
               width : document.width,
               height : document.height,
               description : "No description",
               alt_description : "No description",
               from: 'pexels',
               tags: null,
               color : "",
               likes : 0,
               img :{
                    high : document.src.portrait,
                    low: document.src.large2x
               },
               user: {
                    id : "PexelsId",
                    name : document.photographer,
                    username: "",
                    twitter_username : "@pexels",
                    bio : "Free stock photos and videos from a global network of creators",
                    portfolio_url : document.photographer_url,
                    profile_image : "https://pbs.twimg.com/profile_images/1066802384330883072/Ce7rN_66_400x400.jpg",
                    instagram_username : "@pexels",
                    total_likes : 100,
                    total_photos : 150004
               }
          }) 
     });
     
     return {
          total_result: result.total_results,
          page: result.page,
          posts: modified
     }
}

/**
 * Promise factory to interact with Pexels Search API
 * @param {string} query Search term
 * @param {number} perPage Specifies the number of items per page (Defaults to 10)
 * @param {number} page Specifies the page being requested (Defaults to 1)
 * @returns {Promise}
 */
PexelsApi.prototype.search = function (query, perPage, page) {
    var url = prepareUrl(DIRECTORY.SEARCH_URL, query, perPage, page);
    return request(this, url);
};

/**
 * Promise factory to interact with Pexels Popular Photos API
 * @param {number} perPage Specifies the number of items per page (Defaults to 10)
 * @param {number} page Specifies the page being requested (Defaults to 1)
 * @returns {Promise}
 */
PexelsApi.prototype.getPopularPhotos = function (perPage, page) {
    var url = prepareUrl(DIRECTORY.POPULAR_URL, null, perPage, page);
    return request(this, url);
};

/**
 * Promise factory to interact with Pexels Curated Photos API
 * @param {number} perPage Specifies the number of items per page (Defaults to 10)
 * @param {number} page Specifies the page being requested (Defaults to 1)
 * @returns {Promise}
 */
PexelsApi.prototype.getCuratedPhotos = function (perPage, page) {
    var url = prepareUrl(DIRECTORY.CURATED_URL, null, perPage, page);
    return request(this, url);
};

/**
 * Promise factory to interact with Pexels Videos API
 * @param {string} query Search term
 * @param {number} perPage Specifies the number of items per page (Defaults to 10)
 * @param {number} page Specifies the page being requested (Defaults to 1)
 * @returns {Promise}
 */
PexelsApi.prototype.searchVideos = function (query, perPage, page) {
    var url = prepareUrl(DIRECTORY.VIDEO_SEARCH_URL, query, perPage, page);
    return request(this, url);
};

/**
 * Promise factory to interact with Pexels Popular Videos API
 * @param {number} perPage Specifies the number of items per page (Defaults to 10)
 * @param {number} page Specifies the page being requested (Defaults to 1)
 * @returns {Promise}
 */
PexelsApi.prototype.getPopularVideos = function (perPage, page) {
    var url = prepareUrl(DIRECTORY.POPULAR_VIDEO_URL, null, perPage, page);
    return request(this, url);
};

/**
 * Promise factory to interact with Pexels API to request a specific photo by ID
 * @param {number} id
 * @returns {Promise}
 */
PexelsApi.prototype.getPhoto = function (id) {
    var url = DIRECTORY.PHOTO_URL + id;
    return request(this, url);
};

module.exports = PexelsApi;
