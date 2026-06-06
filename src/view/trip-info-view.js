import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTemplate = ({ route, dateFrom, dateTo, totalPrice }) => `
  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route || ''}</h1>

      ${dateFrom && dateTo ? `
        <p class="trip-info__dates">
          ${dateFrom} — ${dateTo}
        </p>
      ` : ''}
    </div>

    ${totalPrice ? `
      <p class="trip-info__cost">
        Total: € <span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    ` : ''}
  </section>
`;

export default class TripInfoView extends AbstractView {
  #tripInfo;

  constructor(tripInfo) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    return createTripInfoTemplate(this.#tripInfo);
  }
}
