import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { StackActions } from "@react-navigation/native";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  Dimensions,
  Platform,
  TouchableHighlight,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function AddInitialAmount({ route, navigation }) {
  const { splitmembers } = route.params;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [error, setError] = React.useState();
  const [account_desc, setAccountDesc] = React.useState("");
  const [initial_split, setInitialSplit] = React.useState("");
  const [initialsplit_desc, setInitialSplitDesc] = React.useState("");
  React.useEffect(() => {
    async function allow() {
      var token = await AsyncStorage.getItem("split-token");

      var decoded = jwt_decode(token);

      //splitmembers.push(decoded)
    }
    allow();
  }, []);

  async function submit() {
    try {
      axios
        .post(
          "http://192.168.42.147:3000/api/split/addSplitUp",
          {
            account_desc,
            initial_split,
            initialsplit_desc,
            account_members: splitmembers,
          },
          {
            headers: {
              Authorization:
                "Bearer " + (await AsyncStorage.getItem("split-token")),
            },
          }
        )
        .then(async (res) => {
          console.log(res.data);
          setAccountDesc();
          setInitialSplitDesc();
          setInitialSplit();

          navigation.navigate("Home");
          navigation.dispatch(StackActions.popToTop());
        });
    } catch (err) {
      setError("Please try again");
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {splitmembers.map((item, index) => (
                  <View key={index}>
                    <Text style={{ margin: 10, fontSize: 20 }}>
                      {item.username} {item.phonenumber}
                    </Text>
                  </View>
                ))}
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
              }}
            >
              <Text style={{ color: "black" }}>
                Creating a split account for`
                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  <Text> {splitmembers.length + 1} </Text>
                </TouchableOpacity>
                members.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account description"
                onChangeText={(text) => setAccountDesc(text)}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 20,
              }}
            >
              <Text style={{ color: "black" }}>
                Add the initial splitup amount
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                onChangeText={(text) => setInitialSplit(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Description"
                onChangeText={(text) => setInitialSplitDesc(text)}
              />
              {error && <Text style={{ color: "red" }}>{error}</Text>}
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  marginTop: 20,
                  backgroundColor: "#ff4d4d",
                  padding: 10,
                  paddingHorizontal: 50,
                  borderRadius: 20,
                }}
                onPress={() => submit()}
              >
                <Text style={{ color: "white", fontSize: 20 }}>Add Split</Text>
              </TouchableOpacity>
            </View>
          </>
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
    borderBottomColor: "red",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
