import {render, replace, remove} from '../framework/render.js';
import FiltersView from '../view/filter-view.js';

export default class FilterPresenter {

  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor({
    filterContainer,
    filterModel,
    pointsModel
  }) {

    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(
      this.#handleModelEvent
    );
  }

  init() {

    const prevFilter = this.#filterComponent;

    this.#filterComponent =
      new FiltersView({
        currentFilter: this.#filterModel.filter,
        onFilterChange: this.#handleFilterChange
      });

    if (!prevFilter) {

      render(
        this.#filterComponent,
        this.#filterContainer
      );

      return;
    }

    replace(
      this.#filterComponent,
      prevFilter
    );

    remove(prevFilter);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
