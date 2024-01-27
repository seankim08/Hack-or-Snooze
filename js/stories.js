"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
    return $(`
      <li id="${story.storyId}">`).append(
      isStoryFavorite(story.storyId)).append(
      $(`<a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <div class="story-hostname">(${hostName})</div>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        <hr>
      </li>
    `));
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of current user's favorite stories from server, generates their HTML, and puts on page. */

function putFavoritesOnPage() {
  $allFavoritesList.empty();
  currentUser.favorites.forEach((fav) => {
    const $fav = generateStoryMarkup(fav);
    $allFavoritesList.append($fav);
  })

  $allFavoritesList.show();
}

/** Gets list of current user's own stories from server, generates their HTML, and puts on page. */

function putUserStoryOnPage() {
  $allUserStoryList.empty();
  currentUser.ownStories.forEach((own) => {
      const $own = generateStoryMarkup(own);
      const $trash = $(`<span id="trash"><i class="fas fa-trash-alt"></i></span>`);
      $own[0].prepend($trash[0]);
      $allUserStoryList.append($own);
  })
  $allUserStoryList.show();
}

/** Add a new story through the submit form */
async function submitStory() {
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  const username = currentUser.username;
  const story = await storyList.addStory(currentUser,{title, author, url, username});
  currentUser.ownStories.push(story);
  $("#story-author").val('');
  $("#story-title").val('');
  $("#story-url").val('');
  $storyForm.hide();
  getAndShowStoriesOnStart();
}

/** Toggle current user's favorite story on/off */
async function toggleFavorite(evt) {
  const story = storyList.stories.find((ele) => ele.storyId === evt.target.parentElement.parentElement.id)
  await currentUser.toggleFavorite(evt.target, story);
}

/** Remove current user's ownstory */
async function toggleRemove(evt) {
  const story = storyList.stories.find((ele) => ele.storyId === evt.target.parentElement.parentElement.id)
  await currentUser.toggleRemove(story);
  //storyList = storyList.stories.filter((ele) => ele.storyId === evt.target.parentElement.parentElement.id)
}

function isStoryFavorite(storyId) {
  if(currentUser === undefined) {
    return ;
  }
  else if(currentUser.favorites.some((ele) => ele.storyId === storyId)) {
    return $('<span> <i id="star" class="fa-star fas favorite"></i> </span>');
  }
  else {
    return $('<span> <i id="star" class="far fa-star un-favorite"></i> </span>');
  }
}

$storyForm.on("submit", submitStory);
$body.on("click", "#star", toggleFavorite);
$body.on("click", "#trash", toggleRemove);
