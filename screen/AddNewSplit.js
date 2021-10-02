import React from "react";
import { Button, FlatList, TouchableOpacity, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Addmembers from "./Addmembers";
import AddInitialAmount from "./AddInitialAmount";
import SplitupDetails from "./SplitupDetails";
const Stack = createStackNavigator();

export default function Home({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddMembers"
        component={Addmembers}
        options={{
          headerTitle: "New split up",
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
        name="AddInitialAmount"
        component={AddInitialAmount}
        options={{
          headerTitle: "New split up",
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
        }}
      />
    </Stack.Navigator>
  );
}
