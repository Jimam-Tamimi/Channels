import React, { PropsWithChildren, useRef } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

const AppleStyleSwipeableRow: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const swipeableRowRef = useRef<Swipeable>(null);

  const renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    // Slide the left action from left to right
    const trans = dragX.interpolate({
      inputRange: [0, 100], // Adjust the range to control when the slide stops
      outputRange: [-100, 0], // Start off-screen and slide into view
      extrapolate: 'clamp',
    });

    // Animate background color from transparent to blue
    const opacity = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1], // Transparent to blue
      extrapolate: 'clamp',
    });

    // Animate scale for a subtle zoom effect
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0.75, 1], // Slight scale-up from 0.95 to 1
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
            
          styles.leftAction,
          {
            transform: [{ translateX: trans }, { scale }],
            opacity, 
          },
        ]}
      >
        <RectButton onPress={close}>
          <Animated.Text style={styles.actionText}>
            Block
          </Animated.Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
      extrapolate: 'clamp',
    });

    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1], // Scale up slightly for a cool effect
      extrapolate: 'clamp',
    });

    const pressHandler = () => {
      close();
 
      alert(text);
    };

    return (
      <Animated.View style={{   opacity, transform: [{ scale  }, {translateX: trans}] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {renderRightAction('Mute', '#BDBDBD80', 192, progress)}
      {renderRightAction('Archive', '#497AFC80', 128, progress)}
      {renderRightAction('Delete', '#dd2c0080', 64, progress)}
    </View>
  );

  const close = () => {
    swipeableRowRef.current?.close();
  };

  return (
    <Swipeable
      ref={swipeableRowRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      
      containerStyle={{
        borderRadius: 2,
        borderWidth:1  
      }}
      onSwipeableOpen={(direction) => {
        console.log(`Opening swipeable from the ${direction}`);
      }}
      onSwipeableClose={(direction) => {
        console.log(`Closing swipeable to the ${direction}`);
      }}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:"#f4433690", 
    
    // Removed hardcoded background color to allow animation
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default AppleStyleSwipeableRow;
