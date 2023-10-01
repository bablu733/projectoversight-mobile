import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/EmployeeHomeScreen';
import TaskScreen from '../Screens/TaskScreens/TaskScreen';
import { longPressHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler';
import PlanScreen from '../Screens/DayPlanScreens/PlanScreen';
import TimeScreen from '../Screens/EmployeeDailyTask/EmployeeDailyTask';
import WorkHistory from '../Screens/MyWorkHistory';
import ProjectScreen from '../Screens/TaskScreens/ProjectsScreen';
import RegistrationScreen from '../Screens/RegistrationScreen';
import CategoryScreen from '../Screens/TaskScreens/CategoryScreen';
import UIlistScreen from '../Screens/TaskScreens/UIListScreen';
import USlistScreen from '../Screens/TaskScreens/UserStoryListScreen';
import AssignTaskScreen from '../Screens/TaskScreens/USCreateTask';
import DayPlanTaskScreen from '../Screens/DayPlanScreens/DayPlanTaskScreen';
import DayPlanTaskDetailsScreen from '../Screens/DayPlanScreens/DayPlanTaskDetailsScreen';
import CreateUITaskScreen from '../Screens/TaskScreens/UICreateTask';
import EmployeeAssignedTask from '../Screens/EmployeeDailyTask/EmployeeTaskAssignedList';
import EmployeeDailyTaskDetails from '../Screens/EmployeeDailyTask/EmployeeDailyTaskDetails';
import { EmployeeTask } from '../Models/EmployeeTask';
import EmployeeTimeScreen from '../Screens/EmployeeTimeScreen';
import MyTaskList from '../Screens/MyTaskList/MyTaskList';
import { StackNavigationProp } from '@react-navigation/stack';
import WhatsappTaskListScreen from '../Screens/WhatsappTask/WhatsapptaskList';
import { TaskModel } from '../Models/TaskModel';
import { FeedBackModel } from '../Models/FeedBackModel';
import MyTaskListBasedonproject from '../Screens/MyTaskList/MyTaskListBasedOnProject';
import CommentScreen from '../Screens/CommentsScreen/CommentsScreen';
import WhatsappCompletedTaskListScreen from '../Screens/WhatsappTask/WhatsapptaskListForCompletedTask';
import LeaveAppliedScreen from '../Screens/LeaveScreens/LeaveAppliedScreen';
import LeaveApplyScreen from '../Screens/LeaveScreens/LeaveApplyScreen';
import ReleaseNotesProjectList from '../Screens/ReleaseNotesScreens/ReleaseNotesProjectList';
import ReleaseNotesShare from '../Screens/ReleaseNotesScreens/ReleaseNotesShare';
import AddDayPlanTaskDetailsScreen from '../Screens/DayPlanScreens/AddDayplanScreen';
import { EmployeeDailyTask } from '../Models/EmployeeDailyTask';
import FeedBackScreen from '../Screens/FeedBackScreens/FeedBackScreen';
import TaskDetailsScreen from '../Screens/TaskScreens/TaskDetailsScreen';

export type EmployeeStackParamList = {
Home:undefined;
Task:undefined;
Plan:undefined;   
Time:undefined;
WorkHistory:undefined;
Projects:undefined;
Register:undefined;
UIList:{ProjectId:number, Name: string,CategoryIds:number,UserStoryId:number,USName:string,CategoryName:string,subCategoryName:string};
USList:{ProjectId:number,Name:string,CategoryIds:number,isUIApplicable:boolean,CategoryName:string,subCategoryName:string};
Category:{ProjectId:number, Name: string};
Assign:{userStoryId:number,projectId:number,CategoryIds:number,USName:string,Description:string,Name:string,CategoryName:string,subCategoryName:string};
DayPlanTaskScreen: { ProjectId: number; ProjectName: string};
DayPlanTaskDetails: { Id: number, Name: string, description: string, status: string ,ProjectId:number,percentage:number,priority:string,ProjectName:string,estimate: number};
UICreateTask:{userInterfaceId:number,projectId:number,CategoryIds:number,UIName:string,Description:string,UserStoryId:number,CategoryName:string,subCategoryName:string,Name:string,USName:string};
EmployeeAssignedTask:{ProjectName: string};
//EmployeeDailyTaskDetails : {Id: number, Name: string, description: string, status: string ,ProjectId:number,percentage:number,priority:string}
EmployeeDailyTaskDetails : {EmployeeDailyTask : EmployeeDailyTask}
EmployeeTime:undefined;
MyTask:undefined;
MyTaskBasedOnproject:{ProjectId:number};
WhatsappTaskList : {ProjectTask : TaskModel[]};
Comments:{TaskId:number,EmployeeTaskId:number,Name:string,ProjectId:number,EmployeeDailyTaskId:number};
WhatsappCompletedTaskList :undefined;

ReleaseNotesProjectList:undefined;
ReleaseNotesShare:{ProjectId:number,projectName:string};
LeaveApplyScreen:undefined;
LeaveAppliedScreen:undefined;
FeedBackScreen:{EmplyeeId:FeedBackModel[]};
 //FeedBackScreen:undefined;
TaskDetailsScreen:{TaskId:number,EmployeeTaskId:number,Name:string,ProjectId:number,EmployeeDailyTaskId:number};
AddDayPlanTaskDetails : {ProjectId:number,projectName:string, employeeTaskId:number,taskName:string, taskId: number}
}
export type HomeScreenProp = StackNavigationProp<EmployeeStackParamList, 'Home'>;
const Stack = createStackNavigator<EmployeeStackParamList>();

export const EmployeeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Task" component={TaskScreen} />
      <Stack.Screen name="Plan" component={PlanScreen} />
      <Stack.Screen name="Time" component={TimeScreen} />
      <Stack.Screen name="WorkHistory" component={WorkHistory} />
      <Stack.Screen name="Projects" component={ProjectScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="UIList" component={UIlistScreen} />
      <Stack.Screen name="USList" component={USlistScreen} />
      <Stack.Screen name="Assign" component={AssignTaskScreen} />
      <Stack.Screen name="DayPlanTaskScreen" component={DayPlanTaskScreen} />
      <Stack.Screen name="DayPlanTaskDetails" component={DayPlanTaskDetailsScreen} />
      <Stack.Screen name="UICreateTask" component={CreateUITaskScreen} />
      <Stack.Screen name="EmployeeAssignedTask" component={EmployeeAssignedTask} />
      <Stack.Screen name="EmployeeDailyTaskDetails" component={EmployeeDailyTaskDetails} />
      <Stack.Screen name="EmployeeTime" component={EmployeeTimeScreen} />
      <Stack.Screen name="MyTask" component={MyTaskList} />
      <Stack.Screen name="MyTaskBasedOnproject" component={MyTaskListBasedonproject} />
      <Stack.Screen name="WhatsappTaskList" component={WhatsappTaskListScreen} />
      <Stack.Screen name="Comments" component={CommentScreen} />
      <Stack.Screen name="WhatsappCompletedTaskList" component={WhatsappCompletedTaskListScreen} />
      <Stack.Screen name="LeaveApplyScreen" component={LeaveApplyScreen}/>
      <Stack.Screen name="LeaveAppliedScreen" component={LeaveAppliedScreen}/>
      <Stack.Screen name="ReleaseNotesProjectList" component={ReleaseNotesProjectList}/>
      <Stack.Screen name="ReleaseNotesShare" component={ReleaseNotesShare}/>
      <Stack.Screen name="AddDayPlanTaskDetails" component={AddDayPlanTaskDetailsScreen}/>
      <Stack.Screen name="FeedBackScreen" component={FeedBackScreen}/>
      <Stack.Screen name="TaskDetailsScreen" component={TaskDetailsScreen} />
     
    </Stack.Navigator>
  );
}