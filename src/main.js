import {render} from './render.js';
import FilterView from './view/filters-view.js';
import SortingView from './view/sorting-view.js';
import MainPresenter from './presenter/main-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsSectionElement = document.querySelector('.trip-events');
const eventsListPresenter = new MainPresenter({eventsListContainer: tripEventsSectionElement});

render(new FilterView(), tripFiltersElement);
render(new SortingView(), tripEventsSectionElement);

eventsListPresenter.init();
