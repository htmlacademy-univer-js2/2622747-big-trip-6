import AbstractView from '../framework/view/abstract-view.js';

const FILTER_TYPES = ['everything', 'future', 'present', 'past'];

const createFiltersItemTemplate = (type) => `
  <div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" checked>
    <label class="trip-filters__filter-label" for="filter-${type}">${type.toUpperCase()}</label>
  </div>`;

const createFiltersTemplate = () =>
  ` <form class="trip-filters" action="#" method="get">
      ${FILTER_TYPES.map((type) => createFiltersItemTemplate(type)).join('')}
    </form> `;

export default class FiltersView extends AbstractView {
  get template() {
    return createFiltersTemplate();
  }
}
