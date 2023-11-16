const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');

// Crie uma instância do servidor Express
const expressApp = express();
const port = 9090;

// Configuração para servir arquivos estáticos
expressApp.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
expressApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pendente.html'));
});

// Inicie o servidor Express
const expressServer = expressApp.listen(port, () => {
  console.log(`Servidor Express está rodando em http://localhost:${port}`);
});

// Crie uma janela do Electron
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Carregue a URL do servidor Express
  mainWindow.loadURL(`http://localhost:${port}`);
}

// Evento de criação da janela
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Encerre o aplicativo quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Encerre o servidor Express quando o aplicativo Electron for encerrado
app.on('before-quit', () => {
  expressServer.close();
});