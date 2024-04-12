import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Importez useParams de React Router

const ProgrammesConseiller = () => {
    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { idDuConseiller } = useParams(); // Récupérez l'ID du conseiller de l'URL

    useEffect(() => {
        const fetchProgrammes = async () => {
            if (idDuConseiller) { // Vérifiez si idDuConseiller est défini
                try {
                    const response = await axios.get(`http://localhost:5000/api/conseiller-programmes/${idDuConseiller}`);
                    setProgrammes(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchProgrammes();
    }, [idDuConseiller]); // Assurez-vous de déclencher l'effet uniquement lorsque idDuConseiller change

    return (
        <div>
            {loading ? (
                <p>Chargement en cours...</p>
            ) : (
                <ul>
                    {programmes.map(programme => (
                        <li key={programme.id}>
                            <p>Période: {programme.periode_debut} - {programme.periode_fin}</p>
                            <p>Lieu: {programme.lieu}</p>
                            {/* Afficher d'autres détails du programme ici */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProgrammesConseiller;
