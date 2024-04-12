from flask import Flask, jsonify, request, make_response, flash
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from .models import ConseillerLocal, db, AdminPublique, President, ProgrammeVisite, ProgrammeConseiller

from functools import wraps
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
import os
import jwt
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib



app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/uploads'


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SECRET_KEY'] = "secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://user:postgres@localhost:5434/postgres"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialise la base de données
db.init_app(app)

# Vérifie si le répertoire existe, sinon créez-le
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/signup_admin', methods=['POST'])
def signup_admin():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No image selected for uploading"}), 400
    
    # Vérifier si les données de formulaire sont présentes dans request.form
    if 'firstName' not in request.form or 'lastName' not in request.form or 'email' not in request.form or 'password' not in request.form or 'directeur' not in request.form:
        return jsonify({"message": "Missing form data"}), 400
    
    # Récupérer les données de formulaire
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    password = request.form['password']
    email = request.form['email']
    directeur= request.form['directeur']
    
    # Enregistrer le fichier sur le serveur
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        # Hasher le mot de passe avant de l'enregistrer dans la base de données
        hashed_password = generate_password_hash(password)
        
        
        # Créer un nouvel utilisateur avec les données du formulaire et le nom de fichier
        new_President = AdminPublique(firstName=firstName, lastName=lastName, password=hashed_password,email=email, directeur =directeur ,profile_image=filename)
        db.session.add(new_President)
        db.session.commit()

        return jsonify({"message": "President created successfully"}), 200
    else:
        return jsonify({"message": "Allowed image types are - png, jpg, jpeg, gif"}), 400




# -------------------------------------------------------------------------------------------------------------


# # Définir votre route Flask pour obtenir les e-mails des conseillers
# @app.route('/api/conseillers-emails', methods=['GET'])
# def get_conseillers_emails():
#     conseillers = conseillerLocale.query.all()
#     emails = [conseiller.email for conseiller in conseillers]
#     return jsonify(emails)

# # Définir votre route Flask pour obtenir les e-mails de l'administration publique
# @app.route('/api/admins-emails', methods=['GET'])
# def get_admins_emails():
#     admins = President.query.all()
#     emails = [admin.email for admin in admins]
#     return jsonify(emails)

# # Définir votre route Flask pour créer un programme de visite
# @app.route('/api/programme-visite', methods=['POST'])
# def create_programme_visite():
#     data = request.json

#     # Récupérer les données du formulaire
#     periode_debut = datetime.strptime(data['periode'][0], '%Y-%m-%d %H:%M:%S')
#     periode_fin = datetime.strptime(data['periode'][1], '%Y-%m-%d %H:%M:%S')
#     criteres_evaluation = data['criteresEvaluation']
#     lieu = data['lieu']
#     description = data['description']
#     contacts_urgence = data['contactsUrgence']
#     documents_joints = data['documentsJoints']
#     admin_email = data['adminEmail']
#     conseiller_emails = data['conseillerEmails']

#     # Créez une nouvelle instance de ProgrammeVisite
#     new_programme = ProgrammeVisite(periode_debut=periode_debut,
#                                     periode_fin=periode_fin,
#                                     criteres_evaluation=criteres_evaluation,
#                                     lieu=lieu,
#                                     description=description,
#                                     contacts_urgence=contacts_urgence,
#                                     documents_joints=documents_joints)

#     # Ajoutez le programme à la base de données
#     db.session.add(new_programme)
#     db.session.commit()

#     # Pour ajouter les liens entre le programme et les conseillers, vous pouvez faire comme suit
#     for conseiller_email in conseiller_emails:
#         conseiller = conseillerLocale.query.filter_by(email=conseiller_email).first()
#         if conseiller:
#             new_programme.conseillers.append(conseiller)

#     db.session.commit()

#     return jsonify({'message': 'Programme de visite créé avec succès!'}), 201



# -------------------------------------------------------------------------------------------------------------------

