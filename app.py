from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import imaplib
import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from urllib.parse import quote_plus
import cloudinary
import cloudinary.uploader

load_dotenv()

app = Flask(__name__)
CORS(app)

ADMIN_SECRET = 'Shreedutt@7371'
SMTP_USER = os.environ.get('SMTP_USER', 'knacksolutions.vlsd@gmail.com')
SMTP_PASS = os.environ.get('SMTP_PASS', '')
CONTACT_TO = 'knacksolutions.vlsd@gmail.com'

# Cloudinary config
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

# Build MongoDB URI with encoded credentials
MONGO_URI = os.environ.get('MONGO_URI', '')
if not MONGO_URI:
    MONGO_USER = quote_plus(os.environ.get('MONGO_USER', ''))
    MONGO_PASS = quote_plus(os.environ.get('MONGO_PASS', ''))
    MONGO_HOST = os.environ.get('MONGO_HOST', 'localhost:27017')
    MONGO_DB = os.environ.get('MONGO_DB', 'knacksolutions')
    MONGO_URI = f"mongodb+srv://{MONGO_USER}:{MONGO_PASS}@{MONGO_HOST}/{MONGO_DB}?retryWrites=true&w=majority"

os.makedirs('static/images', exist_ok=True)
os.makedirs('static/logos', exist_ok=True)

import certifi

# MongoDB
client = MongoClient(MONGO_URI)
db = client.get_default_database()
products_col = db['products']
services_col = db['services']
clients_col = db['clients']
team_col = db['team']
categories_col = db['categories']
service_categories_col = db['service_categories']

# IMAP connection cache — per-thread
_imap_local = threading.local()

def get_imap(user_email, app_password):
    key = user_email.replace('@', '_').replace('.', '_')
    conn = getattr(_imap_local, key, None)
    try:
        if conn:
            conn.noop()
            return conn
    except Exception:
        pass
    mail = imaplib.IMAP4_SSL('imap.gmail.com', 993)
    mail.login(user_email, app_password)
    setattr(_imap_local, key, mail)
    return mail


def check_admin(req):
    key = req.headers.get('X-Admin-Key') or req.args.get('admin_key')
    return key == ADMIN_SECRET


# ── CATEGORIES ───────────────────────────────────────────

@app.route('/api/categories', methods=['GET'])
def get_categories():
    docs = list(categories_col.find())
    return jsonify([{'id': str(d['_id']), 'name': d.get('name', '')} for d in docs])

@app.route('/api/categories', methods=['POST'])
def add_category():
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    if categories_col.find_one({'name': name}):
        return jsonify({'error': 'Category already exists'}), 400
    categories_col.insert_one({'name': name})
    return jsonify({'message': 'Category added'}), 201

