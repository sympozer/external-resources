/**
 * Created by pierremarsot on 27/04/2017.
 */
function googleSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  $(location).attr('href', '/login/social?email='+profile.getEmail()+'&id_social_network='+profile.getId()+'&type_social_network=google');
}

function logout(){
  $(location).attr('href', '/logout');
}

$(document).ready(function(){
  /* Google + */

  gapi.load('auth2', function() {
    gapi.auth2.init();
  });

  $(document).on('click', '#disconnect-google', function(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      logout();
    });
  });
  /* End Google + */
});