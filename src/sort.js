import {SortType} from './const.js';

const sortDay = (pointA, pointB) =>
  pointA.dateFrom - pointB.dateFrom;

const sortPrice = (pointA, pointB) =>
  pointB.basePrice - pointA.basePrice;

const sortTime = (pointA, pointB) => {
  const durationA =
    pointA.dateTo - pointA.dateFrom;

  const durationB =
    pointB.dateTo - pointB.dateFrom;

  return durationB - durationA;
};

export const sort = {
  [SortType.DAY]: sortDay,

  [SortType.PRICE]: sortPrice,

  [SortType.TIME]: sortTime,
};
