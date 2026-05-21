import EventsListView from '../view/events-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render} from '../framework/render.js';
import {filter} from '../filter.js';
import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #eventsListContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #eventsListComponent = new EventsListView();

  #pointPresenters = new Map();

  constructor({eventsListContainer, pointsModel, filterModel}) {
    this.#eventsListContainer = eventsListContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  init() {
    const filterType = this.#filterModel.filter;
    const eventsListPoints = this.#pointsModel.points;

    const filteredPoints =
      filter[filterType](eventsListPoints);

    if (filteredPoints.length === 0) {
      render(
        new NoPointsView({filterType}),
        this.#eventsListContainer
      );

      return;
    }

    render(
      this.#eventsListComponent,
      this.#eventsListContainer
    );

    filteredPoints.forEach((point) => {
      const destination =
        this.#pointsModel.getDestinationById(
          point.destination
        );

      const offers =
        this.#pointsModel.getOffersByIds(
          point.offers
        );

      const pointPresenter =
        new PointPresenter({
          eventsListContainer:
            this.#eventsListComponent.element,

          point,
          destination,
          offers,

          allOffers:
            this.#pointsModel.getOffersByType(
              point.type
            ),

          allDestinations:
            this.#pointsModel.destinations,

          onDataChange:this.#handlePointChange,
          onModeChange: this.#resetAllPoints
        });

      pointPresenter.init();

      this.#pointPresenters.set(
        point.id,
        pointPresenter
      );
    });
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);

    const pointPresenter =
      this.#pointPresenters.get(updatedPoint.id);

    pointPresenter.init(updatedPoint);
  };

  #resetAllPoints = () => {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
  };
}
