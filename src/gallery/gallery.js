function getImagesRefs() {
  var dbRef = firebase.database().ref('image_gallery');
  return dbRef.once('value');
}

function getImagePaths(imageRefs) {
  return Promise.resolve(
    Object.keys(imageRefs)
      .map(function (key) { return imageRefs[key] })
  );
}

function appendImages(paths) {
  var storage = firebase.storage().ref('');

  paths.forEach(function (path) {
    // Create a reference to the file we want to download
    var starsRef = storage.child(path);

    // Get the download URL
    starsRef.getDownloadURL().then(function (url) {

      $('.js-gallery').append(
        [
          '<div class="4u 6u(small)">',
          '<span class="image fit">',
          '<a data-fancybox="gallery" href="' + url + '">',
          '<img src="' + url + '" alt="" />',
          '</a>',
          '</span>',
          '</div>'
        ].join()
      );
    }).catch(function (error) {
      console.error('Uh oh! problem fetching images', error);
    });
  });
}

function initFancybox() {
  $('[data-fancybox]').fancybox({
    // Options will go here
  });
}

getImagesRefs()
  .then(function (imageRefs) { return getImagePaths(imageRefs.val()) })
  .then(function (paths) { return appendImages(paths) })
  .then(function () { initFancybox() })
  .catch(function (err) { console.error('Uh oh! Errorzzz', err); });