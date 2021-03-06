// https://www.codementor.io/@garethdwyer/building-a-crm-app-with-nodejs-repl-it-and-mongodb-119r72mczg
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http').Server(app);
const MongoClient = require('mongodb').MongoClient;
const mongo_username = process.env.MONGO_USERNAME
const mongo_password = process.env.MONGO_PASSWORD
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.7c2nb.mongodb.net/library?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let fs = require('fs');
const puppeteer = require('puppeteer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('pug', require('pug').__express);
app.set('views', '.');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
});

app.get('/create', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
});

app.post('/create', function (req, res, next) {
  client.connect(err => {
    const books = client.db("library").collection("books");
    let book = { title: req.body.title, author: req.body.author, pages: req.body.pages, read: req.body.read };
    books.insertOne(book, function(err, res) {
      if (err) throw err;
      console.log("1 book added");
    });
  });
  res.sendFile('/static/library.html', {root:'.'});
  // res.send('Book added');
});

app.get('/get', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
})

app.get('/get-book', function (req, res) {
  let myTitle = new RegExp(req.query.title, 'i');
  client.connect(err => {
    client.db('library').collection('books').findOne({title: myTitle}, function(err, result) {
      if (err) {throw err;}
      else if (result === null) {
        res.status(404).send('No such book found...');
      } 
      else {
        res.render('update', {oldtitle: result.title, oldauthor: result.author, oldpages: result.pages, oldread: result.read, title: result.title, author: result.author, pages: result.pages, read: result.read});
        }
    });
  });
});

app.post('/update', function(req, res) {
  client.connect(err => {
    if (err) throw err;
    let query = { title: req.body.oldtitle, author: req.body.oldauthor, pages: req.body.oldpages, read: req.body.oldread };
    let newvalues = { $set: {title: req.body.title, author: req.body.author, pages: req.body.pages, read: req.body.read } };
    client.db("library").collection("books").updateOne(query, newvalues, function(err, result) {
        if (err) throw err;
        console.log("1 book updated");
        // res.render('update', {message: 'Book updated!', oldtitle: req.body.title, oldauthor: req.body.author, oldpages: req.body.pages, oldread: req.body.read, title: req.body.title, author: req.body.author, pages: req.body.pages, read: req.body.read});
      });
  });
  res.sendFile('/static/library.html', {root:'.'});
});

app.get('/list-all',function(req, res){
  client.connect(err => {
    if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
    } 
    else {
      console.log('Connection established');  
      client.db('library').collection('books').find({}, {projection: { _id: 0 }}).toArray(function(err, myBooks) {
        if (err) throw err;
        fs.writeFile('static/books.json', JSON.stringify(myBooks), function(err) {
          if (err) throw err;
          console.log('file saved');
        });
      });
    }
  });
  res.sendFile('/static/library.html', {root:'.'});
});

app.post('/delete', function(req, res) {
  client.connect(err => {
    if (err) throw err;
    let query = { title: req.body.title, author: req.body.author ? req.body.author : null, pages: req.body.pages ? req.body.pages : null, read: req.body.read ? req.body.read : null };
    client.db("library").collection("books").deleteOne(query, function(err, obj) {
      if (err) throw err;
      console.log("1 book deleted");
      // res.send(`Book ${req.body.title} deleted`);
    });
  });
  res.sendFile('/static/library.html', {root:'.'});
});

app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
    console.log('listening on port', app.get('port'));
});