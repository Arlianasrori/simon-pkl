import admin from "firebase-admin"
import serviceAccount from "C:\\Users\\Farhan\\Desktop\\simon_pkl_backend\\private_key.json"

export async function sendNotification(message) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    
    admin.messaging().send(message)
}