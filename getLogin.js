import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth ,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { getFirestore,doc,getDoc,collection } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
const db = getFirestore(app)
const auth = getAuth(app);
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


var ispp = false
const elementConfig = document.getElementById("userConfig")
const elementConfigMobile = document.getElementById("menuButton")
const removeMenu = document.getElementById("closeMenuOp")
const menu = document.getElementById("menu")


onAuthStateChanged(auth, (user) => {
    if (user) {
        async function getUserType(){
            try{
                const docSnapshot  = await getDoc(doc(db, "users", user.uid))
                if (docSnapshot.exists()){
                    const data = docSnapshot.data()
                    localStorage.user_tipo = data.tipo
                }else{
                    localStorage.user_tipo = "null" 
                }
            }catch(err){
                console.error(err)
                localStorage.user_tipo = "null" 
                return err
            }
        }
        getUserType()

        elementConfig.style.backgroundImage = `url(${user.photoURL})`
        function generatePopup(type){
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
            type=="mob"?menu.appendChild(popup):document.body.appendChild(popup)
            const optElement = document.createElement("div")
            optElement.id = "opts"
            const opt_qr = document.createElement("a")
            opt_qr.href = "./qr.html"
            opt_qr.innerText = "Qr coder"
            optElement.appendChild(opt_qr)
            menu.appendChild(optElement)
            ispp = true
            document.onclick = e=>{
                if(e.target.className!="popup-user-config"
                &&
                    e.target.parentNode.className!="popup-user-config"
                &&
               ( e.target.id!="userConfig"&& e.target.id!="userConfig-mobile")&&type!="mob"){
                    console.log(e.target.className)
                    popup.remove()
                    ispp = false
                }
            }
        }   
        elementConfig.onclick = generatePopup
        elementConfigMobile.onclick = ()=>{
            generatePopup("mob")
            if(menu.classList.value.includes("active")){
                menu.classList.remove("active")
                return
            }
            menu.classList.add("active")
        }
       
        console.log(user)
        
    }else{
        window.location.href = "login.html"
    }
})
removeMenu.onclick = ()=>{
    elementConfigMobile.click()
}
console.log(removeMenu.onclick)

