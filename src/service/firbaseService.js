import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDhGn2ABiuNNto_pqVygYAIMwr3ytIhAJQ",
    authDomain: "wasteology-f2595.firebaseapp.com",
    databaseURL: "https://wasteology-f2595-default-rtdb.firebaseio.com",
    projectId: "wasteology-f2595",
    storageBucket: "wasteology-f2595.appspot.com",
    messagingSenderId: "659634029046",
    appId: "1:659634029046:web:91adb1fa7537da4fa087d7",
    measurementId: "G-QV8BYDR9FX"
};

const firebaseApp = initializeApp(firebaseConfig);
const AUTH = getAuth(firebaseApp);
const DB = getDatabase(firebaseApp);

export { AUTH, DB, firebaseApp };
