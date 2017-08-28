const FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/explore";
const FOURSQUARE_CLIENT_ID = "IZYP4O4X12IIUAWFET4VWM0CG1WVWS4VJTMCVU3RMVORDRGJ";
const FOURSQUARE_CLIENT_SECRET = "TV3AXUBEPXUDCCOF5FAH0G4GOJHFGYGKERFS2UXASA5ZFQM0";
const RESULTS_CONTAINER = $(".js-search-results");
const SEARCH_FORM = $(".js-search-form");

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
}

function getVenueResults(data) {
  data.response.groups[0].items.forEach(function(item) {
    const foursquareVenueUrl = `https://api.foursquare.com/v2/venues/${item.venue.id}`;

    const query = {
      m: "foursquare",
      v: 20170823,
      client_id: FOURSQUARE_CLIENT_ID,
      client_secret: FOURSQUARE_CLIENT_SECRET
    }
    const venueInfo = $.getJSON(foursquareVenueUrl, query, displayVenueInfo);
  });
}

function displayVenueInfo(info) {
  RESULTS_CONTAINER.append(renderResult(info));
}

function renderResult(venueResults) {
  const venuePath = venueResults.response.venue;
  const venuePhoto = `${venuePath.bestPhoto.prefix}300x300${venuePath.bestPhoto.suffix}`;
  const venueName = venuePath.name;
  const venueLink = venuePath.canonicalUrl;

  return `
    <a href="${venueLink}" target="_blank">
      <img class="search-results__thumbnail" src="${venuePhoto}" alt="${venueName}" />
    </a>
  `;
}

function clearInput(input) {
  input.val("");
}

function watchSubmit() {
  SEARCH_FORM.submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(".js-search-input");
    const query = queryTarget.val();

    RESULTS_CONTAINER.empty().prop("hidden", false);
    clearInput(queryTarget);
    getDataFromApi(query, getVenueResults);
  });
}

$(watchSubmit);