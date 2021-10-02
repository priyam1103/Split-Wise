import React, { useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import jwt_decode from "jwt-decode";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function SplitupDetails({ route, navigation }) {
  const { modalVisible, setModalVisible } = React.useContext(AuthContext);
  const [current_user, setCurrentUser] = React.useState("");
  const [split, setSplit] = useState();
  React.useEffect(() => {
    const { split_ } = route.params;
    console.log(split_);
    setSplit(split_);

    async function allow() {
      var token = await AsyncStorage.getItem("split-token");

      var decoded = jwt_decode(token);

      if (decoded) {
        console.log(decoded.id);
        setCurrentUser(decoded.id);
      }
    }
    allow();
  }, []);

  const [error, setError] = React.useState();

  const [amount, setAmount] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [modalMember, setModalMember] = useState(false);
  // export const show = () => {
  //     setModalVisible(!modalVisible);
  // }

  async function submit() {
    if (split) {
      axios
        .post(
          "http://192.168.42.147:3000/api/split/addSplit",
          { amount, desc, account_id: split._id },
          {
            headers: {
              Authorization:
                "Bearer " + (await AsyncStorage.getItem("split-token")),
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setSplit(res.data.split_account);
          setModalVisible(!modalVisible);
        });
    }
  }
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ color: "black" }}>Transaction details</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                onChangeText={(text) => setAmount(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Description"
                onChangeText={(text) => setDesc(text)}
              />
              {error && <Text style={{ color: "red" }}>{error}</Text>}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: windowWidth - 150,
                  margin: 20,
                }}
              >
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    submit();
                  }}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal animationType="slide" transparent={true} visible={modalMember}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {split && (
                <>
                  {split.members.map((item, index) => (
                    <View key={index}>
                      <Text style={{ margin: 10, fontSize: 20 }}>
                        {item.username} {item.phonenumber}
                      </Text>
                    </View>
                  ))}
                </>
              )}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: windowWidth - 150,
                  margin: 20,
                }}
              >
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalMember(!modalMember);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
                {split && (
                  <>
                    {split.admins.indexOf(current_user) != -1 && (
                      <TouchableHighlight
                        style={{
                          ...styles.openButton,
                          backgroundColor: "#2196F3",
                        }}
                        onPress={() => {
                          setModalMember(false);

                          navigation.navigate("AddMembers", {
                            current_members_: split.members,
                            split_account_: split.description,
                            split_account_id_: split._id,
                            from_: true,
                          });
                        }}
                      >
                        <Text style={styles.textStyle}>Add Members</Text>
                      </TouchableHighlight>
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </Modal>
        {split ? (
          <>
            <Text
              style={{
                color: "black",
                fontSize: 30,
                marginHorizontal: 15,
                marginTop: 20,
              }}
            >
              {split.description}
            </Text>
            <TouchableOpacity onPress={() => setModalMember(!modalMember)}>
              <Text style={{ color: "black", marginHorizontal: 15 }}>
                Members {split.members.length}
              </Text>
            </TouchableOpacity>
            <Text
              style={{ color: "black", marginHorizontal: 15, fontSize: 15 }}
            >
              Expenditure
              <Text style={{ color: "red" }}> {split.total_amount}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("splitchart", { split })}
            >
              <Text
                style={{
                  color: "black",
                  marginHorizontal: 15,
                  fontSize: 15,
                  textDecorationLine: "underline",
                }}
              >
                View details
              </Text>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  width: windowWidth - 40,
                  opacity: 0.7,
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                }}
              />
            </View>
            <ScrollView>
              <View style={{ marginVertical: 20 }}>
                {split.transactions.map((item, index) => (
                  <View key={index}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 25,
                        marginVertical: 10,
                      }}
                    >
                      <Text style={{ fontSize: 17 }}>{item.desc}</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text style={{ color: "green", fontSize: 17 }}>
                          + {item.amount}
                        </Text>
                        <Text>{item.addedBy.user}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <View
                        style={{
                          width: windowWidth - 40,
                          opacity: 0.4,
                          borderBottomColor: "black",
                          borderBottomWidth: 1,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    paddingLeft: 30,

    width: windowWidth - 100,
    flexDirection: "row",
    borderRadius: 20,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "red",
  },
  container: {
    flex: 1,

    backgroundColor: "#ffffff",
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
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 40,
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
