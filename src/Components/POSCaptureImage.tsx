import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
interface Props {
  setImages: any;
  imageLimit?: number;
  // label: string;
  mandatory?: boolean;
  setImageCount:any;
}
interface File {
  name: string;
  type: string;
  path: string; 
  blob: Blob;
  base64: string;
}

const POSCaptureImage: React.FC<Props> = ({ setImages}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImageUri, setSelectedImageUri] = React.useState(null);

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
 
  const onPressCaptureNew = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }


    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const newImages = Object.assign([], selectedImages);

      const image = await fetch(result.uri);
      const blob = await image.blob();
      let newImage: File = {
        name: "Image",
        type: result.type!,
        path: result.uri,
        blob: blob,
        base64: await convertBlobToBase64(blob),
      };
      newImages.push(newImage);
      setSelectedImages(newImages);
      setImages(newImages);
      setImageCount(imageCount);
    }
  };

  const onPressGallery = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }


    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const newImages = Object.assign([], selectedImages);

      const image = await fetch(result.uri);
      const blob = await image.blob();
      let newImage: File = {
        name: "Image",
        type: result.type!,
        path: result.uri,
        blob: blob,
        base64: await convertBlobToBase64(blob),
      };
      newImages.push(newImage);
      setSelectedImages(newImages);
      setImages(newImages);
      setImageCount(imageCount);
    }
  };


  const DeleteImage = async (position: number) => {
    var image = selectedImages[position];
    var path = image.path;
    const newImages = Object.assign([], selectedImages);
    delete newImages[position];
    setSelectedImages(newImages);
    setImages(newImages);
    setImageCount(imageCount - 1);
  }

  const onPressImage = (key:any) => async () => {
    if (Platform.OS === "web") {
      alert("Delete File");
    } else {
      Alert.alert(
       ("DeleteImage"),
        ("Areyousureyouwanttodeletetheimage"),
        [{ text: "Yes", onPress: () => DeleteImage(key)}, { text: "No", onPress:() => console.log("No Pressed") } ]
      );
    }
    return;
  };

  return (
    <>
    
      <ScrollView style={styles.photosContainer} horizontal={true}>
        {selectedImages.map((image, index) => {
          return (
            <TouchableOpacity
              style={styles.photo}
              onPress={onPressImage(index)}
              key={index}
            >
              {/* {image && (
                <Image
                key={index}
                source={{ uri: image.base64 }}
                style={styles.popupImage}
              />
              )} */}
            </TouchableOpacity>
          );
        })}
        </ScrollView>
        <TouchableOpacity style={styles.modalButton} onPress={onPressCaptureNew}>
            <Text style={styles.modalButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onPressGallery}>
            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  modalButton: {
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  popupImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  modalButtonText: {
    fontSize: 18,
    color: '#3A9EC2',
  },
  cameraText: {
    fontSize: 16,
    color: '#333', 
  },
  photosContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
    marginRight:120,
  },
  photo: {
    // width: 80,
    // height: 80,
    // marginRight: 10,
    // borderStyle: "dashed",
    // borderRadius: 1,
    // borderWidth: 1,
    // borderColor: "grey",
    // justifyContent: "center",
    // alignitems: "left",
    marginLeft:15,
  },
});

export default POSCaptureImage;