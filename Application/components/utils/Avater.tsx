import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  uri: string;
  size?: number;
  name?: string;
  isActive?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ uri, size = 64, name, isActive = false }) => {
  return (
    <View style={styles.container}>
      {/* Avatar Image */}
      <Image
        source={{ uri }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
      {/* Active Status Indicator */}
      {isActive && (
        <View
          style={[
            styles.activeIndicator,
            {
              width: size * 0.23,
              height: size * 0.23,
              borderRadius: 100,
              bottom: size * 0.05,
              right: size * 0.05,
            },
          ]}
        />
      )} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'gray',
  },
  activeIndicator: {
    position: 'absolute',
    backgroundColor: "#0ceb41", 
  },
  name: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: 'gray',
  },
});

export default Avatar;
