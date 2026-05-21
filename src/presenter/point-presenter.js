import {render, replace, remove} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditingFormView from '../view/editing-form-view.js';

export default class PointPresenter {
  #eventsListContainer = null;

  #point = null;
  #destination = null;
  #offers = null;

  #allOffers = null;
  #allDestinations = null;

  #onDataChange = null;

  #mode = 'VIEW';

  #pointComponent = null;
  #editPointComponent = null;

  #onModeChange = null;

  constructor({
    eventsListContainer,
    point,
    destination,
    offers,
    allOffers,
    allDestinations,
    onDataChange,
    onModeChange
  }) {
    this.#eventsListContainer = eventsListContainer;

    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;

    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(updatedPoint = this.#point) {
    this.#point = updatedPoint;

    if (!this.#pointComponent || !this.#editPointComponent) {
      this.#renderComponents();
      return;
    }

    if (this.#mode === 'EDIT') {
      this.#updateEditView();
      return;
    }

    this.#updatePointView();
  }

  #renderComponents() {
    this.#pointComponent = this.#createPointView();
    this.#editPointComponent = this.#createEditView();

    render(this.#pointComponent, this.#eventsListContainer);
  }

  #createPointView() {
    return new RoutePointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onOpenEditButtonClick: this.#handleOpenEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
  }

  #createEditView() {
    return new EditingFormView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onCloseEditButtonClick: this.#handleCloseEditClick,
      onSubmitButtonClick: this.#handleFormSubmit
    });
  }

  #updatePointView() {
    const newPointComponent = this.#createPointView();

    replace(newPointComponent, this.#pointComponent);

    this.#pointComponent = newPointComponent;
  }

  #updateEditView() {
    const newEditComponent = this.#createEditView();

    replace(newEditComponent, this.#editPointComponent);

    this.#editPointComponent = newEditComponent;
  }

  #replacePointToEditPoint = () => {
    this.#mode = 'EDIT';

    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceEditPointToPoint = () => {
    this.#mode = 'VIEW';

    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditPointToPoint();
    }
  };

  #handleOpenEditClick = () => {
    this.#onModeChange?.();
    this.#replacePointToEditPoint();
  };

  #handleCloseEditClick = () => {
    this.#replaceEditPointToPoint();
  };

  #handleFormSubmit = () => {
    this.#replaceEditPointToPoint();
  };

  #handleFavoriteClick = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  resetView = () => {
    if (this.#mode !== 'VIEW') {
      this.#replaceEditPointToPoint();
    }
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
