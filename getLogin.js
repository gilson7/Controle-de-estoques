import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth ,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
const firebaseConfig = {
    apiKey: "AIzaSyASSiODHgwFGkwjgwl_E-y1nQLpiuGdXKQ",
    authDomain: "gerenciador-de-estoques.firebaseapp.com",
    projectId: "gerenciador-de-estoques",
    storageBucket: "gerenciador-de-estoques.appspot.com",
    messagingSenderId: "543584297763",
    appId: "1:543584297763:web:8e7b4f09c11fee0828e296",
    measurementId: "G-TX8X7DRS5E"
 };
 
function Html(type,ref,content){
    const element = document.createElement(type)
    if(ref[0] == "#"){
        element.id = ref.replace("#","")
    }
    if(ref[0] == "."){
        element.className = ref.replace(".","")
    }
    if(content){
        if(typeof(content) == "string"){

            element.innerHTML =content
        }else if(typeof(content)=="object"){
            if (Array.isArray(content)) {
                content.map((ele)=>{
                    element.appendChild(ele)
                })
            }else{
                element.appendChild(content)
            }
        
        }
    }
    return element
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
var ispp = false
const elementConfig = document.getElementById("userConfig")
onAuthStateChanged(auth, (user) => {
    if (user) {

        elementConfig.style.backgroundImage = `url(${user.photoURL})`

        function generatePopup(){
            if(ispp){
                //impedindo multiplos popups
                return
            }
            const name = Html("div",".name-user-config",user.displayName)
            const email = Html("div",".email-user-config",user.email)
            const preview = Html("div",".preview-user-config","")
            const sair = Html("div",".sair-user-config","sair")
            const popup = Html("div",".popup-user-config",[preview,name,email,sair])
            sair.onclick =()=>{
                // Se houver um usuário autenticado, fazer logout
                signOut(auth).then(() => {
                    // Usuário desconectado com sucesso
                    console.log('Usuário desconectado');
                }).catch((error) => {
                    // Ocorreu um erro ao desconectar o usuário
                    console.error('Erro ao desconectar o usuário:', error);
                });
            }
            preview.style.backgroundImage = `url(${user.photoURL})`
            document.body.appendChild(popup)
            ispp = true
            document.onclick = e=>{
                if(e.target.className!="popup-user-config"
                &&
                    e.target.parentNode.className!="popup-user-config"
                &&
                e.target.id!="userConfig"){
                    console.log(e.target.className)
                    popup.remove()
                    ispp = false
                }
            }
        }   
        elementConfig.onclick = generatePopup
        console.log(user)
    }else{
        window.location.href = "login.html"
    }
})