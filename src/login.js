import { auth, createUserWithEmailAndPassword, sendEmailVerification } from "./modules/firebaseService.js";


function createUserEmailPassword(email, password){
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("Usuario creado con exito");
    sendEmailVerification(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Ocurrió un error: ", error.code, " - ", errorMessage);
  });
};

window.createUserEmailPassword = createUserEmailPassword;
