import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut,signInWithPopup,GoogleAuthProvider, onAuthStateChanged,} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
// import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
  

  const firebaseConfig = {
    apiKey: "AIzaSyBvhp5RdY17DSQCO6p6vLrQ5E2RasBH-IM",
    authDomain: "sign-up-login-form-f52a3.firebaseapp.com",
    projectId: "sign-up-login-form-f52a3",
    storageBucket: "sign-up-login-form-f52a3.firebasestorage.app",
    messagingSenderId: "339294474621",
    appId: "1:339294474621:web:f40c5c517c66c544effc14",
    measurementId: "G-J2985QSGLZ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth=getAuth(app);
  const provider=new GoogleAuthProvider();
//   const db = getDatabase(app);

  // Sign Up with Email/Password
  document.getElementById("signup-btn")?.addEventListener("click", () => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
    alert("Sign Up Successful!");
    window.location.href = "task.html";
    })
    .catch((error) => {
    alert(error.message);
    });
    });

     // Login with Email/Password
     document.getElementById("login-btn")?.addEventListener("click", () => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
        alert("Login Successful!");
        window.location.href = "task.html";
        })
        .catch((error) => {
        alert(error.message);
        });
        });

    // Continue with Google
       
    document.getElementById("google-btn")?.addEventListener("click", () => {
    signInWithPopup(auth, provider)
    .then(() => {
    alert("Login Successful!");
    window.location.href = "task.html";
    })
    .catch((error) => {
    alert(error.message);
    });
    });

// Logout
document.getElementById("logout-btn")?.addEventListener("click", () => {
    signOut(auth)
    .then(() => {
    alert("Logged Out Successfully!");
    window.location.href = "index.html";
    })
    .catch((error) => {
    alert(error.message);
    });
    });

   // Show User Email on Welcome Page
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("task.html")) {
    document.getElementById("user-email").textContent = user.email;
    } else if (!user && window.location.pathname.includes("task.html")) {
    window.location.href = "index.html";
    }
});


















