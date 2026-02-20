import CreationFormView from '../view/creation-form-view.js';
import EventsListView from '../view/events-list-view.js';
import EditingFormView from '../view/editing-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import {render} from '../render.js';

export default class MainPresenter {
  eventsListComponent = new EventsListView();

  constructor({eventsListContainer}) {
    this.eventsListContainer = eventsListContainer;
  }

  init() {
    render(this.eventsListComponent, this.eventsListContainer);
    render(new EditingFormView(), this.eventsListComponent.getElement());
    render(new CreationFormView(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++){
      render(new RoutePointView(), this.eventsListComponent.getElement());
    }
  }
}
