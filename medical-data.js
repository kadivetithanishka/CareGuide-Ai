/**
 * CareGuide AI - Medical Knowledge Base & Clinical Triage Rules
 * Contains symptom databases, triage scoring logic, first aid guides,
 * mock healthcare providers, health articles, and preloaded sample cases.
 */

const MedicalData = {
    // Curated common symptoms for quick-selection chips
    quickSymptoms: [
        { id: "chest_pain", en: "Chest Pain / Pressure", te: "ఛాతి నొప్పి / ఒత్తిడి", icon: "❤️", category: "cardio" },
        { id: "shortness_breath", en: "Shortness of Breath", te: "శ్వాస ఆడకపోవడం", icon: "🫁", category: "resp" },
        { id: "high_fever", en: "High Fever (>102°F)", te: "తీవ్రమైన జ్వరం", icon: "🌡️", category: "general" },
        { id: "severe_headache", en: "Severe Headache", te: "తీవ్రమైన తలనొప్పి", icon: "🧠", category: "neuro" },
        { id: "dizziness", en: "Dizziness / Vertigo", te: "తలతిరగడం", icon: "💫", category: "neuro" },
        { id: "abdominal_pain", en: "Abdominal Pain", te: "కడుపు నొప్పి", icon: "🤢", category: "gi" },
        { id: "cough", en: "Persistent Cough", te: "నిరంతర దగ్గు", icon: "🗣️", category: "resp" },
        { id: "sore_throat", en: "Sore Throat", te: "గొంతు నొప్పి", icon: "🧣", category: "resp" },
        { id: "vomiting", en: "Vomiting / Nausea", te: "వాంతులు / వికారం", icon: "🤮", category: "gi" },
        { id: "rash", en: "Skin Rash / Itching", te: "చర్మంపై దద్దుర్లు", icon: "🩹", category: "derma" },
        { id: "fatigue", en: "Extreme Fatigue", te: "విపరీతమైన అలసట", icon: "🔋", category: "general" },
        { id: "joint_pain", en: "Joint / Muscle Aches", te: "కీళ్ల / కండరాల నొప్పులు", icon: "🦵", category: "ortho" }
    ],

    // Emergency red flag phrases (English and Telugu)
    emergencyPhrases: [
        // English
        "chest pain", "pressure in chest", "crushing chest", "heart attack", "can't breathe",
        "cannot breathe", "difficulty breathing", "trouble breathing", "gasping for air",
        "shortness of breath", "unconscious", "passed out", "unresponsive", "not waking up",
        "severe bleeding", "coughing blood", "vomiting blood", "face drooping", "arm weakness",
        "speech slurred", "slurred speech", "stroke", "paralysis", "anaphylaxis",
        "throat swelling", "blue lips", "cyanosis", "suicidal", "want to die", "kill myself",
        "overdose", "poisoning", "seizure", "convulsions", "severe burn", "head trauma",

        // Telugu
        "ఛాతి నొప్పి", "ఛాతీలో నొప్పి", "గుండె నొప్పి", "ఊపిరి ఆడటం లేదు", "శ్వాస తీసుకోలేక",
        "శ్వాస కష్టం", "స్పృహ లేదు", "స్పృహ తప్పి", "తీవ్రమైన రక్తస్రావం", "రక్తం కారుతోంది",
        "ముఖం వంకర", "చేయి పడిపోయింది", "మాట తడబడుతోంది", "పక్షవాతం", "గొంతు వాపు",
        "ఆత్మహత్య", "విషం తాగారు", "ఫిట్స్", "మూర్ఛ", "తల తీవ్రంగా గాయపడింది"
    ],

    // Urgent care indicators (require physician attention within 12-24 hours)
    urgentPhrases: [
        // English
        "high fever", "103 fever", "104 fever", "stiff neck", "worst headache of my life",
        "severe stomach pain", "sharp abdominal pain", "appendix", "can't keep fluids down",
        "persistent vomiting", "dehydration", "deep cut", "gash", "burn with blisters",
        "broken bone", "suspected fracture", "unable to walk", "eye injury", "sudden vision loss",
        "ear drainage", "urinary burning with fever", "kidney pain", "dark urine with fever",

        // Telugu
        "తీవ్రమైన జ్వరం", "మెడ పట్టేయడం", "కడుపులో విపరీతమైన నొప్పి", "నిరంతర వాంతులు",
        "డీహైడ్రేషన్", "లోతైన గాయం", "ఎముక విరిగింది", "కంటి గాయం", "చూపు మందగించడం"
    ],

    // Preloaded interactive test cases for evaluation and demonstration
    sampleCases: [
        {
            title: "🚨 Emergency: Acute Cardiac Red Flag",
            titleTe: "🚨 అత్యవసరం: తీవ్రమైన గుండె నొప్పి లక్షణాలు",
            text: "Sudden crushing chest pain radiating to left arm and jaw for the past 45 minutes, with cold sweat and shortness of breath.",
            textTe: "గత 45 నిమిషాలుగా ఎడమ చేయి మరియు దవడ వరకు వ్యాపిస్తున్న తీవ్రమైన ఛాతి నొప్పి, చల్లటి చెమట మరియు శ్వాస తీసుకోవడంలో ఇబ్బంది.",
            age: "adult",
            duration: "less_6h",
            severity: 9,
            symptoms: ["chest_pain", "shortness_breath", "dizziness"]
        },
        {
            title: "⚠️ Urgent: High Pediatric Fever & Lethargy",
            titleTe: "⚠️ తక్షణ శ్రద్ధ: చిన్నారికి తీవ్ర జ్వరం & నీరసం",
            text: "My 4-year-old child has high fever of 103.5°F for 36 hours, persistent vomiting, cannot keep fluids down, and is unusually drowsy and irritable.",
            textTe: "నా 4 ఏళ్ల బిడ్డకు 36 గంటలుగా 103.5°F తీవ్ర జ్వరం, నిరంతర వాంతులు, నీరు కూడా తాగలేకపోతున్నారు మరియు తీవ్ర నీరసంగా ఉన్నారు.",
            age: "child",
            duration: "1_2d",
            severity: 8,
            symptoms: ["high_fever", "vomiting", "fatigue"]
        },
        {
            title: "🟡 Routine: Lingering Respiratory & Cough",
            titleTe: "🟡 సాధారణ కన్సల్టేషన్: దగ్గు మరియు గొంతు నొప్పి",
            text: "I have had a dry irritating cough and mild sore throat for 5 days with low grade fever (99.5°F), mild fatigue, and nasal congestion.",
            textTe: "5 రోజులుగా పొడి దగ్గు మరియు స్వల్ప గొంతు నొప్పి, స్వల్ప జ్వరం (99.5°F), తేలికపాటి అలసట మరియు ముక్కు మూసుకుపోవడం ఉంది.",
            age: "adult",
            duration: "3_7d",
            severity: 4,
            symptoms: ["cough", "sore_throat", "fatigue"]
        },
        {
            title: "🟢 Self-Care: Mild Tension & Eye Strain",
            titleTe: "🟢 గృహ సంరక్షణ: సాధారణ అలసట & తలనొప్పి",
            text: "Mild dull headache at the back of my head after long computer screen hours today. No nausea, no fever, no vision changes.",
            textTe: "ఈరోజు కంప్యూటర్ ముందు ఎక్కువ సేపు పని చేయడం వల్ల స్వల్ప తలనొప్పి మరియు కళ్ల అలసట ఉంది. జ్వరం లేదా వాంతులు లేవు.",
            age: "adult",
            duration: "less_6h",
            severity: 2,
            symptoms: ["severe_headache"]
        }
    ],

    // Clarifying follow-up questions generated dynamically based on symptoms
    clarifyingQuestions: {
        chest_pain: [
            { id: "cq_radiate", qEn: "Does the pain radiate to your left arm, neck, jaw, or back?", qTe: "నొప్పి ఎడమ చేయి, మెడ, దవడ లేదా వెనుక భాగానికి పాకుతోందా?", isUrgent: true },
            { id: "cq_sweat", qEn: "Are you having cold sweats, nausea, or dizziness?", qTe: "చల్లటి చెమటలు, వికారం లేదా మైకం వస్తోందా?", isUrgent: true }
        ],
        shortness_breath: [
            { id: "cq_stridor", qEn: "Can you speak in full sentences without needing to gasp for breath?", qTe: "ఆపకుండా పూర్తి వాక్యం మాట్లాడగలుగుతున్నారా?", isUrgent: true },
            { id: "cq_lips", qEn: "Are your lips, fingertips, or face turning pale or bluish?", qTe: "పెదవులు లేదా వేళ్ల గోర్లు నీలిరంగులోకి మారుతున్నాయా?", isUrgent: true }
        ],
        high_fever: [
            { id: "cq_neck", qEn: "Can you touch your chin to your chest without severe neck pain or stiffness?", qTe: "మెడ నొప్పి లేకుండా మీ గడ్డాన్ని ఛాతికి ఆనించగలరా?", isUrgent: true },
            { id: "cq_fluids", qEn: "Are you able to drink water and urinate normally?", qTe: "సాధారణంగా నీరు తాగడం మరియు మూత్ర విసర్జన చేయగలరా?", isUrgent: false }
        ],
        abdominal_pain: [
            { id: "cq_rebound", qEn: "Is the pain located sharply in the lower right abdomen?", qTe: "నొప్పి పొత్తికడుపు కుడివైపు కింద భాగంలో తీవ్రంగా ఉందా?", isUrgent: true },
            { id: "cq_blood_stool", qEn: "Have you noticed any blood in vomit or stools?", qTe: "వాంతిలో లేదా మలంలో రక్తం కనిపించిందా?", isUrgent: true }
        ],
        severe_headache: [
            { id: "cq_thunderclap", qEn: "Did this headache hit abruptly with maximum intensity like a thunderclap?", qTe: "ఈ తలనొప్పి పిడుగు పడినట్లు అకస్మాత్తుగా తీవ్రస్థాయిలో ప్రారంభమైందా?", isUrgent: true },
            { id: "cq_neuro", qEn: "Are you experiencing weakness on one side of your face or body?", qTe: "ముఖం లేదా శరీరంలో ఒకవైపు బలహీనత లేదా తిమ్మిరి ఉందా?", isUrgent: true }
        ]
    },

    // First Aid emergency guides with step-by-step instructions
    firstAidGuides: [
        {
            id: "cpr",
            icon: "🫀",
            titleEn: "Adult Hands-Only CPR",
            titleTe: "చేతులతో మాత్రమే CPR ప్రక్రియ",
            summaryEn: "For an unresponsive adult who is not breathing normally. 100-120 beats per minute.",
            summaryTe: "స్పృహ లేని మరియు సాధారణంగా శ్వాస తీసుకోని వారి కోసం. నిమిషానికి 100-120 ప్రెస్సులు.",
            hasMetronome: true,
            stepsEn: [
                "1. Call Emergency Services (108 / 112 / 911) immediately or tell a bystander to call.",
                "2. Place the person on their back on a firm, flat surface.",
                "3. Place heel of one hand in the center of the chest. Interlock your other hand on top.",
                "4. Keep arms straight and position shoulders directly over your hands.",
                "5. Push hard and fast at least 2 inches (5 cm) deep at 100-120 BPM until help arrives."
            ],
            stepsTe: [
                "1. వెంటనే అత్యవసర సేవలకు (108 / 112) కాల్ చేయండి లేదా ఇతరులతో చేయించండి.",
                "2. వ్యక్తిని గట్టి, సమాంతర నేలపై వెల్లకిలా పడుకోబెట్టండి.",
                "3. ఛాతి మధ్యలో ఒక చేతి అరచేతి మడమను ఉంచండి. దానిపై మరో చేతి వేళ్లను లాక్ చేయండి.",
                "4. చేతులను నిటారుగా ఉంచి, మీ భుజాలు నేరుగా చేతులపై ఉండేలా చూడండి.",
                "5. నిమిషానికి 100-120 సార్లు, కనీసం 2 అంగుళాల లోతుకు సహాయం వచ్చే వరకు బలంగా నొక్కండి."
            ]
        },
        {
            id: "stroke_fast",
            icon: "🧠",
            titleEn: "FAST Stroke Evaluation",
            titleTe: "FAST పక్షవాతం నిర్ధారణ పరీక్ష",
            summaryEn: "Act FAST when you spot signs of a stroke. Every minute saves brain tissue.",
            summaryTe: "పక్షవాతం లక్షణాలను గుర్తించినప్పుడు వేగంగా స్పందించండి. ప్రతి నిమిషం విలువైనది.",
            hasInteractiveCheck: true,
            stepsEn: [
                "F - Face Drooping: Ask the person to smile. Does one side of the face droop?",
                "A - Arm Weakness: Ask them to raise both arms. Does one arm drift downward?",
                "S - Speech Difficulty: Ask them to repeat a simple sentence. Is speech slurred or strange?",
                "T - Time to Call 112 / 108: If you see ANY of these signs, call emergency medical help immediately."
            ],
            stepsTe: [
                "F - Face (ముఖం): నవ్వమని అడగండి. ముఖంలో ఒక వైపు వాలిపోయిందా?",
                "A - Arm (చేయి): రెండు చేతులు ఎత్తమనండి. ఒక చేయి కిందకు జారిపోతోందా?",
                "S - Speech (మాట): ఒక సాధారణ వాక్యాన్ని పలకమనండి. మాట తడబడుతోందా?",
                "T - Time (సమయం): ఈ లక్షణాల్లో ఏ ఒక్కటి ఉన్నా వెంటనే 108 / 112 కు కాల్ చేయండి."
            ]
        },
        {
            id: "choking",
            icon: "💨",
            titleEn: "Choking (Heimlich Maneuver)",
            titleTe: "గొంతులో ఆహారం అడ్డం పడినప్పుడు (హీమ్‌లిక్)",
            summaryEn: "When a person cannot breathe, cough, or speak due to a blocked airway.",
            summaryTe: "శ్వాసనాళం మూసుకుపోయి శ్వాస తీసుకోలేనప్పుడు, దగ్గలేనప్పుడు.",
            stepsEn: [
                "1. Stand behind the person and wrap your arms around their waist.",
                "2. Make a fist with one hand and place the thumb side just above their navel (belly button).",
                "3. Grasp your fist with your other hand.",
                "4. Perform quick, upward and inward abdominal thrusts.",
                "5. Repeat until the foreign object is expelled or the person becomes unresponsive (then start CPR)."
            ],
            stepsTe: [
                "1. బాధితుడి వెనుక నిలబడి వారి నడుము చుట్టూ చేతులు వేయండి.",
                "2. ఒక చేతి పిడికిలి బిగించి, బొడ్డుకు కొద్దిగా పైన బొటనవేలు వైపు ఉంచండి.",
                "3. మీ రెండో చేత్తో ఆ పిడికిలిని గట్టిగా పట్టుకోండి.",
                "4. వేగంగా పైకి మరియు లోపలికి ఒత్తిడితో కూడిన తోపులు (Thrusts) ఇవ్వండి.",
                "5. అడ్డంకి తొలగిపోయే వరకు లేదా వ్యక్తి స్పృహ కోల్పోయే వరకు పునరావృతం చేయండి."
            ]
        },
        {
            id: "bleeding",
            icon: "🩹",
            titleEn: "Severe Bleeding Control",
            titleTe: "తీవ్రమైన రక్తస్రావ నివారణ",
            summaryEn: "Immediate actions to stop life-threatening blood loss from injuries.",
            summaryTe: "గాయాల నుండి ప్రాణాంతక రక్త నష్టాన్ని అరికట్టే అత్యవసర చర్యలు.",
            stepsEn: [
                "1. Apply direct firm pressure on the wound with a clean cloth, sterile gauze, or gloved hand.",
                "2. Maintain constant pressure for at least 5-10 minutes without lifting to check.",
                "3. If bleeding continues and soaks through, add more cloth on top; DO NOT remove the original cloth.",
                "4. Keep the injured limb elevated above the heart level if safe to do so.",
                "5. If bleeding is arterial (spurting), apply a tourniquet 2-3 inches above the wound."
            ],
            stepsTe: [
                "1. శుభ్రమైన గుడ్డ లేదా గాజ్ గుడ్డతో గాయంపై నేరుగా గట్టిగా ఒత్తిడి ఉంచండి.",
                "2. చూడటానికి గుడ్డను ఎత్తకుండా కనీసం 5-10 నిమిషాలు నిరంతర ఒత్తిడిని కొనసాగించండి.",
                "3. రక్తం కారుతూ ఉంటే దానిపైనే మరిన్ని గుడ్డలు ఉంచండి; మొదటి గుడ్డను తీయకండి.",
                "4. వీలైతే గాయపడిన భాగాన్ని గుండె మట్టం కంటే ఎత్తుగా ఉంచండి.",
                "5. రక్తం చిమ్ముతుంటే గాయానికి 2-3 అంగుళాల పైన టోర్నిక్వెట్‌తో కట్టండి."
            ]
        }
    ],

    // Realistic directory of nearby healthcare facilities (supports filtering & simulated geolocation)
    facilities: [
        {
            id: 1,
            name: "Apollo Multispecialty Hospital & Emergency Trauma Centre",
            nameTe: "అపోలో మల్టీస్పెషాలిటీ హాస్పిటల్ & ఎమర్జెన్సీ ట్రామా సెంటర్",
            type: "emergency",
            typeLabel: "24/7 Emergency & Trauma",
            typeLabelTe: "24/7 అత్యవసర & ట్రామా",
            address: "Plot 14, Health City Corridor",
            distance: "1.2 km",
            rating: "4.9 ★ (1,840 reviews)",
            open: "Open 24/7",
            waitTime: "Immediate Triage (< 5 min)",
            phone: "+91 40 2360 7777",
            emergencyHotline: "1066",
            features: ["ICU Available", "Cath Lab", "Pediatric Trauma", "Ambulance Fleet"]
        },
        {
            id: 2,
            name: "City Care Urgent Medical & Walk-in Clinic",
            nameTe: "సిటీ కేర్ అర్జెంట్ మెడికల్ & వాక్-ఇన్ క్లినిక్",
            type: "urgent",
            typeLabel: "Urgent Care & Diagnostics",
            typeLabelTe: "అర్జెంట్ కేర్ & డయాగ్నోస్టిక్స్",
            address: "Main Road, Sector 4",
            distance: "2.4 km",
            rating: "4.7 ★ (620 reviews)",
            open: "Open Today · 7:00 AM - 11:00 PM",
            waitTime: "Est. Wait: 15-20 min",
            phone: "+91 40 4455 8899",
            features: ["On-site X-Ray", "Stitches & Splints", "Rapid Blood Tests", "Pharmacy Attached"]
        },
        {
            id: 3,
            name: "LifeLine 24-Hour Government General Hospital",
            nameTe: "లైఫ్‌లైన్ 24-గంటల ప్రభుత్వ సర్వజన ఆసుపత్రి",
            type: "emergency",
            typeLabel: "Government Tertiary Center",
            typeLabelTe: "ప్రభుత్వ సర్వజన ఆసుపత్రి",
            address: "Civic Center Boulevard",
            distance: "3.8 km",
            rating: "4.5 ★ (3,100 reviews)",
            open: "Open 24/7 · Free Emergency Care",
            waitTime: "Triage Priority Based",
            phone: "+91 40 2460 0121",
            emergencyHotline: "108",
            features: ["Free Emergency Care", "Blood Bank", "Trauma Ward", "Neonatal ICU"]
        },
        {
            id: 4,
            name: "Dr. Rao's Family Health & Pediatrics Clinic",
            nameTe: "డాక్టర్ రావుస్ ఫ్యామిలీ హెల్త్ & పీడియాట్రిక్స్ క్లినిక్",
            type: "primary",
            typeLabel: "Family Physician & Pediatrics",
            typeLabelTe: "కుటుంబ వైద్యుడు & పిల్లల క్లినిక్",
            address: "Greenwood Avenue, Block B",
            distance: "0.9 km",
            rating: "4.8 ★ (410 reviews)",
            open: "Open Today · 9:00 AM - 8:00 PM",
            waitTime: "By Appointment & Walk-in",
            phone: "+91 40 2712 3344",
            features: ["General Health", "Vaccinations", "Pediatric Care", "Chronic Disease"]
        },
        {
            id: 5,
            name: "MedPlus 24x7 Super Pharmacy & Lab Collection",
            nameTe: "మెడ్‌ప్లస్ 24x7 సూపర్ ఫార్మసీ & ల్యాబ్",
            type: "pharmacy",
            typeLabel: "24/7 Pharmacy & First Aid Supplies",
            typeLabelTe: "24/7 మందుల దుకాణం",
            address: "Crossroads Junction",
            distance: "0.6 km",
            rating: "4.6 ★ (890 reviews)",
            open: "Open 24 Hours",
            waitTime: "No Wait",
            phone: "+91 40 6700 6700",
            features: ["Home Delivery", "Prescription Refills", "First Aid Kits", "BP & Sugar Check"]
        }
    ],

    // Curated health educational articles
    articles: [
        {
            id: "heart_signs",
            category: "Cardiology",
            categoryTe: "కార్డియాలజీ",
            readTime: "4 min read",
            titleEn: "Silent Heart Attacks: Warning Signs You Shouldn't Ignore",
            titleTe: "సైలెంట్ హార్ట్ ఎటాక్: విస్మరించకూడని ప్రమాద సంకేతాలు",
            summaryEn: "Not all heart events strike like a dramatic lightning bolt. Learn how fatigue, jaw tightness, and indigestion can signal myocardial ischemia.",
            summaryTe: "గుండెపోటులన్నీ ఒక్కసారిగా తీవ్ర నొప్పితో రావు. అలసట, దవడ నొప్పి, అజీర్ణం కూడా గుండెపోటు సంకేతాలు కావచ్చు.",
            bodyEn: `A silent heart attack (silent myocardial infarction) accounts for almost 45% of all heart attacks. 
            Unlike typical heart attacks with crushing chest agony, silent attacks may manifest as:
            • Unexplained extreme fatigue or breathlessness while doing minimal activity
            • Mild ache or discomfort radiating to the neck, jaw, shoulders, or back
            • Sensation resembling heavy heartburn or acid reflux that does not respond to antacids
            • Cold, clammy sweats paired with sudden lightheadedness
            
            Risk Factors: Diabetics, elderly individuals, and women are particularly susceptible to atypical presentations. If in doubt, immediate medical evaluation is critical.`
        },
        {
            id: "fever_management",
            category: "Pediatrics & Family",
            categoryTe: "పీడియాట్రిక్స్ & కుటుంబ ఆరోగ్యం",
            readTime: "5 min read",
            titleEn: "Managing Childhood Fevers: When to Monitor and When to Visit the ER",
            titleTe: "పిల్లల్లో జ్వరం నిర్వహణ: ఎప్పుడు పర్యవేక్షించాలి, ఎప్పుడు అత్యవసర విభాగం వెళ్ళాలి?",
            summaryEn: "A guide for parents on safe temperature management, hydration protocols, and warning signs of febrile complications.",
            summaryTe: "తల్లిదండ్రుల కోసం సురక్షితమైన ఉష్ణోగ్రత నియంత్రణ, డీహైడ్రేషన్ నివారణ మరియు ప్రమాద సంకేతాలు.",
            bodyEn: `Fever is the immune system's natural and healthy response against infections.
            When home care is usually sufficient:
            • Child stays active, drinks fluids, and makes eye contact
            • Temperature decreases with pediatric paracetamol/ibuprofen (as prescribed by your pediatrician)
            
            When to seek immediate emergency medical care:
            • Any infant under 3 months with a rectal temperature of 100.4°F (38°C) or higher
            • Stiff neck, inability to bend neck forward, or purple/dark rash that doesn't fade under pressure
            • Extreme lethargy, refusal to drink fluids, or breathing faster than normal with chest indrawing.`
        },
        {
            id: "stroke_guide",
            category: "Neurology",
            categoryTe: "న్యూరాలజీ",
            readTime: "3 min read",
            titleEn: "The Golden Hour: Why Rapid Response in Acute Stroke is Vital",
            titleTe: "గోల్డెన్ అవర్: పక్షవాతంలో తక్షణ స్పందన ఎందుకు కీలకమైనది?",
            summaryEn: "Every single minute during an ischemic stroke, roughly 1.9 million brain cells are lost. Understand the critical 3-hour window.",
            summaryTe: "ఇస్కీమిక్ స్ట్రోక్ సమయంలో ప్రతి నిమిషానికి దాదాపు 19 లక్షల మెదడు కణాలు నశిస్తాయి. 3 గంటల సమయ ప్రాధాన్యతను తెలుసుకోండి.",
            bodyEn: `A stroke occurs when blood supply to part of your brain is interrupted or reduced, depriving brain tissue of oxygen and nutrients.
            Key treatments like intravenous thrombolysis (clot-busting medication) can only be administered within the initial 3 to 4.5 hours from symptom onset.
            
            Remember the FAST acronym: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Never allow a suspected stroke patient to sleep it off.`
        }
    ],

    // Available Specialist Doctors for Appointment Booking & Telehealth Video Calls
    doctors: [
        {
            id: "doc_1",
            name: "Dr. Arvind Sharma",
            nameTe: "డాక్టర్ అరవింద్ శర్మ",
            specialty: "cardiology",
            specialtyTitle: "Senior Interventional Cardiologist",
            specialtyTitleTe: "సీనియర్ కార్డియాలజిస్ట్ (గుండె నిపుణులు)",
            qualifications: "MD (Medicine), DM (Cardiology), FACC",
            experience: "18+ years experience",
            experienceTe: "18+ సంవత్సరాల అనుభవం",
            rating: "4.9 ★ (1,420 consults)",
            fee: "₹800 / $10",
            languages: "English, Telugu, Hindi",
            avatar: "👨‍⚕️",
            hospital: "Apollo Heart Institute",
            slots: ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM", "06:00 PM"]
        },
        {
            id: "doc_2",
            name: "Dr. Priya Reddy",
            nameTe: "డాక్టర్ ప్రియా రెడ్డి",
            specialty: "pediatrics",
            specialtyTitle: "Consultant Pediatrician & Neonatologist",
            specialtyTitleTe: "పీడియాట్రిషియన్ (పిల్లల నిపుణులు)",
            qualifications: "MBBS, MD (Pediatrics), DNB",
            experience: "12+ years experience",
            experienceTe: "12+ సంవత్సరాల అనుభవం",
            rating: "4.9 ★ (2,100 consults)",
            fee: "₹650 / $8",
            languages: "Telugu, English",
            avatar: "👩‍⚕️",
            hospital: "Rainbow Children's Medicare",
            slots: ["10:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM"]
        },
        {
            id: "doc_3",
            name: "Dr. Rohan Varma",
            nameTe: "డాక్టర్ రోహన్ వర్మ",
            specialty: "neurology",
            specialtyTitle: "Chief Neurologist & Stroke Specialist",
            specialtyTitleTe: "న్యూరాలజిస్ట్ (నాడీ & మెదడు నిపుణులు)",
            qualifications: "MD, DM (Neurology), Stroke Fellowship",
            experience: "15+ years experience",
            experienceTe: "15+ సంవత్సరాల అనుభవం",
            rating: "4.8 ★ (980 consults)",
            fee: "₹900 / $12",
            languages: "English, Telugu, Hindi",
            avatar: "👨‍⚕️",
            hospital: "KIMS Neurosciences Center",
            slots: ["10:30 AM", "12:00 PM", "03:00 PM", "05:30 PM"]
        },
        {
            id: "doc_4",
            name: "Dr. Ananya Sen",
            nameTe: "డాక్టర్ అనన్య సేన్",
            specialty: "general",
            specialtyTitle: "General Physician & Diabetologist",
            specialtyTitleTe: "జనరల్ ఫిజీషియన్ & మధుమేహ నిపుణులు",
            qualifications: "MBBS, MD (General Medicine)",
            experience: "10+ years experience",
            experienceTe: "10+ సంవత్సరాల అనుభవం",
            rating: "4.8 ★ (3,400 consults)",
            fee: "₹500 / $6",
            languages: "English, Hindi, Bengali",
            avatar: "👩‍⚕️",
            hospital: "Care Family Health Center",
            slots: ["09:00 AM", "10:30 AM", "01:30 PM", "04:00 PM", "06:30 PM"]
        },
        {
            id: "doc_5",
            name: "Dr. Rajesh Kumar",
            nameTe: "డాక్టర్ రాజేష్ కుమార్",
            specialty: "orthopedics",
            specialtyTitle: "Orthopedic & Joint Surgeon",
            specialtyTitleTe: "ఆర్థోపెడిక్ సర్జన్ (కీళ్ళు & ఎముకల నిపుణులు)",
            qualifications: "MS (Ortho), MCh, Arthroscopy Specialist",
            experience: "16+ years experience",
            experienceTe: "16+ సంవత్సరాల అనుభవం",
            rating: "4.8 ★ (1,150 consults)",
            fee: "₹750 / $9",
            languages: "Telugu, English",
            avatar: "👨‍⚕️",
            hospital: "Sunshine Bone & Joint Clinic",
            slots: ["11:00 AM", "02:00 PM", "04:30 PM", "07:00 PM"]
        },
        {
            id: "doc_6",
            name: "Dr. Meera Nambiar",
            nameTe: "డాక్టర్ మీరా నంబియార్",
            specialty: "gynecology",
            specialtyTitle: "Consultant Obstetrician & Gynecologist",
            specialtyTitleTe: "గైనకాలజిస్ట్ (మహిళా ఆరోగ్య నిపుణులు)",
            qualifications: "MBBS, MS (OBG), FMAS",
            experience: "14+ years experience",
            experienceTe: "14+ సంవత్సరాల అనుభవం",
            rating: "4.9 ★ (2,800 consults)",
            fee: "₹700 / $9",
            languages: "English, Telugu, Malayalam",
            avatar: "👩‍⚕️",
            hospital: "Fernandez Maternity Hospital",
            slots: ["10:00 AM", "12:30 PM", "03:00 PM", "05:00 PM"]
        }
    ],

    // Clinical Diagnostic Reference Ranges & Conclusion Engine Config
    labTestsConfig: {
        tests: [
            {
                id: "glucose",
                name: "Fasting Blood Glucose",
                nameTe: "ఫాస్టింగ్ బ్లడ్ షుగర్ (FBS)",
                unit: "mg/dL",
                normalMin: 70,
                normalMax: 99,
                prediabeticMax: 125,
                dangerThreshold: 180,
                category: "metabolic"
            },
            {
                id: "hba1c",
                name: "Glycated Hemoglobin (HbA1c)",
                nameTe: "గ్లైకేటెడ్ హిమోగ్లోబిన్ (HbA1c)",
                unit: "%",
                normalMin: 4.0,
                normalMax: 5.6,
                prediabeticMax: 6.4,
                dangerThreshold: 8.5,
                category: "metabolic"
            },
            {
                id: "bp_systolic",
                name: "Blood Pressure (Systolic)",
                nameTe: "రక్తపోటు - సిస్టోలిక్ (BP)",
                unit: "mmHg",
                normalMin: 90,
                normalMax: 120,
                prediabeticMax: 139,
                dangerThreshold: 160,
                category: "cardio"
            },
            {
                id: "bp_diastolic",
                name: "Blood Pressure (Diastolic)",
                nameTe: "రక్తపోటు - డయాస్టోలిక్",
                unit: "mmHg",
                normalMin: 60,
                normalMax: 80,
                prediabeticMax: 89,
                dangerThreshold: 100,
                category: "cardio"
            },
            {
                id: "cholesterol",
                name: "Total Cholesterol",
                nameTe: "టోటల్ కొలెస్ట్రాల్",
                unit: "mg/dL",
                normalMin: 125,
                normalMax: 199,
                prediabeticMax: 239,
                dangerThreshold: 260,
                category: "lipid"
            },
            {
                id: "hemoglobin",
                name: "Hemoglobin (Hb)",
                nameTe: "హిమోగ్లోబిన్ (Hb)",
                unit: "g/dL",
                normalMin: 12.0,
                normalMax: 16.5,
                dangerLow: 9.0,
                category: "cbc"
            },
            {
                id: "creatinine",
                name: "Serum Creatinine",
                nameTe: "సీరం క్రియాటినిన్ (కిడ్నీ ఫంక్షన్)",
                unit: "mg/dL",
                normalMin: 0.6,
                normalMax: 1.2,
                dangerThreshold: 2.0,
                category: "renal"
            }
        ],
        sampleReports: [
            {
                title: "🩸 Sample 1: Diabetic & High Cholesterol Profile",
                titleTe: "🩸 నమూనా 1: మధుమేహం & అధిక కొలెస్ట్రాల్ నివేదిక",
                values: {
                    glucose: 148,
                    hba1c: 7.4,
                    bp_systolic: 138,
                    bp_diastolic: 88,
                    cholesterol: 245,
                    hemoglobin: 13.5,
                    creatinine: 1.0
                }
            },
            {
                title: "📉 Sample 2: Iron Deficiency Anemia & Fatigue",
                titleTe: "📉 నమూనా 2: రక్తహీనత (అనీమియా) నివేదిక",
                values: {
                    glucose: 88,
                    hba1c: 5.2,
                    bp_systolic: 108,
                    bp_diastolic: 72,
                    cholesterol: 170,
                    hemoglobin: 9.4,
                    creatinine: 0.8
                }
            },
            {
                title: "✅ Sample 3: Optimal Routine Master Health Check",
                titleTe: "✅ నమూనా 3: సాధారణ ఆరోగ్యకరమైన మాస్టర్ చెకప్",
                values: {
                    glucose: 85,
                    hba1c: 5.1,
                    bp_systolic: 118,
                    bp_diastolic: 76,
                    cholesterol: 165,
                    hemoglobin: 14.2,
                    creatinine: 0.9
                }
            }
        ]
    },

    // Comprehensive Healthy Food, Nutrition & Diet Plans by Condition
    healthyFoodTips: {
        conditions: [
            {
                id: "heart",
                icon: "🫀",
                nameEn: "Heart Health & Cardio Fitness",
                nameTe: "గుండె ఆరోగ్యం & కొలెస్ట్రాల్ నియంత్రణ",
                taglineEn: "Mediterranean & Low-Saturated Fat Protocols",
                taglineTe: "కొవ్వు తక్కువగా ఉండే మెడిటరేనియన్ ఆహార ప్రణాళిక",
                dosEn: [
                    "Consume Omega-3 rich foods (walnuts, chia seeds, flaxseeds, salmon)",
                    "Eat soluble fiber daily (rolled oats, barley, beans, lentils)",
                    "Cook with extra virgin cold-pressed olive oil or mustard oil in moderation",
                    "Add colorful antioxidant berries, pomegranate, and leafy spinach"
                ],
                dosTe: [
                    "ఒమేగా-3 సమృద్ధిగా ఉండే వాల్‌నట్స్, చియా గింజలు, అవిసె గింజలు తినండి",
                    "రోజూ కరిగే పీచు పదార్థాలు (ఓట్స్, కాయధాన్యాలు, బీన్స్) తీసుకోండి",
                    "పరిమిత మోతాదులో ఆలివ్ నూనె లేదా ఆవనూనెతో వంట చేయండి",
                    "యాంటీఆక్సిడెంట్లు ఉండే దానిమ్మ, బెర్రీలు, తోటకూర తీసుకోండి"
                ],
                dontsEn: [
                    "Avoid deep-fried fast foods and hydrogenated trans fats (vanaspati)",
                    "Eliminate processed meats (sausages, bacon, salami)",
                    "Strictly cap dietary sodium below 1,500 - 2,000 mg per day",
                    "Avoid commercial pastries, margarine, and palm oil"
                ],
                dontsTe: [
                    "నూనెలో వేయించిన ఫాస్ట్ ఫుడ్స్, వనస్పతి వాడకాన్ని పూర్తిగా మానేయండి",
                    "ప్రాసెస్ చేసిన మాంసాలు తీసుకోకండి",
                    "ఉప్పు వాడకాన్ని రోజుకు 1 చెంచా (5 గ్రాములు) కంటే తక్కువకు పరిమితం చేయండి",
                    "పామాయిల్ మరియు బేకరీ పిండివంటలను నివారించండి"
                ],
                mealPlan: {
                    breakfast: "Warm rolled oats topped with chopped walnuts, chia seeds, and half sliced apple.",
                    breakfastTe: "వాల్‌నట్స్, చియా విత్తనాలు మరియు ఆపిల్ ముక్కలతో తయారుచేసిన ఓట్స్ గంజి.",
                    lunch: "Brown rice / quinoa with mixed vegetable curry, spinach dal (palak pappu), and cucumber salad.",
                    lunchTe: "బ్రౌన్ రైస్ లేదా కొర్రలు, పాలకూర పప్పు, కూరగాయల కూర మరియు కీరా సలాడ్.",
                    snack: "Roasted unsalted makhana (fox nuts) with green tea.",
                    snackTe: "వేయించిన తామర గింజలు (మఖానా) మరియు గ్రీన్ టీ.",
                    dinner: "Grilled tofu / steamed fish with stir-fried broccoli, bell peppers, and garlic.",
                    dinnerTe: "బ్రోకలీ, క్యాప్సికం, వెల్లుల్లితో తేలికపాటి గ్రిల్డ్ పన్నీర్ లేదా టోఫు కూర."
                }
            },
            {
                id: "diabetes",
                icon: "🩸",
                nameEn: "Diabetes & Blood Sugar Balance",
                nameTe: "మధుమేహం (షుగర్) & రక్తంలో గ్లూకోజ్ నియంత్రణ",
                taglineEn: "Low Glycemic Index (GI) & High Fiber Nutrition",
                taglineTe: "తక్కువ గ్లైసిమిక్ ఇండెక్స్ & అధిక పీచుతో కూడిన ఆహారం",
                dosEn: [
                    "Incorporate whole ancient millets (foxtail, finger millet/ragi, bajra)",
                    "Include bitter gourd (karela), fenugreek (methi seeds), and cinnamon",
                    "Prioritize high-protein plant sources (chickpeas, green moong dal, paneer)",
                    "Eat a large raw salad before every major carbohydrate meal"
                ],
                dosTe: [
                    "చిరుధాన్యాలు (కొర్రలు, రాగులు, సజ్జలు) ఆహారంలో భాగం చేసుకోండి",
                    "కాకరకాయ, మెంతులు మరియు దాల్చిన చెక్కను క్రమం తప్పకుండా వాడండి",
                    "మొలకెత్తిన పెసలు, శనగలు, పప్పుదినుసులు అధికంగా తీసుకోండి",
                    "ప్రధాన భోజనానికి ముందు తాజా పచ్చి కాయగూరల సలాడ్ తినండి"
                ],
                dontsEn: [
                    "Strictly avoid refined white sugar, soda, sweets, and sweetened juices",
                    "Minimize white polished rice, maida (refined flour), and instant noodles",
                    "Avoid high-glycemic fruits in large quantities (ripe mangoes, grapes, sapota)",
                    "Avoid skipping meals which leads to compensatory sugar spikes"
                ],
                dontsTe: [
                    "తెల్ల పంచదార, శీతల పానీయాలు, మిఠాయిలు పూర్తిగా నివారించండి",
                    "తెల్లటి పాలిష్ బియ్యం, మైదా, ఇన్‌స్టంట్ నూడుల్స్ తగ్గించండి",
                    "తీపి ఎక్కువ ఉండే మామిడి, ద్రాక్ష, సపోటా పండ్లను అతిగా తినకండి",
                    "సమయానికి భోజనం చేయడం మానవద్దు"
                ],
                mealPlan: {
                    breakfast: "Sprouted moong dal cheela (savory pancake) with mint chutney and soaked methi seeds.",
                    breakfastTe: "మొలకల పెసర అట్టు, పుదీనా చట్నీ మరియు నానబెట్టిన మెంతులు.",
                    lunch: "Foxtail millet with ridge gourd (beerakaya) dal, boiled egg or paneer, and curd.",
                    lunchTe: "కొర్రల అన్నం, బీరకాయ పప్పు, ఉడికించిన గుడ్డు లేదా పన్నీర్ మరియు పెరుగు.",
                    snack: "Handful of roasted Bengal gram (chana) with buttermilk.",
                    snackTe: "వేయించిన శనగలు మరియు మజ్జిగ.",
                    dinner: "Multi-grain roti with methi paneer curry and tomato soup.",
                    dinnerTe: "మల్టీగ్రెయిన్ రోటీ, మెంతి పన్నీర్ కూర మరియు టమోటా సూప్."
                }
            },
            {
                id: "hypertension",
                icon: "⚡",
                nameEn: "Hypertension & BP Management (DASH Diet)",
                nameTe: "రక్తపోటు (హై బీపీ) నియంత్రణ - DASH ప్రణాళిక",
                taglineEn: "Potassium, Magnesium & Low-Sodium Synergy",
                taglineTe: "పొటాషియం సమృద్ధిగా, సోడియం తక్కువగా ఉండే పోషణ",
                dosEn: [
                    "Eat potassium-rich natural foods (bananas, sweet potatoes, coconut water)",
                    "Include beetroot juice (natural dietary nitrates dilate arteries and reduce BP)",
                    "Snack on raw unsalted pumpkin seeds and almonds (magnesium rich)",
                    "Flavor your meals with lemon juice, herbs, and garlic instead of table salt"
                ],
                dosTe: [
                    "పొటాషియం సమృద్ధిగా ఉండే అరటిపండ్లు, చిలగడదుంపలు, కొబ్బరి నీరు తీసుకోండి",
                    "బీట్‌రూట్ రసం తాగండి (ఇది సహజంగా రక్తనాళాలను విడదీసి బీపీని తగ్గిస్తుంది)",
                    "ఉప్పులేని గుమ్మడికాయ గింజలు మరియు బాదం పప్పులు తినండి",
                    "ఉప్పుకు బదులుగా నిమ్మరసం, వెల్లుల్లి, కొత్తిమీరతో వంటలకు రుచిని ఇవ్వండి"
                ],
                dontsEn: [
                    "Avoid commercial pickles, papads, and canned soups with heavy sodium",
                    "Eliminate processed cheeses, salted chips, and soy sauce",
                    "Limit caffeine and energy drinks that trigger blood pressure spikes",
                    "Avoid alcohol and tobacco products completely"
                ],
                dontsTe: [
                    "నిల్వ ఊరగాయలు, అప్పడాలు, అధిక ఉప్పు ఉండే చిప్స్ నివారించండి",
                    "ప్రాసెస్ చేసిన చీజ్ మరియు సోయా సాస్ వినియోగాన్ని తగ్గించండి",
                    "రక్తపోటును పెంచే కాఫీ, ఎనర్జీ డ్రింక్స్ పరిమితం చేయండి",
                    "మద్యపానం మరియు పొగాకు ఉత్పత్తులకు దూరంగా ఉండండి"
                ],
                mealPlan: {
                    breakfast: "Banana and spinach smoothie with flaxseed powder, followed by 2 steamed idlis with tomato-onion chutney (low salt).",
                    breakfastTe: "అరటిపండు-పాలకూర స్మూతీ, మరియు ఉప్పు తక్కువగా ఉన్న ఇడ్లీలు.",
                    lunch: "Brown rice with beetroot poriyal, drumstick sambar, and fresh homemade curd.",
                    lunchTe: "బ్రౌన్ రైస్, బీట్‌రూట్ వేపుడు, మునక్కాయ సాంబార్ మరియు తాజా పెరుగు.",
                    snack: "Sliced cucumbers and carrots with hummus or lemon-mint water.",
                    snackTe: "కీరా, క్యారెట్ ముక్కలు మరియు నిమ్మకాయ నీరు.",
                    dinner: "Soft whole wheat phulkas with bottle gourd (sorakaya) curry and boiled lentils.",
                    dinnerTe: "మృదువైన గోధుమ పుల్కాలు, సొరకాయ కూర మరియు కందిపప్పు."
                }
            },
            {
                id: "immunity",
                icon: "🛡️",
                nameEn: "Immunity Boost & Infection Recovery",
                nameTe: "రోగనిరోధక శక్తి పెంపు & వ్యాధి నిరోధకత",
                taglineEn: "Vitamins C, D, Zinc & Anti-Inflammatory Superfoods",
                taglineTe: "విటమిన్ సి, డి, జింక్ మరియు సహజ యాంటీఆక్సిడెంట్లు",
                dosEn: [
                    "Consume Vitamin C heroes daily (amla/Indian gooseberry, guava, oranges, lemons)",
                    "Drink golden turmeric milk (haldi doodh) with a pinch of black pepper (piperine)",
                    "Include crushed fresh garlic (allicin) and ginger tea",
                    "Spend 20 minutes in morning sunlight for natural Vitamin D synthesis"
                ],
                dosTe: [
                    "విటమిన్ సి ఎక్కువగా ఉండే ఉసిరికాయ, జామకాయ, బత్తాయి పండ్లు తినండి",
                    "చిటికెడు మిరియాల పొడి కలిపిన పసుపు పాలు (గోల్డెన్ మిల్క్) తాగండి",
                    "తాజా వెల్లుల్లి, అల్లం టీ క్రమం తప్పకుండా తీసుకోండి",
                    "విటమిన్ డి కోసం రోజూ ఉదయం 20 నిమిషాలు ఎండలో గడపండి"
                ],
                dontsEn: [
                    "Avoid refined white sugar which impairs white blood cell phagocytosis for hours",
                    "Avoid ice-cold sweetened beverages and artificial confectionery",
                    "Don't consume stale or overly refrigerated leftover foods",
                    "Avoid chronic sleep deprivation (sleep is when cytokines are released)"
                ],
                dontsTe: [
                    "రోగనిరోధక శక్తిని తగ్గించే తెల్ల పంచదార మరియు కృత్రిమ రసాయనాలు మానేయండి",
                    "చల్లటి ఐస్ పానీయాలు మరియు నిల్వ ఉంచిన పదార్థాలు తినకండి",
                    "రాత్రి వేళల్లో నిద్రలేమి లేకుండా కనీసం 7-8 గంటలు నిద్రపోండి"
                ],
                mealPlan: {
                    breakfast: "Warm amla juice on empty stomach; vegetable poha with peanuts and lemon squeeze.",
                    breakfastTe: "ఉదయాన్నే ఉసిరి రసం; వేరుశెనగలు, నిమ్మరసం కలిపిన కూరగాయల పోహా (అటుకులు).",
                    lunch: "Steamed rice with moringa (drumstick leaves) dal, rasam with black pepper, and steamed greens.",
                    lunchTe: "మునగాకు పప్పు, మిరియాల చారు మరియు ఆకుకూరలు.",
                    snack: "Herbal kadha (tulsi, ginger, cinnamon, clove) with jaggery.",
                    snackTe: "తులసి, అల్లం, దాల్చిన చెక్కతో చేసిన హెర్బల్ కషాయం.",
                    dinner: "Clear vegetable chicken/mushroom soup with garlic toast or warm khichdi.",
                    dinnerTe: "వెల్లుల్లితో చేసిన కూరగాయల లేదా పుట్టగొడుగుల సూప్ లేదా వేడి కిచిడీ."
                }
            }
        ]
    }
};

if (typeof window !== "undefined") {
    window.MedicalData = MedicalData;
}

