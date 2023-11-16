 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
 import { getFirestore ,getDocs,collection,doc,setDoc ,updateDoc ,deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const analytics = getAnalytics(app);


const estoques = document.getElementById("estoques")
const produtosColec = collection(db, "produtos_pendentes");
async function obterProdutos() {
    try {
      const snapshot = await getDocs(produtosColec);
      snapshot.forEach((docu) => {
        console.log("ID do documento:", docu.id);
        console.log("Dados do documento:", docu.data());
        const data  =  docu.data()

        const estDiv = document.createElement("div");
        estDiv.classList.add("est");
        estDiv.id = `div_${(data.titulo).toLowerCase()}`

        const previewDiv = document.createElement("div");
        previewDiv.classList.add("preview");
        previewDiv.style.backgroundImage=`url(${data.foto})`

        const nomeDiv = document.createElement("div");
        nomeDiv.classList.add("nome");
        
        const tituloDiv = document.createElement("div");
        tituloDiv.classList.add("titulo");
        tituloDiv.textContent = data.titulo
        
        const skuDiv = document.createElement("div");
        skuDiv.classList.add("sku");
        skuDiv.textContent = docu.id

        const estoqueDiv = document.createElement("div");
        estoqueDiv.classList.add("estoque");
        estoqueDiv.textContent = data.pendente

        const addEstDiv = document.createElement("div")
        
        const removeEstDiv = document.createElement("div")
        addEstDiv.classList.add("addEstDiv")
        addEstDiv.textContent = "+"
        removeEstDiv.classList.add("removeEstDiv")
        removeEstDiv.textContent = "-"

        const saveButton = document.createElement("div")
        saveButton.textContent = "salvar"
        saveButton.classList.add("save")
        var quanty = 0
        function quantyChange(){
            if(quanty!=0){
                if(quanty>0){
                    estoqueDiv.innerHTML = data.pendente + `<span style = "color:green;"> +${quanty}</span>`
                    saveButton.style.display = "block"
                }
                else{
                    estoqueDiv.innerHTML = data.pendente + `<span style = "color:red;"> ${quanty}</span>`
                    saveButton.style.display = "block"
                }
            }
            else{
                estoqueDiv.innerHTML = data.pendente
                saveButton.style.display = "none"
            }
        }
        addEstDiv.onclick = ()=>{
            quanty+=1
            quantyChange()
        }
        removeEstDiv.onclick = ()=>{
          if(quanty  + parseFloat(data.pendente)>=1){  
            quanty-=1
            quantyChange()
        }
          }
        saveButton.onclick = ()=>{
            const novosDados = data
            novosDados.pendente = parseFloat(data.pendente) + quanty
            if(novosDados.pendente!=0){
              atualizarDocumento(docu.id, novosDados)
              .then(() => {         
                  estoqueDiv.textContent = parseFloat(data.pendente) + quanty
                  quanty = 0
                  quantyChange()                
              })
              .catch((error) => {
              console.error("Erro ao atualizar o documento: ", error);
              });
            }else{
                const docRef = doc(db, 'produtos_pendentes',docu.id);
                deleteDoc(docRef)
                .then(() => {
                  console.log('Documento deletado com sucesso.');
                  window.location.reload()
                })
                .catch((error) => {
                  console.error('Erro ao deletar o documento:', error);
                });
            }
          
        }
        const controls = document.createElement("div")
        controls.classList.add("controls")
        controls.appendChild(addEstDiv)
        controls.appendChild(removeEstDiv)              
        // Estrutura da árvore de elementos
        nomeDiv.appendChild(tituloDiv);
        nomeDiv.appendChild(skuDiv);

        estDiv.appendChild(previewDiv);
        estDiv.appendChild(nomeDiv);
        estDiv.appendChild(estoqueDiv);
        estDiv.appendChild(saveButton)
        estDiv.appendChild(controls)
        estoques.appendChild(estDiv)
      });
    } catch (error) {
      console.error("Erro ao obter documentos da coleção:", error);
    }
  }
obterProdutos() 
// Função para atualizar um documento
async function  atualizarDocumento(id, novosDados) {
    const produtosColec = "produtos_pendentes"; // Substitua pelo nome da coleção
  // Crie uma referência ao documento que você deseja atualizar
    const produtoRef = doc(collection(db, produtosColec), id);

  // Use o método updateDoc para atualizar os dados do documento
    return  await updateDoc(produtoRef, novosDados)
}
const searchBar = document.getElementById("search")
searchBar.oninput = ()=>{
    var elementos = []
    elementos = encontrarDivsComPalavra(searchBar.value)
    if(searchBar.value!=""){
        if(elementos.length){
            elementos.forEach(ele=>{
                document.getElementById("estoques").insertBefore(ele, document.getElementById("estoques").firstChild);
            })
        }
  
    }
}
// Função para retornar todas as divs com palavras no ID que correspondem à palavra fornecida
function encontrarDivsComPalavra(palavra) {
    const elementos = document.querySelectorAll('[id^="div_"]');

    const palavraMinuscula = palavra.toLowerCase(); // Converter a palavra para minúsculas
  
    const divsCorrespondentes = [];
  
    elementos.forEach((elemento) => {
      const id = elemento.id.replace("div_", "").toLowerCase(); // Converter o ID para minúsculas
      const palavrasNoId = id.split(" ");
  
      for (const palavraNoId of palavrasNoId) {
        if (palavraNoId.includes(palavraMinuscula) || palavraMinuscula.includes(palavraNoId)) {
            divsCorrespondentes.push(elemento);
          break; // Evitar duplicações
        }
      }
    });
    return divsCorrespondentes;
}
  
  
  

