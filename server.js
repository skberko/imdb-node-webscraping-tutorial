// https://scotch.io/tutorials/scraping-the-web-with-node-js

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  //All the web scraping magic will happen here
  url = 'http://www.imdb.com/title/tt1229340/';

  request(url, function (error, response, html){

    if(!error){
      var cheerioedHTML = cheerio.load(html);

      var title, release, rating;
      var json = { title : "", release : "", rating : "" }

      cheerioedHTML('h1[itemprop="name"]').filter(function () {
        var data = cheerioedHTML(this);
        title = data.clone().children().remove().end().text().trim();
        release = data.children().first().children().first().text();

        json.title = title;
        json.release = release;
      })

      cheerioedHTML('span[itemprop="ratingValue"]').filter(function () {
        var data = cheerioedHTML(this);
        rating = data.text();
        json.rating = rating;
      })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
      console.log('File successfully written! Look at project directory for output.json')
    })

    res.send('Check your console!')

  });

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
