import { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "./modules/firebaseService.js";

function createUserEmailPassword(email, password){
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("Usuario creado con exito");
    sendEmailVerification(user);
    alert("Usuario creado con exito. Revisa tu correo electronico.");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Ocurrió un error: ", error.code, " - ", errorMessage);
    if (errorCode === "auth/email-already-in-use") {
      alert("Ya existe una cuenta con este correo electronico.")
    }
  });
};

function logInEmailPassword(email, password){
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified){
        alert("Por favor verifica tu correo electronico.")
        return
      }
      window.location.assign("index.html");
    })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: ", errorMessage);
    })
}

window.createUserEmailPassword = createUserEmailPassword;
window.logInEmailPassword = logInEmailPassword;
