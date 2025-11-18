import React from 'react'

function MainMenu(){
    return (
        <div id="menu">
            <p className="menu-literaly" id="menuLiteraly">Menu</p><br/><br/>
            <a href="./create.html"><button className="quiz-button"><p className="menu-text">Create a New Quiz</p></button></a>
            <a href="./manage.html"><button className="quiz-button"><p className="menu-text">Manage Quiz</p></button></a>
            <a href="./result.html"><button className="quiz-button"><p className="menu-text">View Quizzes Results</p></button></a>
        </div>
    )
}

export default MainMenu