// import { getFirestore, collection } from 'firebase/firestore'

// used for the firestore refs
// const db = getFirestore(firebaseApp)

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAAT6-8suhi5T4JpQA5Hta1Yn35wc8LQnc',
  authDomain: 'foody-f8545.firebaseapp.com',
  projectId: 'foody-f8545',
  storageBucket: 'foody-f8545.appspot.com',
  messagingSenderId: '1040216597893',
  appId: '1:1040216597893:web:72e18b0d4ce0d478e990ec',
  measurementId: 'G-13F5MXPTLC',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const analytics = getAnalytics(firebaseApp)
export const storage = getStorage(firebaseApp)
