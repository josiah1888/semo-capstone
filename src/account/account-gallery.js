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
          '<div class="4u 6u(small)">',
          '<span class="image fit">',
          '<a data-fancybox="gallery" href="' + url + '">',
          '<img src="' + url + '" alt="" />',
          '</a>',
          '</span>',
          '<button type="button" class="btn btn-danger js-deleteImage" data-path="' + path + '">Delete</button>',
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
  return Promise.resolve();
}

function handleDeleteImage() {
  $('.js-deleteImage').on('click', function () {
    var self = this
    var baseRef = $(this).closest('.js-gallery').data('imageref');
    var path = $(this).data('path');

    getImagesRefs($(this).closest('.js-gallery'))
      .then(function (imageRef) {
        var images = imageRef.val();
        return Promise.resolve(Object.keys(images)
          .filter(function (key) { return images[key] === path; })
          .map(function (key) { return { key: key, value: images[key] }; })[0]
        )
      })
      .then(function (imageRef) {
        var dbRef = firebase.database().ref(baseRef + '/' + imageRef.key);
        dbRef.remove();
        $(self).closest('div').hide(750);
      });
  });
}

$('.js-gallery').each(function (index, gallery) {
  getImagesRefs($(gallery))
    .then(function (imageRefs) { return getImagePaths(imageRefs.val()) })
    .then(function (imagePaths) { return appendImages(imagePaths, $(gallery)); })
    .then(initFancybox)
    .then(handleDeleteImage)
    .catch(function (err) { console.error('Uh oh! Errorzzz', err); });
});
