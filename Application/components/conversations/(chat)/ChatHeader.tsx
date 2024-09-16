import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';

const ChatHeader = () => (
  <>
    <Image
      source={require("../../../assets/images/New folder/1.jpg")}
      style={styles.backgroundImage}
    />
    <View style={styles.overlay} />
  </>
);

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.6,
  },
});

export default ChatHeader;
