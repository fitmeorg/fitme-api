import { getTimezoneList } from 'timezone-by-country';

export const tzCode = getTimezoneList().map((timeZone) => timeZone.name);
