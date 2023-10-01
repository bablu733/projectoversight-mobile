import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  selectedRating: number;
  onRatingSelect: (rating: number) => void;
}

const FeedbackRating: React.FC<Props> = ({ selectedRating, onRatingSelect }) => {
  const emojis = [
    { name: "cry", icon: "sad-outline", rating: 1 },
    { name: "neutral", icon: "ios-neutral-outline", rating: 2 },
    { name: "happy", icon: "happy-outline", rating: 3 },
    { name: "very-happy", icon: "ios-happy-outline", rating: 4 },
    { name: "ecstatic", icon: "ios-heart-outline", rating: 5 },
  ];

  return (
    <View style={styles.container}>
      {emojis.map((emoji) => (
        <TouchableOpacity
          key={emoji.name}
          style={styles.emojiButton}
          onPress={() => onRatingSelect(emoji.rating)}
        >
          <Ionicons
            name={emoji.icon}
            size={50}
            color={selectedRating === emoji.rating ? "#FFA500" : "#fff"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  emojiButton: {
    padding: 10,
  },
});

export default FeedbackRating;
