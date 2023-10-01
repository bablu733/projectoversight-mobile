import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  onImagesSelected: (images: string[]) => void;
}

const FeedBackImagePost: React.FC<Props> = ({ onImagesSelected }) => {
  const [images, setImages] = useState<string[]>([]);

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        if (images.length < 3) {
          setImages(prevImages => [...prevImages, result.uri]);
          onImagesSelected([...images, result.uri]);
        } else {
          alert("You can only post up to three images.");
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleRemoveImage = (imageUri: string) => {
    setImages(prevImages => prevImages.filter(img => img !== imageUri));
    onImagesSelected(images.filter(img => img !== imageUri));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(item)}
            >
              <Ionicons name="close-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.addButton, images.length >= 3 && styles.disabledButton]}
        onPress={handleSelectImage}
        disabled={images.length >= 3}
      >
        <Ionicons name="add-circle-outline" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 2,
  },
  addButton: {
    backgroundColor: '#3A9EC2',
    borderRadius: 20,
    padding: 4,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default FeedBackImagePost;
