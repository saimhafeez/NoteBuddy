import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("noteBuddy.db");

// Tables
export const todo = "todo";
export const todo_categories = "todo_categories";
export const notes = "notes";

db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS ${todo} (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, isCompleted BOOLEAN, completedOn TEXT, symbol TEXT)`
  );

  // Make Categories Table
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS ${todo_categories} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`,
    [],
    function (tx) {
      // Table creation successful, now insert the categories if necessary
      tx.executeSql(
        `INSERT INTO ${todo_categories} (name) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM ${todo_categories} WHERE name = ?)`,
        ["Work", "Work"],
        null,
        null
      );

      tx.executeSql(
        `INSERT INTO ${todo_categories} (name) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM ${todo_categories} WHERE name = ?)`,
        ["Personal", "Personal"],
        null,
        null
      );

      tx.executeSql(
        `INSERT INTO ${todo_categories} (name) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM ${todo_categories} WHERE name = ?)`,
        ["Wishlist", "Wishlist"],
        null,
        null
      );

      tx.executeSql(
        `INSERT INTO ${todo_categories} (name) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM ${todo_categories} WHERE name = ?)`,
        ["Birthday", "Birthday"],
        null,
        null
      );
    },
    null
  );

  // Make Notes Table
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS ${notes} (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, dateAdded TEXT, dateModified TEXT, password TEXT)`
  );

  // Make User Table
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT)`
  );
});

export default db;
