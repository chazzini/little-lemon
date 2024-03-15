import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import { debounce } from "lodash";
import { fetchMenu } from "../data/api/DataApi";
import Menu from "../components/Menu";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "../data/database/Model";
import FilterButtons from "../components/FilterButtons";
import { useUpdateEffect } from "../util";

function HomeScreen({ navigation }) {
  const [menuData, setMenuData] = useState();
  const [tabs, setTabs] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState([]);

  const getTabFromData = (data) => {
    let tab = [];
    data.forEach((element) => {
      if (!tab.includes(element.category)) {
        tab.push(element.category);
      }
    });
    return tab;
  };

  function handleFilterSelection() {
    return (e) => {
      if (!filterSelections.includes(e)) {
        selections = [...filterSelections, e];
      } else {
        selections = filterSelections.filter((value) => {
          return e != value;
        });
      }
      setFilterSelections(selections);
    };
  }

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);
  const handleSearchChange = (txt) => {
    setSearchBarText(txt);
    console.log(txt);
    debouncedLookup(txt);
  };

  useEffect(() => {
    (async () => {
      try {
        //create database
        await createTable();
        //fetch menu data from database
        let menuItem = await getMenuItems();
        //if not data fetch from api

        if (!menuItem.length) {
          menuItem = await fetchMenu();
          saveMenuItems(menuItem);
        }
        menuItem = await getMenuItems();
        const tabs = getTabFromData(menuItem ?? []);
        setTabs(tabs);

        setMenuData(menuItem);
      } catch (e) {
        Alert.alert("Data Error: " + e);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      //   const activeCategories = sections.filter((s, i) => {
      //     if (filterSelections.every((item) => item === false)) {
      //       return true;
      //     }
      //     return filterSelections[i];
      //   });

      let selections = filterSelections.length ? filterSelections : tabs;
      try {
        const menuItems = await filterByQueryAndCategories(query, selections);

        setMenuData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
        console.log(e.message);
      }
    })();
  }, [filterSelections, query]);

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ height: 320 }}>
        <ScrollView style={styles.hero}>
          <Text style={styles.heroHeading}>Little Lemon</Text>
          <Text style={styles.heroSubHeading}>Chicago</Text>
          <View style={styles.heroIntroContainer}>
            <Text style={styles.heroIntro}>
              We are a family owned Mediterranean restaurant focused on
              traditional recipes served with a modern twist.
            </Text>
            <Image
              source={require("../images/Hero.png")}
              style={styles.heroImage}
            />
            {/* Adding the search input  */}
          </View>
          <Searchbar
            style={styles.search}
            onChangeText={handleSearchChange}
            autoCorrect={false}
            value={searchBarText}
            placeholder="Search for meal"
            collapsable={true}
            clearButtonMode="always"
          />
        </ScrollView>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>ORDER FOR DELIVERY!</Text>
        <FilterButtons
          tabs={tabs}
          setFilterData={handleFilterSelection()}
          selections={filterSelections}
        />

        <Menu data={menuData} style={{ flex: 1 }} />
      </View>

      {/* <MenuTab data={menuData} action={handleOnclickTab} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexGrow: 1,
    flex: 1,
  },
  hero: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#495E57",
    marginTop: 10,
    flexShrink: 1,
  },
  heroHeading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F4CE14",
  },
  heroSubHeading: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  heroIntroContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  heroIntro: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#fff",

    flex: 2,
    paddingRight: 20,
  },
  heroImage: {
    width: 80,
    height: 120,
    borderRadius: 20,
    flex: 1,
  },
  search: {
    backgroundColor: "#B5B7B9",
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
  },
  body: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
});

export default HomeScreen;
