const autoComplete = ({ root, renderOption, onOptionSelect, inputValue,fetchData}) => {
  root.innerHTML = `
<label><b>Search for a movie</b></label>
<input class="input"/>
<div class='dropdown'>
  <div class='dropdown-menu'>
    <div class='dropdown-content results'></div>
  </div>
</div>
`;
  const input = root.querySelector(".input");
  const dropdown = root.querySelector(".dropdown");
  const resultWrap = root.querySelector(".results");

  const timeFun = async (event) => {
    const items = await fetchData(event.target.value);
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    resultWrap.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let item of items) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      resultWrap.appendChild(option);
    }
  };
  input.addEventListener("input", debouncer(timeFun));
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
