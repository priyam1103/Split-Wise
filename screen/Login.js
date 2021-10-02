import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Button,
  TextInput,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
var PushNotification = require("react-native-push-notification");

export default function Login() {
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  async function signInWithPhoneNumber() {
    setLoading(true);
    try {
      const number = "+91" + phoneNumber;
      console.log(number);
      const confirmation = await auth().signInWithPhoneNumber(number);
      //console.log(confirmation)

      setConfirm(confirmation);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  async function confirmCode() {
    setLoading(true);
    setError(null);
    try {
      axios
        .post("http://192.168.42.147:3000/api/auth", {
          phonenumber: "+91" + phoneNumber,
        })
        .then(async (res) => {
          console.log(res.data);

          await AsyncStorage.setItem("split-token", res.data.token);
          await confirm.confirm(code);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Invalid otp");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            width: windowWidth,
            backgroundColor: "#ffffff",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!confirm ? (
            <>
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../app_icon.png")}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                keyboardType="numeric"
                onChangeText={(text) => setPhoneNumber(text)}
              />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  marginTop: 20,
                  backgroundColor: "#001133",
                  padding: 10,
                  paddingHorizontal: 50,
                  borderRadius: 20,
                }}
                onPress={() => signInWithPhoneNumber()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={{ color: "white", fontSize: 20 }}>Send Otp</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../app_icon.png")}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter otp"
                keyboardType="numeric"
                onChangeText={(text) => setCode(text)}
              />
              {error && <Text style={{ color: "red" }}>Invalid Otp</Text>}
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  marginTop: 20,
                  backgroundColor: "#001133",
                  padding: 10,
                  paddingHorizontal: 50,
                  borderRadius: 20,
                }}
                onPress={() => confirmCode()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={{ color: "white", fontSize: 20 }}>
                    Confirm Otp
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    paddingLeft: 30,

    width: windowWidth - 60,
    flexDirection: "row",
    borderRadius: 20,
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#001133",
  },
});
