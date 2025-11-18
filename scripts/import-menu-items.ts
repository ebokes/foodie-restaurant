import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { menuItems } from '../lib/constants';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function importMenuItems() {
  try {
    // Validate environment variables
    const missingVars: string[] = [];
    if (!firebaseConfig.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
    if (!firebaseConfig.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
    if (!firebaseConfig.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    if (!firebaseConfig.storageBucket) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
    if (!firebaseConfig.messagingSenderId) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
    if (!firebaseConfig.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID');

    if (missingVars.length > 0) {
      console.error('❌ Error: Firebase configuration is missing!');
      console.error(`Missing environment variables: ${missingVars.join(', ')}`);
      console.error('\nPlease make sure .env.local file exists in the project root with all Firebase configuration variables.');
      console.error('You can copy .env.example to .env.local and fill in your Firebase credentials.');
      process.exit(1);
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('🚀 Starting menu items import...');
    console.log(`📦 Total items to import: ${menuItems.length}\n`);

    // Import each menu item
    let imported = 0;
    let skipped = 0;

    for (const item of menuItems) {
      try {
        const docRef = doc(db, 'menuItems', item.id.toString());
        await setDoc(docRef, {
          ...item,
          id: item.id,
        });
        console.log(`✓ Imported: ${item.name} (ID: ${item.id})`);
        imported++;
      } catch (error: any) {
        console.error(`✗ Failed to import ${item.name}:`, error.message);
        skipped++;
      }
    }

    console.log(`\n✅ Import completed!`);
    console.log(`   Successfully imported: ${imported} items`);
    if (skipped > 0) {
      console.log(`   Skipped/Failed: ${skipped} items`);
    }
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error importing menu items:', error.message);
    if (error.code === 'permission-denied') {
      console.error('\n💡 Tip: Make sure your Firestore security rules allow writes to menuItems collection.');
    }
    process.exit(1);
  }
}

// Run the import
importMenuItems();

