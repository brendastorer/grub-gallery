const FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/explore";
const FOURSQUARE_CLIENT_ID = "IZYP4O4X12IIUAWFET4VWM0CG1WVWS4VJTMCVU3RMVORDRGJ";
const FOURSQUARE_CLIENT_SECRET = "TV3AXUBEPXUDCCOF5FAH0G4GOJHFGYGKERFS2UXASA5ZFQM0";
const FOURSQUARE_API_BEFORE_THIS_DATE = 20170823;
const RESULTS_HEADER = $(".js-results-header");
const RESULTS_CONTAINER = $(".js-search-results");
const SEARCH_FORM = $(".js-search-form");
const SEARCH_INPUT = $(".js-search-input");

window.addEventListener("touchstart", function onFirstTouch() {
  document.body.classList.add("touch-user");
  window.removeEventListener("touchstart", onFirstHover, false);
}, false);

function getDataFromApi(searchTerm, callback) {
  const query = {
    limit: 24,
    section: "food",
    near: searchTerm,
    venuePhotos: 1,
    m: "foursquare",
    v: FOURSQUARE_API_BEFORE_THIS_DATE,
    client_id: FOURSQUARE_CLIENT_ID,
    client_secret: FOURSQUARE_CLIENT_SECRET
  }

  const result = $.getJSON(FOURSQUARE_SEARCH_URL, query, callback).fail(renderError);
}

function getVenueResults(data) {
  const searchLocation = data.response.geocode.displayString;
  renderSearchLocation(searchLocation);

  data.response.groups[0].items.forEach(function(item) {
    const foursquareVenueUrl = `https://api.foursquare.com/v2/venues/${item.venue.id}`;

    const query = {
      m: "foursquare",
      v: FOURSQUARE_API_BEFORE_THIS_DATE,
      client_id: FOURSQUARE_CLIENT_ID,
      client_secret: FOURSQUARE_CLIENT_SECRET
    }

    const venueInfo = $.getJSON(foursquareVenueUrl, query, renderResult).fail(renderError);
  });
}

function emptyValue() {
  SEARCH_INPUT.addClass("error");
  $(".js-search-form-input-container").after(
    `<p class="error-message js-input-error">Search box can't be empty.</p>
    `
  );
}

function renderError(error) {
  const errorResponsePath = error.responseJSON.meta;
  const errorCode = errorResponsePath.code;
  const errorCopy = errorResponsePath.errorDetail;

  const errorMessage = (
    ` <li class="search-results__error">
        <p>Sorry, something went wrong.</p>
        <p>Error ${errorCode}, ${errorCopy}</p>
      </li>
    `
  );

  RESULTS_CONTAINER.append(errorMessage);
}

function renderSearchLocation(location) {
  const title = (
    ` <h2 class="results-header__title">${location}</h2>`
  );

  RESULTS_HEADER.empty().prop("hidden", false).append(title);
}

function renderResult(venueData) {
  const responsePath = venueData.response.venue;
  const venuePhoto = `${responsePath.bestPhoto.prefix}500x500${responsePath.bestPhoto.suffix}`;
  const venueName = responsePath.name;
  const venueLink = responsePath.canonicalUrl;
  const venueCategory = responsePath.categories[0].name;
  let venueStreet = responsePath.location.address;
  let venueCity = responsePath.location.city;
  let venueResults = "";

  if (venueStreet === undefined) {
    venueStreet = "";
  }

  if (venueCity === undefined) {
    venueCity = "";
  }

  const venueListItemStart = (
    ` <li class="search-results__result">
        <img class="search-results__photo" src="${venuePhoto}" alt="${venueName}" />
        <a class="search-results__link" href="${venueLink}" target="_blank" rel="noopener noreferrer">
          <h3 class="search-results__name">${venueName}</h3>
          <h4>${venueCategory}</h4>
    `
  );

  const venueAddress = (
    ` <address>
        ${venueStreet}<br>
        ${venueCity}
      </address>
    `
  );

  const venueListItemEnd = (
    `    <h5 class="search-results__cta">See details on Foursquare &raquo;</h5>
        </a>
      </li>
    `
  );

  if (venueStreet === "" && venueCity === "") {
    venueResults = venueListItemStart + venueListItemEnd;
  }
  else {
    venueResults = venueListItemStart + venueAddress + venueListItemEnd;
  }

  RESULTS_CONTAINER.append(venueResults);
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
    const queryTarget = $(event.currentTarget).find(SEARCH_INPUT);
    const query = queryTarget.val();

    if (query === "") {
      emptyValue();
    }
    else {
      SEARCH_INPUT.removeClass("error");
      $(".js-input-error").remove();
      clearResults();
      clearInput(queryTarget);
      getDataFromApi(query, getVenueResults);
    }
  });
}

$(watchSubmit);
