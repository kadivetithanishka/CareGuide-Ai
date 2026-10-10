/**
 * CareGuide AI - Comprehensive Multilingual Translation Catalog (English & Telugu)
 */

const Translations = {
    en: {
        brand: "CareGuide AI",
        tagline: "Clinical Guidance & Triage System",

        // Navigation
        nav_triage: "Symptom Triage",
        nav_firstaid: "First Aid & SOS",
        nav_locator: "Find Care",
        nav_calculators: "Health Calculators",
        nav_library: "Health Library",
        nav_sos: "Emergency SOS",

        // Hero Section
        hero_badge: "Clinical Intelligence Engine • Online 24/7",
        hero_title: "Understand Your Symptoms. Take the Right Step.",
        hero_desc: "Describe what you are experiencing in plain words or your native language. Our intelligent clinical engine evaluates urgency, spots life-threatening red flags, and prepares a physician-ready report.",
        hero_sos_label: "In a Life-Threatening Emergency? Call Right Away:",
        hero_sos_108: "Ambulance (108)",
        hero_sos_112: "National Emergency (112)",
        hero_sos_911: "Int'l Dispatch (911)",
        hero_quick_tags_label: "Or quickly test common medical scenarios:",

        // Checker Section
        checker_heading: "Intelligent Symptom Assessment",
        checker_subheading: "Complete the details below for prioritized triage recommendations.",

        // Patient Context
        ctx_age_label: "Patient Age Group",
        ctx_age_infant: "Infant (< 1 yr)",
        ctx_age_child: "Child (1 - 12 yrs)",
        ctx_age_adult: "Adult (18 - 64 yrs)",
        ctx_age_senior: "Senior (65+ yrs)",

        ctx_duration_label: "Symptom Duration",
        ctx_dur_6h: "Less than 6 hours",
        ctx_dur_1d: "1 to 2 days",
        ctx_dur_3d: "3 to 7 days",
        ctx_dur_long: "More than a week",

        ctx_severity_label: "Pain / Discomfort Severity",
        ctx_sev_mild: "1-3 Mild",
        ctx_sev_mod: "4-6 Moderate",
        ctx_sev_sev: "7-8 Severe",
        ctx_sev_crit: "9-10 Critical",

        // Textarea & Voice
        input_label: "Describe your symptoms, sensation, and timeline:",
        input_placeholder: "e.g., I've had sudden pressure in my chest spreading to my left shoulder with cold sweats, or a high fever for 2 days...",
        voice_start: "Speak Symptoms (Voice Input)",
        voice_listening: "Listening... Speak your symptoms clearly",
        voice_stop: "Stop Listening",
        voice_not_supported: "Voice input is not supported in this browser. Please type.",
        char_count: "chars",

        // Chips
        quick_select_title: "Select common accompanying symptoms:",

        // Preloaded Demos
        demo_pill_label: "Test Sample Scenarios:",
        demo_btn_emergency: "🚨 Cardiac Emergency",
        demo_btn_urgent: "⚠️ High Child Fever",
        demo_btn_routine: "🟡 Lingering Cough",
        demo_btn_mild: "🟢 Mild Tension Headache",

        // Action Buttons
        btn_analyze: "Analyze Symptoms with AI Triage →",
        btn_analyzing: "Evaluating Clinical Red Flags...",
        btn_clear: "Clear All",

        // Result Cards
        res_triage_level_1: "🔴 IMMEDIATE EMERGENCY (Level 1)",
        res_triage_level_2: "🟠 URGENT MEDICAL CARE (Level 2)",
        res_triage_level_3: "🟡 ROUTINE / PRIMARY CARE (Level 3)",
        res_triage_level_4: "🟢 SELF-CARE & MONITORING (Level 4)",

        res_emergency_banner: "POTENTIAL MEDICAL EMERGENCY DETECTED. DO NOT DELAY.",
        res_emergency_alert_text: "Your described symptoms may indicate a critical medical emergency. Call local emergency dispatch or proceed to the nearest emergency department immediately.",
        res_call_emergency_now: "Call Emergency Services (108 / 112)",
        res_find_emergency_room: "Locate Nearest 24/7 Emergency Hospital",

        res_summary_title: "Clinical Intelligence Summary",
        res_possible_causes_title: "Conditions Physicians Typically Evaluate",
        res_immediate_steps_title: "Immediate Recommended Next Steps",
        res_red_flags_title: "Critical Red Flags Requiring Immediate Escalation",
        res_questions_title: "Questions to Ask Your Doctor",

        res_export_btn: "📄 Export / Print Doctor's Summary",
        res_copy_btn: "📋 Copy Clinical Report",
        res_copied_toast: "Clinical summary copied to clipboard!",

        // Clarifying Questions
        res_clarifying_title: "Interactive Follow-Up Screening Questions",
        res_clarifying_desc: "Answer these quick clinical questions to refine your triage priority in real time:",
        cq_yes: "Yes",
        cq_no: "No",

        // First Aid Section
        firstaid_heading: "Emergency First Aid Hub & Protocols",
        firstaid_subheading: "Life-saving step-by-step guidance designed for immediate bystanders during acute emergencies.",
        cpr_metronome_title: "Hands-Only CPR Rhythm Metronome (110 BPM)",
        cpr_metronome_desc: "Push hard and fast in the center of the chest to the rhythm of this beat until medical professionals arrive.",
        cpr_start_beat: "▶ Start CPR Beat (110 BPM)",
        cpr_stop_beat: "⏹ Stop Metronome",
        cpr_compression_count: "Compressions Delivered",

        // Fast Stroke Checker
        stroke_tool_title: "Interactive FAST Stroke Checker",
        stroke_tool_desc: "Check any positive signs observed in the patient:",
        stroke_f_check: "Face Drooping (Uneven smile or one side pulled down)",
        stroke_a_check: "Arm Weakness (One arm drifts downward when raised)",
        stroke_s_check: "Speech Difficulty (Slurred, garbled, or nonsensical words)",
        stroke_result_positive: "🚨 CRITICAL: Possible acute stroke detected! Call emergency services immediately. Time lost is brain lost.",
        stroke_result_negative: "No classic FAST symptoms selected. However, if neurological symptoms persist, consult a doctor.",

        // Clinic Locator Section
        locator_heading: "Find Medical Care Facilities Nearby",
        locator_subheading: "Locate verified 24/7 trauma hospitals, urgent clinics, primary physicians, and pharmacies.",
        locator_search_ph: "Search by facility name, service, or area...",
        locator_tab_all: "All Facilities",
        locator_tab_emergency: "24/7 Emergency",
        locator_tab_urgent: "Urgent Care",
        locator_tab_primary: "Family Doctor",
        locator_tab_pharmacy: "Pharmacies",
        locator_call_btn: "Call Facility",
        locator_directions_btn: "Get Directions",

        // Health Calculators Section
        calc_heading: "Interactive Health Calculators & Screeners",
        calc_subheading: "Quick evidence-based self-assessment tools for preventive health.",

        bmi_title: "BMI & Weight Category Calculator",
        bmi_height_label: "Height (cm)",
        bmi_weight_label: "Weight (kg)",
        bmi_btn: "Calculate BMI",
        bmi_result_prefix: "Your Body Mass Index:",

        water_title: "Daily Hydration Target Estimator",
        water_weight_label: "Body Weight (kg)",
        water_activity_label: "Activity Level",
        water_act_low: "Sedentary / Desk Work",
        water_act_mod: "Moderate (30m Exercise)",
        water_act_high: "Active / Heavy Workout",
        water_btn: "Calculate Water Target",
        water_result_prefix: "Recommended Daily Water Intake:",

        hr_title: "Target Heart Rate Zone Estimator",
        hr_age_label: "Age (years)",
        hr_btn: "Estimate Heart Rate Zones",
        hr_max_label: "Estimated Max Heart Rate:",
        hr_cardio_label: "Cardio Fitness Zone (70-85%):",

        // Video Call Telehealth Room
        nav_videocall: "Live Video Consult",
        video_heading: "Telehealth Live Video Consultation Room",
        video_subheading: "Connect face-to-face with verified specialist physicians from the comfort and privacy of your home.",
        video_connected_status: "🔴 Live Encrypted Video Session Active",
        video_start: "Start Video Consultation",
        video_cam_on: "📷 Camera On",
        video_cam_off: "📷 Camera Off",
        video_mic_on: "🎙️ Mic Active",
        video_mic_off: "🔇 Muted",
        video_end_call: "End Consultation",
        video_doc_status: "Dr. Sarah Rao, MD · On Call",
        video_chat_heading: "Live In-Call Clinical Chat",
        video_chat_placeholder: "Type a question or describe how you feel...",
        video_chat_send: "Send",

        // Book Doctor Appointment
        nav_appointment: "Book Appointment",
        book_heading: "Book In-Clinic & Video Appointments",
        book_subheading: "Schedule a consultation with top cardiologists, pediatricians, neurologists, and general physicians.",
        book_filter_all: "All Specialists",
        book_filter_cardio: "Cardiology",
        book_filter_pediatrics: "Pediatrics",
        book_filter_neuro: "Neurology",
        book_filter_general: "General Medicine",
        book_filter_ortho: "Orthopedics",
        book_filter_gyn: "Gynecology",
        book_select_slot: "Select Time Slot",
        book_consult_mode: "Consultation Type",
        book_mode_clinic: "🏥 In-Clinic Hospital Visit",
        book_mode_video: "💻 Online Telehealth Video Call",
        book_patient_name: "Patient Full Name",
        book_patient_phone: "Phone / WhatsApp Number",
        book_patient_reason: "Primary Health Concern / Symptoms",
        book_btn_confirm: "Confirm & Generate Appointment Pass →",
        book_pass_title: "Verified Clinical Appointment Pass",
        book_token_label: "Token #",
        book_print_pass: "🖨️ Print / Save Booking Pass",

        // Lab Report Checker & Conclusion Engine
        nav_reports: "Lab Report Checker",
        reports_heading: "Diagnostic Lab Report Analyzer & Clinical Conclusions",
        reports_subheading: "Input your diagnostic test markers to receive evidence-based range analysis, risk classifications, and actionable clinical next steps.",
        reports_sample_label: "Or quickly test sample diagnostic panels:",
        reports_btn_analyze: "Analyze Report & Generate Clinical Conclusions →",
        reports_conclusion_title: "Clinical Diagnostic Conclusion & Summary",
        reports_status_optimal: "Normal / Optimal Range",
        reports_status_borderline: "Borderline / Needs Monitoring",
        reports_status_critical: "Elevated / Requires Physician Follow-up",
        reports_action_title: "Recommended Dietary & Clinical Interventions",
        reports_export_btn: "📄 Export Lab Conclusion Brief",
        reports_save_db_btn: "💾 Save Report to Database",

        // Patient Records & Backend Hub
        nav_records: "My Records & Bookings",
        records_heading: "Clinical Database & Patient Health Records Hub",
        records_subheading: "Review, filter, and manage your booked doctor appointments, analyzed laboratory reports, and clinical triage evaluations.",
        records_save_triage_btn: "💾 Save Assessment to History",

        // Healthy Food & Nutrition Hub
        nav_nutrition: "Diet & Nutrition Tips",
        nutrition_heading: "Personalized Healthy Diet & Clinical Nutrition Plans",
        nutrition_subheading: "Evidence-based meal plans, healing superfoods, and dietary do's and don'ts tailored to your health condition.",
        nutrition_dos_title: "Foods to Eat (Healing Superfoods)",
        nutrition_donts_title: "Foods to Strictly Avoid",
        nutrition_mealplan_title: "Sample 1-Day Clinical Meal Plan",
        nutrition_meal_bf: "Breakfast",
        nutrition_meal_lunch: "Lunch",
        nutrition_meal_snack: "Evening Snack",
        nutrition_meal_dinner: "Dinner",

        // Footer
        footer_brand: "CareGuide AI Healthcare Guidance Platform",
        footer_rights: "Built for proactive health awareness & educational triage.",
        footer_feedback: "Emergency Services: India (108/112) · US (911) · UK (999) · Europe (112)"
    },

    te: {
        brand: "కేర్ గైడ్ AI",
        tagline: "వైద్య మార్గదర్శకం & ట్రయేజ్ వ్యవస్థ",

        // Navigation
        nav_triage: "లక్షణాల పరీక్ష",
        nav_firstaid: "ప్రథమ చికిత్స & SOS",
        nav_locator: "ఆసుపత్రుల శోధన",
        nav_calculators: "ఆరోగ్య కాలిక్యులేటర్లు",
        nav_library: "ఆరోగ్య కథనాలు",
        nav_sos: "అత్యవసర SOS",

        // Hero Section
        hero_badge: "క్లినికల్ ఇంటెలిజెన్స్ ఇంజిన్ • 24/7 అందుబాటులో",
        hero_title: "మీ ఆరోగ్య లక్షణాలను అర్థం చేసుకోండి. సరైన అడుగు వేయండి.",
        hero_desc: "మీరు అనుభవిస్తున్న ఆరోగ్య సమస్యలను సాధారణ మాటల్లో లేదా తెలుగులో వివరించండి. మా కృత్రిమ మేధ వ్యవస్థ ప్రమాద సంకేతాలను గుర్తించి, డాక్టర్‌కు చూపించే నివేదికను అందిస్తుంది.",
        hero_sos_label: "ప్రాణాపాయ అత్యవసర పరిస్థితుల్లో తక్షణమే కాల్ చేయండి:",
        hero_sos_108: "అంబులెన్స్ (108)",
        hero_sos_112: "జాతీయ అత్యవసర (112)",
        hero_sos_911: "అంతర్జాతీయ ఎమర్జెన్సీ (911)",
        hero_quick_tags_label: "లేదా సాధారణ కేసులను పరీక్షించండి:",

        // Checker Section
        checker_heading: "ఇంటెలిజెంట్ లక్షణాల విశ్లేషణ",
        checker_subheading: "సరైన మార్గదర్శకత్వం కోసం క్రింది వివరాలను పూరించండి.",

        // Patient Context
        ctx_age_label: "రోగి వయస్సు వర్గం",
        ctx_age_infant: "శిశువు (< 1 సం.)",
        ctx_age_child: "పిల్లలు (1 - 12 సం.)",
        ctx_age_adult: "పెద్దలు (18 - 64 సం.)",
        ctx_age_senior: "వయోవృద్ధులు (65+ సం.)",

        ctx_duration_label: "లక్షణాలు ప్రారంభమైన సమయం",
        ctx_dur_6h: "6 గంటల లోపు",
        ctx_dur_1d: "1 నుండి 2 రోజులు",
        ctx_dur_3d: "3 నుండి 7 రోజులు",
        ctx_dur_long: "వారం కంటే ఎక్కువ",

        ctx_severity_label: "నొప్పి / అసౌకర్య తీవ్రత",
        ctx_sev_mild: "1-3 స్వల్పం",
        ctx_sev_mod: "4-6 మధ్యస్థం",
        ctx_sev_sev: "7-8 తీవ్రం",
        ctx_sev_crit: "9-10 అత్యంత తీవ్రం",

        // Textarea & Voice
        input_label: "మీ లక్షణాలు మరియు అసౌకర్యాన్ని వివరించండి:",
        input_placeholder: "ఉదాహరణకు: గత 1 గంట నుండి ఛాతిలో తీవ్రమైన ఒత్తిడి, చెమటలు వస్తున్నాయి లేదా 2 రోజులుగా తీవ్రమైన జ్వరం...",
        voice_start: "మాటలతో చెప్పండి (వాయిస్ ఇన్‌పుట్)",
        voice_listening: "వింటోంది... మీ సమస్యను స్పష్టంగా చెప్పండి",
        voice_stop: "వాయిస్ ఆపండి",
        voice_not_supported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.",
        char_count: "అక్షరాలు",

        // Chips
        quick_select_title: "సహాయక లక్షణాలను ఎంచుకోండి:",

        // Preloaded Demos
        demo_pill_label: "నమూనా కేసులు పరీక్షించండి:",
        demo_btn_emergency: "🚨 గుండె నొప్పి అత్యవసరం",
        demo_btn_urgent: "⚠️ పిల్లల తీవ్ర జ్వరం",
        demo_btn_routine: "🟡 సాధారణ దగ్గు",
        demo_btn_mild: "🟢 తేలికపాటి తలనొప్పి",

        // Action Buttons
        btn_analyze: "AI తో లక్షణాలను విశ్లేషించండి →",
        btn_analyzing: "లక్షణాలను పరిశీలిస్తోంది...",
        btn_clear: "అన్నీ తొలగించండి",

        // Result Cards
        res_triage_level_1: "🔴 అత్యవసర చికిత్స అవసరం (స్థాయి 1)",
        res_triage_level_2: "🟠 తక్షణ వైద్య సహాయం (స్థాయి 2)",
        res_triage_level_3: "🟡 సాధారణ వైద్య సంప్రదింపు (స్థాయి 3)",
        res_triage_level_4: "🟢 గృహ సంరక్షణ & పర్యవేక్షణ (స్థాయి 4)",

        res_emergency_banner: "వైద్య అత్యవసర పరిస్థితి గుర్తించబడింది. ఆలస్యం చేయకండి.",
        res_emergency_alert_text: "మీరు వివరించిన లక్షణాలు తీవ్రమైన వైద్య అత్యవసర పరిస్థితిని సూచించవచ్చు. వెంటనే సమీపంలోని ఎమర్జెన్సీ ఆసుపత్రికి వెళ్లండి లేదా 108 కు కాల్ చేయండి.",
        res_call_emergency_now: "అత్యవసర సేవలకు కాల్ చేయండి (108 / 112)",
        res_find_emergency_room: "సమీప అత్యవసర ఆసుపత్రిని కనుగొనండి",

        res_summary_title: "క్లినికల్ విశ్లేషణ సారాంశం",
        res_possible_causes_title: "వైద్యులు పరిశీలించే సాధారణ అవకాశాలు",
        res_immediate_steps_title: "మీరు వెంటనే చేయవలసిన పనులు",
        res_red_flags_title: "వెంటనే ఆసుపత్రికి వెళ్లవలసిన తీవ్ర సంకేతాలు",
        res_questions_title: "డాక్టర్‌ను అడగవలసిన ప్రశ్నలు",

        res_export_btn: "📄 వైద్య నివేదికను డౌన్‌లోడ్ / ప్రింట్ చేయండి",
        res_copy_btn: "📋 నివేదికను కాపీ చేయండి",
        res_copied_toast: "వైద్య నివేదిక క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!",

        // Clarifying Questions
        res_clarifying_title: "అదనపు తనిఖీ ప్రశ్నలు",
        res_clarifying_desc: "మీ పరిస్థితిని మరింత కచ్చితంగా అంచనా వేయడానికి ఈ ప్రశ్నలకు సమాధానమివ్వండి:",
        cq_yes: "అవును",
        cq_no: "కాదు",

        // First Aid Section
        firstaid_heading: "అత్యవసర ప్రథమ చికిత్స కేంద్రం",
        firstaid_subheading: "ఆపద సమయంలో ప్రాణాలను కాపాడే కీలకమైన దశలవారీ మార్గదర్శకాలు.",
        cpr_metronome_title: "చేతులతో CPR రిథమ్ మెట్రోనోమ్ (110 BPM)",
        cpr_metronome_desc: "ఆసుపత్రి సహాయం అందే వరకు ఈ శబ్దం లయకు అనుగుణంగా బాధితుడి ఛాతి మధ్యలో వేగంగా నొక్కండి.",
        cpr_start_beat: "▶ CPR బీట్ ప్రారంభించండి (110 BPM)",
        cpr_stop_beat: "⏹ బీట్ ఆపండి",
        cpr_compression_count: "చేసిన కంప్రెషన్ల సంఖ్య",

        // Fast Stroke Checker
        stroke_tool_title: "FAST పక్షవాతం నిర్ధారణ టూల్",
        stroke_tool_desc: "బాధితుడిలో కనిపించే లక్షణాలను ఎంచుకోండి:",
        stroke_f_check: "Face (ముఖం ఒకవైపు వాలిపోవడం)",
        stroke_a_check: "Arm (ఒక చేయి కిందకు జారిపోవడం)",
        stroke_s_check: "Speech (మాట తడబడటం లేదా అర్థం కాకపోవడం)",
        stroke_result_positive: "🚨 అత్యవసరం: పక్షవాతం సంకేతాలు ఉండవచ్చు! వెంటనే 108 కు కాల్ చేయండి. కాలయాపన చేయకండి.",
        stroke_result_negative: "ప్రాథమిక పక్షవాత లక్షణాలు గుర్తించబడలేదు. అయినప్పటికీ ఇబ్బంది ఉంటే వైద్యుడిని సంప్రదించండి.",

        // Clinic Locator Section
        locator_heading: "సమీప వైద్య కేంద్రాల వివరాలు",
        locator_subheading: "ధృవీకరించబడిన 24/7 ఎమర్జెన్సీ ఆసుపత్రులు, క్లినిక్‌లు మరియు ఫార్మసీలు.",
        locator_search_ph: "పేరు, విభాగం లేదా ప్రాంతం ద్వారా శోధించండి...",
        locator_tab_all: "అన్ని కేంద్రాలు",
        locator_tab_emergency: "24/7 ఎమర్జెన్సీ",
        locator_tab_urgent: "అర్జెంట్ కేర్",
        locator_tab_primary: "కుటుంబ వైద్యుడు",
        locator_tab_pharmacy: "మందుల దుకాణాలు",
        locator_call_btn: "కాల్ చేయండి",
        locator_directions_btn: "దారిని చూపించండి",

        // Health Calculators Section
        calc_heading: "ఆరోగ్య కాలిక్యులేటర్లు & స్క్రీనర్లు",
        calc_subheading: "మీ దైనందిన ఆరోగ్య నిర్వహణకు ఉపయోగపడే సులభమైన ఉపకరణాలు.",

        bmi_title: "BMI & బరువు అంచనా కాలిక్యులేటర్",
        bmi_height_label: "ఎత్తు (సెం.మీ.)",
        bmi_weight_label: "బరువు (కేజీలు)",
        bmi_btn: "BMI లెక్కించండి",
        bmi_result_prefix: "మీ బాడీ మాస్ ఇండెక్స్:",

        water_title: "రోజువారీ నీటి అవసరాల కాలిక్యులేటర్",
        water_weight_label: "శరీర బరువు (కేజీలు)",
        water_activity_label: "శారీరక శ్రమ స్థాయి",
        water_act_low: "తక్కువ శ్రమ (డెస్క్ వర్క్)",
        water_act_mod: "మధ్యస్థం (30 నిమి. వ్యాయామం)",
        water_act_high: "ఎక్కువ శ్రమ (కష్టమైన వ్యాయామం)",
        water_btn: "నీటి పరిమాణాన్ని లెక్కించండి",
        water_result_prefix: "మీరు రోజుకు తాగవలసిన నీరు:",

        hr_title: "టార్గెట్ హార్ట్ రేట్ జోన్ కాలిక్యులేటర్",
        hr_age_label: "వయస్సు (సంవత్సరాలు)",
        hr_btn: "గుండె వేగం జోన్లను అంచనా వేయండి",
        hr_max_label: "గరిష్ట గుండె వేగం:",
        hr_cardio_label: "కార్డియో ఫిట్‌నెస్ జోన్ (70-85%):",

        // Video Call Telehealth Room
        nav_videocall: "వీడియో కన్సల్టేషన్",
        video_heading: "టెలిహెల్త్ లైవ్ వీడియో కన్సల్టేషన్ గది",
        video_subheading: "ఇంటి నుంచే ధృవీకరించబడిన ప్రముఖ వైద్యులతో ముఖాముఖి వీడియో ద్వారా సంప్రదించండి.",
        video_connected_status: "🔴 లైవ్ ఎన్‌క్రిప్టెడ్ వీడియో సెషన్ ప్రారంభమైంది",
        video_start: "వీడియో కన్సల్టేషన్ ప్రారంభించండి",
        video_cam_on: "📷 కెమెరా ఆన్",
        video_cam_off: "📷 కెమెరా ఆఫ్",
        video_mic_on: "🎙️ మైక్ ఆన్",
        video_mic_off: "🔇 మ్యూట్",
        video_end_call: "కాల్ ముగించండి",
        video_doc_status: "డాక్టర్ సారా రావు, MD · అందుబాటులో ఉన్నారు",
        video_chat_heading: "కాల్‌లో లైవ్ క్లినికల్ చాట్",
        video_chat_placeholder: "మీ ప్రశ్నను లేదా సమస్యను ఇక్కడ టైప్ చేయండి...",
        video_chat_send: "పంపండి",

        // Book Doctor Appointment
        nav_appointment: "అపాయింట్‌మెంట్ బుకింగ్",
        book_heading: "క్లినిక్ & వీడియో అపాయింట్‌మెంట్ బుకింగ్",
        book_subheading: "కార్డియాలజిస్ట్, పీడియాట్రిషియన్, న్యూరాలజిస్ట్ మరియు జనరల్ వైద్యులతో సులభంగా అపాయింట్‌మెంట్ పొందండి.",
        book_filter_all: "అన్ని విభాగాలు",
        book_filter_cardio: "కార్డియాలజీ (గుండె)",
        book_filter_pediatrics: "పీడియాట్రిక్స్ (పిల్లలు)",
        book_filter_neuro: "న్యూరాలజీ (మెదడు)",
        book_filter_general: "జనరల్ మెడిసిన్",
        book_filter_ortho: "ఆర్థోపెడిక్స్ (ఎముకలు)",
        book_filter_gyn: "గైనకాలజీ (మహిళలు)",
        book_select_slot: "సమయాన్ని ఎంచుకోండి",
        book_consult_mode: "కన్సల్టేషన్ విధానం",
        book_mode_clinic: "🏥 ఆసుపత్రికి ప్రత్యక్ష సందర్శన",
        book_mode_video: "💻 ఆన్‌లైన్ టెలిహెల్త్ వీడియో కాల్",
        book_patient_name: "రోగి పూర్తి పేరు",
        book_patient_phone: "ఫోన్ / వాట్సాప్ నంబర్",
        book_patient_reason: "ఆరోగ్య సమస్య / లక్షణాలు",
        book_btn_confirm: "ధృవీకరించి అపాయింట్‌మెంట్ పాస్ పొందండి →",
        book_pass_title: "ధృవీకరించబడిన క్లినికల్ అపాయింట్‌మెంట్ పాస్",
        book_token_label: "టోకెన్ నంబర్ #",
        book_print_pass: "🖨️ బుకింగ్ పాస్ ప్రింట్ / సేవ్ చేయండి",

        // Lab Report Checker & Conclusion Engine
        nav_reports: "ల్యాబ్ రిపోర్ట్ చెకర్",
        reports_heading: "డయాగ్నస్టిక్ ల్యాబ్ రిపోర్ట్ ఎనలైజర్ & వైద్య ముగింపు",
        reports_subheading: "మీ రక్త పరీక్షలు, బీపీ మరియు ల్యాబ్ విలువల ఆధారంగా నివేదికలను విశ్లేషించి సరైన ముగింపును మరియు సూచనలను పొందండి.",
        reports_sample_label: "లేదా నమూనా ల్యాబ్ నివేదికలను పరీక్షించండి:",
        reports_btn_analyze: "రిపోర్టును విశ్లేషించి ముగింపు ఇవ్వండి →",
        reports_conclusion_title: "క్లినికల్ విశ్లేషణ ముగింపు & సారాంశం",
        reports_status_optimal: "సాధారణ / ఆరోగ్యకరమైన పరిమితి",
        reports_status_borderline: "సరిహద్దులో ఉంది / పర్యవేక్షణ అవసరం",
        reports_status_critical: "ఎక్కువగా ఉంది / వైద్యుడి సంప్రదింపు తక్షణం అవసరం",
        reports_action_title: "సిఫార్సు చేయబడిన ఆహార & చికిత్సా మార్గదర్శకాలు",
        reports_export_btn: "📄 ల్యాబ్ ముగింపు నివేదికను ఎక్స్‌పోర్ట్ చేయండి",
        reports_save_db_btn: "💾 రిపోర్టును డేటాబేస్‌లో భద్రపరచండి",

        // Patient Records & Backend Hub
        nav_records: "నా రికార్డులు & బుకింగ్స్",
        records_heading: "క్లినికల్ డేటాబేస్ & పేషెంట్ హెల్త్ రికార్డుల హబ్",
        records_subheading: "మీ స్థానిక డేటాబేస్‌లో సేవ్ చేయబడిన డాక్టర్ అపాయింట్‌మెంట్లు, ల్యాబ్ రిపోర్టులు మరియు ట్రయాజ్ సెషన్లను ఇక్కడ సులభంగా నిర్వహించండి.",
        records_save_triage_btn: "💾 ట్రయాజ్ ఫలితాన్ని హిస్టరీలో భద్రపరచండి",

        // Healthy Food & Nutrition Hub
        nav_nutrition: "ఆరోగ్యకరమైన ఆహార సూచనలు",
        nutrition_heading: "ఆరోగ్య సమస్యల వారీగా వ్యక్తిగతీకరించిన ఆహార ప్రణాళికలు",
        nutrition_subheading: "మీ ఆరోగ్య పరిస్థితికి తగిన శాస్త్రీయ ఆహార ప్రణాళికలు, సూపర్ ఫుడ్స్ మరియు తినవలసిన/తినకూడని పదార్థాలు.",
        nutrition_dos_title: "తినవలసిన ఆహారాలు (సూపర్ ఫుడ్స్)",
        nutrition_donts_title: "పూర్తిగా నివారించవలసిన ఆహారాలు",
        nutrition_mealplan_title: "నమూనా 1-రోజు క్లినికల్ భోజన ప్రణాళిక",
        nutrition_meal_bf: "అల్పాహారం (టిఫిన్)",
        nutrition_meal_lunch: "మధ్యాహ్న భోజనం",
        nutrition_meal_snack: "సాయంత్రం స్నాక్స్",
        nutrition_meal_dinner: "రాత్రి భోజనం",

        // Footer
        footer_brand: "కేర్ గైడ్ AI హెల్త్‌కేర్ గైడెన్స్ వేదిక",
        footer_rights: "ముందస్తు ఆరోగ్య అవగాహన & ప్రాథమిక సమాచారం కోసం అభివృద్ధి చేయబడింది.",
        footer_feedback: "అత్యవసర నంబర్లు: భారతదేశం (108/112) · అమెరికా (911) · యూరప్ (112)"
    }
};

if (typeof window !== "undefined") {
    window.Translations = Translations;
}
