import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  Name: string;
}

const POTeamDetailsListItem: React.FC<Props> = ({
  Name,
}) => {

  return (
    <View style={styles.itemContainer}>

      <LinearGradient
        colors={['white', '#6CB9D8']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >

        <TouchableOpacity>

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
  container: {
    backgroundColor: '#DFF6FF',
    borderRadius: 30,
    padding: 16,
    //marginBottom: 16,
    elevation: 5,
    margin: 15,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    padding: 10,
    marginLeft: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    borderRadius: 25,
    height: 45,
    width: 45,
    backgroundColor: "#fff"
  },
  gradientContainer: {
    borderRadius: 30,
    padding: 20,
    elevation: 5,
  },
  itemContainer: {
    marginRight: 16,
    width: '80%',
    margin: 10,
  },
});

export default POTeamDetailsListItem;
