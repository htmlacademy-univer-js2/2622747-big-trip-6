import {render, remove} from '../framework/render.js';

import EventsListView from '../view/events-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import SortingView from '../view/sorting-view.js';
import LoadingView from '../view/loading-view.js';

import PointPresenter from './point-presenter.js';
import CreatePointPresenter from './create-point-presenter.js';

import {filter} from '../filter.js';
import {sort} from '../sort.js';
import { UserAction } from '../const.js';

export default class MainPresenter {
  #eventsListContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #eventsListComponent = new EventsListView();

  #sortingComponent = null;
  #noPointsComponent = null;

  #pointPresenters = new Map();

  #currentSortType = 'day';
  #createPointPresenter = null;

  #loadingComponent = new LoadingView();
  #isLoading = true;

  constructor({eventsListContainer, pointsModel, filterModel, newEventButton}) {
    this.#eventsListContainer = eventsListContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    newEventButton.addEventListener('click',this.#handleNewPointClick);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {

    //this.#renderSort();

    render(
      this.#eventsListComponent,
      this.#eventsListContainer
    );

    render(
      this.#loadingComponent,
      this.#eventsListComponent.element
    );
    //this.#renderPoints();
  }

  #getPoints() {

    const filterType = this.#filterModel.filter;

    const points = filter[filterType](this.#pointsModel.getPoints());

    return points
      .slice()
      .sort(sort[this.#currentSortType]);
  }

  #renderSort() {

    if (this.#sortingComponent) {
      return;
    }

    this.#sortingComponent =
      new SortingView({
        currentSortType:this.#currentSortType,
        onSortTypeChange:this.#handleSortChange
      });

    render(
      this.#sortingComponent,
      this.#eventsListContainer,
      'afterbegin'
    );
  }

  #renderPoints() {
    if (this.#isLoading) {
      return;
    }

    this.#renderSort();
    const points = this.#getPoints();

    if (!points.length) {

      render(
        new NoPointsView({filterType: this.#filterModel.filter}),
        this.#eventsListComponent.element
      );

      return;
    }

    points.forEach(
      (point) =>
        this.#renderPoint(point)
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
        allOffers:this.#pointsModel.getOffersByType(point.type),
        allOffersByType:this.#pointsModel.offers,
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

  #handleCreateDestroy = () => {

    this.#createPointPresenter.destroy();

    this.#createPointPresenter = null;

  };

  #handlePointChange = async (actionType, updatedPoint) => {

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        await this.#pointsModel.updatePoint(updatedPoint);
        break;

      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updatedPoint);
        this.#clearPoints();
        this.#renderPoints();
        break;

      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updatedPoint);

        this.#createPointPresenter?.destroy();
        this.#createPointPresenter = null;

        this.#clearPoints();
        this.#renderPoints();

        break;
    }

  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPoints();

    this.#renderPoints();
  };

  #handleModelEvent = () => {
    this.#isLoading = false;
    remove(this.#loadingComponent);
    this.#currentSortType = 'day';

    this.#clearPoints();
    this.#renderPoints();
  };

  #handleNewPointClick = () => {
    this.#currentSortType = 'day';
    this.#filterModel.setFilter('everything');
    this.#resetAllPoints();

    if (this.#createPointPresenter) {
      return;
    }

    this.#createPointPresenter = new CreatePointPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onDestroy: this.#handleCreateDestroy
    });

    this.#createPointPresenter.init();
  };

  #refreshPoints() {
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  }

  #clearPoints() {
    this.#pointPresenters
      .forEach(
        (presenter) =>
          presenter.destroy()
      );

    this.#pointPresenters.clear();

    this.#eventsListComponent.element.innerHTML = '';

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    remove(this.#sortingComponent);

    this.#sortingComponent = null;
  }

  #resetAllPoints = (currentPresenter) => {
    this.#pointPresenters
      .forEach((presenter) => {

        if (presenter !== currentPresenter) {
          presenter.resetView();
        }
      });
  };
}
