import { HttpParams } from "@angular/common/http";

export function getHttpParams(data: any) {
  const newObject = { ...data };

  for (const key in newObject) {
    if (newObject[key] === undefined) {
      delete newObject[key];
    }
  }

  const params = new HttpParams({ fromObject: newObject });
  return params;
}
