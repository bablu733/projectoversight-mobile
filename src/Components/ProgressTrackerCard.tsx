import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { EmployeeStackParamList } from '../Routes/EmployeeStack';
import { LinearGradient } from 'expo-linear-gradient';

type CategoryProp = RouteProp<EmployeeStackParamList, "UIList">;
type UICreateProp = RouteProp<EmployeeStackParamList, "UICreateTask">;
type USCreateProp = RouteProp<EmployeeStackParamList, "USList">;

interface Props {
    UserStory: string;
    UserInterface: string;
    selectedCategory: string;
    selectedSubCategory: string;
}

const ProgressTrackerCard: React.FC<Props> = ({
    selectedCategory = "",
    selectedSubCategory = "",
}) => {
    const route = useRoute<CategoryProp>();
    const route1 = useRoute<UICreateProp>();
    const route2 = useRoute<USCreateProp>();

    const [Name] = React.useState<string>(route.params.Name);
    const [USName] = React.useState<string>(route.params.USName);
    const [UIName] = React.useState<string>(route1.params.UIName);
    const [CategoryName] = React.useState<string>(route2.params.CategoryName);
    const [SubCategoryName] = React.useState<string>(route2.params.subCategoryName);

    return (
        <View style={styles.cardContainer}>
             <LinearGradient
        colors={['#93a5cf', '#e4efe9']}
        style ={{paddingTop:7,borderRadius:10}}
      >

            <View style={styles.progressContainer}>
                <View style={[styles.stepContainer]}>
                    {Name ? (
                        <View style ={styles.fill}>
                             <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                           <Text style={styles.stepText}>&#8226;</Text>
                        </View>
                    )}
                    <View style={styles.stepLine} />
                </View>
                <Text style={styles.stepLabel}>Project Name: {Name} </Text>
            </View>

            {CategoryName ?(<View style={styles.progressContainer}>
                <View style={[styles.stepContainer]}>
                    {CategoryName ? (
                      <View style ={styles.fill}>
                            <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}></Text>
                        </View>
                    )}
                    <View style={styles.stepLine3} />
                </View>
                <Text style={styles.stepLabel}>Category: {CategoryName}</Text>
            </View> ):( <View style={styles.progressContainer}>
                <View style={[styles.stepContainer]}>
                    {selectedCategory ? (
                      <View style ={styles.fill}>
                           <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}></Text>
                        </View>
                    )}
                    <View style={styles.stepLine3} />
                </View>
                <Text style={styles.stepLabel}>Category: {selectedCategory}</Text>
            </View>)}



            {SubCategoryName ?(<View style={styles.progressContainer}>
                <View style={[styles.stepContainer]}>
                    {SubCategoryName ? (
                        <View style ={styles.fill}>
                            <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}></Text>
                        </View>
                    )}
                    
                </View>
                <Text style={styles.stepLabel}>Sub-Category: {SubCategoryName}</Text>
            </View> ):( <View style={styles.progressContainer}>
                <View style={[styles.stepContainer]}>
                    {selectedSubCategory ? (
                       <View style ={styles.fill}>
                           <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}></Text>
                        </View>
                    )}
                   
                </View>
                <Text style={styles.stepLabel}>Sub-Category: {selectedSubCategory}</Text>
            </View>)}

           {USName ? (  <View style={styles.progressContainer}>
                <View style={styles.stepContainer}>
                    {USName ? (
                      <View style ={styles.fill}>
                            <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}>&#8226;</Text>
                        </View>
                    )}
                    <View style={styles.stepLine1} />
                </View>
                <Text style={styles.stepLabel}>User Story:{USName}</Text>
            </View>): null}
          
          {UIName ? ( <View style={styles.progressContainer}>
                <View style={styles.stepContainer}>
                    {UIName ? (
                        <View style ={styles.fill}>
                            <Image source={require('../../assets/icons/VerifiedIcon.png')}  style = {{width:27,height:20}}/>
                        </View>
                    ) : (
                        <View style={styles.stepCircle}>
                            <Text style={styles.stepText}>&#8226;</Text>
                        </View>
                    )}<View style={styles.stepLine1} />
                </View>
                <Text style={styles.stepLabel}>User Interface:{UIName}</Text>
            </View>): null }
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 5,
        margin:20,
        width:'90%',
        bottom:10
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    background: {
        flex: 1,
      },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    fill:{
      marginLeft:-1
    },
    stepCircle: {
        width: 16,
        height: 16,
        borderRadius: 10,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:5,
    },
    stepText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    stepLine: {
        width: 2,
        height: 14,
        backgroundColor: '#4a90e2',
        position: 'absolute',
        top: 19,
    },
    stepLine1:{
        width: 2,
        height: 15,
        backgroundColor: '#4a90e2',
        position: 'absolute',
        top:-13,
    },
    stepLine3:{
        width: 2,
        height: 16,
        backgroundColor: '#4a90e2',
        position: 'absolute',
        top: 16,
        left:12
    },
    stepLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight:'bold',
    },
});

export default ProgressTrackerCard;
