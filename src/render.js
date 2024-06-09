// Variables globales para almacenar los datos de las flashcards y la ruta del archivo JSON
let flashcardsData;
let jsonFilePath;

// Función asincrónica para abrir un archivo JSON que contiene las flashcards
async function openFile() {
    // Se espera a que la función openFile() de la API de electron devuelva un resultado
    const result = await window.electronAPI.openFile();
    // Si se obtiene un resultado válido
    if (result) {
        // Se actualiza la ruta del archivo y los datos de las flashcards
        jsonFilePath = result.filePath;
        flashcardsData = result.data;
        // Se llena la barra lateral con las categorías y se muestra la primera categoría si hay datos
        populateSidebar();
        if (flashcardsData.length !== 0) {
            showFlashcardGroup(flashcardsData[0]);
        } else {
            // Si no hay datos, se oculta el contenedor de las flashcards
            document.getElementById('flashcardContainer').style.display = 'none';
        }
    }
}

// Función asincrónica para guardar los cambios en el archivo JSON
async function saveChangesToFile() {
    // Si hay una ruta de archivo especificada
    if (jsonFilePath) {
        // Se utiliza la función saveChanges() de la API de electron para guardar los cambios
        await window.electronAPI.saveChanges(jsonFilePath, flashcardsData);
        // Se muestra un mensaje de éxito en la consola
        console.log('Archivo actualizado con éxito');
    }
}

// Función asincrónica para crear una nueva flashcard
async function newFlashcard() {
    // Se obtiene el grupo de flashcards actual
    const group = flashcardsData[currentGroupIndex];

    try {
        // Se solicita al usuario que ingrese el título de la flashcard
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
        // Si el usuario cancela la operación, se muestra un mensaje en la consola y se sale de la función
        if (title === null) {
            console.log('El usuario canceló la operación');
            return;
        }

        // Se solicita al usuario que ingrese el contenido de la flashcard
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
        // Si el usuario cancela la operación, se muestra un mensaje en la consola y se sale de la función
        if (content === null) {
            console.log('El usuario canceló la operación');
            return;
        }

        // Se solicita al usuario que ingrese la respuesta de la flashcard
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
        // Si el usuario cancela la operación, se muestra un mensaje en la consola y se sale de la función
        if (answer === null) {
            console.log('El usuario canceló la operación');
            return;
        }

        // Se crea un nuevo objeto de flashcard con los datos proporcionados por el usuario
        const newCard = {
            titulo: title,
            contenido: content,
            respuesta: answer
        };
        // Se agrega la nueva flashcard al grupo actual de flashcards
        group.grupoFlashcards.push(newCard);
        // Se guardan los cambios en el archivo
        saveChangesToFile();
        // Se muestra la nueva flashcard en la interfaz de usuario
        showFlashcard(currentGroupIndex, group.grupoFlashcards.length - 1);
    } catch (error) {
        // Si ocurre un error durante el proceso, se muestra en la consola
        console.error(error);
    }
}

// Función asincrónica para eliminar una flashcard
async function deleteFlashcard() {
    // Se obtiene el grupo de flashcards actual
    const group = flashcardsData[currentGroupIndex];
    
    // Se verifica si hay una flashcard seleccionada
    if (currentFlashcardIndex === -1) {
        alert("No hay ninguna flashcard seleccionada");
        return;
    }

    // Se solicita al usuario confirmación antes de eliminar la flashcard
    const confirm = await window.electronAPI.prompt({
        title: "Eliminar categoría",
        label: "Esta acción eliminará de manera permanente la flashcard. Escriba CONFIRMAR para continuar",
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

    // Si el usuario cancela la operación, se sale de la función
    if (confirm === null) return;

    // Si el usuario no escribe 'confirmar', se muestra un mensaje en la consola y se sale de la función
    if (confirm.toLowerCase() !== 'confirmar'){
        console.log('Operación cancelada por el usuario');
        return;
    }

    // Se elimina la flashcard del grupo actual
    if (group.grupoFlashcards.length > 0) {
        group.grupoFlashcards.splice(currentFlashcardIndex, 1);
        // Se guardan los cambios en el archivo
        saveChangesToFile();
        // Si hay más flashcards en el grupo, se muestra la siguiente flashcard
        if (group.grupoFlashcards.length > 0) {
            if (currentFlashcardIndex >= group.grupoFlashcards.length) {
                currentFlashcardIndex = group.grupoFlashcards.length - 1;
            }
            showFlashcard(currentGroupIndex, currentFlashcardIndex);
        } else {
            // Si no hay más flashcards en el grupo, se oculta el contenedor de flashcards
            document.getElementById('flashcardContainer').style.display = 'none';
        }
    }
}

// Función para llenar la barra lateral con las categorías de las flashcards
function populateSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    // Se recorren todas las categorías de flashcards y se crea un botón para cada una
    flashcardsData.forEach(group => {
        const button = document.createElement('button');
        button.textContent = group.nombreGrupo;
        // Al hacer clic en un botón de categoría, se muestra el grupo correspondiente de flashcards
        button.onclick = () => showFlashcardGroup(group);
        sidebar.appendChild(button);
    });

    // Se agrega un botón para crear una nueva categoría
    const newCategoryButton = document.createElement('button');
    newCategoryButton.textContent = 'Nueva categoría';
    newCategoryButton.onclick = addNewCategory;
    sidebar.appendChild(newCategoryButton);
}

// Función para mostrar el grupo de flashcards seleccionado
function showFlashcardGroup(group) {
    currentGroupIndex = flashcardsData.indexOf(group);
    currentFlashcardIndex = 0;

    // Si la respuesta de una flashcard está visible, se oculta
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
        toggleFlashcardAnswer();
    }

    // Si no hay flashcards en el grupo seleccionado, se oculta el contenedor de flashcards y se sale de la función
    if (flashcardsData[currentGroupIndex].grupoFlashcards.length === 0) {
        document.getElementById('flashcardContainer').style.display = 'none';
        currentFlashcardIndex = -1;
        return;
    }

    // Se muestra la primera flashcard del grupo
    showFlashcard(currentGroupIndex, currentFlashcardIndex);
    document.getElementById('flashcardContainer').style.display = 'block';
}

