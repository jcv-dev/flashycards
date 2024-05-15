
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


function populateSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = ''; // Clear existing buttons
    
    flashcardsData.forEach(group => {
        const button = document.createElement('button');
        button.textContent = group.nombreGrupo;
        button.onclick = () => showFlashcardGroup(group);
        if (group.grupoFlashcards.length !== 0){
          sidebar.appendChild(button);
        }
    });
}


function showFlashcardGroup(group) {
    currentGroupIndex = flashcardsData.indexOf(group);
    currentFlashcardIndex = 0;
    const flashcardAnswer = document.getElementById('flashcardAnswer');
    if (flashcardAnswer.style.display === 'block'){
      toggleFlashcardAnswer();
    }

    showFlashcard(currentGroupIndex, currentFlashcardIndex);  

    document.getElementById('flashcardContainer').style.display = 'block';
}

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

function showFlashcard(groupIndex, flashcardIndex) {
    const group = flashcardsData[groupIndex];
    const flashcard = group.grupoFlashcards[flashcardIndex];

    document.getElementById('flashcardTitle').innerHTML = `<b>${flashcard.titulo}</b>`;
    document.getElementById('flashcardContent').innerHTML = flashcard.contenido;
    document.getElementById('flashcardAnswer').innerHTML = flashcard.respuesta;

    // Disable/enable previous and next buttons based on current flashcard index
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
