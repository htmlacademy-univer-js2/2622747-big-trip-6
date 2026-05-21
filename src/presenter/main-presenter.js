import {render} from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import SortingView from '../view/sorting-view.js';
import PointPresenter from './point-presenter.js';
import {filter} from '../filter.js';
import {sort} from '../sort.js';

export default class MainPresenter {
  #eventsListContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #eventsListComponent = new EventsListView();

  #sortingComponent = null;

  #pointPresenters = new Map();

  #currentSortType = 'day';

  constructor({
    eventsListContainer,
    pointsModel,
    filterModel
  }) {
    this.#eventsListContainer = eventsListContainer;

    this.#pointsModel = pointsModel;

    this.#filterModel = filterModel;
  }

  init() {
    this.#renderSort();
    render(
      this.#eventsListComponent,
      this.#eventsListContainer
    );
    this.#renderPoints();
  }

  #getPoints() {

    const filterType = this.#filterModel.filter;

    const points = filter[filterType](this.#pointsModel.points);

    return points
      .slice()
      .sort(
        sort[this.#currentSortType]
      );
  }

  #renderSort() {

    this.#sortingComponent =
      new SortingView({
        currentSortType:this.#currentSortType,
        onSortTypeChange:this.#handleSortChange
      });

    render(
      this.#sortingComponent,
      this.#eventsListContainer
    );
  }

  #renderPoints() {

    const points = this.#getPoints();

    if (points.length === 0) {
      render(
        new NoPointsView({
          filterType:this.#filterModel.filter
        }),
        this.#eventsListComponent.element
      );
      return;
    }

    points.forEach(
      (point) => this.#renderPoint(point)
    );
  }

  #renderPoint(point) {

    const destination = this.#pointsModel.getDestinationById(point.destination);

    const offers = this.#pointsModel.getOffersByIds(point.offers);

    const pointPresenter =
      new PointPresenter({
        eventsListContainer:this.#eventsListComponent.element,
        point,
        destination,
        offers,
        allOffers: this.#pointsModel.getOffersByType(point.type),
        allDestinations:this.#pointsModel.destinations,
        onDataChange:this.#handlePointChange,
        onModeChange:this.#resetAllPoints
      });

    pointPresenter.init();

    this.#pointPresenters.set(
      point.id,
      pointPresenter
    );
  }

  #handlePointChange = (updatedPoint) => {

    this.#pointsModel
      .updatePoint(
        updatedPoint
      );

    const presenter = this.#pointPresenters.get(updatedPoint.id);

    presenter.init(updatedPoint);
  };

  #handleSortChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPoints();

    this.#renderPoints();
  };

  #clearPoints() {

    this.#pointPresenters.forEach(
      (presenter) => presenter.destroy()
    );

    this.#pointPresenters.clear();
  }

  #resetAllPoints = () => {

    this.#pointPresenters
      .forEach(
        (presenter) =>presenter.resetView()
      );
  };
}
