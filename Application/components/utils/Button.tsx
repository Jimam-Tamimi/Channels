import React from 'react';
import { Text, StyleSheet, PressableProps, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { Pressable } from 'react-native';

interface SignInButtonProps extends PressableProps {
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<SignInButtonProps> = ({ title = 'Sign In', isLoading = false, disabled = false, ...props }) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(0); // Use this to animate the color

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(235,37,96,0.62)', 'rgba(235,37,96,0.91)']
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  const handlePressIn = () => {
    if (!disabled && !isLoading) {
      scale.value = withTiming(0.95, { duration: 250 });
      progress.value = withTiming(1, { duration: 250 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !isLoading) {
      scale.value = withTiming(1, { duration: 250 });
      progress.value = withTiming(0, { duration: 250 });
    }
  };

  return (
    <Animated.View style={[styles.button, animatedStyle, (disabled || isLoading) && styles.disabledButton]}>
      <Pressable
        {...props}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        style={styles.pressable}
      >
        {isLoading ? (
          <ActivityIndicator  color="white"  />
        ) :  (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  pressable: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  disabledButton: {
    opacity: 0.7, // Make the button look disabled
  },
});

export default Button;
