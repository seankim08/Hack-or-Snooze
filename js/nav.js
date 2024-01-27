"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $loginForm.hide();
  $signupForm.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user clicks Sumbit on the navbar, update the page */

function navBarClick() {
  hidePageComponents();
  $allStoriesList.show();
  $storyForm.show();
}

/** When a user clicks favorites on the navbar, update the page to show the user's favrite list */

$navSubmit.on("click", navBarClick);

  function navFavoriteClick(){
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorite.on("click", navFavoriteClick);

/** When a user clicks my stories on the navbar, update the page to show the user's own story list */

function navUserStoryClick() {
  hidePageComponents();
  putUserStoryOnPage();
}

$navStory.on("click", navUserStoryClick);
