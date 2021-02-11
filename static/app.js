function updatePage() {
  const section = document.querySelector('section');
  let requestURL = 'books.json';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    const myBooks = request.response;
    showBooks(myBooks);
  }

  function showBooks(obj) {
    const books = obj;
    const myList = document.createElement('ol');

    for (let i = 0; i < books.length; i++) {
      const myEntry = document.createElement('li');
      myEntry.textContent = books[i].title + ' by ' + books[i].author + ', ' +books[i].pages + ' pages. ' + ((books[i].read.toLowerCase() === 'yes') ? 'Already red.' : 'In your nearest plans.');
      myList.appendChild(myEntry);
      section.appendChild(myList);
    }
  }
}
updatePage();

// window.onload = function(){
//   for (let count = 3; count>0; count--) {
//     document.querySelector('.magic-button').click();
//     // document.querySelector('.magic-button').click();
//   }
//   // updatePage();
// }

// var getList = (function() {
//     var executed = false;
//     return function() {
//         if (!executed) {
//             executed = true;
//             document.querySelector('.magic-button').click();
//         }
//     };
// })();
// getList();