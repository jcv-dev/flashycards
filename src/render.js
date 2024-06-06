let flashcardsData;
let jsonFilePath;

async function openFile() {
    const result = await window.electronAPI.openFile();
    if (result) {
        jsonFilePath = result.filePath;
        flashcardsData = result.data;
        populateSidebar();
        if (flashcardsData.length !== 0) {
            showFlashcardGroup(flashcardsData[0]);
        } else {
            document.getElementById('flashcardContainer').style.display = 'none';
        }
    }
}

async function saveChangesToFile() {
    if (jsonFilePath) {
        await window.electronAPI.saveChanges(jsonFilePath, flashcardsData);
        console.log('Archivo actualizado con exito');
    }
}

async function newFlashcard() {
    const group = flashcardsData[currentGroupIndex];

    try {
        const title = await window.electronAPI.prompt({
            title: 'Nueva Flashcard',
            label: 'Título:',
            value: '',
            inputAttrs: {
                type: 'text'
            },
            type: 'input',
            customStylesheet: 'src/prompt.css'
        });
        if (title === null) {
            console.log('El usuario canceló la operación');
            return;
        }

        const content = await window.electronAPI.prompt({
            title: 'Nueva Flashcard',
            label: 'Contenido:',
            value: '',
            inputAttrs: {
                type: 'text'
            },
            type: 'input',
            customStylesheet: 'src/prompt.css'
        });
        if (content === null) {
            console.log('El usuario canceló la operación');
            return;
        }

        const answer = await window.electronAPI.prompt({
            title: 'Nueva Flashcard',
            label: 'Respuesta:',
            value: '',
            inputAttrs: {
                type: 'text'
            },
            type: 'input',
            customStylesheet: 'src/prompt.css'
        });
        if (answer === null) {
            console.log('El usuario canceló la operación');
            return;
        }

        const newCard = {
            titulo: title,
            contenido: content,
            respuesta: answer
        };
        group.grupoFlashcards.push(newCard);
        saveChangesToFile();
        showFlashcard(currentGroupIndex, group.grupoFlashcards.length - 1);
    } catch (error) {
        console.error(error);
    }
}

async function deleteFlashcard() {
    const group = flashcardsData[currentGroupIndex];
    
  if (currentFlashcardIndex === -1) {
    alert("No hay ninguna flashcard seleccionada");
    return;
  }

  const confirm = await window.electronAPI.prompt({
    title: "Eliminar categoría",
    label: "Esta acción <b>eliminará de manera <br>permanente la flashcard.</b> <br>Escriba CONFIRMAR para continuar",
    resizable: false,
    useHtmlLabel: true,
    useContentSize:true,
    height: 200,
    inputAttrs: {
      type: 'text',
      required: true
    },
    type: 'input',
    customStylesheet: 'src/prompt.css'
  });

  if (confirm === null) return;

  if (confirm.toLowerCase() !== 'confirmar'){
    console.log('Operacion cancelada por el usuario');
    return;
  }

    if (group.grupoFlashcards.length > 0) {
        group.grupoFlashcards.splice(currentFlashcardIndex, 1);
        saveChangesToFile();
        if (group.grupoFlashcards.length > 0) {
            if (currentFlashcardIndex >= group.grupoFlashcards.length) {
                currentFlashcardIndex = group.grupoFlashcards.length - 1;
            }
            showFlashcard(currentGroupIndex, currentFlashcardIndex);
        } else {
            document.getElementById('flashcardContainer').style.display = 'none';
        }
    }
}

function populateSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    flashcardsData.forEach(group => {
        const button = document.createElement('button');
        button.textContent = group.nombreGrupo;
        button.onclick = () => showFlashcardGroup(group);
        sidebar.appendChild(button);
    });

    const newCategoryButton = document.createElement('button');
    newCategoryButton.textContent = 'Nueva categoría';
    newCategoryButton.onclick = addNewCategory;
    sidebar.appendChild(newCategoryButton);
}

