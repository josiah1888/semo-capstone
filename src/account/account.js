firebase.auth().onAuthStateChanged(function (user) {
  !user && redirectToLogin();
});

function redirectToLogin() {
  window.location.href = '/account/login';
}

$('.file-uploader').fileupload({
  dataType: 'json',
  add: function (e, data) {
    uploadToFirebase($(e.target).data('gallery'), data.files)
    // We are specifically not doing this
    // data.submit();
  },
});

function uploadToFirebase(gallery, files) {
  files.forEach(function (file) {
    var filePath = 'image_gallery/' + file.name;
    var storageRef = firebase.storage().ref(filePath);

    var uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function (snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, function (error) {
      alert('Uh oh! We had a problem uploading this file')
    }, function () {
      addToIndex(gallery, filePath)
    });
  })
}

function addToIndex(index, filePath) {
  debugger;
  var dbRef = firebase.database().ref(index);
  dbRef.push(filePath);
}