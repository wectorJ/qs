let add_question_button = document.getElementById('add_question_btn');
let questions_container = document.getElementById('questions_container');
let save_button = document.getElementById('save_questions_btn');

save_button.addEventListener('click', function() {
    save_questions_to_storage();
    alert('Questions saved successfully!');
});

add_question_button.addEventListener('click', function() {
    let current_question_count = questions_container.getElementsByClassName('question').length;
    let new_question_number = current_question_count + 1;
    let new_question_element = create_question_element(new_question_number);
    questions_container.appendChild(new_question_element);
});

function create_question_element(question_number) {
    let question_div = document.createElement('div');
    let question_option_number = 0;
    question_div.className = 'question';
    question_div.innerHTML = 

    `
    <h3>Question ${question_number}</h3>
    <label>Question Text:</label>
    <input type="text" name="question_${question_number}_text" required>
    <br>
    <label>Option ${question_option_number+1}:</label>
    <input type="text" name="question_${question_number}_option_${question_option_number}" required>
    <br>
    <button onclick="add_option(${question_number}, this)">Add Option</button>
    <br>
    <label>Correct option</label>
    <input type="text" name="question_${question_number}_correct_option" required>

    <hr>
    `
    return question_div;
}

function add_option(question_number, button) {
    let question_div = button.parentElement;
    let option_count = question_div.getElementsByTagName('input').length - 1;
    let new_option_number = option_count;
    let option_label = document.createElement('label');
    option_label.innerText = `Option ${new_option_number}:`;
    let option_input = document.createElement('input');
    option_input.type = 'text';
    option_input.name = `question_${question_number}_option_${new_option_number}`;
    option_input.required = true;
    question_div.insertBefore(option_label, button);
    question_div.insertBefore(option_input, button);
    question_div.insertBefore(document.createElement('br'), button);
}

function save_questions_to_storage() {
    let questions = [];
    let question = [];
    let question_elements = questions_container.getElementsByClassName('question');
    for (let i = 0; i < question_elements.length; i++) {
        let input_question = question_elements[i].getElementsByTagName('input');

        questions.push(input.value);
    }
    localStorage.setItem('saved_questions', JSON.stringify(questions));
}