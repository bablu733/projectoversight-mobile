import { File } from "./request/File";

export interface Task {
    employeeId:number,
    uIUserStoryId:number;
    uIId:number;
    id:number;
    userStoryId:number;
    projectId:number;
    categoryId:any;
    name:string;
    description:string;
    startDate:Date;
    endDate:Date;
    estTime:number;
    actTime:number;
    weekEndingDate:Date;
    status:string;
    priority:string;
    percentage:number;
    Comment:string;
    EstimateStartDate:Date;
    EstimateEndDate:Date;
    taskType:string;
    classification:string;
    taskDescription:string;
    selectedImages:File;
}