import admin from "firebase-admin/app"
import serviceAccount from "file:\\C:\\Users\\pc-03\\Desktop\\backend2\\simon-pkl-2a7c6-firebase-adminsdk-zvkwd-08e150fa34.json" with {type : "json"}
import { credential } from "firebase-admin"

admin.getApp({
    credential : admin.c
})
// admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
// });

// admin.messaging().send({
//             notification : {
//                 body : "Kabar Baik Untukmu",
//                 title : "P",
                
//             },
//             token : "djRleG7ETayLB2z1LArts9:APA91bGlaMyBp_HfmEj-Vcsb5jVWNn0zrNZv6WRXzSSukIdQ_kgSGPFPGBSE1glD5KE8gi3eWqGdgmM35-Jin1y70tf0IyDY3oEZG8dWZImOSTKjA8yaB6riwMwPqs92StwjwctCVyvA"
// }).then(msg => {
//     console.log(msg);
// })