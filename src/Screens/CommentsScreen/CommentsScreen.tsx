import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAxios } from '../../Contexts/Axios';
import { Comments } from '../../Models/Comments';
import LottieAnimation from '../../Components/Animation';
import POInputBoxField from '../../Components/POInputBoxField';
import POInputField from '../../Components/POSInputField';
import { ProgressBar } from 'react-native-paper';
import FloatingButton from '../../Components/FloatingButton';
import { TaskModel } from '../../Models/TaskModel';
import EmployeeProgressTracker from '../../Components/EmployeeProgressTracker';
import POProjectListItem from '../../Components/POProjectListItem';
import { EmployeeStackParamList } from '../../Routes/EmployeeStack';
import { useAuth } from '../../Contexts/Auth';
import { DayPlanModel } from '../../Models/DayPlanModel';
import moment from 'moment';

type CommentsScreenProp = NativeStackNavigationProp<EmployeeStackParamList, "Comments">;
type CommentsListRouteProps = RouteProp<EmployeeStackParamList, "Comments">;

const CommentScreen: React.FC = () => {
  const navigation = useNavigation<CommentsScreenProp>();
  const axios = useAxios();
  const auth = useAuth();
  const route = useRoute<CommentsListRouteProps>();
  const [comments, setComments] = useState<Comments[]>([]);
  const [loading, setLoading] = useState(false);
  const [TaskId] = useState(route.params.TaskId);
  const [Name] = React.useState<string>(route.params.Name);
  const [ProjectId] = React.useState(route.params?.ProjectId);
  const employeeId = auth.loginData.employeeId;
  const [message, setMessage] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [replies, setReplies] = useState<string[]>([]);
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [list, setList] = React.useState<TaskModel[]>([]);
  const [originalList, setOriginalList] = React.useState<TaskModel[]>([]);
  const [employeeTaskId] = React.useState(route.params?.EmployeeTaskId);
  const [employeeDailyTaskId] = React.useState(route.params?.EmployeeDailyTaskId);

  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleSend = () => {
    debugger
    if (message) {
      setReplies((prevReplies) => [...prevReplies, message]);
      setMessage('');
      const AssignComment: Comments = {
        id: undefined,
        projectId: ProjectId,
        taskId: TaskId,
        employeeTaskId: employeeTaskId,
        employeeDailyTaskId: employeeDailyTaskId,
        employeeId: employeeId,
        employeeTimeId: undefined,
        comment: message,
        employeeName: Name,
        status: undefined,
        percentage: undefined,
        createdOn:undefined,
        createdBy:'reply',
        project:undefined,
        employee:undefined,
        createdDate:undefined,
      };

      axios.privateAxios
        .post<Comments>("/app/Common/AddReplyComments", AssignComment)
        .then((response) => {
          debugger
          console.log(response.data);
          setIsReplyVisible(true);
          navigation.pop();
        })
        .catch((error) => {
           debugger
        });
    }
  };


  const loadConnectionList = async () => {
    setLoading(true);
    try {
      const response = await axios.privateAxios.get<Comments[]>("/app/Common/GetCommentsList?EmployeeTaskId=" + TaskId);
      setLoading(false);
      setComments(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    loadConnectionList();
  }, []);

  const getProgressColor = (progress: number): string => {
    if (progress >= 0 && progress < 25) {
      return 'red';
    } else if (progress >= 25 && progress < 50) {
      return 'yellow';
    } else if (progress >= 50 && progress < 95) {
      return 'orange';
    } else if (progress >= 95 && progress <= 100) {
      return 'green';
    } else {
      return '#4287f5'; // Default color
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Ionicons
          name="chevron-back"
          size={30}
          color="#fff"
          style={styles.backButton}
          onPress={handleBackPress}
        />
        <Text style={styles.headingText}>Comments</Text>

      </View>
      <View style={styles.bottomView}>
        <SafeAreaView>
          <EmployeeProgressTracker></EmployeeProgressTracker>

        </SafeAreaView>
        <Text style={styles.title}>Comments List</Text>

        {loading && (
          <LottieAnimation
            source={require('../../../assets/icons/Loading.json')}
            autoPlay={true}
            loop={true}
            visible={loading}
          />
        )}

        <ScrollView contentContainerStyle={styles.commentsContainer}>

          {comments.length === 0 ? (
            <Text style={styles.noCommentsText}>No comments available</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                  <Ionicons name="person" size={24} color="#333" style={styles.profileIcon} />
                  <Text style={styles.commentUser}>{comment.employeeName}</Text>
                </View>
                <View style={styles.commentBubble}>
                  <POInputBoxField
                    label={"Comments"}
                    placeholder={""}
                    value={comment.comment}
                    onChangeText={""}
                    numberOfLines={4}
                    multiline={true}
                    secureTextEntry={false}
                    keyboardType={"ascii-capable"}
                    maxLength={500}
                    editable={false}
                    autoFocus={false}
                    mandatory={false}
                    NonEditablelabel='Comments'
                  />

                  <POInputField
                    label='Status'
                    value={comment.status}
                    editable={false}
                    NonEditablelabel='Status'
                  />
                  <View style={styles.progressContainer}>
                    <Text style={styles.percentageText}>Percentage</Text>
                    <ProgressBar progress={comment.percentage / 100} color={getProgressColor(comment.percentage)} style={[styles.progress, styles.progressBar]} />
                    <Text style={styles.percentageText}>{comment.percentage}%</Text>
                  </View>
                  <View style={{ marginTop: 30 }}>
                    <Text style={[styles.commentCreatedDate, styles.bottomRightCorner]}>Created on: {moment(comment.createdDate).format('DD-MM-YYYY hh:mm a')}</Text>
                  </View>

                </View>



              </View>
            ))
          )}

          {isReplyVisible && (
            <View style={styles.commentReplyBubble}>
              <POInputBoxField
                label={"Comments"}
                placeholder={""}
                value={message}
                //onChangeText={}
                numberOfLines={4}
                multiline={true}
                secureTextEntry={false}
                keyboardType={"ascii-capable"}
                maxLength={500}
                editable={false}
                autoFocus={false}
                mandatory={false}
                NonEditablelabel='Comments'
              />
            </View>
          )}

        </ScrollView>


        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <FloatingButton
            title='Send'
            icon='send'
            variant='contained'
            style={{ backgroundColor: '#35A2C1', justifyContent: 'center', alignItems: 'center', left: 30 }}
            onPress={handleSend}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A9EC2',
  },
  topView: {
    marginTop: 30,
    marginHorizontal: 24,
    backgroundColor: '#3A9EC2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    bottom: 55,
  },
  headingText: {
    position: 'absolute',
    top: 15,
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomView: {
    flex: 6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    marginHorizontal: 26,
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 20,
  },
  commentsContainer: {
    margin: 20,
    paddingBottom: 80,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentUser: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentBubble: {
    backgroundColor: '#ECECEC',
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
  },
  commentReplyBubble: {
    backgroundColor: '#ECECEC',
    borderRadius: 30,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'flex-end',
    width: 280
  },
  commentText: {
    fontSize: 16,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 20,
  },
  noCommentsText: {
    fontSize: 16,
    //textAlign='center',
    marginTop: 20,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileIcon: {
    marginRight: 8,
  },
  progressBar: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginLeft: 20,
    width: 180
  },
  progress: {
    height: 5,
    borderRadius: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    color: '#256D85',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  typedMessage: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  replyContainer: {
    marginTop: 10,
  },
  replyLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  replyMessage: {
    marginLeft: 10,
    fontSize: 16,
  },
  oppositeCommentBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: 300
  },
  oppositeCommentText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentCreatedDate: {
    fontSize: 12,
    color: '#777',
    marginLeft: 8,
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default CommentScreen;
