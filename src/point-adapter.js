export default class PointAdapter {

  static adaptToClient(point) {

    return {
      id: point.id,
      basePrice: point.base_price,
      dateFrom: point.date_from ? new Date(point.date_from) : null,
      dateTo: point.date_to ? new Date(point.date_to) : null,
      destination: point.destination,
      isFavorite: point.is_favorite,
      offers: point.offers,
      type: point.type
    };

  }

  static adaptToServer(point) {
    return {
      'id': point.id,
      'base_price': Number(point.basePrice),
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'destination': point.destination,
      'is_favorite': point.isFavorite,
      'offers': point.offers,
      'type': point.type
    };
  }

}
