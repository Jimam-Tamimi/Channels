// import { View, Text } from "react-native";
// import React from "react";
// import { Image } from "expo-image";

// export default function LoadingScreen() {
//   return (
//     <View style={{ flex: 1, backgroundColor: "black" }}>
//       <Image
//         source={require("../../assets/images//loader/loader (1).gif")}
//         // source={require("../../assets/images/New folder/4.jpg")}
//         contentFit="cover"
//         contentPosition={"center"}
//         style={[
//           {
//             flex: 1,
//             // transform: [{scale:1}]
//             // width: Dimensions.get("window").width,
//             // width: ,
//             // height: Dimensions.get("window").height,
//             // height: Dimensions.get("window").height/2,
//             // position: "absolute",
//             // overflow: "hidden",
//           },
//         ]}
//       />
//   <Text  style={{fontSize: 25, textAlign: "center", marginBottom: "35%", letterSpacing:6, fontWeight: '500'}}  className='text-white '>Loading...</Text>

//     </View>
//   );
// }
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import React from "react";
import { Image } from "expo-image";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: 'center' }}>
      <Image
        source={require("../../assets/images//loader/loader (3).gif")}
        // source={require("../../assets/images/New folder/4.jpg")}
        contentFit="cover"
        contentPosition={"center"}
        style={[
          {
            flex: 1,
            transform: [{scale:1}],
            width: Dimensions.get("window").width,
            // width: ,
            height: Dimensions.get("window").height,
            // height: Dimensions.get("window").height/2,
            // position: "absolute",
            // overflow: "hidden",
          },
        ]}
      />
      {/* <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "black", opacity: 0.93 },
        ]}
      ></View>
      <ActivityIndicator style={{position: 'absolute'}} size={50}  color={"white"}/> */}

      {/* <Text  style={{fontSize: 25, textAlign: "center", marginBottom: "35%", letterSpacing:6, fontWeight: '500'}}  className='text-white '>Loading...</Text> */}
    </View>
  );
}
