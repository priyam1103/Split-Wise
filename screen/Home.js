import React from "react";
import { Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ListSplitUps from "./ListSplitUps";
import { AuthContext } from "../context/AuthProvider";
import LinearGradient from "react-native-linear-gradient";
import SplitupDetails from "./SplitupDetails";
import Addmembers from "./Addmembers";
import Splitchart from "./Splitchart";
import { SvgUri } from "react-native-svg";
const Stack = createStackNavigator();
const GradientHeader = (props) => (
  <View style={{ backgroundColor: "#eee" }}>
    <LinearGradient
      colors={["red", "blue"]}
      style={[StyleSheet.absoluteFill, { height: Header.HEIGHT }]}
    >
      <Header {...props} />
    </LinearGradient>
  </View>
);
export default function Home({ navigation }) {
  const { modalVisible, setModalVisible } = React.useContext(AuthContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListView"
        component={ListSplitUps}
        options={{
          headerTitle: "Split Ups",
          headerTintColor: "#ffffff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Image
                source={require("../menu.png")}
                style={{ width: 30, height: 30, margin: 10 }}
              />
            </TouchableOpacity>
          ),

          headerStyle: {
            backgroundColor: "#001133",
          },
        }}
      />
      <Stack.Screen
        name="SplitDetail"
        component={SplitupDetails}
        options={{
          headerTitle: "Split Ups",
          headerTintColor: "#ffffff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Image
                source={require("../menu.png")}
                style={{ width: 30, height: 30, margin: 10 }}
              />
            </TouchableOpacity>
          ),

          headerStyle: {
            backgroundColor: "#001133",
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Image
                source={require("../add.png")}
                style={{ width: 30, height: 30, margin: 10, marginRight: 21 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="splitchart"
        component={Splitchart}
        options={{
          headerTitle: "Split up",
          headerTintColor: "#ffffff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Image
                source={require("../menu.png")}
                style={{ width: 30, height: 30, margin: 10 }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#001133",
          },
        }}
      />
      <Stack.Screen
        name="AddMembers"
        component={Addmembers}
        options={{
          headerTitle: "Split up",
          headerTintColor: "#ffffff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Image
                source={require("../menu.png")}
                style={{ width: 30, height: 30, margin: 10 }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#001133",
          },
        }}
      />
    </Stack.Navigator>
  );
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
});
