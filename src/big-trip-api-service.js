import ApiService from './framework/api-service.js';
import PointAdapter from './point-adapter.js';

export default class BigTripApi extends ApiService {

  async points() {
    const response = await this._load({
      url: 'points'
    });

    const points = await ApiService.parseResponse(response);

    return points.map(PointAdapter.adaptToClient);
  }

  async destinations() {
    const response = await this._load({
      url: 'destinations'
    });

    return ApiService.parseResponse(response);
  }

  async offers() {
    const response = await this._load({
      url: 'offers'
    });

    return ApiService.parseResponse(response);
  }

  async updatePoint(point) {

    const response = await this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(
        PointAdapter.adaptToServer(point)
      ),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return ApiService.parseResponse(response);
  }

  async createPoint(point) {
    console.log('SENDING TO SERVER:', PointAdapter.adaptToServer(point));
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(
        PointAdapter.adaptToServer(point)
      ),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return PointAdapter.adaptToClient(
      await ApiService.parseResponse(response)
    );
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'DELETE'
    });

    return response;
  }
}
