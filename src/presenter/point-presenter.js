import {render, replace, remove} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import { UserAction } from '../const.js';

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

    this.#updateViewData();

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
        allOffers: this.#allOffersByType[this.#point.type] || [],
        allOffersByType: this.#allOffersByType,
        allDestinations: this.#allDestinations,
        onCloseEditButtonClick: this.#handleCloseEditClick,
        onSubmitButtonClick: this.#handleFormSubmit,
        onDeleteClick: this.#handleDeleteClick
      });

    if (prevPoint === null || prevEdit === null) {

      render(
        this.#pointComponent,
        this.#eventsListContainer
      );

      this.#mode = 'DEFAULT';

      return;
    }

    if (this.#mode === 'DEFAULT') {

      replace(
        this.#pointComponent,
        prevPoint
      );

    } else {

      replace(
        this.#editPointComponent,
        prevEdit
      );

    }

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

  #updateViewData() {

    this.#destination =
      this.#allDestinations.find((d) => d.id === this.#point.destination) || null;

    const offersGroup = this.#allOffersByType.find(
      (group) => group.type === this.#point.type
    );

    this.#offers = (offersGroup?.offers || [])
      .filter((offer) =>
        (this.#point.offers || [])
          .includes(offer.id)
      );

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

    this.#onDataChange(UserAction.UPDATE_POINT,{
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });

  };

  #handleFormSubmit = (updatedPoint) => {

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      updatedPoint
    );

    //this.#replaceEditToPoint();

  };

  #handleDeleteClick = () => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      this.#point
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToPoint();
    }
  };

  setSaving() {

    if (this.#mode === 'EDITING') {
      this.#editPointComponent.setSaving();
    }

  }

  setDeleting() {

    if (this.#mode === 'EDITING') {
      this.#editPointComponent.setDeleting();
    }

  }

  setAborting() {

    this.#editPointComponent.setAborting();

  }
}
