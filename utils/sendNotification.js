import admin from "firebase-admin"
import { db } from "../config/prismaClient.js";
import serviceAccount from "file:\\C:\\Users\\LENOVO\\Desktop\\backend-mon\\simon-pkl-2a7c6-firebase-adminsdk-zvkwd-08e150fa34.json" with {type : "json"}
// =======
// import serviceAccount from "file://C:\\Users\\ghera\\OneDrive\\Desktop\\backend2\\simon-pkl-2a7c6-firebase-adminsdk-zvkwd-08e150fa34.json" with {type : "json"}
// >>>>>>> 574d5f28b38994e3dfa87014745562f239f97d8b
            
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export async function sendNotification(message,id) {
    try {           
        await admin.messaging().send(message)  
    }catch(e) {
        console.log("firebase error : " + e.message);
        db.siswa.update({
            where : {
                id : id
            },
            data : {
                token_FCM : null
            }
        })
    }
}