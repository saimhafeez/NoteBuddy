import * as SQLite from 'expo-sqlite';
import db, { notes } from "./Connection";


export const createNote = ({ title, content, dateAdded, dateModified, password }) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO ${notes} (title, content, dateAdded, dateModified, password) VALUES (?, ?, ?, ?, ?)`,
                [title, content, dateAdded, dateModified, password],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        // Data was successfully inserted, now retrieve the inserted data
                        tx.executeSql(
                            `SELECT * FROM ${notes} WHERE id = last_insert_rowid()`,
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

export const getNotes = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${notes}`,
                [],
                (_, results) => {

                    // const data = [];
                    // for(const result of results.rows._array){
                    //     const {task, symbol, ...others} = result
                    //     data.push({
                    //         ...others,
                    //         symbol: JSON.parse(symbol),
                    //         task: JSON.parse(task)
                    //     })
                    // }
                    resolve(results.rows._array)
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}

export const updateNote = ({ id, title, content, dateAdded, dateModified, password }) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE ${notes} SET title = ?, content = ?, dateAdded = ?, dateModified = ?, password = ? WHERE id = ?`,
                [title, content, dateAdded, dateModified, password, id],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        // Data was successfully updated, now retrieve the updated data
                        tx.executeSql(
                            `SELECT * FROM ${notes} WHERE id = ?`,
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

export const getNoteById = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${notes} WHERE id = ?`,
                [id],
                (_, results) => {

                    // const data = [];
                    // for (const result of results.rows._array) {
                    //     const { task, symbol, ...others } = result
                    //     data.push({
                    //         ...others,
                    //         symbol: JSON.parse(symbol),
                    //         task: JSON.parse(task)
                    //     })
                    // }
                    resolve(results.rows._array[0])
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}

export const deleteNoteById = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM ${notes} WHERE id = ?`,
                [id],
                (_, results) => {
                    if (results.rowsAffected > 0) {
                        resolve({ success: true, message: 'Note deleted successfully' });
                    } else {
                        resolve({ success: false, message: 'Note not found' });
                    }
                },
                (_, error) => {
                    reject(error); // Reject the Promise with the database error
                }
            );
        });
    });
}