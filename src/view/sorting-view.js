import AbstractView from '../framework/view/abstract-view.js';

const SORT_TYPES = [
  'day',
  'event',
  'time',
  'price',
  'offers'
];

const createSortingItemTemplate = (type, currentSortType) => `
<div class="trip-sort__item trip-sort__item--${type}">
  <input
    data-sort-type="${type}"
    id="sort-${type}"
    class="trip-sort__input visually-hidden"
    type="radio"
    name="trip-sort"
    ${type === currentSortType ? 'checked' : ''}
    ${type === 'event' || type === 'offers' ? 'disabled' : ''}
  >

  <label class="trip-sort__btn" for="sort-${type}">
    ${type.toUpperCase()}
  </label>
</div>
`;

const createSortingTemplate = (currentSortType) => `
<form
  class="trip-events__trip-sort trip-sort"
  action="#"
  method="get"
>
  ${SORT_TYPES
    .map((type) =>
      createSortingItemTemplate(
        type,
        currentSortType
      )
    )
    .join('')}
</form>
`;

export default class SortingView extends AbstractView {

  #currentSortType = null;
  #onSortTypeChange = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();

    this.#currentSortType =
      currentSortType;

    this.#onSortTypeChange =
      onSortTypeChange;

    this.element.addEventListener(
      'change',
      this.#sortChangeHandler
    );
  }

  get template() {
    return createSortingTemplate(
      this.#currentSortType
    );
  }

  #sortChangeHandler = (evt) => {
    const sortType = evt.target.dataset.sortType;

    if (!sortType) {
      return;
    }

    this.#onSortTypeChange(sortType);
  };
}