@app.route('/api/categories/<cat_id>', methods=['DELETE'])
def delete_category(cat_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    categories_col.delete_one({'_id': ObjectId(cat_id)})
    return jsonify({'message': 'Category deleted'})


# ── SERVICE CATEGORIES ────────────────────────────────────

@app.route('/api/service-categories', methods=['GET'])
def get_service_categories():
    docs = list(service_categories_col.find())
    return jsonify([{'id': str(d['_id']), 'name': d.get('name', '')} for d in docs])

@app.route('/api/service-categories', methods=['POST'])
def add_service_category():
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    if service_categories_col.find_one({'name': name}):
        return jsonify({'error': 'Service category already exists'}), 400
    service_categories_col.insert_one({'name': name})
    return jsonify({'message': 'Service category added'}), 201

@app.route('/api/service-categories/<cat_id>', methods=['DELETE'])
def delete_service_category(cat_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    service_categories_col.delete_one({'_id': ObjectId(cat_id)})
    return jsonify({'message': 'Service category deleted'})


# ── PRODUCTS ──────────────────────────────────────────────

@app.route('/api/products', methods=['GET'])
def get_products():
    docs = list(products_col.find())
    return jsonify([{
        'id': str(d['_id']),
        'name': d.get('name', ''),
        'description': d.get('description', ''),
        'image': d.get('image') or None,
        'category': d.get('category') or None
    } for d in docs])


@app.route('/api/products', methods=['POST'])
def add_product():
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    name = request.form.get('name', '').strip()
    description = request.form.get('description', '').strip()
    file = request.files.get('image')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    if not file or not file.filename:
        return jsonify({'error': 'Product image is required'}), 400
    result = cloudinary.uploader.upload(file, folder='knacksolutions/products', quality='100')
    image_url = result['secure_url']
    # Force original quality by replacing upload path with fl_keep_iptc,q_100
    image_url = image_url.replace('/upload/', '/upload/q_100/')
    image_public_id = result['public_id']
    category = request.form.get('category', '').strip()
    products_col.insert_one({'name': name, 'description': description, 'image': image_url, 'image_public_id': image_public_id, 'category': category or None})
    return jsonify({'message': 'Product added'}), 201


@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    doc = products_col.find_one({'_id': ObjectId(product_id)})
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    name = request.form.get('name', '').strip()
    description = request.form.get('description', '').strip()
    file = request.files.get('image')
    update = {}
    if name:
        update['name'] = name
    if description is not None:
        update['description'] = description
    if file and file.filename:
        if doc.get('image_public_id'):
            cloudinary.uploader.destroy(doc['image_public_id'])
        result = cloudinary.uploader.upload(file, folder='knacksolutions/products', quality='100')
        update['image'] = result['secure_url'].replace('/upload/', '/upload/q_100/')
        update['image_public_id'] = result['public_id']
    category = request.form.get('category', '').strip()
    update['category'] = category or None
    products_col.update_one({'_id': ObjectId(product_id)}, {'$set': update})
    return jsonify({'message': 'Product updated'})


def delete_product(product_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    doc = products_col.find_one({'_id': ObjectId(product_id)})
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    if doc.get('image_public_id'):
        cloudinary.uploader.destroy(doc['image_public_id'])
    products_col.delete_one({'_id': ObjectId(product_id)})
    return jsonify({'message': 'Product deleted'})


# ── SERVICES ──────────────────────────────────────────────

@app.route('/api/services', methods=['GET'])
def get_services():
    docs = list(services_col.find())
    return jsonify([{
        'id': str(d['_id']),
        'name': d.get('name', ''),
        'description': d.get('description', ''),
        'image': d.get('image') or None,
        'category': d.get('category') or None
    } for d in docs])


@app.route('/api/services', methods=['POST'])
def add_service():
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    name = request.form.get('name', '').strip()
    description = request.form.get('description', '').strip()
    file = request.files.get('image')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    image_url = None
    image_public_id = None
    if file and file.filename:
        result = cloudinary.uploader.upload(file, folder='knacksolutions/services', quality='100')
        image_url = result['secure_url'].replace('/upload/', '/upload/q_100/')
        image_public_id = result['public_id']
    category = request.form.get('category', '').strip()
    services_col.insert_one({'name': name, 'description': description, 'image': image_url, 'image_public_id': image_public_id, 'category': category or None})
    return jsonify({'message': 'Service added'}), 201


@app.route('/api/services/<service_id>', methods=['PUT'])
def update_service(service_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    doc = services_col.find_one({'_id': ObjectId(service_id)})
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    name = request.form.get('name', '').strip()
    description = request.form.get('description', '').strip()
    file = request.files.get('image')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    update = {'name': name, 'description': description}
    if file and file.filename:
        if doc.get('image_public_id'):
            cloudinary.uploader.destroy(doc['image_public_id'])
        result = cloudinary.uploader.upload(file, folder='knacksolutions/services', quality='100')
        update['image'] = result['secure_url'].replace('/upload/', '/upload/q_100/')
        update['image_public_id'] = result['public_id']
    category = request.form.get('category', '').strip()
    update['category'] = category or None
    services_col.update_one({'_id': ObjectId(service_id)}, {'$set': update})
    return jsonify({'message': 'Service updated'})


@app.route('/api/services/<service_id>', methods=['DELETE'])
def delete_service(service_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    doc = services_col.find_one({'_id': ObjectId(service_id)})
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    if doc.get('image_public_id'):
        cloudinary.uploader.destroy(doc['image_public_id'])
    services_col.delete_one({'_id': ObjectId(service_id)})
    return jsonify({'message': 'Service deleted'})


# ── CLIENTS ───────────────────────────────────────────────

@app.route('/api/clients', methods=['GET'])
def get_clients():
    docs = list(clients_col.find())
    return jsonify([{
        'id': str(d['_id']),
        'name': d.get('name', ''),
        'logo': d.get('logo') or None  # already a full Cloudinary URL
    } for d in docs])


@app.route('/api/clients', methods=['POST'])
def add_client():
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    name = request.form.get('name', '').strip()
    file = request.files.get('logo')
    if not name:
        return jsonify({'error': 'Client name is required'}), 400
    if not file or not file.filename:
        return jsonify({'error': 'Client logo is required'}), 400
    result = cloudinary.uploader.upload(file, folder='knacksolutions/logos', quality='100')
    logo_url = result['secure_url']
    logo_url = logo_url.replace('/upload/', '/upload/q_100/')
    logo_public_id = result['public_id']
    clients_col.insert_one({'name': name, 'logo': logo_url, 'logo_public_id': logo_public_id})
    return jsonify({'message': 'Client added'}), 201


@app.route('/api/clients/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    doc = clients_col.find_one({'_id': ObjectId(client_id)})
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    if doc.get('logo_public_id'):
        cloudinary.uploader.destroy(doc['logo_public_id'])
    clients_col.delete_one({'_id': ObjectId(client_id)})
    return jsonify({'message': 'Client deleted'})


# ── TEAM ──────────────────────────────────────────────────

@app.route('/api/team/login', methods=['POST'])
def team_login():
    data = request.get_json()
    email = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    member = team_col.find_one({'email': email, 'portal_password': password})
    if not member:
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'message': 'ok'}), 200


@app.route('/api/team/inbox', methods=['POST'])
def team_inbox():
    import email as email_lib
    from email.header import decode_header

    data = request.get_json()
    user_email = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()
    if not user_email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    member = team_col.find_one({'email': user_email, 'portal_password': password})
    if not member:
        return jsonify({'error': 'Invalid credentials'}), 401

    try:
        mail = get_imap(user_email, member['app_password'])
        mail.select('INBOX')

        _, message_numbers = mail.search(None, 'ALL')
        ids = message_numbers[0].split()
        if not ids:
            return jsonify([]), 200

        latest = list(reversed(ids))
        id_set = b','.join(latest)
        _, msg_data = mail.fetch(id_set, '(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])')

        emails = []
        num_index = 0
        for item in msg_data:
            if isinstance(item, tuple):
                msg = email_lib.message_from_bytes(item[1])
                subject_raw = msg.get('Subject', '')
                subject_parts = decode_header(subject_raw)
                subject = ''
                for part, enc in subject_parts:
                    if isinstance(part, bytes):
                        subject += part.decode(enc or 'utf-8', errors='replace')
                    else:
                        subject += str(part)
                emails.append({
                    'id': latest[num_index].decode(),
                    'subject': subject or '(No Subject)',
                    'sender': msg.get('From', ''),
                    'date': msg.get('Date', ''),
                    'body': '',
                    'html': None
                })
                num_index += 1

        return jsonify(emails), 200

    except imaplib.IMAP4.error as e:
        return jsonify({'error': f'IMAP error: {str(e)}'}), 401
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500


@app.route('/api/team/email/<email_id>', methods=['POST'])
def get_email_body(email_id):
    import email as email_lib

    data = request.get_json()
    user_email = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()

    member = team_col.find_one({'email': user_email, 'portal_password': password})
    if not member:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        mail = get_imap(user_email, member['app_password'])
        mail.select('INBOX')

        _, msg_data = mail.fetch(email_id.encode(), '(RFC822)')
        msg = email_lib.message_from_bytes(msg_data[0][1])

        body = ''
        html_body = ''
        if msg.is_multipart():
            for part in msg.walk():
                ct = part.get_content_type()
                if ct == 'text/html' and not part.get('Content-Disposition'):
                    html_body = part.get_payload(decode=True).decode('utf-8', errors='replace')
                elif ct == 'text/plain' and not part.get('Content-Disposition') and not body:
                    body = part.get_payload(decode=True).decode('utf-8', errors='replace')
        else:
            payload = msg.get_payload(decode=True)
            if payload:
                body = payload.decode('utf-8', errors='replace')

        return jsonify({'body': body, 'html': html_body or None}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/team/send', methods=['POST'])
def team_send():
    user_email = (request.form.get('email') or '').strip().lower()
    password = (request.form.get('password') or '').strip()
    to = (request.form.get('to') or '').strip()
    subject = (request.form.get('subject') or '').strip()
    body = (request.form.get('body') or '').strip()

    if not all([user_email, password, to, subject, body]):
        return jsonify({'error': 'All fields are required'}), 400

    member = team_col.find_one({'email': user_email, 'portal_password': password})
    if not member:
        return jsonify({'error': 'Invalid credentials'}), 401

    try:
        msg = MIMEMultipart()
        msg['From'] = user_email
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        files = request.files.getlist('attachments')
        for f in files:
            if f and f.filename:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(f.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename="{secure_filename(f.filename)}"')
                msg.attach(part)

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(user_email, member['app_password'])
            server.sendmail(user_email, to, msg.as_string())

        return jsonify({'message': 'Email sent'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/team', methods=['GET'])
def get_team():
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    docs = list(team_col.find())
    return jsonify([{'id': str(d['_id']), 'email': d['email']} for d in docs])


@app.route('/api/team', methods=['POST'])
def add_team_member():
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    email = (data.get('email') or '').strip().lower()
    portal_password = (data.get('portal_password') or '').strip()
    app_password = (data.get('app_password') or '').strip()
    if not email or not portal_password or not app_password:
        return jsonify({'error': 'All fields are required'}), 400
    if team_col.find_one({'email': email}):
        return jsonify({'error': 'Member already exists'}), 400
    team_col.insert_one({'email': email, 'portal_password': portal_password, 'app_password': app_password})
    return jsonify({'message': 'Member added'}), 201


@app.route('/api/team/<member_id>', methods=['DELETE'])
def delete_team_member(member_id):
    if not check_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    doc = team_col.find_one({'_id': ObjectId(member_id)})
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    team_col.delete_one({'_id': ObjectId(member_id)})
    return jsonify({'message': 'Member deleted'})


# ── CONTACT ───────────────────────────────────────────────

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({'error': 'All fields are required'}), 400
    if not SMTP_PASS:
        return jsonify({'error': 'Email service not configured'}), 500

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = CONTACT_TO
        msg['Reply-To'] = email
        msg['Subject'] = f"New Enquiry from {name} — Knack Solutions"
        msg.attach(MIMEText(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}", 'plain'))

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, CONTACT_TO, msg.as_string())

        return jsonify({'message': 'Email sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port, threaded=True)