function showFlashcardGroup(group) {
    currentGroupIndex = flashcardsData.indexOf(group);
    currentFlashcardIndex = 0;

    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
        toggleFlashcardAnswer();
    }

    if (flashcardsData[currentGroupIndex].grupoFlashcards.length === 0) {
      document.getElementById('flashcardContainer').style.display = 'none';
      currentFlashcardIndex = -1;
      return;
    }

    showFlashcard(currentGroupIndex, currentFlashcardIndex);
    document.getElementById('flashcardContainer').style.display = 'block';
}

function toggleFlashcardAnswer() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    const flashcardAnswerButton = document.getElementById('flashcardAnswerButton');

    if (flashcardAnswer.style.display === 'none') {
        flashcardAnswer.style.display = 'block';
        flashcardAnswerButton.textContent = 'Ocultar respuesta';
    } else {
        flashcardAnswer.style.display = 'none';
        flashcardAnswerButton.textContent = 'Mostrar respuesta';
    }
}

let currentGroupIndex = -1;
let currentFlashcardIndex = -1;

function showFlashcard(groupIndex, flashcardIndex) {
    const group = flashcardsData[groupIndex];
    const flashcard = group.grupoFlashcards[flashcardIndex];

    document.getElementById('flashcardContainer').style.display = 'block';

    document.getElementById('flashcardTitle').innerHTML = `<b>${flashcard.titulo}</b>`;
    document.getElementById('flashcardContent').innerHTML = flashcard.contenido;
    document.getElementById('flashcardAnswer').innerHTML = flashcard.respuesta;

    document.getElementById('prevButton').disabled = flashcardIndex === 0;
    document.getElementById('nextButton').disabled = flashcardIndex === group.grupoFlashcards.length - 1;

    currentGroupIndex = groupIndex;
    currentFlashcardIndex = flashcardIndex;
}

function showNextFlashcard() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
        toggleFlashcardAnswer();
    }

    if (currentFlashcardIndex < flashcardsData[currentGroupIndex].grupoFlashcards.length - 1) {
        showFlashcard(currentGroupIndex, currentFlashcardIndex + 1);
    }
}

function showPrevFlashcard() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
        toggleFlashcardAnswer();
    }
    if (currentFlashcardIndex > 0) {
        showFlashcard(currentGroupIndex, currentFlashcardIndex - 1);
    }
}

async function addNewCategory() {
    const nombreGrupo = await window.electronAPI.prompt({
        title: 'Nueva categoría',
        label: 'Nombre de la nueva categoría:',
        inputAttrs: {
            type: 'text',
            required: true
        },
        type: 'input',
        customStylesheet: 'src/prompt.css'
    });
    if (nombreGrupo === null) {
        console.log('El usuario canceló la operación');
        return;
    }

    const newGroup = {
        nombreGrupo: nombreGrupo,
        grupoFlashcards: []
    };
    flashcardsData.push(newGroup);
    populateSidebar();
    saveChangesToFile();
}

async function deleteCategory() {

  if (currentGroupIndex === -1) {
    alert("No hay ninguna categoría seleccionada");
    return;
  }

  const group = flashcardsData[currentGroupIndex];


  const confirm = await window.electronAPI.prompt({
    title: "Eliminar categoría",
    label: "Esta acción <b>eliminará de manera <br>permanente la categoría.</b> <br>Escriba CONFIRMAR para continuar",
    resizable: false,
    useHtmlLabel: true,
    useContentSize:true,
    height: 200,
    inputAttrs: {
      type: 'text',
      required: true
    },
    type: 'input',
    customStylesheet: 'src/prompt.css'
  });

  if (confirm === null) return;

  if (confirm.toLowerCase() !== 'confirmar'){
    console.log('Operacion cancelada por el usuario');
    return;
  }

  flashcardsData.splice(currentGroupIndex, 1);

  populateSidebar();

  saveChangesToFile();

  currentGroupIndex = -1;

  currentFlashcardIndex = -1;

  document.getElementById('flashcardContainer').style.display = 'none';

}

// Función para inicializar el archivo JSON al cargar la aplicación
window.onload = openFile;
