import React from "react";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";

function FilterButtons({ tabs, setFilterData, selections }) {
  return (
    <View style={{ height: 50 }}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          alignItems: "center",
          maxHeight: 50,
          //justifyContent: "flex-start",
        }}
        style={{
          flex: 1,
          height: 50,
        }}
      >
        {tabs.length
          ? tabs.map((element, index) => {
              const caps = element.charAt(0).toUpperCase() + element.slice(1);
              return (
                <TouchableOpacity
                  onPress={() => {
                    setFilterData(element);
                  }}
                  key={index}
                  style={{
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <Text
                    style={{
                      backgroundColor: selections.includes(element)
                        ? "#495E57"
                        : "#eee",
                      color: selections.includes(element) ? "#eee" : "#495E57",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: "600",
                      marginRight: 20,
                    }}
                  >
                    {caps}
                  </Text>
                </TouchableOpacity>
              );
            })
          : ""}
      </ScrollView>
    </View>
  );
}

export default FilterButtons;
