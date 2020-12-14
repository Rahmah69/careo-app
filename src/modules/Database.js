import SQLite from "react-native-sqlite-storage"
import moment from "moment"

SQLite.DEBUG(true)
SQLite.enablePromise(true)

const database_name = "BraceletMonitoring.db"
const database_version = "1.0"
const database_displayname = "Bracelet Monitoring App Database"
const database_size = 20000

export default class Database {
    initDB() {
      let db
      return new Promise((resolve) => {
        console.log("Plugin integrity check ...")
        SQLite.echoTest()
          .then(() => {
            console.log("Integrity check passed ...")
            console.log("Opening database ...")
            SQLite.openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size
            )
              .then(DB => {
                db = DB
                console.log("Database OPEN")

                // db.transaction((tx) => {
                //   tx.executeSql('DROP TABLE user')
                //   tx.executeSql('DROP TABLE child')
                //   tx.executeSql('DROP TABLE device')
                //   tx.executeSql('DROP TABLE notification')
                // })


                // check if user table exists, if not, create user table
                db.executeSql('SELECT 1 FROM user LIMIT 1').then(() => {
                    console.log("Database is ready ... executing query ...")
                    resolve(db)
                }).catch((error) =>{
                    console.log("Received error: ", error)
                    console.log("Database not yet ready ... populating data")

                    db.transaction((tx) => {
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                                                        name VARCHAR NOT NULL, 
                                                                        email VARCHAR, 
                                                                        phone VARCHAR, 
                                                                        password VARCHAR NOT NULL, 
                                                                        image_path VARCHAR, 
                                                                        created_at VARCHAR NOT NULL, 
                                                                        updated_at VARCHAR NOT NULL)`)
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS child (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                                                        name VARCHAR NOT NULL, 
                                                                        age INTEGER NOT NULL, 
                                                                        blood_type VARCHAR, 
                                                                        condition VARCHAR NOT NULL, 
                                                                        relationship VARCHAR NOT NULL, 
                                                                        image_path VARCHAR, 
                                                                        serial_number VARCHAR, 
                                                                        user_id INTEGER NOT NULL, 
                                                                        created_at VARCHAR NOT NULL, 
                                                                        updated_at VARCHAR NOT NULL)`)
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS device (serial_number VARCHAR PRIMARY KEY NOT NULL, 
                                                                        battery INTEGER NOT NULL, 
                                                                        last_sync_time VARCHAR, 
                                                                        user_id INTEGER NOT NULL, 
                                                                        created_at VARCHAR NOT NULL, 
                                                                        updated_at VARCHAR NOT NULL)`)
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS notification (serial_number VARCHAR NOT NULL, 
                                                                        battery INTEGER, 
                                                                        time VARCHAR NOT NULL, 
                                                                        content VARCHAR, 
                                                                        confirmed INTEGER NOT NULL, 
                                                                        child_id INTEGER,  
                                                                        user_id INTEGER NOT NULL, 
                                                                        created_at VARCHAR NOT NULL, 
                                                                        updated_at VARCHAR NOT NULL)`)
                    }).then(() => {
                        console.log("Table created successfully")
                        resolve(db)

                    }).catch(error => {
                        console.log(error)
                        resolve(db)
                    })
                })
              })
              .catch(error => {
                console.log(error)
                resolve(db)
              })
          })
          .catch(error => {
            console.log("echoTest failed - plugin not functional")
            resolve(db)
          })
        })
    }

    closeDatabase(db) {
      if (db) {
        console.log("Closing DB")
        db.close()
          .then(status => {
            console.log("Database CLOSED")
          })
          .catch(error => {
            this.errorCB(error)
          })
      } else {
        console.log("Database was not OPENED")
      }
    }

    getCurrentDateTimeString() {
      return moment().format('YYYY-MM-DD hh:mm:ss')
    }

    listUser() {
      return new Promise((resolve) => {
        let users = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql('SELECT id, name, email, phone, password, image_path AS imagePath FROM user', []).then(([tx, results]) => {
              console.log("list user query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`User Id: ${row.id}, User Name: ${row.name}, Email: ${row.email}, Phone: ${row.phone}, Image Path: ${row.imagePath} `)
                const { id, name, email, phone, password, imagePath } = row
                users.push({ id, name, email, phone, password, imagePath })
              }

              console.log(">>> list User: ", users)
              resolve(users)
            }).catch((err) => {
              console.log(">>> list User Error: ", err)

              resolve(users)
            })
          }).then((result) => {
            this.closeDatabase(db)

            console.log(">>> listUser - close database")
          }).catch((err) => {
            console.log(">>> listUser Error: ", err)

            resolve(users)
          })
        }).catch((err) => {
          console.log(">>> listUser Error: ", err)

          resolve(users)
        })
      })  
    }

    insertUser(user) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            tx.executeSql(`INSERT INTO user (name, email, phone, password, image_path, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                          [user.name, user.email, user.phone, user.password, user.imagePath, strCurDateTime, strCurDateTime]).then(([tx, results]) => {
              console.log(">>> insert user query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)
            console.log(">>> insertUser - closeDatabase")

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    updateUser(user) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            // tx.executeSql(`UPDATE user SET name = '${user.name}', email = '${user.email}', phone = '${user.phone}', password = '${user.password}', image_path = '${user.imagePath}' 
            //               WHERE id = ${user.id}`, []).then(([tx, results]) => {
            tx.executeSql(`UPDATE user SET name = ?, email = ?, phone = ?, password = ?, image_path = ?, updated_at = ? WHERE id = ?`, 
                            [user.name, user.email, user.phone, user.password, user.imagePath, strCurDateTime, user.id]).then(([tx, results]) => {
              console.log("update user query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    deleteUser(userId) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`DELETE FROM user WHERE id = ?`, [userId]).then(([tx, results]) => {
              console.log("delete user query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    listChild(userId) {
      return new Promise((resolve) => {
        const childs = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT id, name, age, blood_type AS bloodType, condition, relationship, image_path AS imagePath, serial_number as serialNumber 
                          FROM child WHERE user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("list child query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`Child Id: ${row.id}, Child Name: ${row.name}, Age: ${row.age}, Blood Type: ${row.bloodType}, Condition: ${row.condition}, Relationship: ${row.relationship}, Image Path: ${row.imagePath}, Serial Number: ${row.serialNumber} `)
                const { id, name, age, bloodType, condition, relationship, imagePath, serialNumber } = row
                childs.push({ id, name, age, bloodType, condition, relationship, imagePath, serialNumber })
              }

              console.log(childs)
              resolve(childs)
            })
          }).then((result) => {
            this.closeDatabase(db)
            
          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    getChildIdNameList(userId) {
      return new Promise((resolve) => {
        const idNameList = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT id, name FROM child WHERE user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("child id name list query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`Child Id: ${row.id}, Child Name: ${row.name}`)
                const { id, name } = row
                idNameList.push({ id, name })
              }

              console.log(idNameList)
              resolve(idNameList)
            })
          }).then((result) => {
            this.closeDatabase(db)
            
          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    insertChild(child) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            tx.executeSql(`INSERT INTO child (name, age, blood_type, condition, relationship, image_path, serial_number, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                          [child.name, child.age, child.bloodType, child.condition, child.relationship, child.imagePath, child.serialNumber, child.userId, strCurDateTime, strCurDateTime]).then(([tx, results]) => {
              console.log(">>> insert child query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    updateChild(child) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            tx.executeSql(`UPDATE child SET name = ?, age = ?, blood_type = ?, condition = ?, relationship = ?, image_path = ?, serial_number = ?, updated_at = ? WHERE id = ?`, 
                            [child.name, child.age, child.bloodType, child.condition, child.relationship, child.imagePath, child.serialNumber, strCurDateTime, child.id]).then(([tx, results]) => {
              console.log("update child query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    deleteChild(childId) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`DELETE FROM child WHERE id = ?`, [childId]).then(([tx, results]) => {
              console.log("delete child query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    listDevice(userId) {
      return new Promise((resolve) => {
        const devices = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT serial_number AS serialNumber, battery, last_sync_time AS lastSyncTime FROM device WHERE user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("list device query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`Serial Number: ${row.serialNumber}, Battery: ${row.battery}, Last Sync Time: ${row.lastSyncTime}`)
                const { serialNumber, battery, lastSyncTime } = row
                devices.push({ serialNumber, battery, lastSyncTime })
              }

              console.log(devices)
              resolve(devices)
            })
          }).then((result) => {
            this.closeDatabase(db)
            
          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    insertDevice(device) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            tx.executeSql(`INSERT INTO device (serial_number, battery, last_sync_time, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`, 
                          [device.serialNumber, device.battery, device.lastSyncTime, device.userId,  strCurDateTime, strCurDateTime]).then(([tx, results]) => {
              console.log(">>> insert device query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    updateDevice(device) {
      return new Promise((resolve) => {
        const users = []
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            tx.executeSql(`UPDATE device SET serial_number = ?, battery = ?, last_sync_time = ?, updated_at = ? WHERE id = ?`, 
                            [device.serialNumber, device.battery, device.lastSyncTime, strCurDateTime, device.id]).then(([tx, results]) => {
              console.log("update device query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    deleteDevice(deviceId) {
      return new Promise((resolve) => {
        const users = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`DELETE FROM device WHERE id = ?`, [deviceId]).then(([tx, results]) => {
              console.log("delete device query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    listNotification(userId) {
      return new Promise((resolve) => {
        const notifications = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT t1.serial_number AS serialNumber, t1.battery, t1.time, t1.content, t1.confirmed, t2.name AS childName 
                          FROM notification t1, child t2 
                          WHERE user_id = ? AND t1.child_id = t2.id`, [userId]).then(([tx, results]) => {
              console.log("list notification query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`Serial Number: ${row.serialNumber}, Battery: ${row.battery}, Time: ${row.time}, content: ${row.content}, confirmed: ${row.confirmed}, Child Name: ${row.childName}`)
                const { serialNumber, battery, time, content, confirmed, childName } = row
                notifications.push({ serialNumber, battery, time, content, confirmed, childName })
              }

              console.log(notifications)
              resolve(notifications)
            })
          }).then((result) => {
            this.closeDatabase(db)
            
          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    insertNotification(notification) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            tx.executeSql(`INSERT INTO notification (serial_number, battery, time, content, confirmed, child_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                          [notification.serialNumber, notification.battery, notification.time, notification.content, notification.confirmed, notification.childId, device.userId,  strCurDateTime, strCurDateTime]).then(([tx, results]) => {
              console.log(">>> insert notification query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }

    deleteNotification(strUntilTime) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`DELETE FROM notification WHERE time <= ?`, [strUntilTime]).then(([tx, results]) => {
              console.log("delete notification query completed")
              resolve(results)
            })
          }).then((result) => {
            this.closeDatabase(db)

          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        })
      })  
    }
}

export let db = new Database()