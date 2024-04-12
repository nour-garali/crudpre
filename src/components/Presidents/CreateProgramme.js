import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Select, Button, DatePicker, Modal } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateProgramme = () => {
    const [periode, setPeriode] = useState([]);
    const [criteresEvaluation, setCriteresEvaluation] = useState('');
    const [lieu, setLieu] = useState('');
    const [description, setDescription] = useState('');
    const [contactsUrgence, setContactsUrgence] = useState('');
    const [selectedAdminEmail, setSelectedAdminEmail] = useState('');
    const [selectedConseillerEmails, setSelectedConseillerEmails] = useState([]);
    const [adminsEmails, setAdminsEmails] = useState([]);
    const [conseillersEmails, setConseillersEmails] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [emailSubject, setEmailSubject] = useState('Invitation au programme de visite d\'évaluation');
    const [editedEmailSubject, setEditedEmailSubject] = useState('Invitation au programme de visite d\'évaluation');
    const [editedEmailContent, setEditedEmailContent] = useState('');

    useEffect(() => {
        const fetchConseillersEmails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/conseillers-emails');
                setConseillersEmails(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAdminsEmails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admins-emails');
                setAdminsEmails(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchConseillersEmails();
        fetchAdminsEmails();
    }, []);

    useEffect(() => {
        // Générer automatiquement le contenu de l'e-mail
        const content = `Bonjour,\n\nVous êtes invités à participer au programme de visite d'évaluation du ${periode[0]} au ${periode[1]}. Les critères d'évaluation sont les suivants : ${criteresEvaluation}.\n\nCordialement,`;
        setEditedEmailContent(content);
    }, [periode, criteresEvaluation]);

    const createEvaluationProgram = async () => {
        // Envoyer les données du formulaire à votre API Flask
        const formData = {
            periode,
            criteres_evaluation: criteresEvaluation,
            lieu,
            description,
            contacts_urgence: contactsUrgence,
            adminEmail: selectedAdminEmail,
            conseillerEmails: selectedConseillerEmails,
            email_subject: editedEmailSubject,
            email_content: editedEmailContent
        };

        try {
            const response = await axios.post('http://localhost:5000/api/create-evaluation-program', formData);
            // Envoyer l'email aux adresses sélectionnées
            
            // Afficher une confirmation ou rediriger vers une autre page après la création du programme
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    

    const handleModalOk = () => {
        setEmailSubject(editedEmailSubject);
        createEvaluationProgram(); // Appeler la méthode createEvaluationProgram lors de l'appui sur le bouton "Créer un programme de visite"
        setModalVisible(false);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    return (
        <div>
            <Form>
                <Form.Item label="Période" name="periode">
                    <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        value={periode}
                        onChange={value => setPeriode(value)}
                    />
                </Form.Item>
                <Form.Item label="Critères d'évaluation" name="criteres_evaluation">
                    <Input value={criteresEvaluation} onChange={e => setCriteresEvaluation(e.target.value)} />
                </Form.Item>
                <Form.Item label="Lieu" name="lieu">
                    <Input value={lieu} onChange={e => setLieu(e.target.value)} />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea value={description} onChange={e => setDescription(e.target.value)} />
                </Form.Item>
                <Form.Item label="Contacts d'urgence" name="contacts_urgence">
                    <Input value={contactsUrgence} onChange={e => setContactsUrgence(e.target.value)} />
                </Form.Item>
                <Form.Item label="Email de l'administration publique" name="adminEmail">
                    <Select value={selectedAdminEmail} onChange={value => setSelectedAdminEmail(value)}>
                        {adminsEmails.map(email => <Option key={email} value={email}>{email}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Emails des conseillers" name="conseillerEmails">
                    <Select mode="tags" value={selectedConseillerEmails} onChange={value => setSelectedConseillerEmails(value)} placeholder="Sélectionnez les emails des conseillers">
                        {conseillersEmails.map(email => <Option key={email}>{email}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => setModalVisible(true)}>Valider</Button>
                </Form.Item>
            </Form>
            <Modal
                title="Modifier l'e-mail"
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Créer un programme de visite"
            >
                <Form>
                    <Form.Item label="Object">
                        <Input value={editedEmailSubject} onChange={e => setEditedEmailSubject(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Contenu de l'e-mail">
                        <Input.TextArea value={editedEmailContent} onChange={e => setEditedEmailContent(e.target.value)} autoSize={{ minRows: 6, maxRows: 10 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateProgramme;
