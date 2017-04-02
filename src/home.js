function getImagesRefs() {
  var dbRef = firebase.database().ref('home_page_gallery');
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

  return Promise.all(paths.map(function (path) {
    // Create a reference to the file we want to download
    var starsRef = storage.child(path);

    // Get the download URL
    return starsRef.getDownloadURL().then(function (url) {
      var gallery$ = $('.js-homePageGallery');

      gallery$.append(
        [
          '<div class="slide">',
          '<img src="' + url + '" alt=""  />',
          '</div>',
        ].join('')
      );
    }).catch(function (error) {
      console.error('Uh oh! problem fetching images', error);
    });
  }));
}

function initSlider() {
  var $sliders = $('.slider');

  if ($sliders.length > 0) {

    $sliders.slidertron({
      mode: 'fadeIn',
      seamlessWrap: true,
      viewerSelector: '.viewer',
      reelSelector: '.viewer .reel',
      slidesSelector: '.viewer .reel .slide',
      advanceDelay: 0,
      speed: 400,
      fadeInSpeed: 1000,
      autoFit: true,
      autoFitAspectRatio: (840 / 344),
      navPreviousSelector: '.nav-previous',
      navNextSelector: '.nav-next',
      indicatorSelector: '.indicator ul li',
      slideLinkSelector: '.link'
    });

    $(window)
      .on('resize load', function () {
        $sliders.trigger('slidertron_reFit');
      })
      .trigger('resize');

  }
}

getImagesRefs()
  .then(function (imageRefs) { return getImagePaths(imageRefs.val()) })
  .then(appendImages)
  .then(initSlider)
  .catch(function (err) { console.error('Uh oh! Errorzzz', err); });