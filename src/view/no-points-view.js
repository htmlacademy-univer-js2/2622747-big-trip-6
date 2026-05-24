import AbstractView from '../framework/view/abstract-view.js';

const EMPTY_MESSAGE = {
  everything: 'Click New Event to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future: 'There are no future events now'
};
const createNoPointsTemplate = (filterType) => `
  <p class="trip-events__msg">
    ${EMPTY_MESSAGE[filterType]}
  </p>
`;

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
