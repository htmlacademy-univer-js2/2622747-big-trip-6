import { mockDestination } from '../mock/destinations';
import { mockPoints } from '../mock/points';
import {OFFERS_BY_TYPE} from '../mock/offers';

export default class PointsModel {
  #points = mockPoints;
  #destinations = mockDestination;
  #offers = OFFERS_BY_TYPE;

  getPoints() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = points;
  }

  addPoint(newPoint) {
    this.#points = [newPoint,...this.#points];
  }

  deletePoint(pointToDelete) {
    this.#points = this.#points.filter((point) =>
      point.id !== pointToDelete.id
    );
  }

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) =>
      point.id === updatedPoint.id
        ? updatedPoint
        : point
    );
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    const offerGroup = this.offers.find((group) => group.type === type);
    return offerGroup ? offerGroup.offers : [];
  }

  getOffersByIds(offerIds) {
    if (!offerIds || offerIds.length === 0) {
      return [];
    }

    const allOffers = this.offers.flatMap((group) => group.offers);
    return allOffers.filter((offer) => offerIds.includes(offer.id));
  }

  getOfferById(offerId) {
    if (!offerId) {
      return null;
    }
    const allOffers = this.offers.flatMap((group) => group.offers);
    return allOffers.find((offer) => offer.id === offerId) || null;
  }
}

