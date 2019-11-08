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
mongoose.connect(MONGODB_URI);

// Routes
app.get("/",function(req,res){
})

app.get('/scrape', function(req, res) {
  axios.get('https://www.nytimes.com').then(function(response) {
    var $ = cheerio.load(response.data);
    var results = [];
    $('article').each(function(i, element) {
      var result = {};
      result.title = $(element)
        .children()
        .text();
      result.link = $(element)
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
		res.json(results);
		//res.send('Scrape Complete');
  });
});
app.get('/articles', function(req, res) {
  db.Article.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      // Otherwise, send the result of this query to the browser
      res.json(data);
    }
  });
});

// Start the server
app.listen(PORT, function() {
  console.log('App running on port ' + PORT + '!');
});
