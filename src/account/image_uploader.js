function uploadFile () {
  var storageRef = firebase.storage().ref();


  var file = File();
  ref.put(file).then(function(snapshot) {
    console.log('New image has been uploaded!');
})};


