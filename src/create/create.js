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
    question_div.className = 'question';

    // Title
    let title = document.createElement('h3');
    title.textContent = `Question ${question_number}`;
    question_div.appendChild(title);

    // Question text
    let q_label = document.createElement('label');
    q_label.textContent = 'Question Text:';
    question_div.appendChild(q_label);

    let q_input = document.createElement('input');
    q_input.type = 'text';
    q_input.name = `question_${question_number}_text`;
    q_input.required = true;
    question_div.appendChild(q_input);
    question_div.appendChild(document.createElement('br'));

    // Options container
    let options_container = document.createElement('div');
    options_container.className = 'options';

    // Create first option
    let option_label = document.createElement('label');
    option_label.textContent = `Option 1:`;
    let option_input = document.createElement('input');
    option_input.type = 'text';
    option_input.name = `question_${question_number}_option_1`;
    option_input.required = true;

    options_container.appendChild(option_label);
    options_container.appendChild(option_input);
    options_container.appendChild(document.createElement('br'));

    question_div.appendChild(options_container);

    // Add option button
    let add_option_btn = document.createElement('button');
    add_option_btn.type = 'button';
    add_option_btn.textContent = 'Add Option';
    add_option_btn.addEventListener('click', function() {
        add_option(question_number, options_container);
    });
    question_div.appendChild(add_option_btn);
    question_div.appendChild(document.createElement('br'));

    // Correct option input
    let correct_label = document.createElement('label');
    correct_label.textContent = 'Correct Option:';
    let correct_input = document.createElement('input');
    correct_input.type = 'text';
    correct_input.name = `question_${question_number}_correct_option`;
    correct_input.required = true;

    question_div.appendChild(correct_label);
    question_div.appendChild(correct_input);

    // Divider
    question_div.appendChild(document.createElement('hr'));

    return question_div;
}

function add_option(question_number, options_container) {
    let current_option_count = options_container.querySelectorAll('input').length;
    let new_option_number = current_option_count + 1;

    let option_label = document.createElement('label');
    option_label.textContent = `Option ${new_option_number}:`;
    let option_input = document.createElement('input');
    option_input.type = 'text';
    option_input.name = `question_${question_number}_option_${new_option_number}`;
    option_input.required = true;

    options_container.appendChild(option_label);
    options_container.appendChild(option_input);
    options_container.appendChild(document.createElement('br'));
}

function save_questions_to_storage() {
    let all_questions = [];
    let question_divs = document.querySelectorAll('.question');

    question_divs.forEach((q_div, index) => {
        let text = q_div.querySelector(`input[name^="question_${index + 1}_text"]`).value;
        let correct_option = q_div.querySelector(`input[name^="question_${index + 1}_correct_option"]`).value;

        let options = [];
        q_div.querySelectorAll('.options input').forEach(opt => {
            options.push(opt.value);
        });

        all_questions.push({
            text,
            options,
            correct_option
        });
    });

    localStorage.setItem('saved_questions', JSON.stringify(all_questions));
    console.log('✅ Questions saved:', all_questions);
}