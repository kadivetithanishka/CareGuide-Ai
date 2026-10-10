import os
import json
import random
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import pymongo
from bson import ObjectId

# Load Environment Variables (.env)
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "txt", "csv", "doc", "docx"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__, static_folder=BASE_DIR, static_url_path="")
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB limit

# ==============================================================================
# MongoDB Database Connection Setup
# ==============================================================================
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/careguide_db")
DB_NAME = os.getenv("DB_NAME", "careguide_db")

mongo_client = None
db = None
mongo_mode = "Unknown"

try:
    # Try connecting to live MongoDB server
    client_candidate = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    client_candidate.server_info()  # Will trigger exception if server unreachable
    mongo_client = client_candidate
    db = mongo_client[DB_NAME]
    mongo_mode = f"Live MongoDB ({MONGO_URI.split('@')[-1] if '@' in MONGO_URI else MONGO_URI})"
    print(f"[*] Successfully connected to Live MongoDB: {mongo_mode}")
except Exception as e:
    # Fallback to embedded mongomock engine for zero-configuration resilience
    import mongomock
    mongo_client = mongomock.MongoClient()
    db = mongo_client[DB_NAME]
    mongo_mode = "Embedded MongoDB Engine (mongomock - Ready for MongoDB Atlas URI in .env)"
    print(f"[!] Live MongoDB not found on {MONGO_URI}. Running with {mongo_mode}")


# ==============================================================================
# Helpers & Initial Collections Seeding
# ==============================================================================
def serialize_doc(doc):
    """Serialize a MongoDB document into a JSON-friendly dictionary."""
    if not doc:
        return None
    d = dict(doc)
    if "_id" in d:
        d["id"] = str(d["_id"])
        d["_id"] = str(d["_id"])
    return d


