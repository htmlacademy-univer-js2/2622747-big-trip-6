import { POINT_TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createTypeItemsTemplate = (currentType) => POINT_TYPES.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1"
             class="event__type-input  visually-hidden"
             type="radio"
             name="event-type"
             value="${type}"
             ${currentType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}"
             for="event-type-${type}-1">
        ${type.charAt(0).toUpperCase() + type.slice(1)}
      </label>
    </div>
  `).join('');

const createDestinationsListTemplate = (destinations) => destinations.map((dest) => `
    <option value="${dest.name}"></option>
  `).join('');


const createAvailableOffersTemplate = (offers, selectedOfferIds) => {
  if (!offers || offers.length === 0) {
    return '<p class="event__offers-empty">No additional offers</p>';
  }

  return offers.map((offer) => {
    const isChecked = selectedOfferIds.includes(offer.id) ? 'checked' : '';

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
               id="event-offer-${offer.id}"
               type="checkbox"
               name="event-offer"
               value="${offer.id}"
               ${isChecked}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }).join('');
};

const createDestinationDetailsTemplate = (destination) => {
  if (!destination) {
    return '';
  }

  const picturesHtml = destination.pictures?.map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description}">
  `).join('') || '';

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description || ''}</p>

      ${picturesHtml ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesHtml}
          </div>
        </div>
      ` : ''}
    </section>
  `;
};

const createEditingFormTemplate = (point, destination, offers, allDestinations, allOffers) => {
  const {type, basePrice, dateFrom, dateTo, offers: selectedOfferIds} = point;

  const formatDateForInput = (date) => {
    const data = new Date(date);
    const day = data.getDate().toString().padStart(2, '0');
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const year = data.getFullYear().toString().slice(2);
    const hours = data.getHours().toString().padStart(2, '0');
    const minutes = data.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypeItemsTemplate(type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
        <input class="event__input  event__input--destination"
               id="event-destination-1"
               type="text"
               name="event-destination"
               value="${destination ? destination.name : ''}"
               list="destination-list-1"
               placeholder="Enter destination">
        <datalist id="destination-list-1">
          ${createDestinationsListTemplate(allDestinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time"
               id="event-start-time-1"
               type="text"
               name="event-start-time"
               value="${formatDateForInput(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time"
               id="event-end-time-1"
               type="text"
               name="event-end-time"
               value="${formatDateForInput(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price"
               id="event-price-1"
               type="text"
               name="event-price"
               value="${basePrice}"
               placeholder="0">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>

    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createAvailableOffersTemplate(allOffers, selectedOfferIds)}
        </div>
      </section>

      ${createDestinationDetailsTemplate(destination)}
    </section>
  </form>`;
};

export default class EditingFormView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #allDestinations = null;
  #allOffers = null;
  #onCloseEditButtonClick = null;
  #onSubmitButtonClick = null;

  constructor({point,destination, offers, allDestinations, allOffers, onCloseEditButtonClick, onSubmitButtonClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#allDestinations = allDestinations || [];
    this.#allOffers = allOffers || [];
    this.#onCloseEditButtonClick = onCloseEditButtonClick;
    this.#onSubmitButtonClick = onSubmitButtonClick;

    this.#setEventListeners();
  }

  get template() {
    return createEditingFormTemplate(
      this.#point,
      this.#destination,
      this.#offers,
      this.#allDestinations,
      this.#allOffers
    );
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);
    this.element
      .addEventListener('submit', this.#submitHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditButtonClick();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitButtonClick();
  };
}