@app.route('/api/conseillers-emails', methods=['GET'])
def get_conseillers_emails():
    # Récupérer les emails des conseillers locaux depuis la base de données
    conseillers = ConseillerLocal.query.all()
    emails = [conseiller.email for conseiller in conseillers]
    return jsonify(emails)

@app.route('/api/admins-emails', methods=['GET'])
def get_admins_emails():
    # Récupérer les emails des administrateurs publics depuis la base de données
    admins = AdminPublique.query.all()
    emails = [admin.email for admin in admins]
    return jsonify(emails)




@app.route('/api/create-evaluation-program', methods=['POST'])
def create_evaluation_program():
    try:
        data = request.json
        periode = data.get('periode')
        criteres_evaluation = data.get('criteres_evaluation')
        lieu = data.get('lieu')
        description = data.get('description')
        contacts_urgence = data.get('contacts_urgence')
        admin_email = data.get('adminEmail')
        conseiller_emails = data.get('conseillerEmails')
        email_subject = data.get('email_subject')
        email_content = data.get('email_content')

        # Créer un nouveau ProgrammeVisite
        nouveau_programme = ProgrammeVisite(periode_debut=periode[0], periode_fin=periode[1], criteres_evaluation=criteres_evaluation, lieu=lieu, description=description, contacts_urgence=contacts_urgence)
        db.session.add(nouveau_programme)

        # Récupérer les ConseillersLocaux par email
        conseillers = ConseillerLocal.query.filter(ConseillerLocal.email.in_(conseiller_emails)).all()

        # Créer des entrées ProgrammeConseiller pour chaque conseiller
        for conseiller in conseillers:
            programme_conseiller = ProgrammeConseiller(
                programme=nouveau_programme,
                conseiller=conseiller
            )
            db.session.add(programme_conseiller)

        db.session.commit()

        # Envoyer un email à l'administrateur et aux conseillers
        send_email(admin_email, email_subject, email_content)
        for conseiller_email in conseiller_emails:
            send_email(conseiller_email, email_subject, email_content)

        return jsonify({'message': 'Nouveaux programmes d\'évaluation créés avec succès et e-mails envoyés'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/api/conseiller-programmes/<int:conseiller_id>', methods=['GET'])
def get_conseiller_programmes(conseiller_id):
    try:
        conseiller = ConseillerLocal.query.get(conseiller_id)
        if conseiller:
            programmes = conseiller.programmes_visite
            return jsonify([programme.serialize() for programme in programmes]), 200
        else:
            return jsonify({'error': 'Conseiller introuvable'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

  
# @app.route('/api/list-programs/<int:conseiller_id>', methods=['GET'])
# def list_programs(conseiller_id):
#     conseiller = ConseillerLocal.query.get(conseiller_id)
#     if not conseiller:
#         return jsonify({'error': 'Conseiller not found'}), 404
#     result = []
#     for programme in conseiller.programmes_visite:
#         result.append({
#             'conseiller': conseiller.serialize(),
#             'programme': programme.programme.serialize()
#         })
#     return jsonify(result), 200





def send_email(to_email, subject, content):
    # Configurer les détails du serveur SMTP
    smtp_server = 'smtp.googlemail.com'
    smtp_port = 587
    smtp_username = 'nourgarali12345@gmail.com'
    smtp_password = 'tmok wtxn cbia xobx'

    # Créer un objet MIMEText avec le contenu de l'e-mail
    message = MIMEMultipart()
    message['From'] = smtp_username
    message['To'] = to_email
    message['Subject'] = subject
    message.attach(MIMEText(content, 'plain'))

    # Établir une connexion avec le serveur SMTP
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()

    # Se connecter au serveur SMTP
    server.login(smtp_username, smtp_password)

    # Envoyer l'e-mail
    server.send_message(message)

    # Fermer la connexion
    server.quit()
    

@app.route('/generate-email', methods=['POST'])
def generate_email():
    # Récupérer les données du formulaire
    periode = request.form.get('periode')
    criteres_evaluation = request.form.get('criteres_evaluation')
    lieu = request.form.get('lieu')
    description = request.form.get('description')
    contacts_urgence = request.form.get('contacts_urgence')
    admin_email = request.form.get('adminEmail')
    conseiller_emails = request.form.getlist('conseillerEmails')

    # Générer le sujet et le contenu de l'e-mail
    email_subject = f"Programme de visite d'évaluation - {periode}"
    email_content = f"""Bonjour,

    Vous êtes invités à participer au programme de visite d'évaluation du {periode}. Les critères d'évaluation sont les suivants : {criteres_evaluation}.
    
    Lieu de visite : {lieu}
    Description : {description}
    Contacts d'urgence : {contacts_urgence}

    Cordialement,"""

    # Retourner le sujet et le contenu de l'e-mail générés
    return jsonify({
        "email_subject": email_subject,
        "email_content": email_content,
        "admin_email": admin_email,
        "conseiller_emails": conseiller_emails
    })

    
  





# ------------------------------------------------------------------------------------------------------




@app.route('/signup_conseilleur', methods=['POST'])
def signup_conseilleur():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No image selected for uploading"}), 400
    
    # Vérifier si les données de formulaire sont présentes dans request.form
    if 'firstName' not in request.form or 'lastName' not in request.form or 'email' not in request.form or 'password' not in request.form :
        return jsonify({"message": "Missing form data"}), 400
    
    # Récupérer les données de formulaire
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    password = request.form['password']
    email = request.form['email']

    
    # Enregistrer le fichier sur le serveur
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        # Hasher le mot de passe avant de l'enregistrer dans la base de données
        hashed_password = generate_password_hash(password)
        
        
        # Créer un nouvel utilisateur avec les données du formulaire et le nom de fichier
        new_conseilleur = ConseillerLocal(firstName=firstName, lastName=lastName, password=hashed_password,email=email,profile_image=filename)
        db.session.add(new_conseilleur)
        db.session.commit()

        return jsonify({"message": "conseilleur created successfully"}), 200
    else:
        return jsonify({"message": "Allowed image types are - png, jpg, jpeg, gif"}), 400




@app.route('/signup', methods=['POST'])
def signup():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No image selected for uploading"}), 400
    
    if 'firstName' not in request.form or 'lastName' not in request.form or 'email' not in request.form or 'password' not in request.form:
        return jsonify({"message": "Missing form data"}), 400
    
    firstName = request.form['firstName']
    lastName = request.form['lastName']
    password = request.form['password']
    email = request.form['email']
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        hashed_password = generate_password_hash(password)
        
        new_President = President(firstName=firstName, lastName=lastName, password=hashed_password,email=email, profile_image=filename)
        db.session.add(new_President)
        db.session.commit()

        return jsonify({"message": "President created successfully"}), 200
    else:
        return jsonify({"message": "Allowed image types are - png, jpg, jpeg, gif"}), 400




@app.route("/login",methods=["POST"])
def login():
    auth=request.json
    print("Auth reçu :", auth)
    if not auth or not auth.get("email") or not auth.get("password"):
        print("Informations d'identification manquantes")
        return make_response(
            jsonify({"message": "Proper credentials were not provided"}), 401
        )
    President = President.query.filter_by(email=auth.get("email")).first()
    if not President:
        print("Utilisateur non trouvé")
        return make_response(
            jsonify({"message": "Please create an account"}), 401
        ) 
    if check_password_hash(President.password,auth.get('password')):
        token = jwt.encode({
            'id':President.id,
            'exp':datetime.utcnow() + timedelta(minutes=30)
        },
        "secret",
        "HS256"
        )
        print("Token généré :", token)
        return make_response(jsonify({'token':token}), 201)
    print("Informations d'identification incorrectes")
    return make_response(
        jsonify({'message': 'Please check your credentials'}), 401
    )



def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token=None
        if 'Authorization' in request.headers:
            token = request.headers["Authorization"]
        if not token:
            return make_response({"message":"Token is missing "},401)
        
        try:
            data=jwt.decode(token,"secret",algorithms=["HS256"])
            current_President = President.query.filter_by(id=data["id"]).first()
            print(current_President)
        except Exception as e :
            print(e)
            return make_response({
            "message":"token is invalid"},401)
        return f(current_President, *args,**kwargs)
    return decorated





@app.route("/President", methods=["GET"])
def get_all_President():
    try:
        # Fetch all President
        all_President = President.query.all()

        # Print debug information
        print("All President:", all_President)

        # Commit the transaction explicitly
        db.session.commit()

        # Serialize President data
        serialized_President = [President.serialize() for President in all_President]  # Call the serialize method

        return jsonify({"data": serialized_President}), 200

    except Exception as e:
        print(e)
        # Rollback the transaction in case of an exception
        db.session.rollback()
        return make_response({"message": f"Error: {str(e)}"}, 500)



@app.route("/Conseilleur", methods=["GET"])
def get_all_Conseilleur():
    try:
        # Fetch all conseillerLocale
        all_Conseilleur = ConseillerLocal.query.all()

        # Print debug information
        print("All conseillerLocale:", all_Conseilleur)

        # Commit the transaction explicitly
        db.session.commit()

        # Serialize conseillerLocale data
        serialized_conseillerLocale = [conseillerLocale.serialize() for conseillerLocale in all_Conseilleur]  # Call the serialize method

        return jsonify({"data": serialized_conseillerLocale}), 200

    except Exception as e:
        print(e)
        # Rollback the transaction in case of an exception
        db.session.rollback()
        return make_response({"message": f"Error: {str(e)}"}, 500)






@app.route("/admins", methods=["GET"])
def get_all_admins():
    try:
        # Fetch all admins
        admins = AdminPublique.query.all()

        # Print debug information
        print("All Admins:", admins)

        # Commit the transaction explicitly
        db.session.commit()

        # Serialize admin data
        serialized_admins = [admin.serialize() for admin in admins]  # Call the serialize method

        return jsonify({"data": serialized_admins}), 200

    except Exception as e:
        print(e)
        # Rollback the transaction in case of an exception
        db.session.rollback()
        return make_response({"message": f"Error: {str(e)}"}, 500)



@app.route("/adminpublique/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    try:
        # Fetch the AdminPublique
        admin_to_delete = AdminPublique.query.get(admin_id)
        if not admin_to_delete:
            return make_response({"message": f"AdminPublique with id {admin_id} not found"}, 404)

        db.session.delete(admin_to_delete)
        db.session.commit()

        return make_response({"message": "AdminPublique deleted successfully"}, 200)

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response({"message": f"Unable to delete AdminPublique: {str(e)}"}, 500)







# ...

@app.route("/Conseilleur/<int:Conseilleur_id>", methods=["DELETE"])
def delete_Conseilleur(Conseilleur_id):
    try:
        # Fetch the Conseilleur
        Conseilleur_to_delete = ConseillerLocal.query.get(Conseilleur_id)
        if not Conseilleur_to_delete:
            return make_response({"message": f"conseillerLocale with id {Conseilleur_id} not found"}, 404)

        db.session.delete(Conseilleur_to_delete)
        db.session.commit()

        return make_response({"message": "conseillerLocale deleted successfully"}, 200)

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response({"message": f"Unable to delete conseillerLocale: {str(e)}"}, 500)






@app.route("/Conseilleur/<int:Conseilleur_id>", methods=["PUT"])
def update_Conseilleur(Conseilleur_id):
    try:
        # Fetch the Conseilleur_id
        Conseilleur_id_to_update = ConseillerLocal.query.get(Conseilleur_id)
        if not Conseilleur_id_to_update:
            return make_response({"message": f"conseillerLocale with id {Conseilleur_id} not found"}, 404)

        # Update the Conseilleur_id fields
        Conseilleur_id_to_update.firstName = request.form.get('firstName')
        Conseilleur_id_to_update.lastName = request.form.get('lastName')
        Conseilleur_id_to_update.email = request.form.get('email')

        # Check if a file was uploaded in the request
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                # Update the profile image path in the database
                Conseilleur_id_to_update.profile_image = filename

        db.session.commit()

        return jsonify({"message": "conseillerLocale updated successfully"}), 200

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response({"message": "Unable to update conseillerLocale"}, 500)





@app.route("/President/<int:President_id>", methods=["PUT"])
def update_President(President_id):
    try:
        # Fetch the President
        president_to_update = President.query.get(President_id)
        if not president_to_update:
            return make_response({"message": f"President with id {President_id} not found"}, 404)

        # Update the President fields
        president_to_update.firstName = request.form.get('firstName')
        president_to_update.lastName = request.form.get('lastName')
        president_to_update.email = request.form.get('email')

        # Check if a file was uploaded in the request
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                # Update the profile image path in the database
                president_to_update.profile_image = filename

        db.session.commit()

        return jsonify({"message": "President updated successfully"}), 200

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response({"message": "Unable to update President"}, 500)

    
@app.route("/President/<int:President_id>", methods=["DELETE"])
def delete_President(President_id):
    try:
        # Fetch the President
        president_to_delete = President.query.get(President_id)
        if not president_to_delete:
            return make_response({"message": f"President with id {President_id} not found"}, 404)

        db.session.delete(president_to_delete)
        db.session.commit()

        return make_response({"message": "President deleted successfully"}, 200)

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response({"message": f"Unable to delete President: {str(e)}"}, 500)




   


@app.route('/President-profile', methods=['GET'])
@token_required
def get_President_profile(current_President):
    return jsonify({
        'firstName': current_President.firstName,
        'lastName': current_President.lastName,
        'profileImage': current_President.profile_image
    }), 200



@app.route("/adminpublique/<int:admin_id>", methods=["PUT"])
def update_admin(admin_id):
    try:
        admin = AdminPublique.query.get(admin_id)
        if not admin:
            return make_response({"message": f"Admin with id {admin_id} not found"}, 404)

        # Update the admin fields
        admin.firstName = request.form.get('firstName')
        admin.lastName = request.form.get('lastName')
        admin.email = request.form.get('email')
        admin.directeur = request.form.get('directeur')

        # Check if a file was uploaded in the request
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                # Update the profile image path in the database
                admin.profile_image = filename

        db.session.commit()

        return jsonify({"message": "Admin updated successfully"}), 200

    except Exception as e:
        print(e)
        db.session.rollback()
        return make_response({"message": "Unable to update admin"}, 500)
    
    
    
@app.route("/adminpublique/<int:admin_id>", methods=["GET"])
def get_admin(admin_id):
    try:
        admin = AdminPublique.query.get(admin_id)
        if not admin:
            return make_response({"message": f"Admin with id {admin_id} not found"}, 404)

        return jsonify(admin.serialize()), 200

    except Exception as e:
        print(e)
        return make_response({"message": "Unable to get admin"}, 500)



    
@app.route("/conseillerLocale/<int:Conseilleur_id>", methods=["GET"])
def get_conseilleur(Conseilleur_id):
    try:
        conseilleur = ConseillerLocal.query.get(Conseilleur_id)
        if not conseilleur:
            return make_response({"message": f"conseilleur with id {Conseilleur_id} not found"}, 404)

        return jsonify(conseilleur.serialize()), 200

    except Exception as e:
        print(e)
        return make_response({"message": "Unable to get conseilleur"}, 500)




if __name__ == '__main__':
    app.run(debug=True)
