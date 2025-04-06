const admin = require("firebase-admin");
const serviceAccount = require("./path-to-service-account-key.json"); // Replace with the actual path to your service account key
const data = require("./data.json"); // Replace with your JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const uploadData = async () => {
  const collectionName = "your_collection_name"; // Replace with your desired collection name
  const collectionRef = db.collection(collectionName);

  try {
    for (const [key, value] of Object.entries(data)) {
      // Use key as document ID if your JSON has unique keys, otherwise use `add()` for auto-generated IDs
      await collectionRef.doc(key).set(value);
      console.log(`Document ${key} uploaded successfully`);
    }
    console.log("All data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

uploadData();
