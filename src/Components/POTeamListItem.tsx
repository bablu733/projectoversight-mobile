import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  Name: string;
  onPress: () => void;
}

const POTeamListItem: React.FC<Props> = ({
  Name,
  onPress,
}) => {
  return (
    <View style={styles.itemContainer}>

      <LinearGradient
        colors={['white', '#3A9EC2']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >

        <TouchableOpacity onPress={onPress}>
          <View style={styles.rowContainer}>
            <View style={styles.circle} />
            <Text style={styles.normalText}>{Name}</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
  itemContainer: {
    flex: 1,
    //marginRight: 16,
   // width: '20%',
    margin: 10
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
    fontFamily: 'Roboto',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    padding:20
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight:10
  },
  circle: {
    borderRadius: 25,
    height: 45,
    width: 45,
    backgroundColor: "#fff"
  },

});

export default POTeamListItem;
