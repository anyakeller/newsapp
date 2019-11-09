var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
var db = require('./models');

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Connect to the Mongo DB
var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

// Routes
app.get('/', function(req, res) {});

// scrape articles into db
app.get('/scrape', function(req, res) {
  axios.get('https://www.nytimes.com').then(function(response) {
    var $ = cheerio.load(response.data);
    var results = [];
    $('article').each(function(i, element) {
      var result = {};
      result.title = $(element)
        .children()
        .text();
      result.link =
        'https://www.nytimes.com' +
        $(element)
          .find('a')
          .attr('href');

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      results.push(result);
      console.log(result);
    });
    //res.json(results);
    res.send('Scrape Complete');
  });
});
//clear db
app.get('/cleareverything', function(req, res) {
  console.log(db.Article.remove({}).exec());
  console.log(db.Comment.remove({}).exec());
  console.log('halp');
  res.send('yeah');
});

app.post('/api/savedarticles', function(req, res) {
  var result = {};
  result.title = req.body.title;
  result.link = req.body.link;
  // Create a new Article using the `result` object built from scraping
  db.Article.create(result)
    .then(function(dbArticle) {
      console.log(dbArticle);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get('/articles/:id', function(req, res) {
  db.Article.find({_id: req.params.id}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

app.get('/articles', function(req, res) {
  db.Article.find({}).populate("comment").exec( function(err, data) {
    if (err) {
      console.log(err);
    } else {
      // Otherwise, send the result of this query to the browser
      res.json(data);
    }
  });
});

app.get('/comment/:id', function(req, res) {
  db.Comment.find({_id: req.params.id}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});


app.post('/comment/:id', function(req, res) {
  db.Comment.create({comment: req.body.comment}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      db.Article.update({_id: req.params.id},{$push: {comment:data._id}}, function(err, articledata) {
        if (err) console.log(err);
        else {
					res.send(data._id);
					//res.json(data);
        }
      });
    }
  });
});

app.get('/comment', function(req, res) {
  db.Comment.find({}, function(err, data) {
    if (err) console.log(err);
    else res.json(data);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log('App running on port ' + PORT + '!');
});
