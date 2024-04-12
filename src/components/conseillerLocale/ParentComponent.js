import React from 'react';
import { useParams } from 'react-router-dom'; // Si vous utilisez React Router
import ProgrammesConseiller from './ProgrammesConseiller'; // Assurez-vous que le chemin est correct

const ParentComponent = () => {
    const { idDuConseiller } = useParams(); // Assurez-vous que vous récupérez l'ID du conseiller de la route

    return (
        <div>
            {/* Assurez-vous que idDuConseiller contient la valeur de l'ID du conseiller */}
            <ProgrammesConseiller conseillerId={idDuConseiller} />
        </div>
    );
};

export default ParentComponent;
