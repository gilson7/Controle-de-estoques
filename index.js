 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
 import { getFirestore ,getDocs,collection,doc,setDoc ,deleteDoc,updateDoc,getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
 import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js"
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 var category = false
 const urlParams = new URLSearchParams(window.location.search)
 const categoryParam = urlParams.get('categoria')
 if(categoryParam){
    category=categoryParam
    document.getElementById("categorias").value= category
 }else{
    var category = false
}

document.getElementById("categorias").onchange = (e)=>{
    const value = e.target.value
    changeCategory(value)
}
function changeCategory(catergoria){
    if(catergoria=="todos"){
        window.location.href="./"
    }else{
        window.location.href="./"+"?categoria="+catergoria
    }
}
function inserirNumeroAntesDaPalavra(texto, palavra, numero) {
    const regex = new RegExp('\\b' + palavra + '\\b', 'i'); // Expressão regular para a palavra completa
    const novaString = texto.replace(regex, numero + ' ' + palavra); // Substitui a palavra pelo número + palavra
    return novaString;
}
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
 const storage = getStorage(app);
 const analytics = getAnalytics(app);
 console.log(db)

const db_object = {
    sku:null,
    foto:null,
    titulo:null,
    variacoes:[

    ],
}
function randomCode(tamanho){
    let codigo = ""
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&()-_=+[{]}|;:,.<>?'; 
    for (let i = 0; i < tamanho; i++) {
        codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return codigo;
}

function isCategory(id){
const conditions={
    banquetas:(id.includes("BQT")),
    mesas:((id.includes("QD BX")||id.includes("QD AL")||id.includes("RD BX")||id.includes("RD AL"))&&!id.includes("BQT")),
    portoes:(id.includes("68-")||id.includes("78-")),
    exaustores:((id.includes("EX")&&id.includes("220V"))||(id.includes("EX")&&id.includes("127V")))
}
   if (!category) {
        return true
   }
  
   if(conditions[category]){
    
        return true
   }else{
        return false 
   }
}


function toHtml(type,classs){
    const ele = document.createElement(type)
    ele.classList.add(classs)
    return ele
}
const chat = document.getElementById("chat")
const buttonChat = document.getElementById("msn")
const closeChat = document.getElementById("closeChat")
closeChat.onclick = ()=>{
    chat.style.display="none"
}
buttonChat.onclick = ()=>{
    chat.style.display="block"
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
let canvas  = document.createElement("canvas")
canvas.width = 200
canvas.height = 200
let ctx = canvas.getContext("2d")

function generateImage(img){
    // Desenhar a imagem no canvas 
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const screenshot = canvas.toDataURL('image/png');
    return screenshot
}
const popupDiv = document.createElement("div");
popupDiv.classList.add("popup");

const topBarDiv = document.createElement("div");
topBarDiv.id = "topBar";
const topBarTitle = document.createElement("span");
topBarTitle.textContent = "Adicionar Produto";
const closeButton = document.createElement("button");
closeButton.classList.add("close");
closeButton.textContent = "+";
topBarDiv.appendChild(topBarTitle);
topBarDiv.appendChild(closeButton);
closeButton.onclick=()=>{
    popupDiv.remove()
}
const contentDiv = document.createElement("div");
contentDiv.id = "content";

const tituloLabel = document.createElement("span");
tituloLabel.setAttribute("for", "titulo");
tituloLabel.textContent = "Titulo";
const tituloInput = document.createElement("input");
tituloInput.type = "text";
tituloInput.id = "titulo";

const skuLabel = document.createElement("span");
skuLabel.setAttribute("for", "sku");
skuLabel.textContent = "SKU";
const skuInput = document.createElement("input");
skuInput.type = "text";
skuInput.id = "sku";
skuInput.oninput = ()=>{
    db_object.sku = skuInput.value
}
tituloInput.oninput = ()=>{
    db_object.titulo = tituloInput.value
}

const inputImagem = document.createElement('input');
inputImagem.type = 'file';
inputImagem.name = 'imagem';
inputImagem.accept = 'image/*';
inputImagem.onchange = ()=>{

    if (inputImagem.files && inputImagem.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const preview = new Image()
            preview.src = e.target.result;
            console.log(reader)
            var file = ""
            preview.onload=()=>{
                preview.width = canvas.width
                preview.height = canvas.height
                file = dataURLtoBlob(generateImage(preview))
            }
            db_object.foto =  async function(){
                const storageRef = ref(storage);
                // Gerar um nome único para o arquivo no Storage (pode ser personalizado conforme necessário)
                const fileName = Date.now() + '_' + file.name;
                const fileRef = ref(storageRef, 'images/' + fileName);
                try {
               
                    // Fazer o upload do arquivo para o Firebase Storage
                    await uploadBytes(fileRef, file);
                    // Obter a URL do arquivo após o upload
                    const url = await getDownloadURL(fileRef);
                    return url;
                } catch (error) {
                  throw new Error('Erro ao enviar ou obter URL do arquivo: ' + error.message);
                }
            }
        }
        reader.readAsDataURL(inputImagem.files[0]);
    }
}

const customFileUpload = document.createElement('label');
customFileUpload.classList.add('custom-file-upload');
customFileUpload.innerHTML = 'Escolher Imagem';
// const fotoLabel = document.createElement("label");
// fotoLabel.setAttribute("for", "foto");
// fotoLabel.textContent = "Caminho Para Imagem";
// const fotoInput = document.createElement("input");
// fotoInput.type = "text";
// fotoInput.id = "foto";
const variacsMain = document.createElement("div")
const variacoesContainer = document.createElement("div")
const addVariac = document.createElement("button")

variacsMain.classList.add("variac-main")
variacoesContainer.classList.add("variacs")
addVariac.classList.add("add-variac")

addVariac.textContent = "add' variação"
variacsMain.appendChild(variacoesContainer)
variacsMain.appendChild(addVariac)

addVariac.onclick =()=>{
    db_object.variacoes.push(adicionarVariacao())
}
 
const arrayExclusao = []
const coresDisponiveis = ['preto','branco', 'vermelho', 'amarelo','marrom','jambo','adega','pub','floral','mel','imbuia','inox'];

function adicionarVariacao(){

    const obj = {
        cor:null,
        estoque:0
    } 
    // Criar elementos HTML para a nova variação
    const novaVariacao = document.createElement('div');
    novaVariacao.classList.add('variacao');
    //;;;;

    const estoqueLabel = document.createElement("label");
    estoqueLabel.textContent = "Estoque:";

    const estoqueInput = document.createElement("input");
    estoqueInput.type = "number";
    estoqueInput.value=0
    obj.estoque = 0
    const estoqueMain = document.createElement("div");
    estoqueMain.appendChild(estoqueLabel)
    estoqueMain.appendChild(estoqueInput)
    estoqueMain.classList.add("mains")
    // ;;;;;;

    estoqueInput.oninput= ()=>{
        obj.estoque = estoqueInput.value
    }

    const selectCoresTitle = document.createElement("label");
    selectCoresTitle.textContent= "cor:"

    const selectCores = document.createElement('select');
    selectCores.name = 'cores';

    const selectCoresLabel= document.createElement('label');
    selectCoresLabel.className = "select"

    selectCoresLabel.appendChild(selectCores)
    const colorPreview = document.createElement("div")
    colorPreview.className = "colorPreview"

    // Adicionar opções ao campo de seleção de cores (você pode ajustar isso conforme necessário)
    var continuo = true
    for (let index = 0; index < coresDisponiveis.length && continuo; index++) {
        const element = coresDisponiveis[index];
        if (!arrayExclusao.includes(element)) {
            obj.cor = element
            colorPreview.style.backgroundImage = `var(--${element})`
            console.log(element)
            continuo = false
        }
    }
    arrayExclusao.push(obj.cor)

    function reloadCores(){
        selectCores.innerHTML = ""
        const self = document.createElement('option');
        self.value = obj.cor.toLowerCase();
        self.text = obj.cor;
        selectCores.appendChild(self);
        coresDisponiveis.forEach(cor => {
            console.log(db_object)
            console.log(arrayExclusao)

            if (!arrayExclusao.includes(cor)) {
          
                const optionCor = document.createElement('option');
                optionCor.value = cor.toLowerCase();
                optionCor.text = cor;
                selectCores.appendChild(optionCor);
            // Renderiza o elemento (substitua isso com a lógica real de renderização)
            }
            
        });

    }
    reloadCores()
    selectCores.onchange =(e)=>{
        colorPreview.style.backgroundImage = `var(--${selectCores.value})`
        obj.cor = selectCores.value
        arrayExclusao[db_object.variacoes.indexOf(obj)] = obj.cor
    }
    selectCores.onclick = () =>{
        reloadCores()
    }
    const corMain = document.createElement("div");


    corMain.appendChild(selectCoresTitle)
    corMain.appendChild(selectCoresLabel)
    corMain.classList.add("mains")

    // Adicionar os elementos à nova variação
 
    novaVariacao.appendChild(corMain)
    novaVariacao.appendChild(estoqueMain)
    novaVariacao.appendChild(colorPreview)
    // Adicionar a nova variação ao contêiner de variações
    variacoesContainer.appendChild(novaVariacao);

    return obj
}




const cadastrarButton = document.createElement("button");
cadastrarButton.onclick = ()=>{
    if(!db_object.foto){
        aviso("Imagem não foi definida",false)
        return
    }
    if(skuInput.value==""){
        aviso("SKU não foi definido",false)
        return
    }
    if(tituloInput.value==""){
        aviso("Titulo não foi definido",false)
        return
    }
    else{
        console.log(db_object," tipo " + typeof(db_object.foto))
        if(typeof(db_object.foto) == "function"){
            try{

                db_object.foto().then((data)=>{
                    return data
                }).then((data)=>{
                    console.log(data)
                    db_object.foto = data
                    setProduto(db_object,skuInput.value)
                })
              
            }
            catch(error){
                aviso("Upload a foto"+error,false)
            }
        }else if(db_object.foto!=null){
            setProduto(db_object,skuInput.value)
        }
        else{
            aviso("Objeto da imagem não foi encontrado",false)
        }
    }
       
}
customFileUpload.appendChild(inputImagem);
cadastrarButton.classList.add("post");
cadastrarButton.textContent = "Cadastrar";

// Adicionar os elementos à estrutura da página
popupDiv.appendChild(topBarDiv);
popupDiv.appendChild(contentDiv);


popupDiv.appendChild(tituloLabel);
popupDiv.appendChild(tituloInput);

popupDiv.appendChild(skuLabel);
popupDiv.appendChild(skuInput);
popupDiv.appendChild(canvas)
popupDiv.appendChild(customFileUpload)

popupDiv.appendChild(variacsMain)


// popupDiv.appendChild(fotoLabel);
// popupDiv.appendChild(fotoInput);

popupDiv.appendChild(cadastrarButton);

// Adicionar a estrutura à página HTML (substitua 'seletor' pelo seletor do elemento onde você deseja adicionar o popup)
const seletor = document.body; // Substitua pelo seletor adequado



const buttonPost = document.getElementById("add")
buttonPost.onclick = () =>{
    seletor.appendChild(popupDiv);
}

const estoques = document.getElementById("estoques")
const produtosColec = collection(db, "produtos");
async function obterProdutos() {
    try {
      const snapshot =  await getDocs(produtosColec);
 
      snapshot.forEach((doc) => {
        var data  =  doc.data()
        if(!isCategory(data.sku)){
            return
        }
        console.log("ID do documento:", doc.id);
        console.log("Dados do documento:", doc.data());
        var originalestoques = {...doc.data()}

        const saveButton = document.createElement("div")
        saveButton.textContent = "salvar"
        saveButton.classList.add("save")   

        function changeEstoq(cor,value){
                originalestoques.variacoes[cor].estoque = value
                console.log(value,originalestoques,data)
                //checando se os valores mudaram
                var isCHanged = false
                data.variacoes.map((ele,id)=>{
                    var estoque = ele.estoque
                    if(originalestoques.variacoes[id].estoque != estoque){
                        isCHanged = true
                    }
                })
                if(isCHanged){
                    saveButton.style.display = "block"

                }else{
                    data.variacoes[cor]
                    saveButton.style.display = "none"
                }
        }

        const estDiv = document.createElement("div");
        estDiv.classList.add("est");
    

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
        skuDiv.textContent = doc.id.toUpperCase()

        const variacsDiv = toHtml("div","variacsDiv")
        const expandVariac= toHtml("div","expand")
        const iconFalse=`<ion-icon name="chevron-down-outline"></ion-icon>`
        const iconTrue=`<ion-icon name="chevron-up-outline"></ion-icon>`
        expandVariac.innerHTML = iconFalse
        var stateExpand = false
        expandVariac.onclick= () =>{
            if(stateExpand){
                variacsDiv.classList.remove("active")
                stateExpand = false
                expandVariac.innerHTML = iconFalse
            }
            else{
                variacsDiv.classList.add("active")
                stateExpand = true
                expandVariac.innerHTML = iconTrue
            }
        }
        const mapResult = data.variacoes?.map((variac,index)=>{
            var newValue = 0
            var originalEstoq = parseFloat(variac.estoque)
            const variacDiv = toHtml("div","variacElement")
            variacDiv.id = index
            const previewVriac  =  toHtml("div","prevVariac")
            const skuVariac = toHtml("div","skuVariac")
            const estoqueVariac = toHtml("div","estoqueVariac")

            const controlsVariac = toHtml("div","controlsVariac")
            const up  = toHtml("div","estoqUp")
            const down  = toHtml("div","estoqDown")

            const newValueEstoq = toHtml("div","estoqNewValue")
            const pedidoButton = document.createElement("div")
            pedidoButton.textContent= "solicitação"
            pedidoButton.className = "pedir"
    
            const lojas=["Qualyshop","Itaqualy","Tekshop","Shopee"]
            var selectedLojas = lojas[0]
            const values = [1,2,3,4,5,6]
            var selectedValue = values[0]
            pedidoButton.onclick = ()=>{
                
                
                const popup_pedido = document.createElement("div");
                popup_pedido.className = "popup-pedido";

                const topbar_titulo = document.createElement("div");
                topbar_titulo.className = "tb-titulo";

                const topbar_pedido = document.createElement("div");
                topbar_pedido.className = "tb-pedido";

                const topbarPreview = toHtml("div","topbarPreview")
                topbarPreview.style.backgroundImage = `url(${data.foto})`

                const conteudo_pedido = document.createElement("div");
                conteudo_pedido.className = "conteudo-popup-pedido";

                const variacPedido = toHtml("div","cont_pedido")
                variacPedido.textContent = `${data.sku} - [COR: ${variac.cor}]`

                const quantidade_pedido = document.createElement("input");
                quantidade_pedido.className = "qtd-pedido";
                quantidade_pedido.placeholder = "Quantidade"

                const obsPedido =  document.createElement("textarea");
                obsPedido.className = "obs-pedido";
                obsPedido.placeholder = "Observação"

                const quantidade_pacotes = toHtml("div","qtd-pacote")
             
                for (let index = 0; index < values.length; index++) {
                    const element = values[index];
                    const opt = toHtml("div","opt")
                    opt.textContent = element+"x"
                    quantidade_pacotes.appendChild(opt)
                    opt.onclick = ()=>{
                        selectedValue = values[index]
                        addActive(opt)
                    }       
                    if(index==0){
                        opt.classList.add("active")
                    }
                }
                
                function  addActive(ele){
                    const div =document.getElementsByClassName("opt")
                    for(let id = 0;id < div.length;id++){
                        const element = div[id]
                        element.classList.remove("active")
                    }
                    ele.classList.add("active")
                }
                const LojasElment = toHtml("div","opts-lojas")
                lojas.map((item,index)=>{
                    const loja = toHtml("div","opt-loja")
                    loja.textContent = item
                    loja.onclick = ()=>{
                        ChangeStore(index,loja)
                    }
                    LojasElment.appendChild(loja)
                    if(index==0){
                        loja.classList.add("active")
                    }
                })
                function ChangeStore(index,ele){
                    selectedLojas = lojas[index]
                    const div =document.getElementsByClassName("opt-loja")
                    for(let id = 0;id < div.length;id++){
                        const element = div[id]
                        element.classList.remove("active")
                    }
                    ele.classList.add("active")
                }   
                

                const controls_pedido = document.createElement("div");
                controls_pedido.className = "controles";

                const button_pedido = document.createElement("div");
                button_pedido.className = "btn-pedido";

                const cancelar_pedido = document.createElement("div");
                cancelar_pedido.className = "cancelar";
                cancelar_pedido.onclick = ()=>{
                    popup_pedido.remove()
                }
                button_pedido.onclick = () =>{
                    const pedido = { 
                                foto:data.foto,
                                sku:data.sku,
                                cor:variac.cor,
                                quantidade:quantidade_pedido.value,
                                obs:obsPedido.value,
                                pacotes:selectedValue,
                                loja:selectedLojas
                    }
                    if(pedido.pacotes>1){
                        var sku = pedido.sku
                        const regex = /\d+/; // Expressão regular para encontrar um ou mais dígitos
                        const resultado = sku.match(regex); // Procura o padrão na string
                        if (resultado !== null) {
                            console.log(resultado[0]); // Retorna o primeiro número encontrado
                            var firstFoundedNumber = parseInt(resultado[0])
                            if(!firstFoundedNumber){
                                //impedindo a existencia de resutados vazios na quantidade de pacotes caso o sku não especifique a quantidade
                                firstFoundedNumber = 1
                                sku = firstFoundedNumber*pedido.pacotes + sku 
                            }else{
                                sku = sku.replace(resultado[0],resultado[0]*pedido.pacotes)
                                pedido.sku=sku
                            }
                        }
                        if(sku.toUpperCase().includes("MESA")&&sku.toUpperCase().includes("BQT")){
                            sku = inserirNumeroAntesDaPalavra(sku, "MESA", pedido.pacotes)
                            pedido.sku=sku
                        }
                    }
                    if (quantidade_pedido.value!=""&&quantidade_pedido.value!=NaN) {
                        pedido.pendente = quantidade_pedido.value
                        setPedidos(pedido,doc.id,popup_pedido)
                    }
                    else{
                        alert("Escolha uma quantidade")
                    }
                }
                topbar_titulo.textContent = "Pedido de disponibilidade" 
                button_pedido.textContent = "Confirmar"
                cancelar_pedido.textContent = "cancelar"
                quantidade_pedido.type = "number"
                controls_pedido.appendChild(button_pedido)
                controls_pedido.appendChild(cancelar_pedido)

                topbar_pedido.appendChild(topbarPreview)
                topbar_pedido.appendChild(topbar_titulo)
                conteudo_pedido.appendChild(LojasElment)
                conteudo_pedido.appendChild(quantidade_pacotes)
                conteudo_pedido.appendChild(variacPedido)
                conteudo_pedido.appendChild(quantidade_pedido)
                conteudo_pedido.appendChild(obsPedido)
                conteudo_pedido.appendChild(controls_pedido)

                popup_pedido.appendChild(topbar_pedido)
                popup_pedido.appendChild(conteudo_pedido)
                document.body.appendChild(popup_pedido)
                
            }

            up.innerHTML = `<ion-icon name="add-circle-outline"></ion-icon>`
            down.innerHTML = `<ion-icon name="remove-circle-outline"></ion-icon>            `
            up.onclick = ()=>{
                newValue+=1
                reloadValues()
            }
            down.onclick = ()=>{
                if(originalEstoq+newValue>0){
                    newValue-=1
                }
                reloadValues()
            }
            reloadValues()
            function reloadValues(){
                originalEstoq>0?estoqueVariac.style.backgroundColor="var(--cor-positivo)":estoqueVariac.style.backgroundColor="var(--cor-negativo)"
              
                if(newValue!=0){
                    newValueEstoq.style.display = "block"
                    if(newValue>0){
                        newValueEstoq.textContent = "+"+newValue
                        newValueEstoq.style.color ="var(--cor-positivo)"
                    }else{
                        newValueEstoq.textContent=newValue
                        newValueEstoq.style.color ="var(--cor-negativo)"
                    }
               
                }else{
                    newValueEstoq.style.display = "none"
                    newValueEstoq.textContent = ""
                }
                changeEstoq(index,originalEstoq + newValue)

            }
            function resetAll(value){
                //função reseta e escreve os novos valores dps da atualizacão de estoques
                originalEstoq = value
                estoqueVariac.textContent = value
                newValue = 0
                reloadValues()
         
            }
            controlsVariac.appendChild(newValueEstoq)
            controlsVariac.appendChild(up)
            controlsVariac.appendChild(down)

            previewVriac.style.backgroundImage = `var(--${variac.cor})`
            skuVariac.textContent = `${data.sku} ${variac.cor}`
            estoqueVariac.textContent = variac.estoque

            variacDiv.appendChild(previewVriac)
            variacDiv.appendChild(skuVariac)
            variacDiv.appendChild(pedidoButton)
            variacDiv.appendChild(estoqueVariac)
            variacDiv.appendChild(controlsVariac)
            variacsDiv.appendChild(variacDiv)

            return  {resetAll}
        })   

        saveButton.onclick = ()=>{
            const novosDados = originalestoques
            atualizarDocumento(doc.id, novosDados)
            .then(() => {
                aviso("Estoques Atualizados com sucesso",true)
                data =   JSON.parse(JSON.stringify(novosDados))
                originalestoques = JSON.parse(JSON.stringify(novosDados))
                const elementosFilhos = variacsDiv.children;
                for (let filho of elementosFilhos) {
                    //atualizando valores no html e os objetos criando copias independentes com {...}
                    console.log(novosDados.variacoes[filho.id].estoque)
                    filho.getElementsByClassName("estoqueVariac")[0].textContent = novosDados.variacoes[filho.id].estoque
                    //resetando os valores para cada instancia
                    mapResult[filho.id].resetAll(novosDados.variacoes[filho.id].estoque)
                }
            })
            .catch((error) => {
                aviso("Erro ao atualizar Estoques",false)
                console.error("Erro ao atualizar o documento: ", error);
            });
        }
        
        

        const controls = document.createElement("div")

        controls.classList.add("controls")
        // controls.appendChild(addEstDiv)
        // controls.appendChild(removeEstDiv)
        const RootItem = toHtml("div","rootItem")
        RootItem.appendChild(previewDiv)
        RootItem.id = `div_${(doc.id).toLowerCase()}`

        // Estrutura da árvore de elementos
        nomeDiv.appendChild(tituloDiv);
        nomeDiv.appendChild(skuDiv);

        estDiv.appendChild(previewDiv);
        estDiv.appendChild(nomeDiv);
        // estDiv.appendChild(estoqueDiv);
        estDiv.appendChild(saveButton)
        estDiv.appendChild(controls)
        // estDiv.appendChild ( pedidoButton)
        estDiv.appendChild(expandVariac)

        RootItem.appendChild(estDiv)
        RootItem.appendChild(variacsDiv)
        estoques.appendChild(RootItem)
        
      });
    } catch (error) {
      console.error("Erro ao obter documentos da coleção:", error);
    }
  }
obterProdutos() 

function setProduto(obj,id){
    const produtoRef = doc(collection(db, "produtos"), id);
    setDoc(produtoRef, obj)
    .then(() => {

    console.log("Documento definido com sucesso!");
    aviso("Concluido produto definido com sucesso!",true)
    window.location.reload();
    })
    .catch((error) => {
        aviso("Erro ao definir o documento: "+error,false);
    });
}

async function setPedidos(obj, id, popup) {
    const stringRef = ((id + " " + (obj.cor) + (obj.pacotes>1?obj.pacotes+"X":""))+obj.loja+obj.obs).toUpperCase()
    const produtoRef = doc(collection(db, "produtos_pendentes"),stringRef);
    try {
        //atualiza o documento 
        const produtoSnapshot = await getDoc(produtoRef);
        if (produtoSnapshot.exists()) {
            // O documento existe, então vamos atualizar o estoque
            const produtoData = produtoSnapshot.data();
            const novoPendente = [...produtoData.pendentes]
             // Atualizar o estoque conforme necessário
            for(let i=0 ; i < obj.quantidade ; i++){
                const code = randomCode(3)
                novoPendente.push(stringRef+"*"+code+"*"+id+"*"+obj.pacotes+"*"+obj.cor)
            }
            const novoEstoque = novoPendente.length;
            await updateDoc(produtoRef, {quantidade:novoEstoque,pendente:novoEstoque,pendentes:novoPendente}); // Atualizar o estoque no documento existente
            console.log("Estoque atualizado com sucesso!");
        } else {
            // O documento não existe, então vamos criá-lo
   
            const novoPendente =  []
            for(let i=0 ; i < obj.quantidade ; i++){
                const code = randomCode(3)
                novoPendente.push(stringRef+"*"+code+"*"+id+"*"+obj.pacotes+"*"+obj.cor)
            }
            obj.pendentes = novoPendente
            await setDoc(produtoRef, obj);
            console.log("Novo documento definido com sucesso!");
        }
        aviso("Pedido realizado com sucesso", true);
        popup.remove();
    } catch (error) {
        console.error("Erro ao definir/atualizar o documento: ", error);
        aviso("Falha ao realizar pedido, visite o console para mais informações", false);
    }
}
// Função para atualizar um documento
async function  atualizarDocumento(id, novosDados) {
    const produtosColec = "produtos"; // Substitua pelo nome da coleção
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
//recados
const recadosDiv = document.getElementById("recados")
const sendRecado = document.getElementById("enviar")
sendRecado.onclick=()=>{
    const msg = document.getElementById("recado").value
    if(!msg){
        aviso("Escreva algo",false)
    return
    }
    setRecados({
        data:dataFormatada(),
        hora:horaFormatada(),
        msg
    }).then(()=>{
        document.getElementById("recado").value = ""
    })
}
async function getRecados(){
    recadosDiv.innerHTML=""
    try {
        const snapshot =  await getDocs(collection(db,"recados"));
        snapshot.forEach((doc) => {
            const data = doc.data()
            console.log(data)
            const msgMain = toHtml("div","msg-main")
            const msgTopBar = toHtml("div","msg-top-bar")
            const msgBody = toHtml("div","msg-body")
            msgBody.textContent = data.msg

            const msgDate = toHtml("div","msg-date")
            msgDate.textContent = `${data.data}  -${data.hora}`
            
            const deleteMsg = toHtml("div","msg-delete")
            deleteMsg.innerHTML=`<ion-icon name="trash-bin-outline"></ion-icon>`
            deleteMsg.onclick = ()=>{
                deleteRecados(doc.id,msgMain)
            }
            msgTopBar.appendChild(msgDate)
            msgTopBar.appendChild(deleteMsg)
            msgMain.appendChild(msgTopBar)
            msgMain.appendChild(msgBody)
            recadosDiv.appendChild(msgMain)
        })
    }
    catch{

    }
}
getRecados()
function deleteRecados(id,element){
    const documentRef = doc(db, 'recados', id);
    deleteDoc(documentRef)
  .then(() => {
    element.remove()
  })
  .catch((error) => {
    alert("falha ao excluir mensagem abra o console para mais infos")
    console.error('Erro ao excluir o documento:', error);
  });
}
async function setRecados(dados){
    console.log(dados)
    try{
        const id = ("_"+dados.data+"_"+dados.hora).replace(":","_").replace(":","_").replace("/","*").replace("/","*")
        console.log(id)
        const documentRef = doc(db, 'recados', id);
        await setDoc(documentRef,dados)
        aviso("recado enviado com sucesso",true)

        setTimeout(()=>{
            getRecados()
        },400)
    }
    catch(erro){
        aviso("erro ao enviar",false)
        console.log(erro)
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
  
  
  

function dataURLtoBlob(dataURL) {
    //converte um dataUrl para blob
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new Blob([u8arr], { type: mime });
}

function horaFormatada() {
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0'); // Obtém a hora atual e garante dois dígitos
    const minutos = agora.getMinutes().toString().padStart(2, '0'); // Obtém os minutos atuais e garante dois dígitos
    const segundos = agora.getSeconds().toString().padStart(2, '0'); // Obtém os segundos atuais e garante dois dígitos
    return `${hora}:${minutos}:${segundos}`; // Retorna a hora formatada
  }
  
  // Função para retornar data formatada
function dataFormatada() {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0'); // Obtém o dia do mês e garante dois dígitos
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês atual e garante dois dígitos
    const ano = hoje.getFullYear(); // Obtém o ano atual
    return `${dia}/${mes}/${ano}`; // Retorna a data formatada
}