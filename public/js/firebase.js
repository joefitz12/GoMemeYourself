const firebaseBot = (function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOj3OME-VBQwfzp1VvOYu3XprFQvpvhHk",
    authDomain: "go-meme-yourself.firebaseapp.com",
    databaseURL: "https://go-meme-yourself.firebaseio.com",
    projectId: "go-meme-yourself",
    storageBucket: "go-meme-yourself.appspot.com",
    messagingSenderId: "732189360517"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  function assignPhotos(data) {
    //logic for creating object to send to firebase
    //returns object
  }

  function startRound(data) {
    console.log(data);
    // update firebase with assignPhotos(data) 
    // Firebase startRound set to true
  }

  return {
    startRound,
  }
})();
