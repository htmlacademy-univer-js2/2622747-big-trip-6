import { mockDestination } from '../mock/destinations';
import { mockPoints } from '../mock/points';
import {OFFERS_BY_TYPE} from '../mock/offers';

export default class PointsModel {
  #points = mockPoints;
  #destinations = mockDestination;
  #offers = OFFERS_BY_TYPE;

  get points() {
    return this.#points;
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

