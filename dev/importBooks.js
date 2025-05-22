// importBooks.js
// import books from '../puzzle-game/db/essential_book_data.json';
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
// const booksData = books;
const booksData = [
  {
    "title": "Mali princ za najmlajše",
    "author": "Saint-Exupéry, Antoine de",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/290172928"
  },
  {
    "title": "Hamlet [Elektronski vir]",
    "author": "Shakespeare, William, 1564-1616",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/196613891"
  },
  {
    "title": "Marta pred ogledalom [Elektronski vir] : monodrama",
    "author": "Calo, Teresa, 1955-",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/208255747"
  },
  {
    "title": "Dogodek v mestu Gogi [Elektronski vir] : igra v dveh dejanjih",
    "author": "Grum, Slavko",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/142292227"
  },
  {
    "title": "Nora (Hiša lutk) [Elektronski vir]",
    "author": "Ibsen, Henrik, 1828-1906",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/142306563"
  },
  {
    "title": "Antigona [Elektronski vir]",
    "author": "Sophocles",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/142311427"
  },
  {
    "title": "Modus operandi [Elektronski vir]",
    "author": "Černelč, Simon, 1979-",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/150827779"
  },
  {
    "title": "Marta pred ogledalom : monodrama",
    "author": "Calo, Teresa, 1955-",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/158763267"
  },
  {
    "title": "Moj ata, socialistični kulak [Elektronski vir] : (bridka komedija o agrarnem)",
    "author": "Partljič, Tone",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/129897731"
  },
  {
    "title": "Romeo in Julija [Elektronski vir]",
    "author": "Shakespeare, William, 1564-1616",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/129925379"
  },
  {
    "title": "Julij Cezar [Elektronski vir]",
    "author": "Shakespeare, William, 1564-1616",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/129980931"
  },
  {
    "title": "Lepi dnevi v Aranjuezu : poletni dialog",
    "author": "Handke, Peter, 1942-",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/48990211"
  },
  {
    "title": "Zadnje drame [Elektronski vir]",
    "author": "Zupančič, Matjaž, 26.4.1959-",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/65704707"
  },
  {
    "title": "Tri igre za punce [Elektronski vir]",
    "author": "Semenič, Simona",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/80536835"
  },
  {
    "title": "Spalne hibe : (trideset trenov Očesa)",
    "author": "Denemarková, Radka",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/38008323"
  },
  {
    "title": "Za isto mizo [Elektronski vir] : tri komedije",
    "author": "Möderndorfer, Vinko, 1958-",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/38819075"
  },
  {
    "title": "42 gledaliških in lutkovnih predstav",
    "author": "Pernarčič, Jožef",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/304017408"
  },
  {
    "title": "Predsednikova norost ali Predsednik republike je nor : tragikomedija v dveh dejanjih",
    "author": "Godler, Jure, 1984-",
    "image_url": "https://d.cobiss.net/repository/si/thumbnails/299066624"
  }
];

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
