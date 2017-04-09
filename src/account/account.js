firebase.auth().onAuthStateChanged(function (user) {
  !user && redirectToLogin();
});

function redirectToLogin() {
  window.location.href = '/account/login';
}

// var storageRef = firebase.storage().ref('image_gallery/');

// var file = File();
// storageRef.put(file).then(function(snapshot) {
//   console.log('New image has been uploaded!');


//   var uploadTask;
//  // Register three observers:
// // 1. 'state_changed' observer, called any time the state changes
// // 2. Error observer, called on failure
// // 3. Completion observer, called on successful completion
// uploadTask.on('state_changed', function(snapshot){
//   // Observe state change events such as progress, pause, and resume
//   // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//   var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//   console.log('Upload is ' + progress + '% done');
//   switch (snapshot.state) {
//     case firebase.storage.TaskState.PAUSED: // or 'paused'
//       console.log('Upload is paused');
//       break;
//     case firebase.storage.TaskState.RUNNING: // or 'running'
//       console.log('Upload is running');
//       break;
//   }
// }, function(error) {
//   // Handle unsuccessful uploads
// }, function() {
//   // Handle successful uploads on complete
//   // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//   var postKey = firebase.database().ref('Posts/').push().key;
//   var downloadURL = uploadTask.snapshot.downloadURL;
//   var updates = {};
//   var postData = {
//   	url: downloadURL,
//   };

//   updates ['/Posts/'+postKey] = postData;
//   firebase.database().ref.update(updates);
//   console.log(downloadURL);
// });
// });


