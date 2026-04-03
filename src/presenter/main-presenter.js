import EventsListView from '../view/events-list-view.js';
import EditingFormView from '../view/editing-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import {render, replace} from '../framework/render.js';

export default class MainPresenter {
  #eventsListContainer = null;
  #pointsModel = null;

  #eventsListComponent = new EventsListView();

  constructor({eventsListContainer, pointsModel}) {
    this.#eventsListContainer = eventsListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const eventsListPoints = this.#pointsModel.points;

    render(this.#eventsListComponent, this.#eventsListContainer);

    for (let i = 0; i < eventsListPoints.length; i++) {
      const point = eventsListPoints[i];
      const destination = this.#pointsModel.getDestinationById(point.destination);
      const offers = this.#pointsModel.getOffersByIds(point.offers);

      this.#renderPoint(point, destination, offers);
    }

  }

  #renderPoint(point, destination, offers) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditPointToPoint();
      }
    };

    const onOpenEditButtonClick = () => {
      replacePointToEditPoint();
    };

    const onCloseEditButtonClick = () => {
      replaceEditPointToPoint();
    };

    const onSubmitButtonClick = () => {
      replaceEditPointToPoint();
    };

    const pointComponent = new RoutePointView({point, destination, offers, onOpenEditButtonClick});

    const editPointComponent = new EditingFormView({
      point,
      destination,
      offers,
      allOffers: this.#pointsModel.getOffersByType(point.type),
      allDestinations: this.#pointsModel.destinations,
      onCloseEditButtonClick,
      onSubmitButtonClick
    });

    function replacePointToEditPoint() {
      replace(editPointComponent, pointComponent);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function replaceEditPointToPoint(){
      replace(pointComponent, editPointComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#eventsListComponent.element);
  }
}

