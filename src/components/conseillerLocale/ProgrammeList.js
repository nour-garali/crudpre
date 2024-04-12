import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { List, Typography } from 'antd';

const { Title } = Typography;

const ProgrammeList = () => {
  const [programmes, setProgrammes] = useState([]);
  const { conseiller_id } = useParams();

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/conseilleur/${conseiller_id}/programmes`)
      .then(response => setProgrammes(response.data))
      .catch(error => console.error('Error fetching programmes:', error));
  }, [conseiller_id]);

  return (
    <div>
      <Title level={2}>Liste des Programmes de Visite</Title>
      <List
        itemLayout="horizontal"
        dataSource={programmes}
        renderItem={programme => (
          <List.Item>
            <List.Item.Meta
              title={`Programme ${programme.id}`}
              description={`Période de début : ${programme.periode_debut}, Période de fin : ${programme.periode_fin}, Critères d'évaluation : ${programme.criteres_evaluation}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProgrammeList;
