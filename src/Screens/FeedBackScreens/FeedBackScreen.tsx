import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FeedbackSlider from '../../Components/FeedBackSlider';
import POInputField from '../../Components/POSInputField';
import POInputBoxField from '../../Components/POInputBoxField';
import FeedbackAlignment from '../../Components/FeedBackAlignment';
import { useAuth } from '../../Contexts/Auth';
import { useAxios } from '../../Contexts/Axios';
import FloatingButton from '../../Components/FloatingButton';
import EmployeeAssignedTask from "../EmployeeDailyTask/EmployeeTaskAssignedList";
import { DateTime } from "i18n-js";
import { Rating } from "react-native-elements";

interface FeedBackModel {
  EmployeeId: number;
  Name: string;
  Description: string;
  Rating: string;
  CreatedDate: DateTime;
  UpdatedDate: DateTime;
  CreatedBy: string;
  UpdatedBy: string;
}

const FeedBackScreen: React.FC = () => {
  const auth = useAuth();
  const axios = useAxios();
  const [Name, setName] = useState('');
  const [Description, setDescription] = useState('')
  const [selectedRating, setSelectedRating] = useState('');
  const [isFormReady, setIsFormReady] = useState(false);
  const EmployeeId = auth.loginData.employeeId;
  const [DescriptionError, setDescriptionError] = useState('');
  const [error, setError] = React.useState<string>();
  const [NameError, setNameError] = useState('');
  const [RatingError, setRatingError] = React.useState('');
  const [Connected, setConnected]=React.useState('');
  const [feedbackForm, setFeedbackForm] = useState<FeedBackModel>({
    EmployeeId: EmployeeId,
    Name: '',
    Description: '',
    Rating: '',
    CreatedDate: new Date(),
    UpdatedDate: new Date(),
    CreatedBy: '',
    UpdatedBy: ''

  });

  useEffect(() => {
    checkFormValidity();
  }, [Name, Description, selectedRating]);

  const checkFormValidity = () => {
    setIsFormReady(Name.trim().length > 0 && Description.trim().length > 0 && selectedRating > '');
  };

  const navigation = useNavigation();

  const FeedbackRating = ({ selectedRating, onRatingSelect }) => {
    const renderRatingIcon = (rating: string) => {
      const isSelected = rating <= selectedRating;
      const color = isSelected ? "#FFA500" : "#ccc";

      return (
        <TouchableOpacity
          key={rating}
          onPress={() => onRatingSelect(rating)}
          style={styles.ratingIcon}
        >
          <Ionicons name="star" size={30} color={color} />
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) =>
          renderRatingIcon(rating.toString())
        )}
      </View>
    );
  };

  const handleRatingSelect = (rating: string) => {
    setFeedbackForm({
      ...feedbackForm,
      Rating: rating,
      Description:
        rating === '1'
          ? 'Bad'
          : rating === '2'
            ? 'Not Good'
            : rating === '3'
              ? 'Average'
              : rating === '4'
                ? 'Very Good'
                : 'Excellent',

    });
    setSelectedRating(rating);
  };

  const handleFeedbackSubmit = () => {
    debugger
    if (isFormReady) {
      if(!Connected){
        Alert.alert("No Internet Connection");
        return;
      }
      console.log('Feedback submitted!', {
        EmployeeId: EmployeeId,
        Name: Name,
        Description: Description,
        Rating: selectedRating,
        CreatedDate: new Date(),
        UpdatedDate: new Date(),
        CreatedBy: EmployeeId,
        UpdatedBy: EmployeeId
      });
      

      const newCreateFeedBack: FeedBackModel = {
        EmployeeId: EmployeeId,
        Name: Name,
        Description: Description,
        Rating: '',
        CreatedDate: new Date(),
        UpdatedDate: new Date(),
        CreatedBy: '',
        UpdatedBy: ''
      };
    }
  };
  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    if (!Name) {
      setNameError("Please filed the name");
    }
    else {
      setNameError("");
    }
    if (!Rating) {
      setError("Please give the rating");
    }
    else {
      setRatingError("");
    }
    if (!DescriptionError) {
      setDescriptionError("Please filed the description");
    } else {
      setDescriptionError("");
    }
    setNameError("Please filed the name");
    setRatingError("Please give the rating");
    setDescriptionError("Please filed the description");
   

    debugger
    const AssignRequest: FeedBackModel = {
      EmployeeId: EmployeeId,
      Name: Name,
      Description: Description,
      Rating: selectedRating.toString(),
      CreatedDate: new Date(),
      UpdatedDate: new Date(),
      CreatedBy: EmployeeId.toString(),
      UpdatedBy: EmployeeId.toString(),
    };

    axios.privateAxios
      .post<FeedBackModel>("app/FeedBack/AddFeedBack", AssignRequest)
      .then((response) => {
        debugger;
        console.log(response.data);
        setSelectedRating('');
      })
      .catch((error) => {
        console.log(error.response.data)

      });
  }

  const isFormValid = () => {
    debugger
    if (
      (NameError === null || NameError === undefined)
    ) {
      setError("Name Required");
      return false;
    }
    if (
      (RatingError === null || RatingError === undefined)
    ) {
      setError("Rating Required");
      return false;
    }
    if (
      (DescriptionError === null || DescriptionError === undefined)
    ) {
      setError("Description Required");
      return false;
    }
    return true;
  };


  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.headingText}>Feedback</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.bottomView}>
          <Text style={styles.title}>Feedback Form</Text>

          <POInputField
            label="Name"
            value={Name}
            onChangeText={setName}
            secureTextEntry={false}
            placeholder={''}
            NonEditablelabel={''}
          />
          {Name.length === 0 && (
            <Text style={{ color: 'red', marginLeft: 10 }}>{NameError}</Text>
          )}

        
          <Text style={styles.inputTitle}>Rating: {feedbackForm.Description}</Text>

          <View style={[styles.input, { color: selectedRating >= '' ? "#FFA500" : "#000" }]}>
            <FeedbackRating
              selectedRating={selectedRating}
              onRatingSelect={handleRatingSelect}
            />
          </View>

          <FeedbackSlider
            value={selectedRating}
            onValueChange={handleRatingSelect}
            minimumValue={1}
            maximumValue={5}
            step={1}
          />

          <POInputBoxField
            label="Description"
            value={Description}
            onChangeText={setDescription}
            secureTextEntry={false}
          />
          {Description.length === 0 && (
            <Text style={{ color: 'red', marginLeft: 10 }}>{DescriptionError}</Text>
          )}
          {/* <TouchableOpacity
            style={[styles.submitButton, { opacity: isFormReady ? 1 : 0.5 }]}
            onPress={handleSubmit}
            disabled={!isFormReady}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity> */}
          <FloatingButton
            title="Submit FeedBack"
            variant='contained'
            onPress={handleSubmit}
            style={styles.popupButton}
            titleStyle={styles.popupButtonText}
            icon='arrow-right-bold-circle'
          />
        </View>
      </ScrollView>
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
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headingText: {
    position: 'absolute',
    top: 10,
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  popupButton: {
    backgroundColor: '#35A2C1',
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: "80%",
    bottom: 10
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
  inputTitle: {
    padding: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    bottom: 75,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  ratingIcon: {
    marginHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 26,
    marginVertical: 8,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3A9EC2',
    marginHorizontal: 26,
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedBackScreen;