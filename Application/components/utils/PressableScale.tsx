import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface PressableWithScaleProps {
  onPressInOptions: {
    scale: number;
    backgroundColor: string;
  };
  onPressOutOptions: {
    scale: number;
    backgroundColor: string;
  };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  duration?:number;
  onPress:(e:any) => void
}

const PressableWithScale: React.FC<PressableWithScaleProps> = ({
  onPressInOptions,
  onPressOutOptions,
  style,
  children,
  duration,
  onPress
}) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [onPressOutOptions.backgroundColor, onPressInOptions.backgroundColor]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(onPressInOptions.scale, { duration: 200 });
          progress.value = withTiming(1, { duration: 200 });
        }}
        onPressOut={() => {
          scale.value = withTiming(onPressOutOptions.scale, { duration: 200 });
          progress.value = withTiming(0, { duration: duration });
        }}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default PressableWithScale;
