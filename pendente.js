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

function generateRandomCode(){
  const alfabet="abcdefghijklmnopqrstuvwxyz"
  const numeroAleatorio = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; // Gera um número entre 10000 e 99999
  function indexAlfabet () {
    return  Math.floor(Math.random() * alfabet.length)
  }
  return numeroAleatorio + alfabet[indexAlfabet()]
}

function toHtml(type,classe,conteudo){
    const element = document.createElement(type)
    if(!conteudo){
      element.innerHTML=""
    }else if(typeof(conteudo)=='object'){
      element.appendChild(conteudo)
    }else if(typeof(conteudo)=='string'){
      element.textContent = conteudo
    }
    element.classList.add(classe)
    return element
}
const estoques = document.getElementById("pendentes")
const produtosColec = collection(db, "produtos_pendentes");
async function obterProdutos() {
    try {
      const snapshot = await getDocs(produtosColec);
      snapshot.forEach((docu) => {
        // console.log("ID do documento:", docu.id);
        // console.log("Dados do documento:", docu.data());
        const data  =  docu.data()

        const estDiv = document.createElement("div");
        estDiv.classList.add("pendente");
        estDiv.id = `div_${(data.sku).toLowerCase()}`

        const previewDiv = document.createElement("div");
        previewDiv.classList.add("pendente-preview");
        previewDiv.style.backgroundImage=`url(${data.foto})`

        const nomeDiv = document.createElement("div");
        nomeDiv.classList.add("nome");
        
        const corDiv = toHtml("div","cor",data.cor)
        
        const skuDiv = document.createElement("div");
        skuDiv.classList.add("pendente-sku");
        skuDiv.textContent = data.sku

        const estoqueDiv = document.createElement("div");
        estoqueDiv.classList.add("estoque");
        estoqueDiv.textContent = "Quantidade: "+data.quantidade

        const addEstDiv = document.createElement("div")
        const up = `<ion-icon name="add-circle-outline"></ion-icon>`
        const down = `<ion-icon name="remove-circle-outline"></ion-icon>`

        const removeEstDiv = document.createElement("div")
        addEstDiv.classList.add("addPendDiv")
        addEstDiv.innerHTML = up
        removeEstDiv.classList.add("removePendDiv")
        removeEstDiv.innerHTML = down

        const saveButton = document.createElement("div")
        saveButton.textContent = "salvar"
        saveButton.classList.add("pendente-save")
        saveButton.style.pointerEvents = "none"
        saveButton.style.opacity = "50%"
        const printButton  = toHtml("div","printButton","")
        printButton.innerHTML='<ion-icon name="print-outline"></ion-icon> Print SKU'

        printButton.onclick =()=>{
          const datas = []
          const divsToPrint = []
          for (let index = 0; index < parseFloat(data.quantidade); index++) {
            const dataObject = {
              id: data.sku,
              variac:data.cor,
              code: generateRandomCode()

            };
            datas.push(dataObject)
          }
       
          datas.map(ele=>{
            const qrcode = toHtml('img','qr','')
            const jsonData = JSON.stringify(ele);
            const qr = new QRious({
              element: qrcode,
              value: jsonData,
              size: 300
          });
            console.log(datas)
            divsToPrint.push(qrcode)
          })

          const doc = new jsPDF({
            orientation: 'landscape', // Escolha 'portrait' ou 'landscape' conforme desejado
            unit: 'mm',
            format: [100, 50]
          })

          divsToPrint.forEach((img, index) => {
            if (index > 0) {
              doc.addPage();
            }
            const texto = ((datas[index].id )+  " - " + (datas[index].variac)).toUpperCase()

            const tamanho = 20
            const maxWidth = 95
      
            var larguraTexto = doc.getStringUnitWidth(texto) * tamanho / doc.internal.scaleFactor;
            if (larguraTexto > maxWidth) {
              const novaTamanho = (maxWidth * tamanho) / larguraTexto;

              doc.setFontSize(novaTamanho);
              larguraTexto = doc.getStringUnitWidth(texto) * novaTamanho / doc.internal.scaleFactor;

            } else {

              doc.setFontSize(tamanho);

            }
            doc.text((maxWidth/2)  - (larguraTexto / 2) + 2, 10, texto);
            doc.addImage(img, (maxWidth/2) - 10 , 20, 20, 20);
            
          
          });
         // Configura a impressão automática ao abrir o PDF
         const pdfBlob = doc.output('blob');

         // Cria um objeto URL para o Blob do PDF
         const pdfUrl = URL.createObjectURL(pdfBlob);
         
         // Cria um iframe escondido
         const iframe = document.createElement('iframe');
         iframe.style.display = 'none';
         document.body.appendChild(iframe);
         
         // Quando o iframe terminar de carregar o PDF, executa a impressão
         iframe.onload = function() {
           iframe.contentWindow.print();
         };
         
         // Define o PDF como a fonte do iframe
         iframe.src = pdfUrl;
        }



        const removeButton = toHtml("div","removeButton","Finalizar")
        removeButton.onclick= async ()=>{
          try{
            await deletarDocumento(docu.id)
            aviso("Pedido Finalizado Com sucesso",true)
            estDiv.remove()
          }
          catch(erro){
            aviso("Erro ao finalizar pedido",false)
            console.log(erro)
          }

        }
        var quanty = 0
        function quantyChange(){
            if(quanty!=0){
                if(quanty>0){
                    saveButton.style.opacity = "100%"
                    estoqueDiv.innerHTML = data.quantidade + `<span style = "color:green;"> +${quanty}</span>`
                    saveButton.style.pointerEvents = "auto"
                }
                else{
                    saveButton.style.opacity = "100%"
                    estoqueDiv.innerHTML = data.quantidade + `<span style = "color:red;"> ${quanty}</span>`
                    saveButton.style.pointerEvents = "auto"
                }
            }
            else{
                estoqueDiv.innerHTML = "Quantidade: "+data.quantidade
                saveButton.style.pointerEvents = "none"
                saveButton.style.opacity = "50%"
            }
        }
        addEstDiv.onclick = ()=>{
            quanty+=1
            quantyChange()
        }
        removeEstDiv.onclick = ()=>{
            if(quanty  + parseFloat(data.quantidade)>=1){  
              quanty-=1
              quantyChange()
            }
          }
        saveButton.onclick = ()=>{
            const novosDados = data
            novosDados.quantidade = parseFloat(data.quantidade) + quanty
            if(novosDados.quantidade!=0){
              atualizarDocumento(docu.id, novosDados)
              .then(() => {         
                  estoqueDiv.textContent ="Quantidade: "+ parseFloat(data.quantidade) + quanty
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
        const controls_parent = document.createElement("div")
        controls_parent.classList.add("controls_parent")
        const controls = document.createElement("div")
        controls.classList.add("pendente-controls")

        controls.appendChild(addEstDiv)
        controls.appendChild(removeEstDiv)    

        controls_parent.appendChild(saveButton)  
        controls_parent.appendChild(controls)        
        // Estrutura da árvore de elementos
        nomeDiv.appendChild(skuDiv);
        nomeDiv.appendChild(corDiv)

        estDiv.appendChild(previewDiv);
        estDiv.appendChild(nomeDiv);
        estDiv.appendChild(estoqueDiv);
        estDiv.appendChild(controls_parent)
        estDiv.appendChild(removeButton)  
        estDiv.appendChild(printButton)
        estoques.appendChild(estDiv)
      });
    } catch (error) {
      console.error("Erro ao obter documentos da coleção:", error);
    }
  }

document.addEventListener('DOMContentLoaded', function() {
  obterProdutos() 
})

// Função para atualizar um documento
async function  atualizarDocumento(id, novosDados) {
  const produtosColec = "produtos_pendentes"; // Substitua pelo nome da coleção
// Crie uma referência ao documento que você deseja atualizar
  const produtoRef = doc(collection(db, produtosColec), id);

// Use o método updateDoc para atualizar os dados do documento
  return  await updateDoc(produtoRef, novosDados)
}

async function  deletarDocumento(id) {
  const produtosColec = "produtos_pendentes"; // Substitua pelo nome da coleção
  // Crie uma referência ao documento que você deseja atualizar
  const produtoRef = doc(collection(db, produtosColec), id);

  // Use o método updateDoc para atualizar os dados do documento
  return  deleteDoc(produtoRef);
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
  
   
function aviso(text,status){
  const avs = document.createElement("div")
  avs.classList.add("aviso")
  avs.textContent = text
  if(status){
      avs.style.backgroundColor = "rgba(var(--cor-positivo-dec),.3)"
      avs.style.color = "var(--cor-positivo)"
  }else{
      avs.style.backgroundColor = "rgba(var(--cor-negativo-dec),.3)"
      avs.style.color = "var(--cor-negativo)"
  }
  document.getElementById("erros").appendChild(avs)
  setTimeout(()=>{
      avs.style.filter = "opacity(50%)"
  },3000)
  setTimeout(()=>{
      avs.remove()
  },3500)
}

