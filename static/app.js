const header = document.querySelector('header');
const section = document.querySelector('section');

let requestURL = 'books.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  const myBooks = request.response;
  populateHeader(myBooks);
  showBooks(myBooks);
}

function populateHeader(obj) {
  const myH1 = document.createElement('h1');
  myH1.textContent = obj['title'];
  header.appendChild(myH1);

  const myPara = document.createElement('p');
  myPara.textContent = 'Title: ' + obj['title'] + ' Author: ' + obj['author'];
  header.appendChild(myPara);
}

function showBooks(obj) {
  const books = obj;

  for (let i = 0; i < books.length; i++) {
    const myArticle = document.createElement('article');
    const myH2 = document.createElement('h2');
    const myPara1 = document.createElement('p');
    const myPara2 = document.createElement('p');
    const myPara3 = document.createElement('p');
    const myList = document.createElement('ul');

    myH2.textContent = books[i].title;
    myPara1.textContent = 'Author: ' + books[i].author;
    myPara2.textContent = 'Pages: ' + books[i].pages;
    myPara3.textContent = 'Read: ' +books[i].read;

    myArticle.appendChild(myH2);
    myArticle.appendChild(myPara1);
    myArticle.appendChild(myPara2);
    myArticle.appendChild(myPara3);
    myArticle.appendChild(myList);

    section.appendChild(myArticle);
  }
}