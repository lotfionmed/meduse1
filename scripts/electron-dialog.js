import { app, dialog } from 'electron';

async function showOpenDialog() {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Image Icons', extensions: ['svg', 'png'] }
      ],
      title: 'Sélectionnez une icône SVG ou PNG'
    });

    if (!result.canceled && result.filePaths.length > 0) {
      console.log(result.filePaths[0]);
      app.quit();
    } else {
      console.error('Aucun fichier sélectionné');
      app.quit(1);
    }
  } catch (error) {
    console.error(error);
    app.quit(1);
  }
}

app.on('ready', showOpenDialog);
