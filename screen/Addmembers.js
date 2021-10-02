import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  CheckBox,
} from "react-native";
import { PermissionsAndroid } from "react-native";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Contacts from "react-native-contacts";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Addmembers({ navigation, route }) {
  const [dd, setDD] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [resultmem, setResultMem] = React.useState([]);
  const [error, setError] = React.useState();
  const [searchfor, setSearchFor] = React.useState("");
  const [new_members, setNewMembers] = React.useState([]);
  const [already_members, setAlready_members] = React.useState([]);
  var from, current_members, split_account, split_account_id;
  React.useEffect(() => {
    async function check_params() {
      if (route.params) {
        const {
          from_,
          current_members_,
          split_account_,
          split_account_id_,
        } = route.params;
        console.log(split_account_id_, "effect");
        from = from_;
        current_members = current_members_;
        split_account = split_account_;
        split_account_id = split_account_id_;
        let arr2 = [];
        await current_members.map((item, index) => {
          arr2.push(item._id);
        });
        console.log(arr2, "ncdkl");
        setAlready_members(arr2);
      }
    }
    check_params();
    async function ca() {
      axios
        .get("http://192.168.42.147:3000/api/split/getMembers", {
          headers: {
            Authorization:
              "Bearer " + (await AsyncStorage.getItem("split-token")),
          },
        })
        .then(async (res) => {
          const members_ = res.data.users;
          console.log(res.data.users);
          let arr = members_.map((item, index) => {
            if (route.params) {
              for (var j = 0; j < current_members.length; j++) {
                if (current_members[j]._id == item._id) {
                  item.isSelected = true;

                  break;
                }
              }
              if (!item.isSelected) {
                item.isSelected = false;
              }
            } else {
              item.isSelected = false;
            }
            return { ...item };
          });

          if (route.params) {
            setCurrentList(current_members);
          } else {
            setCurrentList([]);
          }

          setMembers(arr);
          setResultMem(arr);
        });
    }
    ca();
  }, []);

  const [current_list, setCurrentList] = React.useState([]);
  async function addToList(val) {
    if (error) {
      setError();
    }
    if (route.params) {
      var k;
      for (var i = 0; i < new_members.length; i++) {
        if (new_members[i].phonenumber == val.phonenumber) {
          k = i;
          break;
        }
      }
      if (k >= 0) {
        new_members.splice(k, 1);
        // setCurrentList(current_list.splice(qw, 1))
      } else {
        setNewMembers([...new_members, val]);
      }
    }

    var qw;
    for (var i = 0; i < current_list.length; i++) {
      if (current_list[i].phonenumber == val.phonenumber) {
        qw = i;
        break;
      }
    }
    if (qw >= 0) {
      current_list.splice(qw, 1);
      // setCurrentList(current_list.splice(qw, 1))
    } else {
      setCurrentList([...current_list, val]);
    }

    let arr = members.map((item, index) => {
      if (item.phonenumber == val.phonenumber) {
        item.isSelected = !item.isSelected;
      }
      return { ...item };
    });
    setMembers(arr);
    let arr1 = resultmem.map((item, index) => {
      if (item.phonenumber == val.phonenumber) {
        item.isSelected = !item.isSelected;
      }
      return { ...item };
    });
    setResultMem(arr);
    console.log(current_list);
  }
  React.useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: "Contacts",
      message: "This app would like to view your contacts.",
      buttonPositive: "Please accept bare mortal",
    })
      .then(Contacts.getAll())
      .then((contacts) => {
        console.log({ contacts });
      });
  }, []);
  async function addMembersToAccount() {
    console.log(new_members);
    const send_data = {
      account_id: split_account_id,
      new_members: new_members,
    };
    console.log(send_data);
    axios
      .post(
        "http://192.168.42.147:3000/api/split/addMembers",
        {
          account_id: route.params.split_account_id_,
          new_members: new_members,
        },
        {
          headers: {
            Authorization:
              "Bearer " + (await AsyncStorage.getItem("split-token")),
          },
        }
      )
      .then((res) => {
        navigation.dispatch(
          StackActions.replace("SplitDetail", {
            split_: res.data.split_account,
          })
        );
        console.log(res.data.split_account);
      });
  }
  const Item = ({ item, onPress, style }) => (
    <>
      {!item.isSelected ? (
        <TouchableOpacity onPress={() => addToList(item)} style={styles.obj}>
          <View>
            <Text
              style={{
                color: "black",
                paddingHorizontal: 10,
                fontSize: 17,
                letterSpacing: 1,
              }}
            >
              {item.username}
            </Text>
            <Text
              style={{
                color: "black",
                paddingHorizontal: 10,
                marginTop: 5,
                fontSize: 14,
              }}
            >
              {item.phonenumber}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.obj1}>
          <Text
            style={{
              color: "black",
              paddingHorizontal: 10,
              fontSize: 17,
              letterSpacing: 1,
            }}
          >
            {item.username}
          </Text>
          <Text
            style={{
              color: "black",
              paddingHorizontal: 10,
              marginTop: 5,
              fontSize: 14,
            }}
          >
            {item.phonenumber}
          </Text>
        </View>
      )}
    </>
  );
  const renderItem = (item) => {
    return <Item item={item.item} />;
  };
  const handleSearch = (text) => {
    const result = members.filter((item) =>
      item.phonenumber.toString().includes(text)
    );
    setResultMem(result);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        onChangeText={(text) => handleSearch(text)}
        style={{
          width: windowWidth - 40,
          borderBottomWidth: 1,
          borderBottomColor: "black",
          paddingLeft: 20,
        }}
        placeholder="Search phonenumber"
        keyboardType="numeric"
      />
      {error && (
        <Text style={{ alignItems: "center", color: "red" }}>{error}</Text>
      )}
      {current_list && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: windowWidth - 50,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          {current_list.map((item, index) => (
            <View style={styles.selected} key={index}>
              <Text style={{ color: "black" }}>{item.username}</Text>
              {already_members.indexOf(item._id) == -1 && (
                <TouchableOpacity onPress={() => addToList(item)}>
                  <Text style={{ fontSize: 20, marginLeft: 5 }}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
      <FlatList
        style={{ marginTop: 10 }}
        data={resultmem}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity style={{ alignItems: "center", margin: 20 }}>
        <Text
          onPress={() => {
            console.log(current_list);
            if (route.params) {
              console.log(new_members);
              addMembersToAccount();
            } else {
              if (current_list.length < 1) {
                setError("Please select memebers");
              } else
                navigation.navigate("AddInitialAmount", {
                  splitmembers: current_list,
                });
            }
          }}
          style={{
            justifyContent: "center",
            alignContent: "center",
            color: "white",
            backgroundColor: "#ff4d4d",
            padding: 10,
            paddingHorizontal: 50,
            borderRadius: 20,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
    backgroundColor: "#ffffff",
  },
  obj: {
    margin: 10,
  },
  obj1: {
    margin: 10,
    opacity: 0.5,
  },
  selected: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    backgroundColor: "#ffb3b3",
    paddingHorizontal: 13,
  },
});
