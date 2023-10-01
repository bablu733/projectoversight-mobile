import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Keyboard, KeyboardEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreenProp } from '../Routes/EmployeeStack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Contexts/Auth';
import { Modal } from 'react-native-paper';

interface FooterProps {
  //navigation: HomeScreenProp; // Adjust the type of the navigation prop based on the navigation library you're using
}

const Footer: React.FC<FooterProps> = ({}) => {
  const [selectedIcon, setSelectedIcon] = useState<string>('home');
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const navigation = useNavigation<HomeScreenProp>();
  const auth = useAuth();
  
  const handleIconPress = (iconName: string) => {
    setSelectedIcon(iconName);

    // Navigate to the appropriate screen based on the iconName
    if (iconName === 'home') {
      navigation.navigate("Home");
    } else if (iconName === 'md-document-text-outline') {
      navigation.navigate('MyTask');
    } else if (iconName === 'ios-menu') {
      setIsModalVisible(true);
    }
  };
  const handleFeedbackPress = () => {
    setIsPopupVisible(!isPopupVisible);
    navigation.navigate("FeedBackScreen");

  };
  
  const getIconName = (icon: string) => {
    switch (icon) {
      case 'home':
        return 'Home';
      case 'md-document-text-outline':
        return 'Task List';
      case 'ios-menu':
        return 'Menu';
      default:
        return '';
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleKeyboardShow = (event: KeyboardEvent) => {
    setKeyboardVisible(true);
  };

  const handleKeyboardHide = (event: KeyboardEvent) => {
    setKeyboardVisible(false);
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  if (isKeyboardVisible) {
    return null; // Hide the footer when the keyboard is opened
  }

  return (
    <>
    {isPopupVisible && (
        <>
        <View style={styles.overlay} /> 
        <View style={styles.popupContainer}>
          <TouchableOpacity onPress={togglePopup} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={auth.signOut} >
              <Text style={styles.option}>Sign out</Text>
            </TouchableOpacity>
            <Text style={styles.option}>My profile</Text>
            <TouchableOpacity onPress={handleFeedbackPress}>
            <Text style={styles.option}>Feed back</Text>
          </TouchableOpacity>
        </View>
        </>
      )}
    <View style={styles.container}>
      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={() => handleIconPress('home')} style={styles.iconContainer}>
          <Ionicons
            name="home"
            size={25}
            color={selectedIcon === 'home' ? '#35A2C1' : '#BDBEC1'}
          />
          <Text style={styles.iconName}>{getIconName('home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleIconPress('md-document-text-outline')} style={styles.iconContainer}>
          <Ionicons
            name="md-document-text-outline"
            size={25}
            color={selectedIcon === 'md-document-text-outline' ? '#35A2C1' : '#BDBEC1'}
          />
          <Text style={styles.iconName}>{getIconName('md-document-text-outline')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePopup} style={styles.iconContainer}>
          <Ionicons
            name="ios-menu"
            size={25}
            color={selectedIcon === 'ios-menu' ? '#35A2C1' : '#BDBEC1'}
          />
          <Text style={styles.iconName}>{getIconName('ios-menu')}</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom:0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#DCE7F1', // Light grayish-blue background color
    borderTopLeftRadius: 25, // Add rounded edges to the top-left corner
    borderTopRightRadius: 25,
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 26,
    marginVertical:5,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconName: {
    marginTop: 2,
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
  },
  popupContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed (0.5 represents 50% opacity)
  },
  popupContainer: {
    position: 'absolute',
    bottom: 60,
    right: 0, // Updated to show on the right side
    width: '50%',
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});

export default Footer;
