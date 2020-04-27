const express = require('express')
const app = express()

const port = process.env.PORT || 1337

const unsplash = require('./modules/unsplash');
const pixabay = require('./modules/pixabay');

//   Pixabay

app.get('/api/v1/pixabay/:page', (req, res) => {
     let page = req.params.page;
     let category = req.query.category;
     let color = req.query.color;

     pixabay.fetchPixabay({page : page,category : category,color : color})
          .then(result => res.status(200).send({
               page : page,
               posts : result
          }))
          .catch(e => console.log(e))
});

//  Unsplash
app.get('/api/v1/unsplash/photos/', (req, res) => {
     let page = req.query.page || 1

     unsplash.fetchPopularPhotos(page)
          .then(body => {
               res.send({
                    current_page : page,
                    posts: body
               })
          })
          .catch(e => res.status(404).send(e))
});

app.get('/api/v1/unsplash/collections', (req, res) => {
     let page = req.query.page || 1;

     unsplash.getAllCollections(page)
          .then(result => {
               res.send(result);
          }).catch(e => res.send(e));
});



app.get('/api/v1/search', (req, res) => {
     const query = req.query.q;

     pixabay.search(query)
     .then(result => res.send(result))
     .catch(e => res.status(404).send(e))
});


app.get('*', (req, res) => {
     res.status(404).send({
          message: "Get the fuck out of here"
     });
});


app.listen(port, () => {
     console.log(`Server started on port ${port}`);
});