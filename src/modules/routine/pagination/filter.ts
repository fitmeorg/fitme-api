import { Filter } from 'src/common/types';

export const filters: Filter[] = [
  { filter: 'categories', field: 'categories', operator: 'in' },
  { filter: 'name', field: 'name', operator: 'search' },
];

export function filterFindAll(userId: string) {
  return {
    $or: [{ shareTo: `${userId}` }, { createdBy: `${userId}` }],
  };
}
