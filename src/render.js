

function openFile() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const jsonContent = event.target.result;
                populateSidebar(jsonContent);
            };
            reader.readAsText(file);
        }
    });
}

// Se añade la variable flashcardsData para almacenar el contenido del JSON. No se hace const para 
// permitir que el usuario cargue un nuevo archivo o edite el actual en cualquier momento.

let flashcardsData;

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    fetchFlashcardsData(file);
});

function fetchFlashcardsData(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            flashcardsData = JSON.parse(event.target.result);
            console.log('Flashcards data:', flashcardsData);
            if (flashcardsData.length !== 0){
              populateSidebar();
              showFlashcardGroup(flashcardsData[0]);
            }else {
              document.getElementById('flashcardContainer').style.display = 'none';
            }
        } catch (error) {
            console.error('There was a problem parsing the JSON file:', error);
        }
    };
    reader.readAsText(file);
}

// Esta función añade los botones de la sidebar
//
function populateSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = ''; // Borra los botones existentes
    
    // Se extrae el atributo nombreGrupo de cada objeto y se añade un botón con ese 
    // nombre a la sidebar
    flashcardsData.forEach(group => {
        const button = document.createElement('button');
        button.textContent = group.nombreGrupo;
        button.onclick = () => showFlashcardGroup(group);
        if (group.grupoFlashcards.length !== 0){
          sidebar.appendChild(button);
        }
    });
}

// Esta función cambia el grupo que de flashcards que se está visualizando
//
function showFlashcardGroup(group) {
    // Se actualiza el grupo actual para que sea el grupo que se está visualizando
    // y se pone pone la flashcard actual en 0 para que al ingresar a un grupo se vea siempre
    // la primera flashcard
    currentGroupIndex = flashcardsData.indexOf(group);
    currentFlashcardIndex = 0;

    // Si la flashcard que se estaba visualizando antes de cambiar de grupo tenía la respuesta
    // visible, se oculta. Sin esto, la flashcard del grupo al que se cambia tendrá la respuesta
    // visible por defecto
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block'){
      toggleFlashcardAnswer();
    }

    showFlashcard(currentGroupIndex, currentFlashcardIndex);  

    document.getElementById('flashcardContainer').style.display = 'block';
}

// Cambia la visibilidad de la respuesta de la flashcard
function toggleFlashcardAnswer() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    const flashcardAnswerBtn = document.getElementById('flashcardAnswerBtn');
    
    if (flashcardAnswer.style.display === 'none') {
        flashcardAnswer.style.display = 'block';
        flashcardAnswerButton.textContent = 'Ocultar respuesta';
    } else {
        flashcardAnswer.style.display = 'none';
        flashcardAnswerButton.textContent = 'Mostrar respuesta';
    }
}

let currentGroupIndex = 0;
let currentFlashcardIndex = 0;

// Imprime la flashcard indicada en el cuerpo de la app
function showFlashcard(groupIndex, flashcardIndex) {
    const group = flashcardsData[groupIndex];
    const flashcard = group.grupoFlashcards[flashcardIndex];

    document.getElementById('flashcardTitle').innerHTML = `<b>${flashcard.titulo}</b>`;
    document.getElementById('flashcardContent').innerHTML = flashcard.contenido;
    document.getElementById('flashcardAnswer').innerHTML = flashcard.respuesta;

    // Se activan o desactivan los botones de siguiente y anterior.
    document.getElementById('prevButton').disabled = flashcardIndex === 0;
    document.getElementById('nextButton').disabled = flashcardIndex === group.grupoFlashcards.length - 1;

    currentGroupIndex = groupIndex;
    currentFlashcardIndex = flashcardIndex;
}

// Llama a la función showFlashcard() ingresando como parametro el índice de 
// la flashcard actual + 1
function showNextFlashcard() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
      toggleFlashcardAnswer();
  }

    if (currentFlashcardIndex < flashcardsData[currentGroupIndex].grupoFlashcards.length - 1) { // Se verifica que no se esté en la última flashcard (no hay siguiente)
        showFlashcard(currentGroupIndex, currentFlashcardIndex + 1);
    }
}

// Llama a la función showFlashcard() ingresando como parametro el índice de 
// la flashcard actual - 1
function showPrevFlashcard() {
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block') {
      toggleFlashcardAnswer();
  }
    if (currentFlashcardIndex > 0) { // Se verifica que no se esté en la primera flashcard (no hay anterior)
        showFlashcard(currentGroupIndex, currentFlashcardIndex - 1);
    }
}
