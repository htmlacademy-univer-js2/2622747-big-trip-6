import {FilterType} from './model/filter-model.js';

const isFuture = (dateFrom) => dateFrom > new Date();
const isPast = (dateTo) => dateTo < new Date();
const isPresent = (dateFrom, dateTo) => dateFrom <= new Date() && dateTo >= new Date();

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) =>
    points.filter((point) => isFuture(point.dateFrom)),

  [FilterType.PRESENT]: (points) =>
    points.filter((point) => isPresent(point.dateFrom, point.dateTo)),

  [FilterType.PAST]: (points) =>
    points.filter((point) => isPast(point.dateTo)),
};
