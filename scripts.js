const FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/explore";
const FOURSQUARE_CLIENT_ID = "IZYP4O4X12IIUAWFET4VWM0CG1WVWS4VJTMCVU3RMVORDRGJ";
const FOURSQUARE_CLIENT_SECRET = "TV3AXUBEPXUDCCOF5FAH0G4GOJHFGYGKERFS2UXASA5ZFQM0";
const RESULTS_CONTAINER = $(".js-search-results");
const SEARCH_FORM = $(".js-search-form");

function getDataFromApi(searchTerm, callback) {
  const query = {
    limit: 5,
    section: "food",
    near: searchTerm,
    venuePhotos: 1,
    m: "foursquare",
    v: 20170823,
    client_id: FOURSQUARE_CLIENT_ID,
    client_secret: FOURSQUARE_CLIENT_SECRET
  }
  const result = $.getJSON(FOURSQUARE_SEARCH_URL, query, callback).fail(renderError);
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
    const venueInfo = $.getJSON(foursquareVenueUrl, query, renderResult).fail(renderError);
  });
}

function renderError(error) {
  const errorResponsePath = error.responseJSON.meta;
  const errorCode = errorResponsePath.code;
  const errorCopy = errorResponsePath.errorDetail;

  const errorMessage = (
    ` <p>Sorry, something went wrong.</p>
      <p>Error Type: ${errorCode}, ${errorCopy}</p>
    `
  );

  clearResults();
  RESULTS_CONTAINER.append(errorMessage);
}

function renderResult(venueData) {
  const responsePath = venueData.response.venue;
  const venuePhoto = `${responsePath.bestPhoto.prefix}300x300${responsePath.bestPhoto.suffix}`;
  const venueName = responsePath.name;
  const venueLink = responsePath.canonicalUrl;

  RESULTS_CONTAINER.append(`
    <a href="${venueLink}" target="_blank">
      <img class="search-results__thumbnail" src="${venuePhoto}" alt="${venueName}" />
    </a>
  `);
}

function clearInput(input) {
  input.val("");
}

function clearResults() {
  RESULTS_CONTAINER.empty().prop("hidden", false);
}

function watchSubmit() {
  SEARCH_FORM.submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find(".js-search-input");
    const query = queryTarget.val();

    clearResults();
    clearInput(queryTarget);
    getDataFromApi(query, getVenueResults);
  });
}

$(watchSubmit);