'use strict'

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed 
var $ = require('string');
var req = request('https://www.voyagespirates.fr/feed')

const nodemailer = require('nodemailer');
const fs = require('fs');
const jsonfile = require('jsonfile');

var feedparser = new FeedParser();
var fileName = './links.json';
var file = require(fileName);

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cyril.tupinier@gmail.com',
        pass: 'Thierry3210'
    }
});


// setup email data with unicode symbols
let mailOptions = {
    from: 'cyril.tupinier@gmail.com', // sender address
    to: 'cyril.tupinier@yahoo.fr', // list of receivers
    subject: 'ERREUR DE PRIX - VOYAGE PIRATES', // Subject line
};

req.on('error', function (error) {
  // handle any request errors 
});

req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream 

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});

feedparser.on('error', function (error) {
  // always handle errors 
});

feedparser.on('readable', function () {
  // This is where the action is! 
  var stream = this; // `this` is `feedparser`, which is a stream 
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance 
  var item;
	
console.log("Execute script treatment")

  while (item = stream.read()) {
    if ($(item.title).include('ERREUR DE PRIX')) {
	
	console.log(item.url);
	if (!file.url.includes(item.link)) {
		file.url.push(item.link);
		console.log(file.url);

		fs.writeFile(fileName, JSON.stringify(file), function (err) {
  			if (err) return console.log(err);
			  console.log(JSON.stringify(file));
			  console.log('writing to ' + fileName);
		});
	}

  /*      mailOptions.html = "<b>"+item.title+"<b> <br/> <a href="+item.link+"> Lien </a>";
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
*/	

  }}
});
