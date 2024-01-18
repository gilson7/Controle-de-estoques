import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth ,onAuthStateChanged,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"


const firebaseConfig = {
    apiKey: "AIzaSyASSiODHgwFGkwjgwl_E-y1nQLpiuGdXKQ",
    authDomain: "gerenciador-de-estoques.firebaseapp.com",
    projectId: "gerenciador-de-estoques",
    storageBucket: "gerenciador-de-estoques.appspot.com",
    messagingSenderId: "543584297763",
    appId: "1:543584297763:web:8e7b4f09c11fee0828e296",
    measurementId: "G-TX8X7DRS5E"
 };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "./index.html"
    }
})


function login(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
document.getElementById("login").onclick = login

