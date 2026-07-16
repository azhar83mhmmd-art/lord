/* Generic search-box wiring. Expects an <input> with [data-search]
   and calls the provided callback with the trimmed query on input. */

function wireSearch(inputEl, onQuery, debounceMs = 200) {
  if (!inputEl) return;
  let timer = null;
  inputEl.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onQuery(inputEl.value.trim()), debounceMs);
  });
}
