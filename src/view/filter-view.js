import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter,currentFilter) => {

  const {type,count} = filter;

  return `
    <div class="trip-filters__filter">

      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${currentFilter === type ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
      >

      <label
        class="trip-filters__filter-label"
        for="filter-${type}"
      >
        ${type.toUpperCase()}
      </label>

    </div>
  `;

};

const createFiltersTemplate = (filters, currentFilter) => `
  <form
    class="trip-filters"
    action="#"
    method="get"
  >

  ${filters.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('')}

  </form>
  `;

export default class FiltersView extends AbstractView {
  #currentFilter = null;
  #onFilterChange = null;
  #filters = [];

  constructor({currentFilter, filters, onFilterChange}) {
    super();

    this.#currentFilter = currentFilter;
    this.#filters = filters;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt)=>{
    this.#onFilterChange(
      evt.target.value
    );
  };
}
