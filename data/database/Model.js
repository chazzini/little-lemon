import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("menu.db");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        //tx.executeSql("drop table if  exists menuitems ;");
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, description text,image text,name text, price text, category textdd);"
        );
      },
      (e) => {
        console.log(e);
      },
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const placeholders = menuItems.map(() => "(?,?,?,?,?)").join(", ");
        const values = menuItems.flatMap((item) => [
          item.description,
          item.image,
          item.name,
          item.price,
          item.category,
        ]);

        tx.executeSql(
          `INSERT INTO menuitems ( description, image, name, price, category) VALUES ${placeholders}`,
          values,
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            console.error("Error executing SQL:", error);
            reject(error);
          }
        );
      },
      null, // Error callback, which is not used here
      resolve
    );
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    if (!query) {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menuitems where ${activeCategories
            .map((category) => `category='${category}'`)
            .join(" or ")}`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          }
        );
      }, reject);
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menuitems where (name like '%${query}%') and (${activeCategories
            .map((category) => `category='${category}'`)
            .join(" or ")})`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          }
        );
      }, reject);
    }
  });
}
