import * as SQLite from 'expo-sqlite';
import db, {todo} from "./Connection";
import {TaskSymbols} from "../utils/TaskSymbols";
export const createTodoTask = (task, isCompleted = false, completedOn = '', symbol = JSON.stringify(TaskSymbols.default)) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO ${todo} (task, isCompleted, completedOn, symbol) VALUES (?, ?, ?, ?)`,
                [task, isCompleted, completedOn, symbol],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        // Data was successfully inserted, now retrieve the inserted data
                        tx.executeSql(
                            `SELECT * FROM ${todo} WHERE id = last_insert_rowid()`,
                            [],
                            (_, { rows }) => {
                                const insertedData = rows.item(0);
                                resolve(insertedData); // Resolve the Promise with the inserted data
                            }
                        );
                    } else {
                        reject(new Error('Insert failed'));
                    }
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}

export const getTodos = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${todo}`,
                [],
                (_, results) => {

                    const data = [];
                    for(const result of results.rows._array){
                        const {task, symbol, ...others} = result
                        data.push({
                            ...others,
                            symbol: JSON.parse(symbol),
                            task: JSON.parse(task)
                        })
                    }
                    resolve(data)
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}

export const updateTodoTask = (id, task, isCompleted, completedOn, symbol) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE ${todo} SET task = ?, isCompleted = ?, completedOn = ?, symbol = ? WHERE id = ?`,
                [task, isCompleted, completedOn, symbol, id],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        // Data was successfully updated, now retrieve the updated data
                        tx.executeSql(
                            `SELECT * FROM ${todo} WHERE id = ?`,
                            [id],
                            (_, { rows }) => {
                                const updatedData = rows.item(0);
                                resolve(updatedData); // Resolve the Promise with the updated data
                            }
                        );
                    } else {
                        reject(new Error('Update failed or no matching ID found'));
                    }
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}

export const getTodoById = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${todo} WHERE id = ?`,
                [id],
                (_, results) => {

                    const data = [];
                    for(const result of results.rows._array){
                        const {task, symbol, ...others} = result
                        data.push({
                            ...others,
                            symbol: JSON.parse(symbol),
                            task: JSON.parse(task)
                        })
                    }
                    resolve(data[0])
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}