import {render, replace, remove} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditingFormView from '../view/editing-form-view.js';

export default class PointPresenter {

  #eventsListContainer = null;

  #point = null;
  #destination = null;
  #offers = null;

  #allOffers = null;
  #allOffersByType = null;

  #allDestinations = null;

  #pointComponent = null;
  #editPointComponent = null;

  #onDataChange = null;
  #onModeChange = null;

  #mode = 'DEFAULT';

  constructor({
    eventsListContainer,
    point,
    destination,
    offers,
    allOffers,
    allOffersByType,
    allDestinations,
    onDataChange,
    onModeChange
  }) {

    this.#eventsListContainer = eventsListContainer;
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#allOffers = allOffers;
    this.#allOffersByType = allOffersByType;
    this.#allDestinations = allDestinations;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(updatedPoint = null) {

    if (updatedPoint) {
      this.#point = updatedPoint;
    }

    const prevPoint = this.#pointComponent;

    const prevEdit = this.#editPointComponent;

    this.#pointComponent =
      new RoutePointView({
        point: this.#point,
        destination: this.#destination,
        offers: this.#offers,
        onOpenEditButtonClick: this.#handleOpenEditClick,
        onFavoriteClick: this.#handleFavoriteClick
      });

    this.#editPointComponent =
      new EditingFormView({
        point: this.#point,
        destination: this.#destination,
        offers: this.#offers,
        allOffers: this.#allOffers,
        allOffersByType: this.#allOffersByType,
        allDestinations: this.#allDestinations,
        onCloseEditButtonClick: this.#handleCloseEditClick,
        onSubmitButtonClick: this.#handleFormSubmit
      });

    if (prevPoint === null || prevEdit === null) {

      render(
        this.#pointComponent,
        this.#eventsListContainer
      );

      this.#mode = 'DEFAULT';

      return;
    }

    replace(
      this.#pointComponent,
      prevPoint
    );

    replace(
      this.#editPointComponent,
      prevEdit
    );

    remove(prevPoint);
    remove(prevEdit);

  }

  destroy() {

    remove(
      this.#pointComponent
    );

    remove(
      this.#editPointComponent
    );

  }

  resetView() {

    if (this.#mode !== 'EDITING') {
      return;
    }

    this.#replaceEditToPoint();

  }

  #replacePointToEdit() {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#mode = 'EDITING';
    document.addEventListener('keydown', this.#escKeyDownHandler);

  }

  #replaceEditToPoint() {
    this.#editPointComponent.reset(this.#point);
    replace(this.#pointComponent,this.#editPointComponent);
    this.#mode = 'DEFAULT';
    document.removeEventListener('keydown', this.#escKeyDownHandler);

  }

  #handleOpenEditClick = () => {
    this.#onModeChange(this);
    this.#replacePointToEdit();
  };

  #handleCloseEditClick = () => {
    this.#replaceEditToPoint();
  };

  #handleFavoriteClick = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  #handleFormSubmit = () => {
    this.#replaceEditToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToPoint();
    }
  };
}
