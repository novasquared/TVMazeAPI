"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`); // base url global variable
  console.log(res.data)
  return res.data.map((scoreAndShow) => {
    return {
      id: scoreAndShow.show.id, 
      name: scoreAndShow.show.name, 
      summary: scoreAndShow.show.summary, 
      image: scoreAndShow.show.image 
    }
  });

  // sample output for getShowsByTerm()
  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary: `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
  //          normal lives, modestly setting aside the part they played in
  //          producing crucial intelligence, which helped the Allies to victory
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //       "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg",
  //   },
  // ];
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const showImage = show.image
      ? show.image.medium
      : "https://tinyurl.com/tv-missing"; //make this a global constant
    const showSummary = show.summary 
      ? show.summary 
      : "No description provided.";
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${showImage}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${showSummary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  //http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes.
  //get episode id, name, season, number
  // return an array of objects with this data
  let episodeList = [];
  let episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  // console.log(episodes);
  // console.log(episodes.length);
  for (let i = 0; i < episodes.data.length; i++) {
    let data = episodes.data;
    // console.log(data[i]);
    episodeList.push({
      id: data[i].id,
      name: data[i].name, 
      season: data[i].season, 
      number: data[i].number
    });
  }
  console.log(episodeList);
  return episodeList;
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
