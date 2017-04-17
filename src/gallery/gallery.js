function getImagesRefs(gallery) {
  var ref = gallery.data('imageref');
  var dbRef = firebase.database().ref(ref);
  return dbRef.once('value');
}

function getImagePaths(imageRefs) {
  return Promise.resolve(
    Object.keys(imageRefs)
      .map(function (key) { return imageRefs[key] })
  );
}

function appendImages(paths, gallery) {
  var storage = firebase.storage().ref('');

  return Promise.all(paths.map(function (path) {
    // Create a reference to the file we want to download
    var starsRef = storage.child(path);

    // Get the download URL
    return starsRef.getDownloadURL().then(function (url) {

      gallery.append(
        [
          '<div class="6u 10u(small)">',
          '<span class="image fit">',
          '<a data-fancybox="gallery" href="' + url + '">',
		  '<img src="' + url + '" alt="" style="width:512px;height:512px;"/>',
          '</a>',
          '</span>',
          '</div>'
        ].join('')
      );
    }).catch(function (error) {
      console.error('Uh oh! problem fetching images', error);
    });
  }));
}

function initFancybox() {
  $('[data-fancybox]').fancybox({
    // Options will go here
  });
}

$('.js-gallery').each(function (index, gallery) {
  getImagesRefs($(gallery))
    .then(function (imageRefs) { return getImagePaths(imageRefs.val()) })
    .then(function (imagePaths) { return appendImages(imagePaths, $(gallery)); })
    .then(initFancybox)
    .catch(function (err) { console.error('Uh oh! Errorzzz', err); });
});
