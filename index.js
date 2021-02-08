// https://www.codementor.io/@garethdwyer/building-a-crm-app-with-nodejs-repl-it-and-mongodb-119r72mczg
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http').Server(app);
const mongoose = require('mongoose');
let myBooks=[];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('pug', require('pug').__express);
app.set('views', '.');
app.set('view engine', 'pug');
mongoose.Promise = global.Promise;

app.get('/', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
});
app.use(express.static(__dirname + '/static'));

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
  res.send('Book added');
});

app.get('/list-all', function(req, res) {
    var db = client.db("library");
    let collection = collection('books');
    collection.find({},{},function(e,docs){
        res.render('bookslist', {
            "bookslist" : docs
        });
    });
});

app.get('/get', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
})

app.get('/get-book', function (req, res) {
  let myTitle = new RegExp(req.query.title, 'i');
  client.connect(err => {
    client.db('library').collection('books').findOne({title: myTitle}, function(err, result) {
      if (err) throw err;
      res.render('update', {oldtitle: result.title, oldauthor: result.author, oldpages: result.pages, oldread: result.read, title: result.title, author: result.author, pages: result.pages, read: result.read});
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
        res.render('update', {message: 'Book updated!', oldtitle: req.body.title, oldauthor: req.body.author, oldpages: req.body.pages, oldread: req.body.read, title: req.body.title, author: req.body.author, pages: req.body.pages, read: req.body.read});
      });
  });
});

app.post('/delete', function(req, res) {
  client.connect(err => {
    if (err) throw err;
    let query = { title: req.body.title, author: req.body.author ? req.body.author : null, pages: req.body.pages ? req.body.pages : null, read: req.body.read ? req.body.read : null };
    client.db("library").collection("books").deleteOne(query, function(err, obj) {
      if (err) throw err;
      console.log("1 book deleted");
      res.send(`Book ${req.body.title} deleted`);
    });
  });
});

app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
    console.log('listening on port', app.get('port'));
});

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongo_username = process.env.MONGO_USERNAME
const mongo_password = process.env.MONGO_PASSWORD
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.7c2nb.mongodb.net/library?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.route('/list-all').get(function(req, res) {
  client.connect(err => {
    const cursor = client.db('library').collection('books').find().limit(numberOfResults);
    const myBooks = cursor.toArray();
  });
});

async function listAllBooks(client, {
  numberOfResults = 10
} = {}) {
  const cursor = client.db('library').collection('books').find({}).sort({author: 'asc'}).limit(numberOfResults);
  const results = await cursor.toArray();

  if (results.length >0) {
    console.log(`Found ${numberOfResults} books`);
    results.forEach((result, i) => {
      console.log(` title: ${result.title}`);
    });
  } else {
    console.log('The listing is empty.')
  }
}

listAllBooks(client, {numberOfResults: 10});

// async function main() {
//   try {
//       // Connect to the MongoDB cluster
//       await client.connect();
//       await findBooks(client);

//   } finally {
//       // Close the connection to the MongoDB cluster
//       await client.close();
//   }
// }
// main().catch(console.error);

// async function findBooks(client) {
//   // See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#find for the find() docs
//   const cursor = client.db("library").collection("books").find({});
//   // Store the results in an array. If you will have many customers, you may want to iterate
//   // this cursor instead of sending the results to an array. You can use Cursor's forEach() 
//   // to do the iterating: https://mongodb.github.io/node-mongodb-native/3.3/api/Cursor.html#forEach
//   const results = await cursor.toArray();
//   const myBooks = [];
//   // Process the results
//   if (results.length > 0) {
//     results.forEach((result, i) => {
//       myBooks.push(result);
//       // Here you could build your html or put the results in some other data structure you want to work with
//     });
//     console.log(myBooks);
//     return myBooks;
//   } else {
//     alert("Database is empty, please add some books.");
//   }
// }