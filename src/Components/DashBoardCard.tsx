import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, ImageSourcePropType } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface DashboardCardProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  style?: any;
  titleStyle?: any;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, onPress, style, titleStyle }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    aspectRatio: 1,
    backgroundColor: '#3A9EC2',
    borderRadius: 10,
    shadowColor: 'rgba(167, 167, 244, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    shadowColor: 'rgba(167, 167, 244, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: 'rgba(167, 167, 244, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconContainer: {
    borderRadius: 10,
    padding: 5,
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default DashboardCard;