def init_mongo_collections():
    """Seed initial sample documents into MongoDB collections if empty."""
    # 1. Appointments Collection
    if db.appointments.count_documents({}) == 0:
        sample_appts = [
            {
                "token": "CG-2026-10492",
                "patient_name": "Vishnu Vardhan",
                "patient_phone": "+91 98765 43210",
                "patient_email": "vishnu@careguide.ai",
                "doctor_id": "doc_1",
                "doctor_name": "Dr. Arvind Sharma",
                "specialty": "Cardiology",
                "hospital": "Apollo Heart Institute",
                "fee": "₹850",
                "appointment_date": "2026-10-12",
                "appointment_slot": "09:30 AM",
                "consult_mode": "clinic",
                "reason": "Routine cardiovascular checkup",
                "status": "Confirmed",
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            {
                "token": "CG-2026-10825",
                "patient_name": "Lakshmi Devi",
                "patient_phone": "+91 94401 23456",
                "patient_email": "lakshmi@example.com",
                "doctor_id": "doc_3",
                "doctor_name": "Dr. Suresh Reddy",
                "specialty": "Endocrinology & Diabetology",
                "hospital": "Yashoda Super Specialty Hospital",
                "fee": "₹750",
                "appointment_date": "2026-10-14",
                "appointment_slot": "11:00 AM",
                "consult_mode": "video",
                "reason": "Quarterly HbA1c review and nutritional consultation",
                "status": "Confirmed",
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        ]
        db.appointments.insert_many(sample_appts)

    # 2. Lab Reports Collection
    if db.lab_reports.count_documents({}) == 0:
        sample_report = {
            "report_id": "REP-2026-55102",
            "patient_name": "Vishnu Vardhan",
            "patient_phone": "+91 98765 43210",
            "glucose": 142.0,
            "hba1c": 7.2,
            "bp_systolic": 138.0,
            "bp_diastolic": 88.0,
            "cholesterol": 245.0,
            "hemoglobin": 13.5,
            "creatinine": 1.0,
            "overall_status": "danger",
            "conclusion_text": "Significant clinical variance identified: Critical elevation in glycemic and lipid parameters. Formal physician follow-up indicated.",
            "action_steps": [
                "Schedule a formal consultation with an endocrinologist within 48 hours.",
                "Strictly reduce dietary simple sugars and trans-fats.",
                "Maintain a daily morning fasting blood sugar log."
            ],
            "metrics": [
                {"name": "Fasting Glucose", "val": 142.0, "status": "critical", "unit": "mg/dL"},
                {"name": "HbA1c", "val": 7.2, "status": "critical", "unit": "%"},
                {"name": "Systolic BP", "val": 138.0, "status": "borderline", "unit": "mmHg"},
                {"name": "Total Cholesterol", "val": 245.0, "status": "critical", "unit": "mg/dL"}
            ],
            "file_path": None,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        db.lab_reports.insert_one(sample_report)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ==============================================================================
# Static File & Portal Serving
# ==============================================================================
@app.route("/")
def serve_index():
    """Serves the clean public patient-facing interface."""
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/admin", strict_slashes=False)
@app.route("/admin/")
def serve_admin():
    """Serves the separate developer & admin backend portal."""
    return send_from_directory(BASE_DIR, "admin.html")


@app.route("/<path:path>")
def serve_static(path):
    file_path = os.path.join(BASE_DIR, path)
    if os.path.exists(file_path):
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/uploads/<filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ==============================================================================
# System & MongoDB Analytics API
# ==============================================================================
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "CareGuide AI MongoDB Backend",
        "database": "MongoDB",
        "db_name": DB_NAME,
        "mongo_mode": mongo_mode,
        "collections": ["appointments", "lab_reports", "triage_assessments"],
        "timestamp": datetime.now().isoformat()
    })


@app.route("/api/stats", methods=["GET"])
def get_stats():
    total_appts = db.appointments.count_documents({})
    active_appts = db.appointments.count_documents({"status": "Confirmed"})
    total_reports = db.lab_reports.count_documents({})
    critical_reports = db.lab_reports.count_documents({"overall_status": "danger"})
    total_triages = db.triage_assessments.count_documents({})

    return jsonify({
        "database": "MongoDB",
        "db_name": DB_NAME,
        "mongo_mode": mongo_mode,
        "total_appointments": total_appts,
        "active_appointments": active_appts,
        "total_lab_reports": total_reports,
        "critical_reports": critical_reports,
        "total_triage_sessions": total_triages
    })


# ==============================================================================
# Appointments Collection API (MongoDB)
# ==============================================================================
@app.route("/api/appointments", methods=["GET"])
def get_appointments():
    phone = request.args.get("phone")
    status = request.args.get("status")
    limit = request.args.get("limit", 100, type=int)

    query = {}
    if phone:
        query["patient_phone"] = {"$regex": phone.strip(), "$options": "i"}
    if status:
        query["status"] = status

    cursor = db.appointments.find(query).sort("_id", -1).limit(limit)
    rows = [serialize_doc(doc) for doc in cursor]

    return jsonify({"success": True, "database": "MongoDB", "count": len(rows), "appointments": rows})


@app.route("/api/appointments", methods=["POST"])
def create_appointment():
    data = request.get_json(force=True, silent=True) or {}

    patient_name = data.get("patient_name", "").strip()
    patient_phone = data.get("patient_phone", "").strip()
    appointment_date = data.get("appointment_date", "").strip()

    if not patient_name or not patient_phone or not appointment_date:
        return jsonify({"success": False, "error": "Missing required fields: patient_name, patient_phone, appointment_date"}), 400

    token = data.get("token") or f"CG-{datetime.now().year}-{random.randint(10000, 99999)}"

    new_doc = {
        "token": token,
        "patient_name": patient_name,
        "patient_phone": patient_phone,
        "patient_email": data.get("patient_email", ""),
        "doctor_id": data.get("doctor_id", "doc_1"),
        "doctor_name": data.get("doctor_name", "Specialist Doctor"),
        "specialty": data.get("specialty", "General Medicine"),
        "hospital": data.get("hospital", "CareGuide Network Hospital"),
        "fee": data.get("fee", "₹500"),
        "appointment_date": appointment_date,
        "appointment_slot": data.get("appointment_slot", "10:00 AM"),
        "consult_mode": data.get("consult_mode", "clinic"),
        "reason": data.get("reason", ""),
        "status": data.get("status", "Confirmed"),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    result = db.appointments.insert_one(new_doc)
    created_doc = db.appointments.find_one({"_id": result.inserted_id})

    return jsonify({
        "success": True,
        "database": "MongoDB",
        "message": "Appointment document successfully saved to MongoDB appointments collection.",
        "appointment": serialize_doc(created_doc)
    }), 201


@app.route("/api/appointments/<token_or_id>", methods=["GET"])
def get_single_appointment(token_or_id):
    query = {"token": token_or_id}
    if ObjectId.is_valid(token_or_id):
        query = {"$or": [{"_id": ObjectId(token_or_id)}, {"token": token_or_id}]}

    doc = db.appointments.find_one(query)
    if not doc:
        return jsonify({"success": False, "error": "Appointment pass not found in MongoDB"}), 404

    return jsonify({"success": True, "database": "MongoDB", "appointment": serialize_doc(doc)})


@app.route("/api/appointments/<doc_id>/status", methods=["PATCH"])
def update_appointment_status(doc_id):
    data = request.get_json(force=True, silent=True) or {}
    new_status = data.get("status")
    if not new_status or new_status not in ["Confirmed", "Completed", "Cancelled"]:
        return jsonify({"success": False, "error": "Invalid status value"}), 400

    query = {"_id": ObjectId(doc_id)} if ObjectId.is_valid(doc_id) else {"token": doc_id}
    res = db.appointments.update_one(query, {"$set": {"status": new_status}})

    if res.matched_count == 0:
        return jsonify({"success": False, "error": "Appointment not found in MongoDB"}), 404

    updated = db.appointments.find_one(query)
    return jsonify({"success": True, "database": "MongoDB", "message": f"Appointment status updated to {new_status}", "appointment": serialize_doc(updated)})


@app.route("/api/appointments/<doc_id>", methods=["DELETE"])
def delete_appointment(doc_id):
    query = {"_id": ObjectId(doc_id)} if ObjectId.is_valid(doc_id) else {"token": doc_id}
    res = db.appointments.delete_one(query)
    if res.deleted_count == 0:
        return jsonify({"success": False, "error": "Appointment document not found in MongoDB"}), 404

    return jsonify({"success": True, "database": "MongoDB", "message": "Appointment deleted successfully from MongoDB"})


# ==============================================================================
# Lab Reports Collection API (MongoDB)
# ==============================================================================
@app.route("/api/reports", methods=["GET"])
def get_lab_reports():
    phone = request.args.get("phone")
    limit = request.args.get("limit", 100, type=int)

    query = {}
    if phone:
        query["patient_phone"] = {"$regex": phone.strip(), "$options": "i"}

    cursor = db.lab_reports.find(query).sort("_id", -1).limit(limit)
    reports = [serialize_doc(doc) for doc in cursor]

    return jsonify({"success": True, "database": "MongoDB", "count": len(reports), "reports": reports})


@app.route("/api/reports", methods=["POST"])
def save_lab_report():
    data = request.get_json(force=True, silent=True) or {}

    report_id = data.get("report_id") or f"REP-{datetime.now().year}-{random.randint(10000, 99999)}"

    new_report = {
        "report_id": report_id,
        "patient_name": data.get("patient_name", "").strip() or "Anonymous Patient",
        "patient_phone": data.get("patient_phone", "").strip() or "",
        "glucose": data.get("glucose"),
        "hba1c": data.get("hba1c"),
        "bp_systolic": data.get("bp_systolic"),
        "bp_diastolic": data.get("bp_diastolic"),
        "cholesterol": data.get("cholesterol"),
        "hemoglobin": data.get("hemoglobin"),
        "creatinine": data.get("creatinine"),
        "overall_status": data.get("overall_status", "optimal"),
        "conclusion_text": data.get("conclusion_text", ""),
        "action_steps": data.get("action_steps", []),
        "metrics": data.get("metrics", []),
        "file_path": data.get("file_path", None),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    res = db.lab_reports.insert_one(new_report)
    saved_doc = db.lab_reports.find_one({"_id": res.inserted_id})

    return jsonify({
        "success": True,
        "database": "MongoDB",
        "message": "Diagnostic lab analysis stored in MongoDB lab_reports collection.",
        "report": serialize_doc(saved_doc)
    }), 201


@app.route("/api/reports/upload", methods=["POST"])
def upload_lab_file():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        saved_name = f"{timestamp}_{filename}"
        dest_path = os.path.join(app.config["UPLOAD_FOLDER"], saved_name)
        file.save(dest_path)

        return jsonify({
            "success": True,
            "message": "Report file uploaded successfully",
            "filename": saved_name,
            "url": f"/uploads/{saved_name}"
        })

    return jsonify({"success": False, "error": "File type not supported"}), 400


@app.route("/api/reports/<doc_id>", methods=["DELETE"])
def delete_lab_report(doc_id):
    query = {"_id": ObjectId(doc_id)} if ObjectId.is_valid(doc_id) else {"report_id": doc_id}
    res = db.lab_reports.delete_one(query)
    if res.deleted_count == 0:
        return jsonify({"success": False, "error": "Report document not found in MongoDB"}), 404

    return jsonify({"success": True, "database": "MongoDB", "message": "Lab report document deleted from MongoDB"})


# ==============================================================================
# Triage Assessments Collection API (MongoDB)
# ==============================================================================
@app.route("/api/triage", methods=["GET"])
def get_triage_history():
    limit = request.args.get("limit", 50, type=int)
    cursor = db.triage_assessments.find({}).sort("_id", -1).limit(limit)
    rows = [serialize_doc(doc) for doc in cursor]

    return jsonify({"success": True, "database": "MongoDB", "assessments": rows})


@app.route("/api/triage", methods=["POST"])
def save_triage_assessment():
    data = request.get_json(force=True, silent=True) or {}
    assessment_id = data.get("assessment_id") or f"TRG-{datetime.now().year}-{random.randint(10000, 99999)}"

    new_triage = {
        "assessment_id": assessment_id,
        "patient_name": data.get("patient_name", "Anonymous"),
        "concern": data.get("concern", ""),
        "symptoms": data.get("symptoms", []),
        "severity": data.get("severity", 5),
        "age_group": data.get("age_group", "adult"),
        "duration": data.get("duration", "few_days"),
        "triage_level": data.get("triage_level", 3),
        "title": data.get("title", "Clinical Triage Assessment"),
        "possible_causes": data.get("possible_causes", []),
        "immediate_steps": data.get("immediate_steps", []),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    res = db.triage_assessments.insert_one(new_triage)
    saved = db.triage_assessments.find_one({"_id": res.inserted_id})

    return jsonify({
        "success": True,
        "database": "MongoDB",
        "message": "Triage session recorded in MongoDB triage_assessments collection.",
        "assessment": serialize_doc(saved)
    }), 201


@app.route("/api/triage/<doc_id>", methods=["DELETE"])
def delete_triage_assessment(doc_id):
    query = {"_id": ObjectId(doc_id)} if ObjectId.is_valid(doc_id) else {"assessment_id": doc_id}
    res = db.triage_assessments.delete_one(query)
    if res.deleted_count == 0:
        return jsonify({"success": False, "error": "Triage record not found in MongoDB"}), 404

    return jsonify({"success": True, "database": "MongoDB", "message": "Triage assessment document deleted from MongoDB"})


# ==============================================================================
# Main Entry Point
# ==============================================================================
if __name__ == "__main__":
    init_mongo_collections()
    port = int(os.getenv("PORT", 8080))
    print("==================================================================")
    print(" CareGuide AI Clinical Decision Support & Telehealth Backend")
    print(f" Database Engine: MongoDB ({DB_NAME})")
    print(f" Mode:            {mongo_mode}")
    print(f" Uploads Folder:  {UPLOAD_FOLDER}")
    print(f" Server active on: http://localhost:{port} (and http://127.0.0.1:{port})")
    print(f" Admin Portal:    http://localhost:{port}/admin")
    print("==================================================================")
    app.run(host="0.0.0.0", port=port, debug=False)
