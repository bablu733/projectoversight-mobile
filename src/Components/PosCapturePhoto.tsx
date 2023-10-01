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
import * as ImagePicker from "expo-image-picker";
interface Props {
  setImages: any;
  imageLimit?: number;
  label: string;
  mandatory?: boolean;
  setImageCount:any;
}
interface File {
  name: string;
  type: string;
  path: string; 
  blob: Blob;
}

const PosCapturePhoto: React.FC<Props> = ({ setImages, imageLimit = 1, label, mandatory = true}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageCount, setImageCount] = useState<number>(0);
  console.log(imageCount)
  const onPressCaptureNew = async () => {
    var capturedImage = imageCount;
    // if (imageLimit >= imageCount) {
    //   //alert(`Only ${imageLimit} image upload allowed`);
    //   alert("only1imageuploadallowed");

    //   return;
    // }

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
      };
      newImages.push(newImage);
      setSelectedImages(newImages);
      setImages(newImages);
      setImageCount(imageCount + 1);
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
    <Text style={styles.label}>{label}<Text style={mandatory ? styles.mandatory : styles.notMandatory}> *</Text></Text>
      <ScrollView style={styles.photosContainer} horizontal={true}>
        {selectedImages.map((image, index) => {
          return (
            <TouchableOpacity
              style={styles.photo}
              onPress={onPressImage(index)}
              key={index}
            >
              {image && (
                <Image
                  source={{ uri: image.path }}
                  style={{ width: 70, height: 70 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
        </ScrollView>
        <TouchableOpacity style={styles.photo} onPress={onPressCaptureNew}>
          {imageCount == 1?(
            ""
          ):(
            <Image
            style={styles.cameraIcon}
            source={require("../../assets/icons/camera.png")}
          />
          )}
         
        </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 2,
    paddingVertical: 6,
    fontWeight: "bold",
    color: "#256D85",
    marginLeft:10,
  },
  photosContainer: {
    flexDirection: "row",
    paddingVertical: 10,
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
    marginBottom:130
  },
  cameraIcon: {
    height: 80,
    width: 80,
    marginLeft:-3,
    bottom:5
  },
  mandatory: {
    color: "red",
  },
  notMandatory: {
    color: "#f0f0f0",
  },
});

export default PosCapturePhoto;