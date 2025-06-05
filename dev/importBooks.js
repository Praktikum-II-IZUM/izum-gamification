// importBooks.js
// import books from './essential_book_data.json';
const books = require('./essential_book_data.json');
// Import the Firebase Admin SDK
const admin = require('firebase-admin');

// Path to your service account key JSON file
// Make sure this file is in the same directory as this script
const serviceAccount = require('./private_key_firestore_izum.json');


// Initialize the Firebase Admin SDK
// Make sure the databaseURL is correct for your project, though not strictly needed for Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://YOUR-PROJECT-ID.firebaseio.com' // Optional for Firestore
});

// Get a Firestore instance
const db = admin.firestore();

// --- Your Data ---
// This is the data you want to import.
// You can copy your JSON array directly into this variable.
const booksData = books;

// const booksData = [

// --- Import Logic ---
async function importData() {
  const collectionName = 'books'; // The name of the collection you want to import into

  if (booksData.length === 0) {
    console.log('No data to import.');
    return;
  }

  // Firestore allows batch writes of up to 500 operations (sets, updates, deletes)
  // For larger datasets, you'd need to split into multiple batches.
  // For this example, assuming the array is small or fits within one batch.
  const batch = db.batch();

  console.log(`Starting import into collection: ${collectionName}`);
  console.log(`Total documents to potentially add: ${booksData.length}`);

  booksData.forEach(book => {
    // Create a new document reference with an auto-generated ID
    const docRef = db.collection(collectionName).doc();

    // Add the set operation to the batch.
    // This means we're creating a new document or overwriting one if an ID was specified (but here we use auto-IDs).
    batch.set(docRef, book);
  });

  try {
    // Commit the batch to Firestore
    await batch.commit();
    console.log('Batch write successful!');
    console.log(`Successfully imported ${booksData.length} documents into '${collectionName}'.`);
  } catch (error) {
    console.error('Error performing batch write:', error);
  }
}

// Run the import function
importData()
  .then(() => process.exit(0)) // Exit the script successfully
  .catch(() => process.exit(1)); // Exit the script with an error code
