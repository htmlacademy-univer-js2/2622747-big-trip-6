import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';

const tripMainElement = document.querySelector('.trip-main');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsSectionElement = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({filterContainer: tripFiltersElement, filterModel, pointsModel});

const eventsListPresenter = new MainPresenter({eventsListContainer: tripEventsSectionElement, pointsModel, filterModel, newEventButton});

eventsListPresenter.init();
filterPresenter.init();

