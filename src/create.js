let add_question_button = document.getElementById('add_question_btn');
let questions_container = document.getElementById('questions_container');
let save_button = document.getElementById('save_questions_btn');
let quiz_title_input = document.getElementById('quiz_title');

save_button.addEventListener('click', function() {
    save_quiz_to_storage();
    console.log('Questions saved successfully!');
});

add_question_button.addEventListener('click', function() {
    let current_question_count = questions_container.querySelectorAll('.question').length;
    let new_question_number = current_question_count + 1;
    let new_question_element = create_question_element(new_question_number);
    questions_container.appendChild(new_question_element);
});


function create_question_element(question_number) {
    // --- Main container ---
    let question_div = document.createElement('div');
    question_div.id = `question_${question_number}`;
    question_div.className = 'question';

    // --- Question title ---
    let title = document.createElement('h3');
    title.textContent = `Question ${question_number}`;
    question_div.appendChild(title);

    // --- Question text container ---
    let text_container = document.createElement('div');
    text_container.id = `question_${question_number}_text_container`;

    let text_label = document.createElement('label');
    text_label.setAttribute('for', `question_${question_number}_text`);
    text_label.textContent = 'Question text:';

    let text_input = document.createElement('input');
    text_input.type = 'text';
    text_input.id = `question_${question_number}_text`;
    text_input.name = `question_${question_number}_text`;
    text_input.required = true;

    text_container.appendChild(text_label);
    text_container.appendChild(text_input);
    question_div.appendChild(text_container);

    // --- Options container ---
    let options_container = document.createElement('div');
    options_container.id = `options_${question_number}_container`;
    options_container.className = 'options_container';


    for (let i = 1; i <= 2; i++) {
        let option_div = document.createElement('div');
        option_div.id = `question_${question_number}_option_${i}`;

        let option_label = document.createElement('label');
        option_label.setAttribute('for', `question_${question_number}_option_${i}_text`);
        option_label.textContent = `Option ${i}:`;

        let option_input = document.createElement('input');
        option_input.type = 'text';
        option_input.id = `question_${question_number}_option_${i}_text`;
        option_input.name = `question_${question_number}_option_${i}_text`;
        option_input.required = true;

        option_div.appendChild(option_label);
        option_div.appendChild(option_input);
        options_container.appendChild(option_div);
    }

    question_div.appendChild(options_container);

    // --- Add Option button ---
    let add_option_btn = document.createElement('button');
    add_option_btn.type = 'button';
    add_option_btn.textContent = 'Add Option';
    add_option_btn.addEventListener('click', function() {
        add_option(question_number);
    });
    question_div.appendChild(add_option_btn);

    // --- Correct option input ---
    let correct_label = document.createElement('label');
    correct_label.setAttribute('for', `correct_option_${question_number}`);
    correct_label.textContent = 'Correct option:';

    let correct_input = document.createElement('input');
    correct_input.type = 'number';
    correct_input.id = `correct_option_${question_number}`;
    correct_input.name = `correct_option_${question_number}`;
    correct_input.value = 1;
    correct_input.min = 1;
    correct_input.required = true;

    // question_div.appendChild(document.createElement('br'));
    question_div.appendChild(correct_label);
    question_div.appendChild(correct_input);

    // --- Bottom line separator ---
    let hr = document.createElement('hr');
    question_div.appendChild(hr);

    return question_div;
}


function add_option(question_number) {
    let options_container = document.getElementById(`options_${question_number}_container`);
    let current_option_count = options_container.querySelectorAll('div').length;
    let new_option_number = current_option_count + 1;

    let option_div = document.createElement('div');
    option_div.id = `question_${question_number}_option_${new_option_number}`;

    let option_label = document.createElement('label');
    option_label.setAttribute('for', `question_${question_number}_option_${new_option_number}_text`);
    option_label.textContent = `Option ${new_option_number}:`;

    let option_input = document.createElement('input');
    option_input.type = 'text';
    option_input.id = `question_${question_number}_option_${new_option_number}_text`;
    option_input.name = `question_${question_number}_option_${new_option_number}_text`;
    option_input.required = true;

    option_div.appendChild(option_label);
    option_div.appendChild(option_input);
    options_container.appendChild(option_div);
}

function save_quiz_to_storage() {
    let quizTitle = quiz_title_input.value.trim() || "Untitled Quiz";
    let questions = [];

    // Loop through all questions
    document.querySelectorAll('.question').forEach((qDiv, index) => {
        let questionText = qDiv.querySelector(`#question_${index + 1}_text`).value.trim();

        // define options array before using it
        let options = [];
        qDiv.querySelectorAll('.options_container input').forEach(opt => {
            options.push(opt.value.trim());
        });

        let correctOptionInput = qDiv.querySelector(`#correct_option_${index + 1}`);
        let correctOption = parseInt(correctOptionInput.value) - 1; // convert to 0-based index

        if (questionText && options.length > 0 && !isNaN(correctOption)) {
            questions.push({
                questionText: questionText,
                options: options,
                correctOptionIndex: correctOption
            });
        }
    });

    let quizData = {
        quizTitle: quizTitle,
        questions: questions
    };

    localStorage.setItem(`quizData_${quizData.quizTitle}`, JSON.stringify(quizData));
    alert(`Quiz ${quizData.quizTitle} saved to localStorage!`);
}

