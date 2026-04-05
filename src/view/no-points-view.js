import AbstractView from '../framework/view/abstract-view.js';

const FilterMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now'
};

const createNoPointsTemplate = (filterType) => `
  <p class="trip-events__msg">
    ${FilterMessage[filterType]}
  </p>
`;

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
