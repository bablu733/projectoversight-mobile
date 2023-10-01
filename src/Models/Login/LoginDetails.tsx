import { DateTime } from "i18n-js/typings";

export interface LoginDetails {
    Id:number;
    InTime: DateTime | null;
    OutTime: DateTime | null;
    Comments: string;
    Latitude: number;
    Longitude: number;
  }