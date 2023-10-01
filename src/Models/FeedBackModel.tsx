import { DateTime } from "i18n-js";

export interface FeedBackModel {
    EmployeeId: number;
    Name: string;
    Description: string;
    Rating: string;
    CreatedDate: DateTime;
    CreatedBy: DateTime;
    UpdatedDate: string;
    UpdatedBy: string;
}
