import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import dayjs from 'dayjs';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;

  #tripInfoComponent = null;

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    const prevComponent = this.#tripInfoComponent;

    const tripInfo = this.#getTripInfo();

    this.#tripInfoComponent = new TripInfoView(tripInfo);

    if (!prevComponent) {
      render(
        this.#tripInfoComponent,
        this.#container,
        RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this.#tripInfoComponent, prevComponent);
    remove(prevComponent);
  }

  #handleModelChange = () => {
    this.init();
  };

  #getTripInfo() {
    const points = this.#pointsModel.getPoints();

    if (!points.length) {
      return {
        route: '',
        dateFrom: '',
        dateTo: '',
        totalPrice: 0
      };
    }

    if (this.#pointsModel.isError()) {
      return {
        route: '',
        dateFrom: '',
        dateTo: '',
        totalPrice: ''
      };
    }
    const sortedPoints = [...points].sort((a, b) =>
      dayjs(a.dateFrom).diff(dayjs(b.dateFrom))
    );

    const destinations = sortedPoints
      .map((point) =>
        this.#pointsModel.getDestinationById(point.destination)?.name
      )
      .filter(Boolean);

    let route = '';

    if (destinations.length <= 3) {
      route = destinations.join(' — ');
    } else {
      route = `${destinations[0]} — ... — ${destinations.at(-1)}`;
    }

    const firstPoint = sortedPoints[0];
    const lastPoint = sortedPoints.at(-1);

    const dateFrom = dayjs(firstPoint.dateFrom).format('DD MMM').toUpperCase();
    const dateTo = dayjs(lastPoint.dateTo).format('DD MMM').toUpperCase();

    const totalPrice = sortedPoints.reduce((sum, point) => {
      const offers = this.#pointsModel.getOffersByIds(point.offers || []);

      const offersPrice = offers.reduce(
        (acc, offer) => acc + offer.price,
        0
      );

      return sum + (point.basePrice || 0) + offersPrice;
    }, 0);

    return {
      route,
      dateFrom,
      dateTo,
      totalPrice
    };
  }
}
