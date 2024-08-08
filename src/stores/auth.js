import { writable } from 'svelte/store';
import { auth } from '../lib/auth/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { goto } from '$app/navigation';

const user = writable(null);

onAuthStateChanged(auth, (firebaseUser) => {
  user.set(firebaseUser);
});

function logout() {
  signOut(auth).then(() => {
    user.set(null);
    goto('/auth/login'); // Redirect to login page
  }).catch((error) => {
    console.error("Sign out error", error);
  });
}

export { user, logout };