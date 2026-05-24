import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const FILTERS = Object.values(FilterType);

const createFilterItemTemplate = (filter, currentFilter) => `
  <div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${currentFilter === filter ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter.toUpperCase()}</label>
  </div>`;

const createFiltersTemplate = (currentFilter) =>
  ` <form class="trip-filters" action="#" method="get">
      ${FILTERS.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('')}
    </form> `;

export default class FiltersView extends AbstractView {
  #currentFilter = null;
  #onFilterChange = null;

  constructor({currentFilter, onFilterChange}) {
    super();

    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#currentFilter);
  }

  #filterChangeHandler = (evt)=>{
    this.#onFilterChange(
      evt.target.value
    );
  };
}