// Función para alternar la visibilidad de la respuesta de una flashcard
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

// Variables globales para almacenar los índices del grupo y la flashcard actual
let currentGroupIndex = -1;
let currentFlashcardIndex = -1;

// Función para mostrar una flashcard específica
function showFlashcard(groupIndex, flashcardIndex) {
    const group = flashcardsData[groupIndex];
    const flashcard = group.grupoFlashcards[flashcardIndex];

    // Se muestra el contenedor de flashcards
    document.getElementById('flashcardContainer').style.display = 'block';

    // Se actualizan los elementos de la interfaz con los datos de la flashcard
    document.getElementById('flashcardTitle').innerHTML = `<b>${flashcard.titulo}</b>`;
    document.getElementById('flashcardContent').innerHTML = flashcard.contenido;
    document.getElementById('flashcardAnswer').innerHTML = flashcard.respuesta;

    // Se deshabilitan los botones de navegación si se está en la primera o última flashcard del grupo
    document.getElementById('prevButton').disabled = flashcardIndex === 0;
    document.getElementById('nextButton').disabled = flashcardIndex === group.grupoFlashcards.length - 1;

    // Se actualizan los índices del grupo y la flashcard actual
    currentGroupIndex = groupIndex;
    currentFlashcardIndex = flashcardIndex;
}

// Función para mostrar la siguiente flashcard
function showNextFlashcard() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
        toggleFlashcardAnswer();
    }

    // Si no se está en la última flashcard del grupo, se muestra la siguiente flashcard
    if (currentFlashcardIndex < flashcardsData[currentGroupIndex].grupoFlashcards.length - 1) {
        showFlashcard(currentGroupIndex, currentFlashcardIndex + 1);
    }
}

// Función para mostrar la flashcard anterior
function showPrevFlashcard() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
        toggleFlashcardAnswer();
    }
    // Si no se está en la primera flashcard del grupo, se muestra la flashcard anterior
    if (currentFlashcardIndex > 0) {
        showFlashcard(currentGroupIndex, currentFlashcardIndex - 1);
    }
}

// Función asincrónica para agregar una nueva categoría de flashcards
async function addNewCategory() {
    // Se solicita al usuario que ingrese el nombre de la nueva categoría
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
    // Si el usuario cancela la operación, se muestra un mensaje en la consola y se sale de la función
    if (nombreGrupo === null) {
        console.log('El usuario canceló la operación');
        return;
    }

    // Se crea un nuevo objeto de grupo de flashcards con el nombre proporcionado por el usuario
    const newGroup = {
        nombreGrupo: nombreGrupo,
        grupoFlashcards: []
    };
    // Se agrega el nuevo grupo de flashcards a la lista de flashcards
    flashcardsData.push(newGroup);
    // Se llena nuevamente la barra lateral con las categorías actualizadas
    populateSidebar();
    // Se guardan los cambios en el archivo
    saveChangesToFile();
}

// Función asincrónica para eliminar una categoría de flashcards
async function deleteCategory() {
    // Si no hay ninguna categoría seleccionada, se muestra un mensaje de alerta y se sale de la función
    if (currentGroupIndex === -1) {
        alert("No hay ninguna categoría seleccionada");
        return;
    }

    // Se obtiene la categoría de flashcards actual
    const group = flashcardsData[currentGroupIndex];

    // Se solicita al usuario confirmación antes de eliminar la categoría
    const confirm = await window.electronAPI.prompt({
        title: "Eliminar categoría",
        label: "Esta acción eliminará de manera permanente la categoría. Escriba CONFIRMAR para continuar",
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

    // Si el usuario cancela la operación, se sale de la función
    if (confirm === null) return;

    // Si el usuario no escribe 'confirmar', se muestra un mensaje en la consola y se sale de la función
    if (confirm.toLowerCase() !== 'confirmar'){
        console.log('Operación cancelada por el usuario');
        return;
    }

    // Se elimina la categoría de flashcards de la lista
    flashcardsData.splice(currentGroupIndex, 1);

    // Se actualiza la barra lateral con las categorías actualizadas
    populateSidebar();

    // Se guardan los cambios en el archivo
    saveChangesToFile();

    // Se reinician los índices del grupo y la flashcard actual
    currentGroupIndex = -1;
    currentFlashcardIndex = -1;

    // Se oculta el contenedor de flashcards
    document.getElementById('flashcardContainer').style.display = 'none';
}

// Función para inicializar el archivo JSON al cargar la aplicación
window.onload = openFile;