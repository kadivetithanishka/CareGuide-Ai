/**
 * CareGuide AI - Core Application Architecture & Interactive Systems
 * Includes Multilingual Support, Clinical Triage Engine, Web Speech API,
 * Web Audio API CPR Metronome, Facility Directory, Calculators, and Report Exporter.
 */

document.addEventListener("DOMContentLoaded", () => {
    // State management
    const state = {
        lang: "en",
        theme: localStorage.getItem("careguide_theme") || "light",
        selectedChips: new Set(),
        currentTriageResult: null,
        metronomeActive: false,
        metronomeTimer: null,
        compressionCount: 0,
        audioCtx: null,
        // Video Consult State
        videoActive: false,
        videoTimer: null,
        videoSeconds: 0,
        localStream: null,
        camEnabled: true,
        micEnabled: true,
        // Booking State
        selectedDoctorId: "doc_1",
        selectedSlot: "09:30 AM",
        activeSpecialtyFilter: "all",
        // Nutrition State
        activeNutritionCondition: "heart",
        // Lab Reports State
        currentLabConclusion: null
    };

    // DOM Element References
    const elements = {
        langSelect: document.getElementById("languageSelect"),
        themeToggle: document.getElementById("themeToggle"),
        concernInput: document.getElementById("concernTextarea"),
        charCountDisplay: document.getElementById("charCountDisplay"),
        voiceBtn: document.getElementById("voiceInputBtn"),
        chipsContainer: document.getElementById("symptomChipsMatrix"),
        severitySlider: document.getElementById("severitySlider"),
        severityBadge: document.getElementById("severityBadge"),
        ageGroupSelect: document.getElementById("ageGroupSelect"),
        durationSelect: document.getElementById("durationSelect"),
        analyzeBtn: document.getElementById("analyzeSymptomsBtn"),
        clearBtn: document.getElementById("clearSymptomsBtn"),
        resultWrapper: document.getElementById("assessmentResultWrapper"),
        resultCard: document.getElementById("clinicalResultCard"),
        triageBadge: document.getElementById("triageLevelBadge"),
        triageTitle: document.getElementById("triageTitle"),
        triageDesc: document.getElementById("triageDescription"),
        possibleCausesList: document.getElementById("possibleCausesList"),
        immediateStepsList: document.getElementById("immediateStepsList"),
        redFlagsList: document.getElementById("redFlagsList"),
        questionsList: document.getElementById("questionsForDoctorList"),
        clarifyingQuestionsCard: document.getElementById("clarifyingQuestionsCard"),
        cqContainer: document.getElementById("clarifyingQuestionsList"),
        copyReportBtn: document.getElementById("copyClinicalReportBtn"),
        exportReportBtn: document.getElementById("exportReportBtn"),

        // CPR Metronome
        cprStartBtn: document.getElementById("startCprMetronomeBtn"),
        cprStopBtn: document.getElementById("stopCprMetronomeBtn"),
        cprHeart: document.getElementById("cprHeartVisual"),
        cprCountDisplay: document.getElementById("cprCompressionCounter"),

        // Stroke Tool
        strokeChecks: document.querySelectorAll(".fast-check-input"),
        strokeResultMsg: document.getElementById("fastStrokeResult"),

        // Facility Locator
        locatorTabs: document.querySelectorAll(".locator-tab-btn"),
        locatorSearch: document.getElementById("locatorSearchInput"),
        facilitiesContainer: document.getElementById("facilitiesGridContainer"),

        // Calculators
        bmiBtn: document.getElementById("calcBmiBtn"),
        bmiResultBox: document.getElementById("bmiResultBox"),
        waterBtn: document.getElementById("calcWaterBtn"),
        waterResultBox: document.getElementById("waterResultBox"),
        hrBtn: document.getElementById("calcHrBtn"),
        hrResultBox: document.getElementById("hrResultBox"),

        // Modal
        articleModal: document.getElementById("articleDetailModal"),
        articleModalTitle: document.getElementById("modalArticleTitle"),
        articleModalMeta: document.getElementById("modalArticleMeta"),
        articleModalBody: document.getElementById("modalArticleBody"),
        articleModalClose: document.getElementById("closeArticleModalBtn"),

        // Articles Grid
        articlesGrid: document.getElementById("healthArticlesGrid"),

        // Video Call Telehealth Room Elements
        videoStartBtn: document.getElementById("startVideoConsultBtn"),
        videoEndBtn: document.getElementById("endVideoConsultBtn"),
        videoCamBtn: document.getElementById("toggleCameraBtn"),
        videoMicBtn: document.getElementById("toggleMicBtn"),
        userLocalVideo: document.getElementById("userLocalVideoElem"),
        callTimerDisplay: document.getElementById("videoCallTimer"),
        videoChatMessages: document.getElementById("videoChatMessagesList"),
        videoChatInput: document.getElementById("videoChatInputField"),
        videoChatSendBtn: document.getElementById("sendVideoChatBtn"),
        videoCallStatusBadge: document.getElementById("videoCallStatusBadge"),

        // Doctor Appointment Booking Elements
        specialtyFilterBtns: document.querySelectorAll(".specialty-chip-btn"),
        doctorsGridContainer: document.getElementById("doctorsGridContainer"),
        appointmentForm: document.getElementById("doctorAppointmentForm"),
        bookingSelectedDoctorInput: document.getElementById("bookingDoctorIdInput"),
        bookingSelectedSlotInput: document.getElementById("bookingSlotInput"),
        bookingDoctorNameDisplay: document.getElementById("selectedDoctorNameBadge"),
        bookingPassModal: document.getElementById("bookingPassModal"),
        closeBookingPassBtn: document.getElementById("closeBookingPassBtn"),
        printBookingPassBtn: document.getElementById("printBookingPassBtn"),
        bookingTokenBadge: document.getElementById("bookingTokenBadge"),
        passPatientName: document.getElementById("passPatientName"),
        passDoctorName: document.getElementById("passDoctorName"),
        passSpecialty: document.getElementById("passSpecialty"),
        passDateTime: document.getElementById("passDateTime"),
        passMode: document.getElementById("passMode"),

        // Lab Report Checker & Conclusion Elements
        reportPresetBtns: document.querySelectorAll(".preset-report-btn"),
        analyzeReportBtn: document.getElementById("analyzeReportBtn"),
        labConclusionContainer: document.getElementById("labConclusionContainer"),
        labOverallBadge: document.getElementById("labOverallBadge"),
        labMetersGrid: document.getElementById("labMetersGrid"),
        labConclusionSummaryText: document.getElementById("labConclusionSummaryText"),
        labActionStepsList: document.getElementById("labActionStepsList"),
        exportLabReportBtn: document.getElementById("exportLabReportBtn"),
        saveLabReportBtn: document.getElementById("saveLabReportBtn"),
        saveTriageBtn: document.getElementById("saveTriageBtn"),
        triggerUploadReportBtn: document.getElementById("triggerUploadReportBtn"),
        labReportFileInput: document.getElementById("labReportFileInput"),
        uploadStatusMsg: document.getElementById("uploadStatusMsg"),

        // Records Hub Elements
        recordsTabs: document.querySelectorAll(".records-tab-btn"),
        recordsSearchInput: document.getElementById("recordsSearchInput"),
        refreshRecordsBtn: document.getElementById("refreshRecordsBtn"),
        appointmentsGridContainer: document.getElementById("appointmentsGridContainer"),
        reportsGridContainer: document.getElementById("reportsGridContainer"),
        triageGridContainer: document.getElementById("triageGridContainer"),
        statAppointmentsCount: document.getElementById("statAppointmentsCount"),
        statReportsCount: document.getElementById("statReportsCount"),
        statCriticalReportsCount: document.getElementById("statCriticalReportsCount"),
        statTriageCount: document.getElementById("statTriageCount"),
        tabCountAppts: document.getElementById("tabCountAppts"),
        tabCountReports: document.getElementById("tabCountReports"),
        tabCountTriage: document.getElementById("tabCountTriage"),

        // Healthy Food & Nutrition Elements
        conditionTabBtns: document.querySelectorAll(".condition-tab-btn"),
        nutritionConditionTitle: document.getElementById("nutritionConditionTitle"),
        nutritionTagline: document.getElementById("nutritionTagline"),
        foodDosList: document.getElementById("foodDosList"),
        foodDontsList: document.getElementById("foodDontsList"),
        mealPlanGrid: document.getElementById("mealPlanGrid"),

        // Toast Container
        toastContainer: document.getElementById("toastNotificationsContainer")
    };

    // =========================================================================
    // Theme System
    // =========================================================================
    function initTheme() {
        if (state.theme === "dark" || (!("careguide_theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.body.classList.add("dark-mode");
            elements.themeToggle.textContent = "☀️ Light";
            state.theme = "dark";
        } else {
            document.body.classList.remove("dark-mode");
            elements.themeToggle.textContent = "🌙 Dark";
            state.theme = "light";
        }
    }

    elements.themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            elements.themeToggle.textContent = "🌙 Dark";
            state.theme = "light";
        } else {
            document.body.classList.add("dark-mode");
            elements.themeToggle.textContent = "☀️ Light";
            state.theme = "dark";
        }
        localStorage.setItem("careguide_theme", state.theme);
    });

    // =========================================================================
    // Toast Notification System
    // =========================================================================
    function showToast(message, icon = "ℹ️") {
        const toast = document.createElement("div");
        toast.className = "toast-item";
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(50px)";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // =========================================================================
    // Multilingual Translation System
    // =========================================================================
    function applyTranslations(langKey) {
        state.lang = langKey;
        const dict = Translations[langKey] || Translations.en;
        document.documentElement.lang = langKey;

        // Update all data-i18n elements
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Update placeholders
        if (elements.concernInput) {
            elements.concernInput.placeholder = dict.input_placeholder;
        }
        if (elements.locatorSearch) {
            elements.locatorSearch.placeholder = dict.locator_search_ph;
        }

        // Render dynamic parts in selected language
        renderSymptomChips();
        renderFacilities();
        renderArticles();
        renderDoctors(state.activeSpecialtyFilter);
        renderNutrition(state.activeNutritionCondition);

        // If results are open, re-evaluate to translate output
        if (state.currentTriageResult) {
            analyzeSymptoms(false);
        }
        if (state.currentLabConclusion) {
            analyzeLabReport(false);
        }
    }

    elements.langSelect.addEventListener("change", (e) => {
        applyTranslations(e.target.value);
        showToast(state.lang === "te" ? "భాష తెలుగులోకి మార్చబడింది" : "Language changed to English", "🌐");
    });

    // =========================================================================
    // Symptom Chips Matrix
    // =========================================================================
    function renderSymptomChips() {
        elements.chipsContainer.innerHTML = "";
        MedicalData.quickSymptoms.forEach(sym => {
            const label = state.lang === "te" ? sym.te : sym.en;
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = `symptom-chip ${state.selectedChips.has(sym.id) ? "active" : ""}`;
            chip.innerHTML = `<span>${sym.icon}</span> <span>${label}</span>`;
            chip.addEventListener("click", () => toggleSymptomChip(sym.id, sym.en, sym.te));
            elements.chipsContainer.appendChild(chip);
        });
    }

    function toggleSymptomChip(id, nameEn, nameTe) {
        const chipName = state.lang === "te" ? nameTe : nameEn;
        if (state.selectedChips.has(id)) {
            state.selectedChips.delete(id);
        } else {
            state.selectedChips.add(id);
            // Append symptom to text if not present
            const currentVal = elements.concernInput.value.trim();
            if (!currentVal.toLowerCase().includes(chipName.toLowerCase())) {
                elements.concernInput.value = currentVal ? `${currentVal}, ${chipName}` : chipName;
                updateCharCount();
            }
        }
        renderSymptomChips();
    }

    // =========================================================================
    // Textarea & Speech Recognition (Web Speech API)
    // =========================================================================
    function updateCharCount() {
        const len = elements.concernInput.value.length;
        const dict = Translations[state.lang] || Translations.en;
        elements.charCountDisplay.textContent = `${len}/1000 ${dict.char_count}`;
    }

    elements.concernInput.addEventListener("input", updateCharCount);

    // Voice recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isListening = true;
            elements.voiceBtn.classList.add("recording");
            const dict = Translations[state.lang] || Translations.en;
            elements.voiceBtn.innerHTML = `<span>🔴</span> <span>${dict.voice_stop}</span>`;
            showToast(dict.voice_listening, "🎙️");
        };

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            if (event.results[event.results.length - 1].isFinal) {
                const currentText = elements.concernInput.value.trim();
                elements.concernInput.value = currentText ? `${currentText} ${transcript}` : transcript;
                updateCharCount();
            }
        };

        recognition.onerror = (event) => {
            console.warn("Speech recognition error:", event.error);
            stopVoiceInput();
        };

        recognition.onend = () => {
            stopVoiceInput();
        };
    } else {
        elements.voiceBtn.addEventListener("click", () => {
            const dict = Translations[state.lang] || Translations.en;
            showToast(dict.voice_not_supported, "⚠️");
        });
    }

    function stopVoiceInput() {
        if (!SpeechRecognition) return;
        isListening = false;
        elements.voiceBtn.classList.remove("recording");
        const dict = Translations[state.lang] || Translations.en;
        elements.voiceBtn.innerHTML = `<span>🎤</span> <span>${dict.voice_start}</span>`;
    }

    if (SpeechRecognition) {
        elements.voiceBtn.addEventListener("click", () => {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.lang = state.lang === "te" ? "te-IN" : "en-US";
                recognition.start();
            }
        });
    }

    // Severity Slider Update
    elements.severitySlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        const dict = Translations[state.lang] || Translations.en;
        let label = dict.ctx_sev_mild;
        if (val >= 4 && val <= 6) label = dict.ctx_sev_mod;
        else if (val >= 7 && val <= 8) label = dict.ctx_sev_sev;
        else if (val >= 9) label = dict.ctx_sev_crit;
        elements.severityBadge.textContent = `${val}/10 - ${label}`;
    });

    // Clear Button
    elements.clearBtn.addEventListener("click", () => {
        elements.concernInput.value = "";
        state.selectedChips.clear();
        elements.severitySlider.value = 5;
        elements.severitySlider.dispatchEvent(new Event("input"));
        updateCharCount();
        renderSymptomChips();
        elements.resultWrapper.style.display = "none";
        state.currentTriageResult = null;
        showToast(state.lang === "te" ? "వివరాలు తొలగించబడ్డాయి" : "Inputs cleared", "🧹");
    });

    // Sample Scenarios Quick Loading
    document.querySelectorAll(".scenario-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            const index = parseInt(pill.getAttribute("data-case-index"));
            const caseData = MedicalData.sampleCases[index];
            if (!caseData) return;

            elements.concernInput.value = state.lang === "te" ? caseData.textTe : caseData.text;
            elements.ageGroupSelect.value = caseData.age;
            elements.durationSelect.value = caseData.duration;
            elements.severitySlider.value = caseData.severity;
            elements.severitySlider.dispatchEvent(new Event("input"));

            state.selectedChips = new Set(caseData.symptoms);
            renderSymptomChips();
            updateCharCount();

            // Auto trigger analysis
            analyzeSymptoms(true);
        });
    });

    // =========================================================================
    // Core Clinical AI Triage Engine
    // =========================================================================
    function analyzeSymptoms(smoothScroll = true) {
        const text = elements.concernInput.value.trim().toLowerCase();
        const dict = Translations[state.lang] || Translations.en;

        if (!text && state.selectedChips.size === 0) {
            showToast(dict.input_label, "⚠️");
            elements.concernInput.focus();
            return;
        }

        elements.analyzeBtn.textContent = dict.btn_analyzing;
        elements.analyzeBtn.disabled = true;

        setTimeout(() => {
            const age = elements.ageGroupSelect.value;
            const duration = elements.durationSelect.value;
            const severity = parseInt(elements.severitySlider.value);

            // 1. Detect Emergency Red Flags
            const emergencyDetected = MedicalData.emergencyPhrases.some(phrase =>
                text.includes(phrase.toLowerCase())
            ) || state.selectedChips.has("chest_pain") && severity >= 7;

            // 2. Detect Urgent Care Indicators
            const urgentDetected = MedicalData.urgentPhrases.some(phrase =>
                text.includes(phrase.toLowerCase())
            ) || severity >= 8 || (age === "infant" && (text.includes("fever") || text.includes("జ్వరం") || state.selectedChips.has("high_fever")));

            // Determine Triage Level
            let level = 3; // default routine
            if (emergencyDetected) {
                level = 1;
            } else if (urgentDetected) {
                level = 2;
            } else if (severity <= 3 && (duration === "less_6h" || duration === "1_2d") && !state.selectedChips.has("chest_pain")) {
                level = 4; // self care
            } else {
                level = 3; // routine primary care
            }

            // Build Triage Model
            const resultData = buildTriageReport(level, text, age, duration, severity);
            state.currentTriageResult = resultData;

            // Render Output
            renderTriageResults(resultData);

            elements.analyzeBtn.textContent = dict.btn_analyze;
            elements.analyzeBtn.disabled = false;

            if (smoothScroll) {
                elements.resultWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 350);
    }

    elements.analyzeBtn.addEventListener("click", () => analyzeSymptoms(true));

    function buildTriageReport(level, text, age, duration, severity) {
        const isTe = state.lang === "te";
        const dict = Translations[state.lang] || Translations.en;

        let badgeText = dict[`res_triage_level_${level}`];
        let title = "";
        let description = "";
        let possibleCauses = [];
        let immediateSteps = [];
        let redFlags = [];
        let doctorQuestions = [];
        let clarifyingQuestions = [];

        if (level === 1) {
            title = isTe ? "తక్షణ అత్యవసర సహాయం అవసరం" : "Seek Immediate Emergency Medical Help";
            description = isTe
                ? "మీ లక్షణాలు ప్రాణాంతక పరిస్థితిని సూచించవచ్చు. ఆలస్యం చేయకుండా 108 / 112 కు కాల్ చేయండి లేదా అత్యవసర ఆసుపత్రికి వెళ్లండి."
                : "Your reported symptoms match potential critical red flags (e.g. cardiac ischemia, severe respiratory compromise, or acute neurological event). Do not drive yourself; seek immediate ambulance dispatch.";

            possibleCauses = isTe
                ? ["తీవ్రమైన మయోకార్డియల్ ఇన్ఫార్క్షన్ (గుండెపోటు)", "తీవ్రమైన శ్వాసకోశ వైఫల్యం", "పక్షవాతం లేదా కేంద్ర నాడీ వ్యవస్థ సమస్య", "తీవ్రమైన అనాఫిలాక్సిస్ లేదా షాక్"]
                : ["Acute Coronary Syndrome / Myocardial Infarction", "Acute Respiratory Distress / Pulmonary Embolism", "Cerebrovascular Accident (Acute Stroke)", "Anaphylaxis or Hemodynamic Shock"];

            immediateSteps = isTe
                ? [
                    "వెంటనే 108 లేదా 112 కు కాల్ చేయండి.",
                    "శాంతంగా ఉండి ఒక చోట స్థిరంగా కూర్చోండి లేదా పడుకోండి; శారీరక శ్రమ చేయకండి.",
                    "వదులుగా ఉన్న దుస్తులను ధరించండి మరియు గాలి ధారాళంగా ఆడేలా చూసుకోండి.",
                    "డాక్టర్ సలహా లేకుండా ఎటువంటి ఆహారం లేదా మాత్రలు తీసుకోకండి (వైద్యులు సూచించిన ఆస్పిరిన్ మినహా)."
                ]
                : [
                    "Call local emergency dispatch (108 / 112 / 911) immediately.",
                    "Sit down in a comfortable upright position; avoid any unnecessary exertion.",
                    "Loosen tight clothing around your neck and chest to maximize airflow.",
                    "Do not eat, drink, or take medications unless explicitly instructed by emergency responders."
                ];

            redFlags = isTe
                ? ["స్పృహ కోల్పోవడం", "తీవ్రమైన నీలి పెదవులు లేదా గోర్లు", "అకస్మాత్తుగా మాట పడిపోవడం లేదా ముఖం వంకర పోవడం"]
                : ["Loss of consciousness or syncope", "Cyanosis (bluish lips or fingernails)", "Sudden unilateral facial droop or slurred speech"];

            doctorQuestions = isTe
                ? ["ఈ లక్షణాలకు ఈసీజీ (ECG) మరియు ట్రోపోనిన్ పరీక్షలు తక్షణమే అవసరమా?", "ఇది గుండెపోటు సంకేతమా?", "తదుపరి అత్యవసర చికిత్స ఏమిటి?"]
                : ["Does this require an immediate 12-lead ECG and cardiac enzyme panel?", "What are the telemetry monitoring findings?", "Is emergency catheterization or thrombolysis indicated?"];

        } else if (level === 2) {
            title = isTe ? "తక్షణ వైద్య సంప్రదింపు సిఫార్సు చేయబడింది (12-24 గంటలు)" : "Urgent Medical Evaluation Recommended (12-24 Hours)";
            description = isTe
                ? "మీ లక్షణాలు తీవ్రంగా ఉన్నాయి మరియు సంక్లిష్టతలు రాకుండా ఉండటానికి తక్షణమే వైద్యుడిని లేదా అర్జెంట్ కేర్ క్లినిక్‌ను సంప్రదించాలి."
                : "Your symptoms warrant professional clinical assessment within the next 12-24 hours. While not an immediate collapse, prompt evaluation prevents rapid clinical deterioration.";

            possibleCauses = isTe
                ? ["తీవ్రమైన ఇన్ఫెక్షన్ లేదా బాక్టీరియల్ జ్వరం", "తీవ్రమైన గ్యాస్ట్రోఎంటరైటిస్ లేదా డీహైడ్రేషన్", "తీవ్రమైన మైగ్రేన్ లేదా సైనుసైటిస్", "కణజాల లేదా కండరాల తీవ్ర గాయం"]
                : ["Acute systemic bacterial or viral infection", "Significant dehydration secondary to fluid loss", "Severe atypical migraine or secondary headache", "Acute abdominal inflammation (e.g., appendicitis/gallbladder)"];

            immediateSteps = isTe
                ? [
                    "సమీపంలోని అర్జెంట్ కేర్ క్లినిక్ లేదా వైద్యుడి అపాయింట్‌మెంట్ తీసుకోండి.",
                    "డీహైడ్రేషన్ కాకుండా ORS లేదా స్వచ్ఛమైన నీటిని తగినంతగా తీసుకోండి.",
                    "మీ శరీర ఉష్ణోగ్రత మరియు రక్తపోటును గమనిస్తూ ఉండండి.",
                    "లక్షణాలు మరింత ఎక్కువైతే వెంటనే అత్యవసర విభాగానికి వెళ్ళండి."
                ]
                : [
                    "Locate and visit a verified urgent care clinic or same-day physician clinic.",
                    "Maintain gentle oral hydration with electrolyte solutions if tolerated.",
                    "Record temperature and symptom progression in a notepad for your doctor.",
                    "Escalate to the emergency department if breathing becomes difficult or pain spikes."
                ];

            redFlags = isTe
                ? ["మెడ తీవ్రంగా పట్టేసి ముందుకు వంచలేకపోవడం", "నిరంతర వాంతుల వల్ల నీరు కూడా తాగలేకపోవడం", "అధిక జ్వరం 103°F దాటడం"]
                : ["Inability to bend neck forward or severe photophobia", "Inability to keep liquids down for > 12 hours", "Fever spiking above 103°F (39.4°C) unresponsive to antipyretics"];

            doctorQuestions = isTe
                ? ["నాకు రక్త పరీక్షలు లేదా అల్ట్రాసౌండ్ స్కానింగ్ అవసరమా?", "ఇది బ్యాక్టీరియల్ ఇన్ఫెక్షనా లేదా వైరల్ ఇన్ఫెక్షనా?", "ఏ ప్రమాద సంకేతాలను నేను గమనించాలి?"]
                : ["Are diagnostic blood counts or imaging studies recommended today?", "Is this likely viral or does it require targeted antimicrobial therapy?", "What specific parameters should trigger an emergency visit?"];

        } else if (level === 3) {
            title = isTe ? "సాధారణ వైద్య సంప్రదింపు (2-3 రోజులలో)" : "Routine Primary Care Consultation (Next 2-3 Days)";
            description = isTe
                ? "మీ లక్షణాలు స్వల్పం నుండి మధ్యస్థంగా ఉన్నాయి. మీ కుటుంబ వైద్యుడిని రాబోయే కొద్ది రోజుల్లో సంప్రదించి సలహా తీసుకోండి."
                : "Your symptoms appear non-emergent at this time. We advise scheduling an appointment with your primary care provider or general physician over the next few days.";

            possibleCauses = isTe
                ? ["సాధారణ వైరల్ శ్వాసకోశ ఇన్ఫెక్షన్", "కాలానుగుణ అలెర్జీలు లేదా జలుబు", "తేలికపాటి గ్యాస్ట్రిక్ అసౌకర్యం", "కండరాల ఒత్తిడి"]
                : ["Mild viral upper respiratory tract infection", "Seasonal allergic rhinitis or bronchitis", "Mild dyspepsia or functional GI disturbance", "Musculoskeletal strain or tension"];

            immediateSteps = isTe
                ? [
                    "తగినంత విశ్రాంతి తీసుకోండి మరియు పోషకాహారం తినండి.",
                    "గోరువెచ్చని నీరు తాగండి మరియు ఆవిరి పట్టండి.",
                    "లక్షణాలు 5-7 రోజుల కంటే ఎక్కువ కొనసాగితే వైద్యుడిని సంప్రదించండి."
                ]
                : [
                    "Schedule a non-urgent appointment with your general physician.",
                    "Ensure adequate sleep (7-8 hours) and supportive balanced nutrition.",
                    "Use warm saline gargles, humidification, and rest as needed.",
                    "Monitor for any change in symptom frequency or character."
                ];

            redFlags = isTe
                ? ["లక్షణాలు 7 రోజుల కంటే ఎక్కువ కొనసాగడం", "ఆకస్మికంగా తీవ్రమైన జ్వరం రావడం"]
                : ["Symptoms persisting beyond 7-10 days without improvement", "Sudden onset of unremitting high fever"];

            doctorQuestions = isTe
                ? ["ఈ లక్షణాలు తగ్గడానికి ఏ జీవనశైలి మార్పులు చేసుకోవాలి?", "ఏమైనా సాధారణ పరీక్షలు చేయించుకోవాలా?"]
                : ["Would routine blood work or allergy assessment be helpful?", "Are there specific over-the-counter options best suited for my health history?"];

        } else {
            // Level 4
            title = isTe ? "గృహ సంరక్షణ & స్వయం పర్యవేక్షణ" : "Self-Care, Rest & Home Monitoring";
            description = isTe
                ? "మీ లక్షణాలు స్వల్పంగా ఉన్నాయి. మంచి విశ్రాంతి, సమృద్ధిగా నీరు తాగడం మరియు తగిన జాగ్రత్తలతో ఇంట్లోనే సాధారణ స్థితికి చేరుకోవచ్చు."
                : "Your reported symptoms are mild and typically self-limiting. Supportive home care, optimal hydration, stress reduction, and monitoring are recommended.";

            possibleCauses = isTe
                ? ["సాధారణ శారీరక అలసట", "స్క్రీన్ ఒత్తిడి వల్ల వచ్చే తలనొప్పి", "తేలికపాటి డీహైడ్రేషన్"]
                : ["Mild tension or ergonomic eye strain", "Mild dehydration or fatigue", "Transient mild muscle stiffness"];

            immediateSteps = isTe
                ? [
                    "డిజిటల్ స్క్రీన్ల నుండి విశ్రాంతి తీసుకోండి.",
                    "రోజంతా కనీసం 2-3 లీటర్ల నీరు తాగండి.",
                    "రాత్రి సమయంలో మంచి నిద్ర పోండి."
                ]
                : [
                    "Rest your eyes and practice the 20-20-20 screen break rule.",
                    "Ensure adequate hydration (2.5 - 3 liters of water throughout the day).",
                    "Engage in gentle stretching and prioritize rest."
                ];

            redFlags = isTe
                ? ["నొప్పి తీవ్రత పెరగడం", "కొత్తగా జ్వరం లేదా వాంతులు రావడం"]
                : ["Pain increasing beyond mild threshold", "Development of fever, nausea, or visual changes"];

            doctorQuestions = isTe
                ? ["ఈ అలసట తగ్గడానికి ఎలాంటి పోషకాహారం తీసుకోవాలి?"]
                : ["What preventive wellness routines support sustained vitality?"];
        }

        // Attach clarifying questions if symptoms match
        state.selectedChips.forEach(chipId => {
            if (MedicalData.clarifyingQuestions[chipId]) {
                clarifyingQuestions.push(...MedicalData.clarifyingQuestions[chipId]);
            }
        });

        return {
            level,
            badgeText,
            title,
            description,
            possibleCauses,
            immediateSteps,
            redFlags,
            doctorQuestions,
            clarifyingQuestions,
            patientInput: { text, age, duration, severity }
        };
    }

    function renderTriageResults(data) {
        state.currentTriageResult = data;
        // Set level class on card
        elements.resultCard.className = `result-card level-${data.level}`;
        elements.triageBadge.textContent = data.badgeText;
        elements.triageTitle.textContent = data.title;
        elements.triageDesc.textContent = data.description;

        // Render lists
        elements.possibleCausesList.innerHTML = data.possibleCauses.map(c => `<li>${c}</li>`).join("");
        elements.immediateStepsList.innerHTML = data.immediateSteps.map(s => `<li>${s}</li>`).join("");
        elements.redFlagsList.innerHTML = data.redFlags.map(r => `<li>${r}</li>`).join("");
        elements.questionsList.innerHTML = data.doctorQuestions.map(q => `<li>${q}</li>`).join("");

        // Clarifying questions
        if (data.clarifyingQuestions && data.clarifyingQuestions.length > 0) {
            elements.clarifyingQuestionsCard.style.display = "block";
            const dict = Translations[state.lang] || Translations.en;
            elements.cqContainer.innerHTML = "";

            data.clarifyingQuestions.forEach(item => {
                const qText = state.lang === "te" ? item.qTe : item.qEn;
                const row = document.createElement("div");
                row.className = "cq-item";
                row.innerHTML = `
                    <span class="cq-question-text">${qText}</span>
                    <div class="cq-btn-group">
                        <button type="button" class="cq-choice-btn btn-yes">${dict.cq_yes}</button>
                        <button type="button" class="cq-choice-btn btn-no">${dict.cq_no}</button>
                    </div>
                `;

                const btnYes = row.querySelector(".btn-yes");
                const btnNo = row.querySelector(".btn-no");

                btnYes.addEventListener("click", () => {
                    btnYes.classList.add("selected-yes");
                    btnNo.classList.remove("selected-no");
                    if (item.isUrgent && data.level > 1) {
                        showToast(state.lang === "te" ? "ప్రమాద సంకేతం కారణంగా ఎమర్జెన్సీగా నవీకరించబడింది!" : "Triage escalated to Emergency due to positive red flag!", "🚨");
                        const escalated = buildTriageReport(1, data.patientInput.text, data.patientInput.age, data.patientInput.duration, 9);
                        state.currentTriageResult = escalated;
                        renderTriageResults(escalated);
                    }
                });

                btnNo.addEventListener("click", () => {
                    btnNo.classList.add("selected-no");
                    btnYes.classList.remove("selected-yes");
                });

                elements.cqContainer.appendChild(row);
            });
        } else {
            elements.clarifyingQuestionsCard.style.display = "none";
        }

        elements.resultWrapper.style.display = "block";
    }

    // =========================================================================
    // Clinical Report Export & Clipboard Copy
    // =========================================================================
    function generateClinicalSummaryText() {
        if (!state.currentTriageResult) return "";
        const res = state.currentTriageResult;
        const input = res.patientInput;
        const timestamp = new Date().toLocaleString();

        return `======================================================
CAREGUIDE AI - PATIENT CLINICAL TRIAGE SUMMARY
Generated: ${timestamp}
Language: ${state.lang.toUpperCase()}
======================================================

PATIENT CONTEXT:
• Age Category: ${input.age}
• Symptom Duration: ${input.duration}
• Pain / Severity Rating: ${input.severity} / 10
• Patient Narrative: "${input.text}"

TRIAGE EVALUATION:
• Priority Level: ${res.badgeText}
• Clinical Guidance: ${res.title}
• Assessment Notes: ${res.description}

DIFFERENTIALS TYPICALLY REVIEWED BY PHYSICIANS:
${res.possibleCauses.map(c => `• ${c}`).join("\n")}

RECOMMENDED IMMEDIATE ACTION PLAN:
${res.immediateSteps.map(s => `• ${s}`).join("\n")}

RED FLAG WARNINGS TO MONITOR:
${res.redFlags.map(r => `• ${r}`).join("\n")}

PREPARED QUESTIONS FOR YOUR PHYSICIAN CONSULTATION:
${res.doctorQuestions.map(q => `• ${q}`).join("\n")}

DISCLAIMER:
This report is generated by an educational triage decision-support tool.
It does not constitute an official diagnosis or medical prescription.
In an emergency, dial 108 / 112 / 911 immediately.
======================================================`;
    }

    elements.copyReportBtn.addEventListener("click", () => {
        const text = generateClinicalSummaryText();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const dict = Translations[state.lang] || Translations.en;
            showToast(dict.res_copied_toast, "📋");
        }).catch(err => {
            console.error("Copy failed", err);
        });
    });

    elements.exportReportBtn.addEventListener("click", () => {
        window.print();
    });

    if (elements.saveTriageBtn) {
        elements.saveTriageBtn.addEventListener("click", () => {
            if (!state.currentTriageResult) {
                showToast("Please assess symptoms first", "⚠️");
                return;
            }
            const res = state.currentTriageResult;
            const input = res.patientInput || {};
            const patientName = document.getElementById("bookingPatientNameInput")?.value?.trim() || "Patient";

            fetch("/api/triage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patient_name: patientName,
                    concern: input.text || "",
                    symptoms: Array.from(state.selectedChips),
                    severity: input.severity || 5,
                    age_group: input.age || "adult",
                    duration: input.duration || "1d",
                    triage_level: res.level,
                    title: res.title,
                    possible_causes: res.possibleCauses,
                    immediate_steps: res.immediateSteps
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    showToast(state.lang === "te" ? "ట్రయాజ్ వివరాలు డేటాబేస్‌లో సేవ్ చేయబడ్డాయి!" : "Triage evaluation saved to database!", "🩺");
                    if (typeof fetchAndRenderRecords === "function") fetchAndRenderRecords();
                }
            })
            .catch(err => {
                console.error("Save triage error", err);
                showToast("Triage assessment recorded", "ℹ️");
            });
        });
    }

    // =========================================================================
    // Hands-Only CPR Rhythm Metronome (Web Audio API)
    // =========================================================================
    function playBeep() {
        try {
            if (!state.audioCtx) {
                state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (state.audioCtx.state === "suspended") {
                state.audioCtx.resume();
            }
            const osc = state.audioCtx.createOscillator();
            const gain = state.audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, state.audioCtx.currentTime); // A5 high clear beep
            gain.gain.setValueAtTime(0.3, state.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(state.audioCtx.destination);
            osc.start();
            osc.stop(state.audioCtx.currentTime + 0.08);
        } catch (e) {
            console.warn("Audio synthesis error:", e);
        }
    }

    function startCprMetronome() {
        if (state.metronomeActive) return;
        state.metronomeActive = true;
        state.compressionCount = 0;
        elements.cprCountDisplay.textContent = state.compressionCount;
        elements.cprHeart.classList.add("beating");

        // 110 beats per minute -> 60000 / 110 = ~545.45 ms interval
        const intervalMs = Math.round(60000 / 110);
        playBeep();
        state.compressionCount++;
        elements.cprCountDisplay.textContent = state.compressionCount;

        state.metronomeTimer = setInterval(() => {
            playBeep();
            state.compressionCount++;
            elements.cprCountDisplay.textContent = state.compressionCount;
        }, intervalMs);

        showToast(state.lang === "te" ? "CPR బీట్ ప్రారంభమైంది (110 BPM)" : "CPR rhythm active (110 BPM)", "🫀");
    }

    function stopCprMetronome() {
        if (!state.metronomeActive) return;
        state.metronomeActive = false;
        clearInterval(state.metronomeTimer);
        elements.cprHeart.classList.remove("beating");
        showToast(state.lang === "te" ? "CPR బీట్ నిలిపివేయబడింది" : "CPR metronome stopped", "⏹️");
    }

    elements.cprStartBtn.addEventListener("click", startCprMetronome);
    elements.cprStopBtn.addEventListener("click", stopCprMetronome);

    // First Aid Accordion Drawers
    document.querySelectorAll(".guide-summary-bar").forEach(bar => {
        bar.addEventListener("click", () => {
            const drawer = bar.nextElementSibling;
            drawer.classList.toggle("open");
        });
    });

    // FAST Stroke Interactive Evaluation
    elements.strokeChecks.forEach(check => {
        check.addEventListener("change", evaluateFastStroke);
    });

    function evaluateFastStroke() {
        const dict = Translations[state.lang] || Translations.en;
        const anyChecked = Array.from(elements.strokeChecks).some(c => c.checked);
        elements.strokeResultMsg.style.display = "block";

        if (anyChecked) {
            elements.strokeResultMsg.textContent = dict.stroke_result_positive;
            elements.strokeResultMsg.style.background = "var(--danger-light)";
            elements.strokeResultMsg.style.color = "var(--danger-dark)";
            elements.strokeResultMsg.style.border = "1px solid var(--danger-border)";
        } else {
            elements.strokeResultMsg.textContent = dict.stroke_result_negative;
            elements.strokeResultMsg.style.background = "var(--primary-subtle)";
            elements.strokeResultMsg.style.color = "var(--primary-dark)";
            elements.strokeResultMsg.style.border = "1px solid var(--primary-light)";
        }
    }

    // =========================================================================
    // Healthcare Facilities Directory & Search Filter
    // =========================================================================
    let currentFacilityTab = "all";

    function renderFacilities() {
        const query = elements.locatorSearch.value.trim().toLowerCase();
        const dict = Translations[state.lang] || Translations.en;
        elements.facilitiesContainer.innerHTML = "";

        const filtered = MedicalData.facilities.filter(fac => {
            const matchesTab = currentFacilityTab === "all" || fac.type === currentFacilityTab;
            const name = (state.lang === "te" ? fac.nameTe : fac.name).toLowerCase();
            const addr = fac.address.toLowerCase();
            const matchesQuery = !query || name.includes(query) || addr.includes(query) || fac.type.includes(query);
            return matchesTab && matchesQuery;
        });

        if (filtered.length === 0) {
            elements.facilitiesContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">${state.lang === "te" ? "ఎటువంటి కేంద్రాలు కనుగొనబడలేదు" : "No healthcare facilities matched your filter."}</div>`;
            return;
        }

        filtered.forEach(fac => {
            const facName = state.lang === "te" ? fac.nameTe : fac.name;
            const facTypeLabel = state.lang === "te" ? fac.typeLabelTe : fac.typeLabel;
            const card = document.createElement("div");
            card.className = "facility-card";
            card.innerHTML = `
                <div class="facility-top">
                    <div class="facility-badge-row">
                        <span class="fac-badge ${fac.type}">${facTypeLabel}</span>
                        <span class="fac-dist">📍 ${fac.distance}</span>
                    </div>
                    <h3 class="facility-name">${facName}</h3>
                    <p class="facility-address">${fac.address}</p>
                    <div class="facility-specs">
                        <span>⭐ ${fac.rating}</span>
                        <span>🕒 ${fac.open}</span>
                        <span>⏱️ ${fac.waitTime}</span>
                    </div>
                    <div class="facility-tags">
                        ${fac.features.map(f => `<span class="fac-tag-pill">${f}</span>`).join("")}
                    </div>
                </div>
                <div class="facility-actions">
                    <a href="tel:${fac.emergencyHotline || fac.phone}" class="fac-call-btn">📞 ${dict.locator_call_btn}</a>
                    <a href="https://maps.google.com/?q=${encodeURIComponent(fac.name + ' ' + fac.address)}" target="_blank" rel="noopener noreferrer" class="fac-dir-btn">🗺️ ${dict.locator_directions_btn}</a>
                </div>
            `;
            elements.facilitiesContainer.appendChild(card);
        });
    }

    elements.locatorTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            elements.locatorTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentFacilityTab = tab.getAttribute("data-tab");
            renderFacilities();
        });
    });

    elements.locatorSearch.addEventListener("input", renderFacilities);

    // =========================================================================
    // Interactive Health Calculators & Screeners
    // =========================================================================
    // 1. BMI
    elements.bmiBtn.addEventListener("click", () => {
        const heightCm = parseFloat(document.getElementById("bmiHeightInput").value);
        const weightKg = parseFloat(document.getElementById("bmiWeightInput").value);
        const dict = Translations[state.lang] || Translations.en;

        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
            showToast("Please enter valid height and weight", "⚠️");
            return;
        }

        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);
        let category = "";
        let color = "var(--primary)";

        if (bmi < 18.5) {
            category = state.lang === "te" ? "తక్కువ బరువు (Underweight)" : "Underweight (< 18.5)";
            color = "var(--warning)";
        } else if (bmi <= 24.9) {
            category = state.lang === "te" ? "ఆరోగ్యకరమైన బరువు (Normal weight)" : "Normal Weight (18.5 - 24.9)";
            color = "var(--success)";
        } else if (bmi <= 29.9) {
            category = state.lang === "te" ? "అధిక బరువు (Overweight)" : "Overweight (25 - 29.9)";
            color = "var(--warning)";
        } else {
            category = state.lang === "te" ? "ఊబకాయం (Obese)" : "Obese (≥ 30)";
            color = "var(--danger)";
        }

        elements.bmiResultBox.style.display = "block";
        elements.bmiResultBox.innerHTML = `
            <strong>${dict.bmi_result_prefix}</strong> <span style="font-size: 1.4rem; color: ${color}; font-weight: 800;">${bmi}</span><br>
            <span><strong>Category:</strong> ${category}</span>
        `;
    });

    // 2. Daily Hydration
    elements.waterBtn.addEventListener("click", () => {
        const weightKg = parseFloat(document.getElementById("waterWeightInput").value);
        const activity = document.getElementById("waterActivitySelect").value;
        const dict = Translations[state.lang] || Translations.en;

        if (!weightKg || weightKg <= 0) {
            showToast("Please enter a valid body weight", "⚠️");
            return;
        }

        let baseLiters = weightKg * 0.033;
        if (activity === "moderate") baseLiters += 0.5;
        if (activity === "high") baseLiters += 1.0;

        const rounded = baseLiters.toFixed(1);
        const glasses = Math.round(baseLiters * 4); // ~250ml glass

        elements.waterResultBox.style.display = "block";
        elements.waterResultBox.innerHTML = `
            <strong>${dict.water_result_prefix}</strong> <span style="font-size: 1.3rem; color: var(--primary); font-weight: 800;">${rounded} Liters / day</span><br>
            <span>(Approximately <strong>${glasses}</strong> glasses of 250ml water)</span>
        `;
    });

    // 3. Heart Rate Zones
    elements.hrBtn.addEventListener("click", () => {
        const age = parseInt(document.getElementById("hrAgeInput").value);
        const dict = Translations[state.lang] || Translations.en;

        if (!age || age < 1 || age > 115) {
            showToast("Please enter a valid age", "⚠️");
            return;
        }

        const maxHr = 220 - age;
        const cardioLow = Math.round(maxHr * 0.70);
        const cardioHigh = Math.round(maxHr * 0.85);

        elements.hrResultBox.style.display = "block";
        elements.hrResultBox.innerHTML = `
            <strong>${dict.hr_max_label}</strong> <span style="font-size: 1.2rem; font-weight: 800; color: var(--danger);">${maxHr} BPM</span><br>
            <strong>${dict.hr_cardio_label}</strong> <span style="font-weight: 700; color: var(--primary);">${cardioLow} - ${cardioHigh} BPM</span>
        `;
    });

    // =========================================================================
    // Health Library & Modal Reader
    // =========================================================================
    function renderArticles() {
        elements.articlesGrid.innerHTML = "";
        const dict = Translations[state.lang] || Translations.en;

        MedicalData.articles.forEach(art => {
            const title = state.lang === "te" ? art.titleTe : art.titleEn;
            const summary = state.lang === "te" ? art.summaryTe : art.summaryEn;
            const category = state.lang === "te" ? art.categoryTe : art.category;

            const card = document.createElement("div");
            card.className = "article-card";
            card.innerHTML = `
                <div>
                    <div class="article-meta">
                        <span>🏷️ ${category}</span>
                        <span>⏱️ ${art.readTime}</span>
                    </div>
                    <h3 class="article-title">${title}</h3>
                    <p class="article-snippet">${summary}</p>
                </div>
                <div>
                    <button type="button" class="article-read-btn" data-art-id="${art.id}">
                        ${dict.library_read_btn}
                    </button>
                </div>
            `;

            card.querySelector(".article-read-btn").addEventListener("click", () => openArticleModal(art));
            elements.articlesGrid.appendChild(card);
        });
    }

    function openArticleModal(art) {
        const title = state.lang === "te" ? art.titleTe : art.titleEn;
        const category = state.lang === "te" ? art.categoryTe : art.category;
        elements.articleModalTitle.textContent = title;
        elements.articleModalMeta.textContent = `${category} • ${art.readTime}`;
        elements.articleModalBody.textContent = art.bodyEn;
        elements.articleModal.classList.add("open");
    }

    elements.articleModalClose.addEventListener("click", () => {
        elements.articleModal.classList.remove("open");
    });

    elements.articleModal.addEventListener("click", (e) => {
        if (e.target === elements.articleModal) {
            elements.articleModal.classList.remove("open");
        }
    });

    // =========================================================================
    // 1. Telehealth Live Video Consultation Room
    // =========================================================================
    function initVideoConsultation() {
        if (!elements.videoStartBtn) return;

        elements.videoStartBtn.addEventListener("click", startVideoConsultation);
        elements.videoEndBtn.addEventListener("click", endVideoConsultation);
        elements.videoCamBtn.addEventListener("click", toggleCamera);
        elements.videoMicBtn.addEventListener("click", toggleMicrophone);
        elements.videoChatSendBtn.addEventListener("click", sendVideoChatMessage);
        elements.videoChatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendVideoChatMessage();
        });
    }

    async function startVideoConsultation() {
        if (state.videoActive) return;
        state.videoActive = true;
        state.videoSeconds = 0;
        elements.videoStartBtn.style.display = "none";
        elements.videoEndBtn.style.display = "inline-flex";

        showToast(state.lang === "te" ? "వీడియో కన్సల్టేషన్ ప్రారంభమైంది" : "Live Video Consultation Started", "🎥");

        // Try getting real camera stream
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                state.localStream = stream;
                if (elements.userLocalVideo) {
                    elements.userLocalVideo.srcObject = stream;
                    elements.userLocalVideo.play().catch(e => console.warn(e));
                }
            }
        } catch (err) {
            console.warn("Camera access denied or unavailable; fallback enabled", err);
            showToast(state.lang === "te" ? "కెమెరా ప్రివ్యూ మోడ్ ప్రారంభించబడింది" : "Webcam preview fallback mode enabled", "📷");
        }

        // Start call duration ticker
        elements.callTimerDisplay.textContent = "00:00";
        state.videoTimer = setInterval(() => {
            state.videoSeconds++;
            const mins = String(Math.floor(state.videoSeconds / 60)).padStart(2, "0");
            const secs = String(state.videoSeconds % 60).padStart(2, "0");
            elements.callTimerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);

        // Initial Doctor Greeting in In-Call Chat
        const isTe = state.lang === "te";
        const welcomeMsg = isTe
            ? "నమస్కారం! నేను డాక్టర్ సారా రావు. మీ క్లినికల్ రికార్డులను పరిశీలిస్తున్నాను. మీకు ఉన్న ఆరోగ్య సమస్యలను చెప్పండి."
            : "Hello! I am Dr. Sarah Rao, Telehealth Clinical Lead. I have your chart open. Please describe what sensations or symptoms you are experiencing today.";
        appendVideoChatMessage("Dr. Sarah Rao, MD", welcomeMsg, "doctor");
    }

    function toggleCamera() {
        if (!state.localStream) return;
        state.camEnabled = !state.camEnabled;
        state.localStream.getVideoTracks().forEach(track => { track.enabled = state.camEnabled; });
        const dict = Translations[state.lang] || Translations.en;
        elements.videoCamBtn.textContent = state.camEnabled ? dict.video_cam_on : dict.video_cam_off;
        elements.videoCamBtn.classList.toggle("muted", !state.camEnabled);
    }

    function toggleMicrophone() {
        if (!state.localStream) return;
        state.micEnabled = !state.micEnabled;
        state.localStream.getAudioTracks().forEach(track => { track.enabled = state.micEnabled; });
        const dict = Translations[state.lang] || Translations.en;
        elements.videoMicBtn.textContent = state.micEnabled ? dict.video_mic_on : dict.video_mic_off;
        elements.videoMicBtn.classList.toggle("muted", !state.micEnabled);
    }

    function endVideoConsultation() {
        if (!state.videoActive) return;
        state.videoActive = false;
        clearInterval(state.videoTimer);

        if (state.localStream) {
            state.localStream.getTracks().forEach(track => track.stop());
            state.localStream = null;
        }
        if (elements.userLocalVideo) {
            elements.userLocalVideo.srcObject = null;
        }

        elements.callTimerDisplay.textContent = "00:00";
        elements.videoStartBtn.style.display = "inline-flex";
        elements.videoEndBtn.style.display = "none";

        const isTe = state.lang === "te";
        appendVideoChatMessage("System", isTe ? "కాల్ విజయవంతంగా ముగిసింది. సారాంశం రికార్డు చేయబడింది." : "Video session concluded. Doctor's consultation summary saved.", "doctor");
        showToast(isTe ? "కాల్ ముగించబడింది" : "Consultation ended", "📞");
    }

    function appendVideoChatMessage(author, text, type = "patient") {
        if (!elements.videoChatMessages) return;
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${type}`;
        bubble.innerHTML = `<span class="chat-author">${author}</span>${text}`;
        elements.videoChatMessages.appendChild(bubble);
        elements.videoChatMessages.scrollTop = elements.videoChatMessages.scrollHeight;
    }

    function sendVideoChatMessage() {
        const text = elements.videoChatInput.value.trim();
        if (!text) return;
        appendVideoChatMessage("You (Patient)", text, "patient");
        elements.videoChatInput.value = "";

        // Simulated Doctor Intelligent Clinical Reply
        setTimeout(() => {
            const lower = text.toLowerCase();
            const isTe = state.lang === "te";
            let reply = "";

            if (lower.includes("chest") || lower.includes("pain") || lower.includes("నొప్పి") || lower.includes("ఛాతి")) {
                reply = isTe
                    ? "నొప్పి ఉన్న భాగాన్ని మీరు తాకితే నొప్పి పెరుగుతుందా? దయచేసి శ్వాస తీసుకోవడం ఎలా ఉందో చెప్పండి."
                    : "Noted the pain sensation. Does it radiate to your neck, back or arm? Please stay seated upright and take gentle breaths.";
            } else if (lower.includes("fever") || lower.includes("temp") || lower.includes("జ్వరం")) {
                reply = isTe
                    ? "జ్వరం కొలవడానికి థర్మామీటర్ ఉందా? హైడ్రేషన్ కోసం ఓఆర్ఎస్ లేదా కొబ్బరి నీరు తీసుకోండి."
                    : "Have you recorded your temperature with a thermometer? Ensure oral hydration while I review pediatric/adult antipyretic protocols.";
            } else if (lower.includes("prescription") || lower.includes("medicine") || lower.includes("మందులు")) {
                reply = isTe
                    ? "కాల్ ముగియగానే మీ వాట్సాప్ లేదా ఈమెయిల్‌కు ధృవీకరించబడిన ఈ-ప్రిస్క్రిప్షన్ పంపబడుతుంది."
                    : "Your electronic prescription with dosage instructions will be delivered immediately to your registered patient portal.";
            } else {
                reply = isTe
                    ? "మీరు చెప్పిన సమాచారాన్ని నమోదు చేశాను. దయచేసి ఇంకేమైనా అదనపు ఇబ్బందులు ఉన్నాయా?"
                    : "Thank you for explaining. I am recording these clinical observations into your consultation notes. Are there any known allergies?";
            }
            appendVideoChatMessage("Dr. Sarah Rao, MD", reply, "doctor");
        }, 1200);
    }

    // =========================================================================
    // 2. Doctor Appointment Booking System
    // =========================================================================
    function renderDoctors(filterSpecialty = "all") {
        if (!elements.doctorsGridContainer) return;
        state.activeSpecialtyFilter = filterSpecialty;
        elements.doctorsGridContainer.innerHTML = "";
        const dict = Translations[state.lang] || Translations.en;

        const filtered = MedicalData.doctors.filter(doc =>
            filterSpecialty === "all" || doc.specialty === filterSpecialty
        );

        filtered.forEach(doc => {
            const docName = state.lang === "te" ? doc.nameTe : doc.name;
            const docSpec = state.lang === "te" ? doc.specialtyTitleTe : doc.specialtyTitle;
            const docExp = state.lang === "te" ? doc.experienceTe : doc.experience;

            const card = document.createElement("div");
            card.className = "doctor-card";
            card.innerHTML = `
                <div>
                    <div class="doctor-header">
                        <div class="doctor-avatar">${doc.avatar}</div>
                        <div>
                            <h3 class="doctor-name">${docName}</h3>
                            <span class="doctor-spec">${docSpec}</span>
                        </div>
                    </div>
                    <div class="doctor-meta-row">
                        <span>🎓 ${doc.qualifications}</span>
                        <span>⭐ ${doc.rating}</span>
                        <span>⏳ ${docExp}</span>
                        <span>🏥 ${doc.hospital}</span>
                        <span>💵 Consultation Fee: <strong>${doc.fee}</strong></span>
                    </div>
                    <div>
                        <span class="slots-label">${dict.book_select_slot}:</span>
                        <div class="slots-pill-group">
                            ${doc.slots.map(s => `<button type="button" class="slot-pill ${state.selectedSlot === s && state.selectedDoctorId === doc.id ? 'active' : ''}" data-doc-id="${doc.id}" data-slot="${s}">${s}</button>`).join("")}
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-select-doc" data-doc-id="${doc.id}">
                    ${state.lang === 'te' ? 'ఈ డాక్టర్‌తో అపాయింట్‌మెంట్ బుక్ చేయండి' : 'Book with this Doctor →'}
                </button>
            `;

            // Slot selection listeners
            card.querySelectorAll(".slot-pill").forEach(pill => {
                pill.addEventListener("click", () => {
                    card.querySelectorAll(".slot-pill").forEach(p => p.classList.remove("active"));
                    pill.classList.add("active");
                    state.selectedDoctorId = pill.getAttribute("data-doc-id");
                    state.selectedSlot = pill.getAttribute("data-slot");
                    updateSelectedDoctorForm();
                });
            });

            // Card Book button listener
            card.querySelector(".btn-select-doc").addEventListener("click", () => {
                state.selectedDoctorId = doc.id;
                updateSelectedDoctorForm();
                document.getElementById("appointmentBookingFormCard").scrollIntoView({ behavior: "smooth" });
            });

            elements.doctorsGridContainer.appendChild(card);
        });
    }

    function updateSelectedDoctorForm() {
        const doc = MedicalData.doctors.find(d => d.id === state.selectedDoctorId);
        if (!doc) return;
        const docName = state.lang === "te" ? doc.nameTe : doc.name;
        if (elements.bookingDoctorNameDisplay) {
            elements.bookingDoctorNameDisplay.textContent = `Selected: ${docName} (${state.selectedSlot})`;
        }
        if (elements.bookingSelectedDoctorInput) {
            elements.bookingSelectedDoctorInput.value = doc.id;
        }
        if (elements.bookingSelectedSlotInput) {
            elements.bookingSelectedSlotInput.value = state.selectedSlot;
        }
    }

    function initAppointmentBooking() {
        if (!elements.appointmentForm) return;

        elements.specialtyFilterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                elements.specialtyFilterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderDoctors(btn.getAttribute("data-specialty"));
            });
        });

        // Form Submit
        elements.appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("bookingPatientNameInput").value.trim();
            const phone = document.getElementById("bookingPatientPhoneInput").value.trim();
            const date = document.getElementById("bookingDateInput").value;
            const mode = document.getElementById("bookingConsultModeSelect").value;
            const reason = document.getElementById("bookingReasonInput") ? document.getElementById("bookingReasonInput").value.trim() : "";
            const doc = MedicalData.doctors.find(d => d.id === state.selectedDoctorId) || MedicalData.doctors[0];
            const dict = Translations[state.lang] || Translations.en;

            if (!name || !phone || !date) {
                showToast("Please fill in all patient details and preferred date", "⚠️");
                return;
            }

            const token = `CG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
            const isTe = state.lang === "te";

            // Save to MongoDB Database Backend
            const payload = {
                token: token,
                patient_name: name,
                patient_phone: phone,
                doctor_id: doc.id,
                doctor_name: isTe ? doc.nameTe : doc.name,
                specialty: isTe ? doc.specialtyTitleTe : doc.specialtyTitle,
                hospital: doc.hospital,
                fee: doc.fee,
                appointment_date: date,
                appointment_slot: state.selectedSlot,
                consult_mode: mode,
                reason: reason
            };

            fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.appointment) {
                    elements.bookingTokenBadge.textContent = `#${data.appointment.token}`;
                }
                if (typeof fetchAndRenderRecords === "function") fetchAndRenderRecords();
            })
            .catch(err => {
                console.warn("Backend sync fallback:", err);
            });

            // Populate Pass
            elements.bookingTokenBadge.textContent = `#${token}`;
            elements.passPatientName.textContent = name;
            elements.passDoctorName.textContent = isTe ? doc.nameTe : doc.name;
            elements.passSpecialty.textContent = isTe ? doc.specialtyTitleTe : doc.specialtyTitle;
            elements.passDateTime.textContent = `${date} at ${state.selectedSlot}`;
            elements.passMode.textContent = mode === "clinic" ? dict.book_mode_clinic : dict.book_mode_video;

            elements.bookingPassModal.classList.add("open");
            showToast(isTe ? "అపాయింట్‌మెంట్ విజయవంతంగా డేటాబేస్‌లో సేవ్ చేయబడింది!" : "Appointment confirmed & saved to database!", "✅");
        });

        if (elements.closeBookingPassBtn) {
            elements.closeBookingPassBtn.addEventListener("click", () => {
                elements.bookingPassModal.classList.remove("open");
            });
        }
        if (elements.printBookingPassBtn) {
            elements.printBookingPassBtn.addEventListener("click", () => {
                window.print();
            });
        }
    }

    // =========================================================================
    // 3. Diagnostic Lab Report Analyzer & Conclusion Engine
    // =========================================================================
    function initLabReportAnalyzer() {
        if (!elements.analyzeReportBtn) return;

        elements.analyzeReportBtn.addEventListener("click", () => analyzeLabReport(true));

        elements.reportPresetBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const sampleIdx = parseInt(btn.getAttribute("data-sample-index"));
                const sample = MedicalData.labTestsConfig.sampleReports[sampleIdx];
                if (!sample) return;

                document.getElementById("labGlucoseInput").value = sample.values.glucose;
                document.getElementById("labHba1cInput").value = sample.values.hba1c;
                document.getElementById("labBpSystolicInput").value = sample.values.bp_systolic;
                document.getElementById("labBpDiastolicInput").value = sample.values.bp_diastolic;
                document.getElementById("labCholesterolInput").value = sample.values.cholesterol;
                document.getElementById("labHemoglobinInput").value = sample.values.hemoglobin;
                document.getElementById("labCreatinineInput").value = sample.values.creatinine;

                showToast(state.lang === "te" ? "నమూనా రిపోర్ట్ లోడ్ చేయబడింది" : "Loaded Diagnostic Sample Report", "🩸");
                analyzeLabReport(true);
            });
        });

        if (elements.exportLabReportBtn) {
            elements.exportLabReportBtn.addEventListener("click", exportLabReportBrief);
        }

        if (elements.saveLabReportBtn) {
            elements.saveLabReportBtn.addEventListener("click", () => {
                if (!state.currentLabConclusion) {
                    analyzeLabReport(false);
                }
                const name = document.getElementById("bookingPatientNameInput")?.value?.trim() || "Patient Vishnu";
                const phone = document.getElementById("bookingPatientPhoneInput")?.value?.trim() || "+91 98765 43210";

                const glucose = parseFloat(document.getElementById("labGlucoseInput").value) || 0;
                const hba1c = parseFloat(document.getElementById("labHba1cInput").value) || 0;
                const systolic = parseFloat(document.getElementById("labBpSystolicInput").value) || 0;
                const diastolic = parseFloat(document.getElementById("labBpDiastolicInput").value) || 0;
                const cholesterol = parseFloat(document.getElementById("labCholesterolInput").value) || 0;
                const hb = parseFloat(document.getElementById("labHemoglobinInput").value) || 0;
                const creatinine = parseFloat(document.getElementById("labCreatinineInput").value) || 0;

                const payload = {
                    patient_name: name,
                    patient_phone: phone,
                    glucose, hba1c, bp_systolic: systolic, bp_diastolic: diastolic,
                    cholesterol, hemoglobin: hb, creatinine,
                    overall_status: state.currentLabConclusion ? state.currentLabConclusion.overallStatus : "optimal",
                    conclusion_text: state.currentLabConclusion ? state.currentLabConclusion.conclusionText : "",
                    action_steps: state.currentLabConclusion ? state.currentLabConclusion.actionSteps : [],
                    metrics: state.currentLabConclusion ? state.currentLabConclusion.metrics : []
                };

                fetch("/api/reports", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        showToast(state.lang === "te" ? "ల్యాబ్ రిపోర్ట్ డేటాబేస్‌లో భద్రపరచబడింది!" : `Lab report saved! ID: ${data.report.report_id}`, "✅");
                        if (typeof fetchAndRenderRecords === "function") fetchAndRenderRecords();
                    }
                })
                .catch(err => {
                    console.error("Save report error:", err);
                    showToast("Report saved locally", "ℹ️");
                });
            });
        }

        if (elements.triggerUploadReportBtn && elements.labReportFileInput) {
            elements.triggerUploadReportBtn.addEventListener("click", () => {
                elements.labReportFileInput.click();
            });

            elements.labReportFileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                if (elements.uploadStatusMsg) {
                    elements.uploadStatusMsg.style.display = "block";
                    elements.uploadStatusMsg.textContent = `Uploading ${file.name}...`;
                    elements.uploadStatusMsg.style.color = "var(--primary)";
                }

                fetch("/api/reports/upload", {
                    method: "POST",
                    body: formData
                })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        elements.uploadStatusMsg.innerHTML = `✅ Successfully uploaded: <a href="${data.url}" target="_blank" style="color:var(--primary); font-weight:700;">${data.filename}</a>`;
                        showToast("Report document uploaded to backend!", "📎");
                        fetch("/api/reports", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                patient_name: document.getElementById("bookingPatientNameInput")?.value?.trim() || "Patient",
                                file_path: data.url,
                                conclusion_text: `Uploaded Diagnostic Document: ${file.name}`,
                                overall_status: "optimal"
                            })
                        }).then(() => {
                            if (typeof fetchAndRenderRecords === "function") fetchAndRenderRecords();
                        });
                    } else {
                        elements.uploadStatusMsg.textContent = `❌ ${data.error || "Upload failed"}`;
                        elements.uploadStatusMsg.style.color = "var(--danger)";
                    }
                })
                .catch(err => {
                    console.error("Upload error", err);
                    if (elements.uploadStatusMsg) {
                        elements.uploadStatusMsg.textContent = "❌ Upload failed: Connection error";
                        elements.uploadStatusMsg.style.color = "var(--danger)";
                    }
                });
            });
        }
    }

    function analyzeLabReport(smoothScroll = true) {
        const glucose = parseFloat(document.getElementById("labGlucoseInput").value);
        const hba1c = parseFloat(document.getElementById("labHba1cInput").value);
        const systolic = parseFloat(document.getElementById("labBpSystolicInput").value);
        const diastolic = parseFloat(document.getElementById("labBpDiastolicInput").value);
        const cholesterol = parseFloat(document.getElementById("labCholesterolInput").value);
        const hb = parseFloat(document.getElementById("labHemoglobinInput").value);
        const creatinine = parseFloat(document.getElementById("labCreatinineInput").value);

        const dict = Translations[state.lang] || Translations.en;
        const isTe = state.lang === "te";

        // Evaluate markers
        const metrics = [
            {
                name: isTe ? "ఫాస్టింగ్ గ్లూకోజ్ (FBS)" : "Fasting Glucose",
                val: glucose, unit: "mg/dL",
                status: glucose > 125 ? "critical" : (glucose >= 100 ? "borderline" : "optimal"),
                label: glucose > 125 ? "High (Diabetic Range)" : (glucose >= 100 ? "Borderline / Pre-diabetic" : "Normal (<100)"),
                pct: Math.min(100, Math.max(10, (glucose / 200) * 100))
            },
            {
                name: isTe ? "HbA1c (గ్లైకేటెడ్ హిమోగ్లోబిన్)" : "HbA1c (3-Month Sugar)",
                val: hba1c, unit: "%",
                status: hba1c >= 6.5 ? "critical" : (hba1c >= 5.7 ? "borderline" : "optimal"),
                label: hba1c >= 6.5 ? "High (≥6.5%)" : (hba1c >= 5.7 ? "Pre-diabetic (5.7-6.4%)" : "Optimal (<5.7%)"),
                pct: Math.min(100, Math.max(10, (hba1c / 10) * 100))
            },
            {
                name: isTe ? "రక్తపోటు (సిస్టోలిక్ BP)" : "Systolic Blood Pressure",
                val: systolic, unit: "mmHg",
                status: systolic >= 140 ? "critical" : (systolic >= 120 ? "borderline" : "optimal"),
                label: systolic >= 140 ? "Hypertension Stage 2" : (systolic >= 120 ? "Elevated / Pre-HTN" : "Optimal (<120)"),
                pct: Math.min(100, Math.max(10, (systolic / 180) * 100))
            },
            {
                name: isTe ? "టోటల్ కొలెస్ట్రాల్" : "Total Cholesterol",
                val: cholesterol, unit: "mg/dL",
                status: cholesterol >= 240 ? "critical" : (cholesterol >= 200 ? "borderline" : "optimal"),
                label: cholesterol >= 240 ? "High Risk (≥240)" : (cholesterol >= 200 ? "Borderline (200-239)" : "Desirable (<200)"),
                pct: Math.min(100, Math.max(10, (cholesterol / 300) * 100))
            },
            {
                name: isTe ? "హిమోగ్లోబిన్ (Hb)" : "Hemoglobin (Hb)",
                val: hb, unit: "g/dL",
                status: hb < 11.5 ? "critical" : (hb < 12.5 ? "borderline" : "optimal"),
                label: hb < 11.5 ? "Low (Anemia Indicator)" : (hb < 12.5 ? "Mild Borderline" : "Normal Healthy Range"),
                pct: Math.min(100, Math.max(10, (hb / 16) * 100))
            },
            {
                name: isTe ? "సీరం క్రియాటినిన్" : "Serum Creatinine",
                val: creatinine, unit: "mg/dL",
                status: creatinine > 1.3 ? "critical" : "optimal",
                label: creatinine > 1.3 ? "Elevated Renal Marker" : "Normal Kidney Function",
                pct: Math.min(100, Math.max(10, (creatinine / 2.5) * 100))
            }
        ];

        // Overall Risk Determination
        const hasCritical = metrics.some(m => m.status === "critical");
        const hasBorderline = metrics.some(m => m.status === "borderline");
        const overallStatus = hasCritical ? "danger" : (hasBorderline ? "borderline" : "optimal");

        // Conclusions & Action steps
        let conclusionText = "";
        let actionSteps = [];

        if (overallStatus === "danger") {
            conclusionText = isTe
                ? "నివేదిక ప్రకారం రక్తంలో గ్లూకోజ్, రక్తపోటు లేదా కొలెస్ట్రాల్ స్థాయిలు తీవ్రమైన ప్రమాద పరిమితిలో ఉన్నాయి. గుండె మరియు జీవక్రియల సమస్యలు రాకుండా ఉండటానికి వెంటనే వైద్యుడిని లేదా డయాబెటాలజిస్ట్‌ను సంప్రదించి ప్రిస్క్రిప్షన్ తీసుకోవాలి."
                : "Significant clinical variance identified: Critical elevation in glycemic, cardiovascular, or lipid parameters. Clinical intervention and formal physician review are strongly indicated to prevent cardiovascular and metabolic complications.";
            actionSteps = isTe
                ? [
                    "రాబోయే 24-48 గంటల్లో డాక్టర్‌తో అపాయింట్‌మెంట్ తీసుకోండి.",
                    "పంచదార, మైదా, వేపుళ్లు మరియు ఉప్పును ఆహారంలో వెంటనే తగ్గించండి.",
                    "డాక్టర్ సలహాతో లిపిడ్ ప్రొఫైల్ మరియు మూత్ర పరీక్షలను పూర్తి చేయండి."
                ]
                : [
                    "Schedule a formal in-clinic or video consultation with a physician within 48 hours.",
                    "Strictly reduce dietary simple sugars, trans-fats, and dietary sodium (<2,000 mg/day).",
                    "Maintain a daily morning fasting blood sugar and blood pressure log."
                ];
        } else if (overallStatus === "borderline") {
            conclusionText = isTe
                ? "నివేదికలో కొన్ని సూచికలు సరిహద్దులో (Borderline / Pre-diabetic) ఉన్నాయి. జీవనశైలి మార్పులు, సమతుల్య పోషకాహారం మరియు రోజూ 30 నిమిషాల నడకతో వీటిని సాధారణ స్థితికి తీసుకురావచ్చు."
                : "Early metabolic shift detected: Mildly elevated glycemic or blood pressure markers indicative of pre-diabetes or pre-hypertension. Proactive nutritional adjustments can successfully reverse these trends.";
            actionSteps = isTe
                ? [
                    "రోజూ 30-40 నిమిషాల వేగవంతమైన నడక లేదా వ్యాయామం చేయండి.",
                    "భోజనంలో చిరుధాన్యాలు, ఆకుకూరలు మరియు ఫైబర్ అధికంగా ఉండే ఆహారాలు తీసుకోండి.",
                    "3 నెలల తర్వాత HbA1c మరియు కొలెస్ట్రాల్ పరీక్షలను మళ్లీ చేయించుకోండి."
                ]
                : [
                    "Engage in 150 minutes of moderate aerobic physical activity (brisk walking) per week.",
                    "Adopt the DASH / Mediterranean dietary pattern rich in whole millets, vegetables, and lean protein.",
                    "Re-evaluate HbA1c and lipid profile after 90 days."
                ];
        } else {
            conclusionText = isTe
                ? "అద్భుతం! మీ అన్ని ల్యాబ్ సూచికలు సాధారణ మరియు ఆరోగ్యకరమైన పరిమితిలో ఉన్నాయి. మీ ప్రస్తుత జీవనశైలి మరియు సమతుల్య ఆహారాన్ని కొనసాగించండి."
                : "Outstanding biomarker profile: All diagnostic markers reside within the optimal clinical reference boundaries. Continue your current balanced lifestyle, active fitness routine, and preventive monitoring.";
            actionSteps = isTe
                ? [
                    "ప్రస్తుత పోషకాహార సమతుల్యతను కొనసాగించండి.",
                    "ప్రతి సంవత్సరం ఒకసారి సాధారణ మాస్టర్ హెల్త్ చెకప్ చేయించుకోండి."
                ]
                : [
                    "Maintain routine annual preventive health screenings.",
                    "Sustain optimal hydration, healthy sleep hygiene, and stress management."
                ];
        }

        // Render UI
        elements.labOverallBadge.className = `conclusion-overall-badge ${overallStatus}`;
        elements.labOverallBadge.innerHTML = `
            <span style="font-size: 1.8rem;">${overallStatus === 'danger' ? '🚨' : (overallStatus === 'borderline' ? '⚠️' : '✅')}</span>
            <div>
                <div style="font-size: 1.15rem; font-weight: 800;">
                    ${overallStatus === 'danger' ? dict.reports_status_critical : (overallStatus === 'borderline' ? dict.reports_status_borderline : dict.reports_status_optimal)}
                </div>
                <small>${isTe ? 'అంతర్జాతీయ క్లినికల్ ప్రమాణాల ప్రకారం విశ్లేషించబడింది' : 'Evaluated according to ADA & AHA clinical guideline parameters'}</small>
            </div>
        `;

        elements.labMetersGrid.innerHTML = metrics.map(m => `
            <div class="meter-item">
                <div class="meter-top">
                    <span class="meter-name">${m.name}</span>
                    <span class="meter-status-tag tag-${m.status}">${m.label}</span>
                </div>
                <div style="font-size: 1.1rem; font-weight: 800; margin-bottom: 6px;">
                    ${m.val} <span style="font-size: 0.8rem; color: var(--text-muted);">${m.unit}</span>
                </div>
                <div class="range-bar-track">
                    <div class="range-bar-fill" style="width: ${m.pct}%; background: ${m.status === 'critical' ? 'var(--danger)' : (m.status === 'borderline' ? 'var(--warning)' : 'var(--success)')};"></div>
                </div>
            </div>
        `).join("");

        elements.labConclusionSummaryText.textContent = conclusionText;
        elements.labActionStepsList.innerHTML = actionSteps.map(s => `<li>${s}</li>`).join("");

        state.currentLabConclusion = { metrics, overallStatus, conclusionText, actionSteps };
        elements.labConclusionContainer.style.display = "block";

        if (smoothScroll) {
            elements.labConclusionContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function exportLabReportBrief() {
        if (!state.currentLabConclusion) return;
        const c = state.currentLabConclusion;
        const timestamp = new Date().toLocaleString();

        const text = `======================================================
CAREGUIDE AI - DIAGNOSTIC LAB REPORT EVALUATION BRIEF
Generated: ${timestamp}
Risk Status: ${c.overallStatus.toUpperCase()}
======================================================

BIOMARKER SUMMARY:
${c.metrics.map(m => `• ${m.name}: ${m.val} ${m.unit} [${m.label}]`).join("\n")}

CLINICAL CONCLUSION:
${c.conclusionText}

RECOMMENDED ACTIONABLE STEPS:
${c.actionSteps.map(s => `• ${s}`).join("\n")}

DISCLAIMER:
Generated by CareGuide AI Diagnostic Analyzer for educational triage.
Please present this summary to your attending licensed physician.
======================================================`;

        navigator.clipboard.writeText(text).then(() => {
            showToast(state.lang === "te" ? "ల్యాబ్ సారాంశం కాపీ చేయబడింది!" : "Lab diagnostic brief copied to clipboard!", "📋");
        });
    }

    // =========================================================================
    // 4. Healthy Food Tips & Clinical Nutrition Hub
    // =========================================================================
    function initHealthyFoodHub() {
        elements.conditionTabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                elements.conditionTabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderNutrition(btn.getAttribute("data-condition"));
            });
        });
    }

    function renderNutrition(conditionId = "heart") {
        if (!elements.foodDosList) return;
        state.activeNutritionCondition = conditionId;
        const condition = MedicalData.healthyFoodTips.conditions.find(c => c.id === conditionId) || MedicalData.healthyFoodTips.conditions[0];
        const isTe = state.lang === "te";

        elements.nutritionConditionTitle.innerHTML = `${condition.icon} ${isTe ? condition.nameTe : condition.nameEn}`;
        elements.nutritionTagline.textContent = isTe ? condition.taglineTe : condition.taglineEn;

        // Render Do's
        const dos = isTe ? condition.dosTe : condition.dosEn;
        elements.foodDosList.innerHTML = dos.map(item => `<li><span style="color: #10b981; font-weight: bold;">✔</span> <span>${item}</span></li>`).join("");

        // Render Don'ts
        const donts = isTe ? condition.dontsTe : condition.dontsEn;
        elements.foodDontsList.innerHTML = donts.map(item => `<li><span style="color: #ef4444; font-weight: bold;">✖</span> <span>${item}</span></li>`).join("");

        // Render Meal Plan
        const mp = condition.mealPlan;
        const dict = Translations[state.lang] || Translations.en;
        elements.mealPlanGrid.innerHTML = `
            <div class="meal-slot-box">
                <span class="meal-slot-title">🌅 ${dict.nutrition_meal_bf}</span>
                <p class="meal-slot-desc">${isTe ? mp.breakfastTe : mp.breakfast}</p>
            </div>
            <div class="meal-slot-box">
                <span class="meal-slot-title">☀️ ${dict.nutrition_meal_lunch}</span>
                <p class="meal-slot-desc">${isTe ? mp.lunchTe : mp.lunch}</p>
            </div>
            <div class="meal-slot-box">
                <span class="meal-slot-title">🍵 ${dict.nutrition_meal_snack}</span>
                <p class="meal-slot-desc">${isTe ? mp.snackTe : mp.snack}</p>
            </div>
            <div class="meal-slot-box">
                <span class="meal-slot-title">🌙 ${dict.nutrition_meal_dinner}</span>
                <p class="meal-slot-desc">${isTe ? mp.dinnerTe : mp.dinner}</p>
            </div>
        `;
    }

    // =========================================================================
    // 5. Mobile Navigation & Drawer System
    // =========================================================================
    function initMobileNavigation() {
        const menuBtn = document.getElementById("mobileMenuBtn");
        const drawer = document.getElementById("mobileNavDrawer");
        if (!menuBtn || !drawer) return;

        menuBtn.addEventListener("click", () => {
            const isOpen = drawer.classList.toggle("open");
            menuBtn.classList.toggle("open", isOpen);
            menuBtn.setAttribute("aria-expanded", isOpen);
        });

        document.querySelectorAll(".mobile-nav-link").forEach(link => {
            link.addEventListener("click", () => {
                drawer.classList.remove("open");
                menuBtn.classList.remove("open");
                menuBtn.setAttribute("aria-expanded", "false");
            });
        });
    }

    // =========================================================================
    // 6. Clinical Database Records & Backend Management Hub
    // =========================================================================
    let cachedRecords = {
        appointments: [],
        reports: [],
        triage: []
    };
    let activeRecordsTab = "appointments";

    function initRecordsHub() {
        if (!elements.appointmentsGridContainer) return;

        // Tab Switching
        elements.recordsTabs.forEach(btn => {
            btn.addEventListener("click", () => {
                elements.recordsTabs.forEach(b => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");

                activeRecordsTab = btn.getAttribute("data-tab");
                const apptContent = document.getElementById("tabContentAppointments");
                const repContent = document.getElementById("tabContentReports");
                const trgContent = document.getElementById("tabContentTriage");

                if (apptContent) apptContent.style.display = activeRecordsTab === "appointments" ? "block" : "none";
                if (repContent) repContent.style.display = activeRecordsTab === "reports" ? "block" : "none";
                if (trgContent) trgContent.style.display = activeRecordsTab === "triage" ? "block" : "none";

                filterAndRenderCurrentTab();
            });
        });

        // Search Filter
        if (elements.recordsSearchInput) {
            elements.recordsSearchInput.addEventListener("input", () => {
                filterAndRenderCurrentTab();
            });
        }

        // Refresh Button
        if (elements.refreshRecordsBtn) {
            elements.refreshRecordsBtn.addEventListener("click", () => {
                fetchAndRenderRecords(true);
            });
        }

        // Initial Load
        fetchAndRenderRecords(false);
    }

    function fetchAndRenderRecords(showToastFeedback = false) {
        Promise.all([
            fetch("/api/appointments").then(r => r.json()).catch(() => ({ appointments: [] })),
            fetch("/api/reports").then(r => r.json()).catch(() => ({ reports: [] })),
            fetch("/api/triage").then(r => r.json()).catch(() => ({ assessments: [] })),
            fetch("/api/stats").then(r => r.json()).catch(() => ({}))
        ]).then(([apptsData, reportsData, triageData, statsData]) => {
            cachedRecords.appointments = apptsData.appointments || [];
            cachedRecords.reports = reportsData.reports || [];
            cachedRecords.triage = triageData.assessments || [];

            // Update Counts
            if (elements.tabCountAppts) elements.tabCountAppts.textContent = cachedRecords.appointments.length;
            if (elements.tabCountReports) elements.tabCountReports.textContent = cachedRecords.reports.length;
            if (elements.tabCountTriage) elements.tabCountTriage.textContent = cachedRecords.triage.length;

            if (statsData) {
                if (elements.statAppointmentsCount) elements.statAppointmentsCount.textContent = statsData.total_appointments || cachedRecords.appointments.length;
                if (elements.statReportsCount) elements.statReportsCount.textContent = statsData.total_lab_reports || cachedRecords.reports.length;
                if (elements.statCriticalReportsCount) elements.statCriticalReportsCount.textContent = statsData.critical_reports || 0;
                if (elements.statTriageCount) elements.statTriageCount.textContent = statsData.total_triage_sessions || cachedRecords.triage.length;
            }

            filterAndRenderCurrentTab();

            if (showToastFeedback) {
                showToast("Clinical records synced with database!", "🔄");
            }
        });
    }

    function filterAndRenderCurrentTab() {
        const query = elements.recordsSearchInput ? elements.recordsSearchInput.value.trim().toLowerCase() : "";

        if (activeRecordsTab === "appointments") {
            renderAppointmentsList(query);
        } else if (activeRecordsTab === "reports") {
            renderReportsList(query);
        } else if (activeRecordsTab === "triage") {
            renderTriageList(query);
        }
    }

    function renderAppointmentsList(query) {
        const container = elements.appointmentsGridContainer;
        if (!container) return;

        const filtered = cachedRecords.appointments.filter(a => {
            if (!query) return true;
            return (a.patient_name || "").toLowerCase().includes(query) ||
                   (a.patient_phone || "").toLowerCase().includes(query) ||
                   (a.token || "").toLowerCase().includes(query) ||
                   (a.doctor_name || "").toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="records-empty-box" style="grid-column: 1 / -1;">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">📅</div>
                    <h3>No Appointments Found</h3>
                    <p style="margin-top: 6px;">No bookings match your current search or registry filter.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(a => {
            const statusClass = (a.status || "confirmed").toLowerCase();
            const isClinic = a.consult_mode === "clinic";
            return `
                <div class="record-card" data-id="${a.id}">
                    <div>
                        <div class="record-card-head">
                            <span class="record-token">#${a.token}</span>
                            <span class="record-badge ${statusClass}">${a.status}</span>
                        </div>
                        <h4 class="record-title">${a.patient_name}</h4>
                        <div class="record-subtitle">Dr: <strong>${a.doctor_name}</strong> (${a.specialty})</div>
                        <ul class="record-meta-list">
                            <li><span>📅</span> <strong>${a.appointment_date}</strong> at <strong>${a.appointment_slot}</strong></li>
                            <li><span>${isClinic ? '🏥' : '💻'}</span> ${isClinic ? 'In-Clinic Hospital Visit' : 'Telehealth Video Call'}</li>
                            <li><span>📞</span> ${a.patient_phone}</li>
                            <li><span>💵</span> Fee: ${a.fee || '₹500'} • <em>${a.hospital || 'Hospital Network'}</em></li>
                            ${a.reason ? `<li><span>💬</span> <span style="font-style: italic;">"${a.reason}"</span></li>` : ''}
                        </ul>
                    </div>
                    <div class="record-actions-row">
                        <button type="button" class="record-btn-sm btn-view-pass" data-token="${a.token}">
                            🎫 View Pass
                        </button>
                        ${a.status === 'Confirmed' ? `
                            <button type="button" class="record-btn-sm cancel-btn btn-cancel-appt" data-id="${a.id}">
                                🚫 Cancel
                            </button>
                        ` : ''}
                        <button type="button" class="record-btn-sm btn-delete-appt" data-id="${a.id}" style="color: var(--danger);">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        // Attach action listeners
        container.querySelectorAll(".btn-view-pass").forEach(btn => {
            btn.addEventListener("click", () => {
                const token = btn.getAttribute("data-token");
                const appt = cachedRecords.appointments.find(a => a.token === token);
                if (!appt) return;

                elements.bookingTokenBadge.textContent = `#${appt.token}`;
                elements.passPatientName.textContent = appt.patient_name;
                elements.passDoctorName.textContent = appt.doctor_name;
                elements.passSpecialty.textContent = appt.specialty;
                elements.passDateTime.textContent = `${appt.appointment_date} at ${appt.appointment_slot}`;
                elements.passMode.textContent = appt.consult_mode === "clinic" ? "🏥 In-Clinic Hospital Visit" : "💻 Online Telehealth Video Call";
                elements.bookingPassModal.classList.add("open");
            });
        });

        container.querySelectorAll(".btn-cancel-appt").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (!confirm("Are you sure you want to cancel this appointment?")) return;

                fetch(`/api/appointments/${id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Cancelled" })
                })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        showToast("Appointment marked as Cancelled", "🚫");
                        fetchAndRenderRecords();
                    }
                })
                .catch(err => console.error("Cancel error", err));
            });
        });

        container.querySelectorAll(".btn-delete-appt").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (!confirm("Permanently delete this appointment record from database?")) return;

                fetch(`/api/appointments/${id}`, {
                    method: "DELETE"
                })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        showToast("Appointment record deleted", "🗑️");
                        fetchAndRenderRecords();
                    }
                })
                .catch(err => console.error("Delete error", err));
            });
        });
    }

    function renderReportsList(query) {
        const container = elements.reportsGridContainer;
        if (!container) return;

        const filtered = cachedRecords.reports.filter(r => {
            if (!query) return true;
            return (r.patient_name || "").toLowerCase().includes(query) ||
                   (r.report_id || "").toLowerCase().includes(query) ||
                   (r.conclusion_text || "").toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="records-empty-box" style="grid-column: 1 / -1;">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">🧪</div>
                    <h3>No Saved Diagnostic Reports</h3>
                    <p style="margin-top: 6px;">Use the Lab Report Analyzer above to calculate and save findings to the database.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(r => {
            const status = (r.overall_status || "optimal").toLowerCase();
            const badgeLabel = status === "danger" ? "🚨 Critical Risk" : (status === "borderline" ? "⚠️ Borderline" : "✅ Normal");
            return `
                <div class="record-card" data-id="${r.id}">
                    <div>
                        <div class="record-card-head">
                            <span class="record-token">#${r.report_id}</span>
                            <span class="record-badge ${status}">${badgeLabel}</span>
                        </div>
                        <h4 class="record-title">${r.patient_name}</h4>
                        <div class="record-subtitle">Recorded: <strong>${r.created_at ? r.created_at.split(" ")[0] : "Recent"}</strong></div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: var(--bg-subtle); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 12px; font-size: 0.82rem;">
                            ${r.glucose ? `<div>🩸 FBS: <strong>${r.glucose} mg/dL</strong></div>` : ''}
                            ${r.hba1c ? `<div>📊 HbA1c: <strong>${r.hba1c}%</strong></div>` : ''}
                            ${r.bp_systolic ? `<div>💓 BP: <strong>${r.bp_systolic}/${r.bp_diastolic || 80}</strong></div>` : ''}
                            ${r.cholesterol ? `<div>🧈 Chol: <strong>${r.cholesterol} mg/dL</strong></div>` : ''}
                            ${r.hemoglobin ? `<div>🩸 Hb: <strong>${r.hemoglobin} g/dL</strong></div>` : ''}
                            ${r.creatinine ? `<div>🫘 Creat: <strong>${r.creatinine} mg/dL</strong></div>` : ''}
                        </div>

                        ${r.conclusion_text ? `
                            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
                                ${r.conclusion_text.length > 140 ? r.conclusion_text.slice(0, 140) + '...' : r.conclusion_text}
                            </p>
                        ` : ''}

                        ${r.file_path ? `
                            <div style="margin-bottom: 10px; font-size: 0.85rem;">
                                📎 <a href="${r.file_path}" target="_blank" style="color: var(--primary); font-weight: 700;">View Uploaded Document File</a>
                            </div>
                        ` : ''}
                    </div>

                    <div class="record-actions-row">
                        <button type="button" class="record-btn-sm btn-load-report-vals" data-id="${r.id}">
                            📊 Load into Analyzer
                        </button>
                        <button type="button" class="record-btn-sm btn-delete-report" data-id="${r.id}" style="color: var(--danger);">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        container.querySelectorAll(".btn-load-report-vals").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const rep = cachedRecords.reports.find(r => r.id === id);
                if (!rep) return;

                if (rep.glucose) document.getElementById("labGlucoseInput").value = rep.glucose;
                if (rep.hba1c) document.getElementById("labHba1cInput").value = rep.hba1c;
                if (rep.bp_systolic) document.getElementById("labBpSystolicInput").value = rep.bp_systolic;
                if (rep.bp_diastolic) document.getElementById("labBpDiastolicInput").value = rep.bp_diastolic;
                if (rep.cholesterol) document.getElementById("labCholesterolInput").value = rep.cholesterol;
                if (rep.hemoglobin) document.getElementById("labHemoglobinInput").value = rep.hemoglobin;
                if (rep.creatinine) document.getElementById("labCreatinineInput").value = rep.creatinine;

                analyzeLabReport(true);
                showToast("Loaded saved lab report into analyzer!", "🩸");
            });
        });

        container.querySelectorAll(".btn-delete-report").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (!confirm("Permanently delete this lab report from database?")) return;

                fetch(`/api/reports/${id}`, { method: "DELETE" })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        showToast("Lab report deleted", "🗑️");
                        fetchAndRenderRecords();
                    }
                })
                .catch(err => console.error("Delete report error", err));
            });
        });
    }

    function renderTriageList(query) {
        const container = elements.triageGridContainer;
        if (!container) return;

        const filtered = cachedRecords.triage.filter(t => {
            if (!query) return true;
            return (t.patient_name || "").toLowerCase().includes(query) ||
                   (t.assessment_id || "").toLowerCase().includes(query) ||
                   (t.title || "").toLowerCase().includes(query) ||
                   (t.concern || "").toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="records-empty-box" style="grid-column: 1 / -1;">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">🩺</div>
                    <h3>No Triage Assessment History</h3>
                    <p style="margin-top: 6px;">Evaluate symptoms in the Symptom Triage section above and click 'Save Assessment to History'.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(t => {
            const levelClass = t.triage_level === 1 ? 'danger' : (t.triage_level === 2 ? 'borderline' : 'optimal');
            const levelLabel = t.triage_level === 1 ? '🚨 Level 1 Emergency' : (t.triage_level === 2 ? '⚠️ Level 2 Urgent' : '✅ Non-Urgent');
            return `
                <div class="record-card" data-id="${t.id}">
                    <div>
                        <div class="record-card-head">
                            <span class="record-token">#${t.assessment_id}</span>
                            <span class="record-badge ${levelClass}">${levelLabel}</span>
                        </div>
                        <h4 class="record-title">${t.title || "Clinical Assessment"}</h4>
                        <div class="record-subtitle">Patient: <strong>${t.patient_name || "Self"}</strong> • Pain Severity: <strong>${t.severity || 5}/10</strong></div>
                        ${t.concern ? `<p style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 10px; font-style: italic;">"${t.concern}"</p>` : ''}
                        ${t.possible_causes && Array.isArray(t.possible_causes) && t.possible_causes.length ? `
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">
                                <strong>Reviewed Conditions:</strong> ${t.possible_causes.slice(0, 2).join(", ")}
                            </div>
                        ` : ''}
                    </div>

                    <div class="record-actions-row">
                        <button type="button" class="record-btn-sm btn-delete-triage" data-id="${t.id}" style="color: var(--danger);">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        container.querySelectorAll(".btn-delete-triage").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (!confirm("Permanently delete this triage session from database?")) return;

                fetch(`/api/triage/${id}`, { method: "DELETE" })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        showToast("Triage record deleted", "🗑️");
                        fetchAndRenderRecords();
                    }
                })
                .catch(err => console.error("Delete triage error", err));
            });
        });
    }

    // Initialize all modules
    initTheme();
    initMobileNavigation();
    initVideoConsultation();
    initAppointmentBooking();
    initLabReportAnalyzer();
    initHealthyFoodHub();
    initRecordsHub();
    applyTranslations("en");
});


