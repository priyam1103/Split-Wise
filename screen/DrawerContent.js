import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import jwt_decode from "jwt-decode";
import auth from "@react-native-firebase/auth";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function DrawerContent(props) {
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [username, setUername] = React.useState();
  const [type, setType] = React.useState();
  React.useEffect(() => {
    async function allow() {
      var token = await AsyncStorage.getItem("split-token");
      console.log(token);
      var decoded = jwt_decode(token);
      console.log(decoded);
      setPhoneNumber(decoded.phonenumber);
      if (decoded.username) {
        setUername(decoded.username);
      }
    }
    allow();
  }, []);
  const updateUsername = async () => {
    axios
      .post(
        "http://192.168.42.1477:3000/api/addUsername",
        { username: type },
        {
          headers: {
            Authorization:
              "Bearer " + (await AsyncStorage.getItem("split-token")),
          },
        }
      )
      .then(async (res) => {
        setUername(type);
        await AsyncStorage.setItem("split-token", res.data.token);
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ margin: 30 }}>
          <Text style={{ color: "black", margin: 10, fontSize: 15 }}>
            {phoneNumber}
          </Text>
          {username ? (
            <Text style={{ color: "black", margin: 5, fontSize: 25 }}>
              {username}
            </Text>
          ) : (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "black",
                  width: 150,
                }}
                placeholder="Enter username"
                onChangeText={(text) => setType(text)}
              />
              <TouchableOpacity
                onPress={() => {
                  updateUsername();
                }}
              >
                <Text style={{ color: "black" }}>nkc</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Home"
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          />
          <DrawerItem
            label="New splitup"
            onPress={() => {
              props.navigation.navigate("Add");
            }}
          />
          <DrawerItem
            label="Logout"
            onPress={() =>
              auth()
                .signOut()
                .then(() => {
                  AsyncStorage.removeItem("split-token");
                })
            }
          />
        </Drawer.Section>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
