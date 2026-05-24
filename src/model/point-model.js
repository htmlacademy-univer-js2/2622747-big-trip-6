import Observable from '../framework/observable.js';
import PointAdapter from '../point-adapter.js';

export default class PointsModel extends Observable {

  #apiService = null;

  #points = [];
  #offers = [];
  #destinations = [];

  constructor({apiService}) {

    super();

    this.#apiService = apiService;

  }

  getPoints() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {

    try {

      const [
        points,
        destinations,
        offers
      ] = await Promise.all([

        this.#apiService.points(),
        this.#apiService.destinations(),
        this.#apiService.offers()

      ]);

      this.#points = points;

      this.#offers =
        offers;

      this.#destinations =
        destinations;

    } catch {

      this.#points = [];
      this.#offers = [];
      this.#destinations = [];

    }

    this._notify();

  }

  async updatePoint(updatedPoint) {

    const response =
      await this.#apiService.updatePoint(updatedPoint);

    const savedPoint =
      PointAdapter.adaptToClient(response);

    const index =
      this.#points.findIndex(
        (point) => point.id === savedPoint.id
      );

    if (index === -1) {
      throw new Error('Point not found');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      savedPoint,
      ...this.#points.slice(index + 1)
    ];

    this._notify();

  }

  getDestinationById(id) {

    return this.#destinations.find(
      (destination) =>
        destination.id === id
    );

  }

  getOffersByType(type) {

    return this.#offers.find(
      (offer) =>
        offer.type === type
    )?.offers || [];

  }

  getOffersByIds(ids = []) {

    const offers =
      this.#offers.flatMap(
        (group) => group.offers
      );

    return offers.filter(
      (offer) =>
        ids.includes(offer.id)
    );

  }

}

