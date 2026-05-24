import {render, remove, RenderPosition} from '../framework/render.js';
import EditingFormView from '../view/editing-form-view.js';
import {UserAction} from '../const.js';

const createBlankPoint = () => ({
  id: String(Date.now()),
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi'
});

export default class CreatePointPresenter {
  #eventsListContainer = null;
  #onDataChange = null;
  #onDestroy = null;
  #pointsModel = null;
  #pointComponent = null;

  constructor({
    eventsListContainer,
    pointsModel,
    onDataChange,
    onDestroy
  }) {

    this.#eventsListContainer = eventsListContainer;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;

  }

  init() {

    if (this.#pointComponent) {
      return;
    }

    this.#pointComponent = new EditingFormView({
      point: createBlankPoint(),
      isCreating: true,
      destination: null,
      offers: [],
      allOffers: [],
      allOffersByType: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations,
      onCloseEditButtonClick: this.destroy,
      onSubmitButtonClick: this.#handleSubmit,
      onDeleteClick: this.destroy
    });

    render(

      this.#pointComponent,

      this.#eventsListContainer,

      RenderPosition.AFTERBEGIN

    );

    document.addEventListener(
      'keydown',
      this.#escKeyDownHandler
    );

  }

  destroy = () => {

    if (
      !this.#pointComponent
    ) {
      return;
    }

    remove(
      this.#pointComponent
    );

    this.#pointComponent =
      null;

    document.removeEventListener(
      'keydown',
      this.#escKeyDownHandler
    );

    this.#onDestroy();

  };

  #handleSubmit = (
    point
  ) => {

    this.#onDataChange(

      UserAction.ADD_POINT,

      point

    );

    this.destroy();

  };

  #escKeyDownHandler = (
    evt
  ) => {

    if (
      evt.key !== 'Escape'
    ) {
      return;
    }

    evt.preventDefault();

    this.destroy();

  };
}
