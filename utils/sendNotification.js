import admin from "firebase-admin"
import serviceAccount from "file://C:\\Users\\ghera\\OneDrive\\Desktop\\backend2\\simon-pkl-2a7c6-firebase-adminsdk-zvkwd-08e150fa34.json" with {type : "json"}
            
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export async function sendNotification(message) {
    try {           
        await admin.messaging().send(message)  
    }catch(e) {
        console.log("firebase error : " + e.message);
    }
}