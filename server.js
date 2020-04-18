const express = require('express')
const app = express()

const port = process.env.PORT || 1337

const unsplash = require('./modules/unsplash');
const pixabay = require('./modules/pixabay');

//   Pixabay

app.get('/api/pixabay/:page', (req, res) => {
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
app.get('/api/unsplash/:page', (req, res) => {
     let page = req.params.page;

     unsplash(req.params.page)
          .then(body => {
               res.send({
                    current_page : page,
                    posts: body
               })
          })
          .catch(e => res.status(404).send(e))
});

app.get('/api/search', (req, res) => {
     const query = req.query.q;

     
     pixabay.search(query)
     .then(result => res.send(result))
     .catch(e => res.status(404).send(e))
});


app.listen(port, () => {
     console.log(`Server started on port ${port}`);
});