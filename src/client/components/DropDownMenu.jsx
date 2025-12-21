import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function DropDownMenu({
    quizId, onDelete
}){
    const [isMenuOpen, showMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const closeMenu = () => {
            showMenu(false);
        };

        if (isMenuOpen) {
            window.addEventListener('click', closeMenu);
        }

        return () => window.removeEventListener('click', closeMenu);
    }, [isMenuOpen]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        showMenu(!isMenuOpen);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(quizId);
        showMenu(false);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/quizmunism/edit/${quizId}`); 
        showMenu(false);
    };


    return (
    <>

        <button className="dots-btn" onClick={toggleMenu}>
            &#8942;
        </button>


        {isMenuOpen && (
            <div className="dropdown-menu">
            <button onClick={handleEdit}>Edit</button> 
            <button onClick={handleDelete} className="delete-option">Delete</button>
        </div>
        
        )}
    </>
    );
}