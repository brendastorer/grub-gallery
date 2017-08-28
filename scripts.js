const FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/explore";
const FOURSQUARE_CLIENT_ID = "IZYP4O4X12IIUAWFET4VWM0CG1WVWS4VJTMCVU3RMVORDRGJ";
const FOURSQUARE_CLIENT_SECRET = "TV3AXUBEPXUDCCOF5FAH0G4GOJHFGYGKERFS2UXASA5ZFQM0";

function getDataFromApi(searchTerm, callback) {
  const query = {
    limit: 20,
    section: "food",
    near: searchTerm,
    venuePhotos: 1,
    m: "foursquare",
    v: 20170823,
    client_id: FOURSQUARE_CLIENT_ID,
    client_secret: FOURSQUARE_CLIENT_SECRET
  }
  const result = $.getJSON(FOURSQUARE_SEARCH_URL, query, callback);
  console.log(result);
}

function renderResult(result) {
  const firstPhoto = result.venue.featuredPhotos.items[0];
  const photoUrl = `${firstPhoto.prefix}300x300${firstPhoto.suffix}`;
  const venueName = result.venue.name;

  return `
    <img class="search-results__thumbnail" src="${photoUrl}" alt="${venueName}" />
  `;
}

function displayFoursquareResults(data) {
  const resultsContainer = $(".js-search-results");

  resultsContainer.empty().prop("hidden", false);
  data.response.groups[0].items.forEach(function(item) {
    resultsContainer.append(renderResult(item));
  });
}

function clearInput(input) {
  input.val("");
}

function watchSubmit() {
  $(".js-search-form").submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(".js-search-input");
    const query = queryTarget.val();

    clearInput(queryTarget);
    getDataFromApi(query, displayFoursquareResults);
  });
}

$(watchSubmit);