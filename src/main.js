import FilterView from './view/filters-view.js';
import SortingView from './view/sorting-view.js';
import MainPresenter from './presenter/main-presenter.js';
import PointsModel from './model/point-model.js';
import {render} from './framework/render.js';

const tripMainElement = document.querySelector('.trip-main');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsSectionElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const eventsListPresenter = new MainPresenter({eventsListContainer: tripEventsSectionElement, pointsModel});

render(new FilterView(), tripFiltersElement);
render(new SortingView(), tripEventsSectionElement);

eventsListPresenter.init();
