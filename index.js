const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title}
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(inpEvent) {
    const resultData = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "dea93ab1",
        s: inpEvent,
      },
    });
    if (resultData.data.Error) {
      return [];
    }
    return resultData.data.Search;
  },
};

autoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    movieInfoReq(movie, document.querySelector("#left-summary"), "left");
  },
});
autoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    movieInfoReq(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftSide;
let rightSide;
const movieInfoReq = async (movie, summaryElement, side) => {
  const result = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "dea93ab1",
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieInfo(result.data);
  if (side === "left") {
    leftSide = result.data;
  } else {
    rightSide = result.data;
  }
  if (leftSide && rightSide) {
    runComparison();
  }
};
const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftValue = parseInt(leftStat.dataset.value);
    const rightValue = parseInt(rightStat.dataset.value);

    if (rightValue > leftValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};
const movieInfo = (movieDetail) => {
  const boxOffice = movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "");
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
  <article class='media'>
    <figure class='media-left'>
      <p class='image'>
        <img src='${movieDetail.Poster}'/>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article data-value=${awards} class='notification is-primary'>
    <p class='title'>${movieDetail.Awards}</p>
    <p class='subtitle'>Awards</p>
  </article>
  <article data-value=${boxOffice} class='notification is-primary'>
    <p class='title'>${movieDetail.BoxOffice}</p>
    <p class='subtitle'>Box Office</p>
  </article>
  <article data-value=${imdbRating} class='notification is-primary'>
    <p class='title'>${movieDetail.imdbRating}</p>
    <p class='subtitle'>Imdb Rating</p>
  </article>
  `;
};
