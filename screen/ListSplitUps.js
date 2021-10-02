import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ListSplitUps = ({ navigation }) => {
  const [splitups, setSplitUps] = React.useState([]);
  PushNotification.localNotification({
    title: "cdk",
    message: "cdl",
  });
  useFocusEffect(
    React.useCallback(() => {
      async function getSplits() {
        await axios
          .get("http://192.168.42.147:3000/api/split/getSplitUps", {
            headers: {
              Authorization:
                "Bearer " + (await AsyncStorage.getItem("split-token")),
            },
          })
          .then(async (res) => {
            console.log(res.data.splits);
            setSplitUps(res.data.splits);
          });
      }
      getSplits();
    }, [])
  );
  // React.useEffect(() => {
  //     async function getSplits() {
  //         axios.get("http://192.168.42.147:3000/api/split/getSplitUps",
  //             {
  //                 headers: {
  //                     Authorization: "Bearer " + await AsyncStorage.getItem("split-token")
  //                 }
  //             }
  //         )
  //             .then(async (res) => {
  //                 console.log(res.data.splits);
  //                 setSplitUps(res.data.splits);
  //             })
  //     }
  //     getSplits();
  // },[navigation])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {splitups.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("SplitDetail", { split_: item })}
          >
            <View style={styles.box}>
              <Text
                style={{
                  fontSize: 20,
                  margin: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  box: {
    height: 70,
    margin: 20,
    backgroundColor: "#b3ccff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.51,
    shadowRadius: 0,

    elevation: 10,
  },
});

export default ListSplitUps;
