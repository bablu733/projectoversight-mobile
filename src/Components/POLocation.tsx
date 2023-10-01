import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const POLocation: React.FC = () => {
  const [mapRegion, setMapRegion] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const userLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({});
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('Error getting location: ' + error.message);
      }
    };

    userLocation();
  }, []);

  if (!mapRegion || errorMsg) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={mapRegion} provider={PROVIDER_GOOGLE}>
          <Marker
            coordinate={{
              latitude: mapRegion?.latitude,
              longitude: mapRegion?.longitude,
            }}
            title="My Location"
            description="This is my current location"
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: '95%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    bottom:30
  },
  map: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
  },
});

export default POLocation;
