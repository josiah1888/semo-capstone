function loginAndRedirect() {
  var form = $('#LoginForm');
  var email = form.find('#email').val();
  var password = form.find('#password').val();

  signIn(email, password);
}

function signIn(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(redirectToAccount)
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      $('#LoginErrorMessage').text(error.message);
      $('#LoginError').show();
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  user && redirectToAccount();
});

function redirectToAccount() {
  window.location.href = '/account/';
}