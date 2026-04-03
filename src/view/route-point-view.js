import AbstractView from '../framework/view/abstract-view.js';

const createSelectedOffers = (offers) => {
  if (!offers || offers.length === 0) {
    return '';
  }
  return offers.slice(0, 3).map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');
};

const createRoutePointTemplate = (point, destination, offers) => {
  const findDuration = (to, from) => {
    const durationMs = to - from;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationFull = durationHours > 0
      ? `${durationHours}H ${durationMinutes}M`
      : `${durationMinutes}M`;

    return durationFull;
  };

  const {type, basePrice, dateFrom, dateTo, isFavorite} = point;

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  const date = new Date(dateFrom);
  const month = date.toLocaleString('en', {month: 'short'}).toUpperCase();
  const day = date.getDate().toString().padStart(2, '0');

  const startTime = dateFrom.toLocaleTimeString('en', {hour: '2-digit', minute: '2-digit'});
  const endTime = dateTo.toLocaleTimeString('en', {hour: '2-digit', minute: '2-digit'});

  const duration = findDuration(dateTo, dateFrom);
  const selectedOffersHtml = createSelectedOffers(offers);

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom.toISOString().slice(0, 10)}">${month} ${day}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom.toISOString()}">${startTime}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo.toISOString()}">${endTime}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${selectedOffersHtml}
                </ul>
                <button class="event__favorite-btn ${favoriteClass}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

export default class RoutePointView extends AbstractView{
  #point = null;
  #destination = null;
  #offers = null;
  #onOpenEditButtonClick = null;

  constructor({point, destination, offers, onOpenEditButtonClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers || [];
    this.#onOpenEditButtonClick = onOpenEditButtonClick;

    this.#setEventListener();
  }

  get template() {
    return createRoutePointTemplate(this.#point, this.#destination, this.#offers);
  }

  #setEventListener() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openEditButtonClickHandler);
  }

  #openEditButtonClickHandler = (evt) => {
    evt.preventDefault(evt);
    this.#onOpenEditButtonClick();
  };
}
