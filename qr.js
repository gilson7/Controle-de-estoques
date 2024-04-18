import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore ,getDocs,collection,doc,setDoc ,deleteDoc,updateDoc,getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyASSiODHgwFGkwjgwl_E-y1nQLpiuGdXKQ",
    authDomain: "gerenciador-de-estoques.firebaseapp.com",
    projectId: "gerenciador-de-estoques",
    storageBucket: "gerenciador-de-estoques.appspot.com",
    messagingSenderId: "543584297763",
    appId: "1:543584297763:web:8e7b4f09c11fee0828e296",
    measurementId: "G-TX8X7DRS5E"
 };
 // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const beep = new Audio()
beep.src = "./beep.mp3"
beep.volume = 0
async function obterDocumento(id){
    const produtosColec = "produtos"; // Substitua pelo nome da coleção
    // Crie uma referência ao documento que você deseja atualizar
    const produtoRef = doc(collection(db, produtosColec), id);
    // Use o método updateDoc para atualizar os dados do documento
    return  await getDoc(produtoRef)
}
async function  atualizarDocumento(id, novosDados) {
    const produtosColec = "produtos"; // Substitua pelo nome da coleção
    // Crie uma referência ao documento que você deseja atualizar
    const produtoRef = doc(collection(db, produtosColec), id);
    // Use o método updateDoc para atualizar os dados do documento
    return  await updateDoc(produtoRef, novosDados)
}
const video = document.getElementById('video');
const constraints = {
    video: {
        facingMode: 'environment' // Para acessar a câmera traseira
    }
};
navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    // sucesso, stream contém a câmera de vídeo
    video.srcObject = stream
  })
  .catch(function(err) {
    // erro ao acessar a câmera
    console.log(err)
  });
let bipCount = 0 
const confirmButtom = document.getElementById("confirmar")
let objectToPost = []
let tasksPost = []
const scanArea = document.getElementById("qrArea")
let lastCode = "null"
const canvasElement = document.createElement('canvas');
let canvas = canvasElement.getContext('2d',{ willReadFrequently: true });

video.addEventListener('play', function() {
    tick();
    console.log("playing")
});
function tick() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvasElement.width = width;
    canvasElement.height = height;
    canvas.drawImage(video, 0, 0, width, height);
    const imageData = canvas.getImageData(0, 0, width, height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    function learnCode(){
        if (code&&lastCode!=code.data) {
            //scan valido
            const data = code.data
            if(!data||!data.split){
                return
            }
            const [refPendentes,codeRef,refEstoques,quant,cor] = data.split("*")
            if(refEstoques&&quant&&data){
                const foundObject = objectToPost.find(ob => ob.code === codeRef);
                if(foundObject){
                    //checando se ja existe antes de postar
                    return
                }
                objectToPost.push({
                    ref:refEstoques,
                    quant:quant,
                    cor:cor,
                    code:codeRef
                })
                execAnimation()
                resetCtx()
            }
            lastCode=data
        }
        // console.log('QR Code detected:', code);
    }
    //Usamos learnCode como método separado porque um return externo pararia o loop
    learnCode()
    requestAnimationFrame(tick)
}
function resetCtx(){
    canvas = null
    canvas = canvasElement.getContext('2d',{ willReadFrequently: true });
}
function execAnimation(){
    beep.currentTime = 0
    beep.volume = 1
    beep.play()
    bipCount = objectToPost.length
    scanArea.classList.add("active")
    confirmButtom.classList.add("active")
    document.getElementById("contador").innerHTML = bipCount!=1?bipCount+" Bipados":bipCount+" Bipado"
    setTimeout(()=>{
        scanArea.classList.remove("active")
    },500)
   
}
confirmButtom.onclick = ()=>{
    document.getElementById("post").style.display="block"
    render()
}
const posts = document.getElementById("posts")
function render(){
    posts.innerHTML=""
    objectToPost.map((item,ind)=>{
        posts.innerHTML+=`<div class="itt" id="itemCode${ind}">${item.ref}</div>`
    })
}
////////////////////////////////////////////////////////////////////////////////////
const postButton = document.getElementById("postButton")
const postButton_entrada = document.getElementById("postButton-entrada")


function execPost(orient){
    //oriente informa se devemos somar o subtrair do estoque de acordo com a escolha do user
    objectToPost.map((obj,ind)=>{
        tasksPost.push(async function(){
                const doc =  await obterDocumento(obj.ref)
                const data = doc.data()
                const variac = data.variacoes.find(vari => vari.cor === obj.cor);
                let res = parseFloat(variac.estoque)+parseFloat(obj.quant)
                if(orient=="add"){
                    res = parseFloat(variac.estoque)+parseFloat(obj.quant)
                }
                if(orient=="remove"){
                    res = parseFloat(variac.estoque) - parseFloat(obj.quant)
                }
                variac.estoque=res
                if(variac.estoque<0){
                    variac.estoque=0
                }
                await atualizarDocumento(obj.ref,data)
                document.getElementById("itemCode"+ind)?.classList.add("true")
                console.log(obj.ref+` atualizado com sucesso`)
            })
    })
    load(true)
    Promise.all(tasksPost.map(task => task()))
    .then((result) => {
        console.log("postado com sucesso")
       load(false)
    })
    .catch(error => {
        load(false)
        console.error('Pelo menos uma das promessas foi rejeitada:', error);
    });
}
postButton.onclick = ()=>{
    execPost("remove")
}
postButton_entrada.onclick=()=>{
    execPost("add")
}
////////////////////////////////////////////////////////////////////////////////////
const closeBipados = document.getElementById("closeBipados")
closeBipados.onclick = ()=>{
    document.getElementById("post").style.display="none"
}
function load(ori){
    if(ori){
        postButton.innerText = "Carregando..."
        postButton.style.pointerEvents="none"
        postButton.style.opacity=".9%"
    }else{
        postButton.innerText = "Finalizar"
        postButton_entrada.style.display = "none"
        postButton.onclick
        postButton.style.pointerEvents="all"
        postButton.style.opacity="100%"
        postButton.onclick =  ()=>{
            window.location.reload()
        }
    }
}