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

                db.transaction((tx) => {
                  // tx.executeSql('DROP TABLE user')
                  // tx.executeSql('DROP TABLE child')
                  // tx.executeSql('DROP TABLE device')
                  // tx.executeSql('DROP TABLE notification')

                  // tx.executeSql('DELETE FROM device')
                  // tx.executeSql('DELETE FROM notification')

                })

                // console.log("******* DROP or DELETE TABLE *******")
                // return

                db.executeSql('UPDATE user SET password="a" WHERE email="a"')

                // check if user table exists, if not, create user table
                db.executeSql('SELECT 1 FROM device LIMIT 1').then(() => {
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
                                                                        uuid VARCHAR, 
                                                                        user_id INTEGER NOT NULL, 
                                                                        created_at VARCHAR NOT NULL, 
                                                                        updated_at VARCHAR NOT NULL)`)
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS device (uuid VARCHAR PRIMARY KEY NOT NULL, 
                                                                        serial_number VARCHAR, 
                                                                        battery INTEGER, 
                                                                        last_sync_time VARCHAR, 
                                                                        is_connected INT NOT NULL,
                                                                        user_id INTEGER NOT NULL, 
                                                                        created_at VARCHAR NOT NULL, 
                                                                        updated_at VARCHAR NOT NULL)`)
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS notification (uuid VARCHAR NOT NULL, 
                                                                        serial_number VARCHAR, 
                                                                        battery INTEGER, 
                                                                        time VARCHAR NOT NULL, 
                                                                        content VARCHAR, 
                                                                        confirmed INTEGER NOT NULL, 
                                                                        child_name INTEGER,  
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
            if (user.password != '') {
              tx.executeSql(`UPDATE user SET name = ?, email = ?, phone = ?, password = ?, image_path = ?, updated_at = ? WHERE id = ?`, 
                              [user.name, user.email, user.phone, user.password, user.imagePath, strCurDateTime, user.id]).then(([tx, results]) => {
                console.log("update user query completed")
                resolve(results)
              })
              
            } else {
              tx.executeSql(`UPDATE user SET name = ?, email = ?, phone = ?, image_path = ?, updated_at = ? WHERE id = ?`, 
                              [user.name, user.email, user.phone, user.imagePath, strCurDateTime, user.id]).then(([tx, results]) => {
                console.log("update user query completed")
                resolve(results)
              })

            }
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
            tx.executeSql(`SELECT t1.id, t1.name, t1.age, t1.blood_type AS bloodType, t1.condition, t1.relationship, t1.image_path AS imagePath, t1.uuid, t2.serial_number as serialNumber, t1.user_id as userId
                          FROM child t1 
                          LEFT JOIN device t2 ON t1.uuid = t2.uuid
                          WHERE t1.user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("list child query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                // console.log(`Child Id: ${row.id}, Child Name: ${row.name}, Age: ${row.age}, Blood Type: ${row.bloodType}, Condition: ${row.condition}, Relationship: ${row.relationship}, 
                //                       Image Path: ${row.imagePath}, UUID: ${row.uuid}, Serial Number: ${row.serialNumber}, User Id: ${row.userId} `)
                const { id, name, age, bloodType, condition, relationship, imagePath, uuid, serialNumber, userId } = row
                childs.push({ id, name, age, bloodType, condition, relationship, imagePath, uuid, serialNumber, userId })
              }

              // console.log(childs)
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

    getChild(childId) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT id, name, age, blood_type AS bloodType, condition, relationship, image_path AS imagePath, uuid, user_id as userId
                          FROM child 
                          WHERE id = ?`, [childId]).then(([tx, results]) => {
              console.log("get child query completed")
              
              var len = results.rows.length
              if (len == 0) return null

              let row = results.rows.item(0)
              console.log(row)
              resolve(row)
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
            tx.executeSql(`SELECT id, name, uuid FROM child WHERE user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("child id name list query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                const { id, name, uuid } = row
                idNameList.push({ id, name, uuid })
              }

              // console.log(idNameList)
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
            tx.executeSql(`INSERT INTO child (name, age, blood_type, condition, relationship, image_path, uuid, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                          [child.name, child.age, child.bloodType, child.condition, child.relationship, child.imagePath, child.uuid, child.userId, strCurDateTime, strCurDateTime]).then(([tx, results]) => {
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
            tx.executeSql(`UPDATE child SET name = ?, age = ?, blood_type = ?, condition = ?, relationship = ?, image_path = ?, uuid = ?, updated_at = ? WHERE id = ?`, 
                            [child.name, child.age, child.bloodType, child.condition, child.relationship, child.imagePath, child.uuid, strCurDateTime, child.id]).then(([tx, results]) => {
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

    updateChildWithUUID(childId, uuid) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          let strCurDateTime = this.getCurrentDateTimeString()
          db.transaction((tx) => {
            tx.executeSql(`UPDATE child SET uuid = ?, updated_at = ? WHERE id = ?`, 
                            [uuid, strCurDateTime, childId]).then(([tx, results]) => {
              console.log("update child query with uuid completed")
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
            tx.executeSql(`SELECT t1.uuid, t1.serial_number AS serialNumber, t1.battery, t1.last_sync_time AS lastSyncTime, 
                            t1.is_connected AS isConnected, t2.id as childId, t2.name as childName, t2.image_path as childPhoto, t1.user_id as userId
                          FROM device t1
                          LEFT JOIN child t2 ON t1.uuid = t2.uuid
                          WHERE t1.user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("list device query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                const { uuid, serialNumber, battery, lastSyncTime, isConnected, childId, childName, childPhoto, userId } = row
                devices.push({ uuid, serialNumber, battery, lastSyncTime, isConnected, childId, childName, childPhoto, userId})
              }

              // console.log(devices)
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

    getDevice(uuid) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT t1.uuid, t1.serial_number AS serialNumber, t1.battery, t1.last_sync_time AS lastSyncTime, 
                            t1.is_connected AS isConnected, t2.id as childId, t2.name as childName, t2.image_path as childPhoto, t1.user_id as userId
                          FROM device t1
                          LEFT JOIN child t2 ON t1.uuid = t2.uuid
                          WHERE t1.uuid = ?`, [uuid]).then(([tx, results]) => {
              console.log("get device query completed")
              
              var len = results.rows.length
              if (len == 0) {
                resolve(null)

              } else {
                let device = results.rows.item(0)
                console.log(device)
                resolve(device)
              }
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

    getDeviceIDList(userId) {
      return new Promise((resolve) => {
        const devices = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT uuid, serial_number AS serialNumber FROM device WHERE user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("getDeviceIDList completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`UUID: ${row.uuid}, Serial Number: ${row.serialNumber}`)
                const { uuid, serialNumber } = row
                devices.push({ uuid, serialNumber })
              }

              // console.log(devices)
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
      console.log(">>> before insert device: ", device)
      return new Promise((resolve) => {
        this.initDB().then((db) => {

          console.log(">>> before insert device: ", device)
          let strCurDateTime = this.getCurrentDateTimeString()
          let resolveResult = null
          db.transaction((tx) => {
            tx.executeSql(`INSERT INTO device (uuid, serial_number, battery, last_sync_time, is_connected, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                          [device.uuid, device.serialNumber, device.battery, device.lastSyncTime, device.isConnected, device.userId,  strCurDateTime, strCurDateTime]).then(([tx, results]) => {
              console.log(">>> insert device query completed, results: ", results)
              // this.closeDatabase(db)
              // resolve(results)
              resolveResult = results
            })
          }).then((result) => {
            console.log("insert device transaction then, results: ", result)
            this.closeDatabase(db)

            resolve(resolveResult)
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
            tx.executeSql(`UPDATE device SET serial_number = ?, battery = ?, last_sync_time = ?, is_connected = ?, updated_at = ? WHERE uuid = ?`, 
                            [device.serialNumber, device.battery, device.lastSyncTime, device.isConnected, strCurDateTime, device.uuid]).then(([tx, results]) => {
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

    deleteDevice(uuid) {
      return new Promise((resolve) => {
        const users = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`UPDATE child SET uuid = "" WHERE uuid = ?`, [uuid])

            tx.executeSql(`DELETE FROM device WHERE uuid = ?`, [uuid]).then(([tx, results]) => {
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

    deleteAllDevice(userId) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {
          db.transaction((tx) => {
            // tx.executeSql(`UPDATE child SET uuid = "" WHERE user_id = ?`, [userId])

            tx.executeSql(`DELETE FROM device WHERE user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("delete all device query completed")
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
            tx.executeSql(`SELECT uuid, serial_number AS serialNumber, battery, time, content, confirmed, child_name AS childName 
                          FROM notification
                          WHERE user_id = ?`, [userId]).then(([tx, results]) => {
              console.log("list notification query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`UUID: ${row.uuid}, Serial Number: ${row.serialNumber}, Battery: ${row.battery}, Time: ${row.time}, content: ${row.content}, confirmed: ${row.confirmed}, Child Name: ${row.childName}`)
                const { uuid, serialNumber, battery, time, content, confirmed, childName } = row
                notifications.push({ uuid, serialNumber, battery, time, content, confirmed, childName })
              }

              // console.log(notifications)
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
            tx.executeSql(`INSERT INTO notification (uuid, serial_number, battery, time, content, confirmed, child_name, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                          [notification.uuid, notification.serialNumber, notification.battery, notification.time, notification.content, notification.confirmed, notification.childName, device.userId,  strCurDateTime, strCurDateTime]).then(([tx, results]) => {
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

    getLastNotificationsByConnectedDevice(userId) {   
      return new Promise((resolve) => {
        const notifications = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT t1.uuid, t1.serial_number AS serialNumber, t1.battery, t1.time, t1.content, t1.confirmed, t1.child_name AS childName 
                          FROM notification t1, device t2 
                          WHERE t1.uuid = t2.uuid AND t2.is_connected = 1 AND t1.user_id = ?
                          ORDER BY time DESC
                          LIMIT 3`, [userId]).then(([tx, results]) => {
              console.log("last notifications query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`UUID: ${row.uuid}, Serial Number: ${row.serialNumber}, Battery: ${row.battery}, Time: ${row.time}, content: ${row.content}, confirmed: ${row.confirmed}, Child Name: ${row.childName}`)
                const { uuid, serialNumber, battery, time, content, confirmed, childName } = row
                notifications.push({ uuid, serialNumber, battery, time, content, confirmed, childName })
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

    getLastNotificationsByAddedDevices(userId) {
      return new Promise((resolve) => {
        const notifications = []
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT t1.uuid, t1.serial_number AS serialNumber, t1.battery, t1.time, t1.content, t1.confirmed, t1.child_name AS childName 
                          FROM notification t1, 
                            (SELECT uuid, max(time) AS recent_time FROM notification GROUP BY uuid) t2
                          WHERE t1.uuid = t2.uuid AND t1.time = t2.recent_time AND t1.user_id = ?
                          ORDER BY time DESC`, [userId]).then(([tx, results]) => {
              console.log("last notifications query completed")
              
              var len = results.rows.length
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i)
                console.log(`UUID: ${row.uuid}, Serial Number: ${row.serialNumber}, Battery: ${row.battery}, Time: ${row.time}, content: ${row.content}, confirmed: ${row.confirmed}, Child Name: ${row.childName}`)
                const { uuid, serialNumber, battery, time, content, confirmed, childName } = row
                notifications.push({ uuid, serialNumber, battery, time, content, confirmed, childName })
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

    getLastNotificationByUUID(uuid) {
      return new Promise((resolve) => {
        this.initDB().then((db) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT content FROM notification WHERE uuid = ? ORDER BY time DESC LIMIT 1`, [uuid]).then(([tx, results]) => {
              console.log("last notification by uuid query completed")
              
              if (results.rows.length == 0) {
                console.log("no notification")
                resolve("")

              } else {
                console.log("last notification: ", results.rows.item(0).content)
                resolve(results.rows.item(0).content)
              }

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