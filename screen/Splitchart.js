import React from "react";
import { StyleSheet, Text, Dimensions, View, ScrollView } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function Splitchart({ navigation, route }) {
  const [data, setData] = React.useState();
  const [accounts, setAccounts] = React.useState([]);
  const [total, setTotal] = React.useState();
  React.useEffect(() => {
    const { split } = route.params;
    var labels = [];
    var datasets = [];
    const accounts_ = split.individual_amounts;
    setTotal(split.total_amount);
    async function getData() {
      await accounts_.map((item, index) => {
        labels.push(item.username);
        datasets.push(item.amount);
      });
      console.log(labels);
      console.log(datasets);
      setData({
        labels,
        datasets: [
          {
            data: datasets,
          },
        ],
      });

      console.log(data);
    }
    getData();

    async function split_amount() {
      var total_amount = 0;
      var split_amount = 0;
      console.log(split.total_amount);
      if (parseInt(split.total_amount) > 0) {
        split_amount = split.total_amount / split.individual_amounts.length;
      }
      let split_data = [];
      await accounts_.map((item, index) => {
        const data__ = {
          username: item.username,
          amount: parseInt(item.amount) - parseInt(split_amount),
        };
        split_data.push(data__);
      });
      setAccounts(split_data);

      console.log(split_amount);
    }
    split_amount();
  }, []);

  return (
    <View style={styles.contanier}>
      {data && (
        <>
          <LineChart
            data={{
              labels: data.labels,
              datasets: [
                {
                  data: data.datasets[0].data,
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#cce6ff",
              backgroundGradientFrom: "#666666",
              backgroundGradientTo: "#bfbfbf",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              margin: 5,
              borderRadius: 16,
            }}
          />
          <ScrollView>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text>Total expense {total}</Text>
              {accounts.length > 0 ? (
                <>
                  {accounts.map((item, index) => (
                    <View style={styles.amount_d} key={index}>
                      <Text
                        style={{
                          width: 100,
                          textAlignVertical: "center",
                          fontSize: 17,
                        }}
                      >
                        {item.username}
                      </Text>
                      {parseInt(item.amount) < 0 ? (
                        <Text
                          style={{
                            color: "red",
                            width: 50,
                            justifyContent: "flex-end",
                            textAlignVertical: "center",
                            fontSize: 17,
                          }}
                        >
                          {item.amount}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "green",
                            fontSize: 17,
                            textAlignVertical: "center",
                            width: 50,
                            justifyContent: "flex-end",
                          }}
                        >
                          {item.amount}
                        </Text>
                      )}
                    </View>
                  ))}
                </>
              ) : null}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contanier: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  amount_d: {
    display: "flex",
    flexDirection: "row",
    width: windowWidth - 70,
    justifyContent: "space-around",
    margin: 10,
    marginHorizontal: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#cce6ff",
    borderRadius: 50,
  },
});
