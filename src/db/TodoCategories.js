import db, {todo_categories} from "./Connection";


export const getToDoCategories = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${todo_categories}`,
                [],
                (_, results) => {
                    resolve(results.rows._array)
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}

export const addNewToDoCategory = (name) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO ${todo_categories} (name) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM ${todo_categories} WHERE name = ?)`,
                [name, name],
                (_, results) => {
                    resolve(results.rows._array)
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}