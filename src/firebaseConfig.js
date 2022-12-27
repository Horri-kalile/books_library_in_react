import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// Initialize Firebase
const app = initializeApp({
  apiKey: 'AIzaSyA4vzqyyMvDZYgdx5XbZqIlf-i1rYtsiyY',
  authDomain: 'reactproject-665bf.firebaseapp.com',
  projectId: 'reactproject-665bf',
  storageBucket: 'reactproject-665bf.appspot.com',
  messagingSenderId: '927625996553',
  appId: '1:927625996553:web:6da9514bc7741765fa4bd8',
  measurementId: 'G-SF0B6NTB8E',
})
// Firebase storage reference
const storage = getStorage(app)
export default storage
