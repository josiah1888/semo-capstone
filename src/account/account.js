firebase.auth().onAuthStateChanged(function(user) {
  !user && redirectToLogin();
});

function redirectToLogin() {
  window.location.href = '/account/login';
}