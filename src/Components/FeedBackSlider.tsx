import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const FeedbackSlider = ({ value = 0, onValueChange, minimumValue = 0, maximumValue = 5, step = 1 }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  

  const handleSliderPress = (event) => {
    
    const { locationX } = event.nativeEvent;
    const newValue = Math.round((locationX / sliderWidth) * (maximumValue - minimumValue) + minimumValue);
    onValueChange(Math.max(minimumValue, Math.min(newValue, maximumValue)));
  };

  return (
    <View
      style={styles.sliderContainer}
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
    >
      <TouchableOpacity
        style={styles.slider}
        onPress={undefined}
      >
        <View style={[styles.fill, { width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%` }]} />
        <View style={styles.thumb} />
      </TouchableOpacity>
      <Text style={styles.ratingText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
    marginRight: 25,
  },
  slider: {
    height: 30,
    backgroundColor: "#ccc",
    borderRadius: 15,
    padding: 2,
    flex: 1,
  },
  fill: {
    height: 28,
    borderRadius: 15,
    backgroundColor: "#3A9EC2",
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 15,
    backgroundColor: "#3A9EC2",
    position: "absolute",
    padding: 1,
    top: 1,
  },
  ratingText: {
    position: 'absolute',
    top: '50%',
    left: '50%', 
    transform: [{ translateX: -15 }, { translateY: -15 }],
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default FeedbackSlider;
