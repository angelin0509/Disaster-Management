import { SupportedLanguage } from '../types';

export interface Translations {
  [key: string]: {
    en: string;
    ta: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Brand & Navigation
  brandName: {
    en: 'DisasterShield',
    ta: 'டிசாஸ்டர்ஷீல்ட் (DisasterShield)',
    hi: 'डिसास्टरशील्ड (DisasterShield)'
  },
  brandTagline: {
    en: 'Emergency Response Coordination System',
    ta: 'பேரிடர் மேலாண்மை மற்றும் அவசர மீட்பு ஒருங்கிணைப்பு அமைப்பு',
    hi: 'आपदा प्रबंधन एवं आपातकालीन समन्वय प्रणाली'
  },
  navHome: {
    en: 'Home',
    ta: 'முகப்பு',
    hi: 'होम'
  },
  navPeople: {
    en: 'People Portal',
    ta: 'பொதுமக்கள் தளம்',
    hi: 'नागरिक पोर्टल'
  },
  navVolunteer: {
    en: 'Volunteer Portal',
    ta: 'தன்னார்வலர் தளம்',
    hi: 'स्वयंसेवक पोर्टल'
  },
  navRescue: {
    en: 'Rescue Team',
    ta: 'மீட்புக் குழு',
    hi: 'राहत एवं बचाव दल'
  },
  navHeadOffice: {
    en: 'Head Office',
    ta: 'தலைமை அலுவலகம்',
    hi: 'मुख्यालय'
  },
  navLogin: {
    en: 'Sign In',
    ta: 'உள்நுழைக',
    hi: 'साइन इन करें'
  },
  navLogout: {
    en: 'Sign Out',
    ta: 'வெளியேறு',
    hi: 'साइन आउट'
  },
  navQuickReport: {
    en: 'Report Emergency',
    ta: 'அவசர உதவி கோருக',
    hi: 'आपातकालीन सहायता मांगें'
  },
  twoLaptopGuide: {
    en: 'Two-Laptop Setup Guide',
    ta: 'இரண்டு மடிக்கணினி வழிகாட்டி',
    hi: 'दो-लैपटॉप सेटअप गाइड'
  },

  // Hero Section
  heroTitle: {
    en: 'Rapid Crisis Response. Unified Community Protection.',
    ta: 'விரைவான பேரிடர் மீட்பு. ஒருங்கிணைந்த சமூகப் பாதுகாப்பு.',
    hi: 'त्वरित संकट प्रतिक्रिया। एकीकृत सामुदायिक सुरक्षा।'
  },
  heroSubtitle: {
    en: 'A centralized disaster management platform connecting citizens in distress with verified volunteers, rapid-deployment rescue forces, and central administrative commanders.',
    ta: 'துயரத்தில் உள்ள பொதுமக்களை சரிபார்க்கப்பட்ட தன்னார்வலர்கள், அதிவிரைவு மீட்புக் குழுக்கள் மற்றும் தலைமை அதிகாரிகளுடன் நேரடியாக இணைக்கும் மையப்படுத்தப்பட்ட பேரிடர் மேலாண்மை தளம்.',
    hi: 'संकट में फंसे नागरिकों को सत्यापित स्वयंसेवकों, त्वरित बचाव दलों और केंद्रीय प्रशासनिक कमांडरों से सीधे जोड़ने वाला आपदा प्रबंधन मंच।'
  },
  heroCtaReport: {
    en: 'Report an Emergency Now',
    ta: 'இப்போதே அவசர உதவி கோருக',
    hi: 'तुरंत आपातकालीन सहायता मांगें'
  },
  heroCtaExplore: {
    en: 'Explore Operation Portals',
    ta: 'இயக்க தளங்களை ஆராய்க',
    hi: 'संचालन पोर्टल देखें'
  },
  helplineCallout: {
    en: 'National Emergency Number for India: Dial 112',
    ta: 'இந்தியாவின் தேசிய அவசர உதவி எண்: 112 ஐ அழைக்கவும்',
    hi: 'भारत के लिए राष्ट्रीय आपातकालीन नंबर: 112 डायल करें'
  },
  prototypeNotice: {
    en: 'Student Demonstration Prototype — All 4 portals share one live SQLite relational database with real-time synchronization.',
    ta: 'மாணவர் செயல்விளக்க மாதிரி — அனைத்து 4 தளங்களும் ஒரே நேரடி SQLite தரவுத்தளத்துடன் நிகழ்நேர ஒத்திசைவுடன் இயங்குகின்றன.',
    hi: 'छात्र प्रदर्शन प्रोटोटाइप — सभी 4 पोर्टल रीयल-टाइम सिंक्रोनाइज़ेशन के साथ एक ही लाइव SQLite डेटाबेस साझा करते हैं।'
  },

  // Portal Cards
  portalCardsHeading: {
    en: 'Dedicated Operational Portals',
    ta: 'பிரத்யேக செயல்பாட்டுத் தளங்கள்',
    hi: 'समर्पित परिचालन पोर्टल'
  },
  portalCardsSubtitle: {
    en: 'Select the appropriate access gateway to manage emergency reports, volunteer fieldwork, dispatch logistics, or executive disaster analytics.',
    ta: 'அவசர அறிக்கைகள், தன்னார்வலர் பணிகள், மீட்புப் பணிகள் அல்லது தலைமை அறிக்கைகளை நிர்வகிக்க பொருத்தமான தளத்தைத் தேர்ந்தெடுக்கவும்.',
    hi: 'आपातकालीन रिपोर्ट, स्वयंसेवक कार्य, बचाव कार्य या मुख्य विश्लेषिकी को प्रबंधित करने के लिए उपयुक्त पोर्टल चुनें।'
  },

  peoplePortalCardTitle: {
    en: 'People Portal',
    ta: 'பொதுமக்கள் தளம்',
    hi: 'नागरिक पोर्टल'
  },
  peoplePortalCardDesc: {
    en: 'Submit emergency assistance requests with contact details, location, and affected count. Track request status in real time.',
    ta: 'தொடர்பு விவரங்கள், இருப்பிடம் மற்றும் பாதிக்கப்பட்டோர் எண்ணிக்கையுடன் அவசர உதவி கோரிக்கைகளை சமர்ப்பியுங்கள். நிலையை நிகழ்நேரத்தில் கண்காணியுங்கள்.',
    hi: 'संपर्क विवरण, स्थान और प्रभावित लोगों की संख्या के साथ आपातकालीन सहायता अनुरोध सबमिट करें। रीयल-टाइम में स्थिति ट्रैक करें।'
  },
  peoplePortalCardBtn: {
    en: 'Request Assistance',
    ta: 'உதவி கோருக',
    hi: 'सहायता का अनुरोध करें'
  },

  volunteerPortalCardTitle: {
    en: 'Volunteer Portal',
    ta: 'தன்னார்வலர் தளம்',
    hi: 'स्वयंसेवक पोर्टल'
  },
  volunteerPortalCardDesc: {
    en: 'Register with specialized skills, toggle active availability, accept assigned field relief missions, and submit task completion updates.',
    ta: 'திறன்களைப் பதிவு செய்து, களப்பணிப் பணிகளை ஏற்றுக்கொண்டு, நிவாரணப் பணிகளை நிறைவு செய்து நிலை அறிக்கைகளை அளியுங்கள்.',
    hi: 'विशेष कौशलों के साथ पंजीकरण करें, उपलब्धता अपडेट करें, सौंपे गए राहत कार्यों को स्वीकार करें और पूर्णता रिपोर्ट भेजें।'
  },
  volunteerPortalCardBtn: {
    en: 'Open Volunteer Desk',
    ta: 'தன்னார்வலர் தளம் செல்க',
    hi: 'स्वयंसेवक डेस्क खोलें'
  },

  rescuePortalCardTitle: {
    en: 'Rescue Team Portal',
    ta: 'மீட்புக் குழு தளம்',
    hi: 'राहत एवं बचाव पोर्टल'
  },
  rescuePortalCardDesc: {
    en: 'Review incoming emergency requests, inspect location coordinates on live map, assign certified volunteers, and advance triage status.',
    ta: 'அவசர கோரிக்கைகளை ஆய்வு செய்து, வரைபடத்தில் இருப்பிடத்தைக் கண்டு, தன்னார்வலர்களை நியமித்து நிலை மாற்றங்களை மேற்கொள்ளுங்கள்.',
    hi: 'आपातकालीन अनुरोधों की समीक्षा करें, मानचित्र पर स्थान देखें, स्वयंसेवकों को कार्य सौंपें और बचाव स्थिति अपडेट करें।'
  },
  rescuePortalCardBtn: {
    en: 'Access Dispatch Console',
    ta: 'மீட்புக் கட்டுப்பாட்டகம்',
    hi: 'बचाव कंसोल खोलें'
  },

  headOfficeCardTitle: {
    en: 'Head Office Portal',
    ta: 'தலைமை அலுவலகம்',
    hi: 'मुख्यालय पोर्टल'
  },
  headOfficeCardDesc: {
    en: 'High-level crisis intelligence, real-time database charts, response distribution metrics, system audit logs, and downloadable CSV incident reports.',
    ta: 'உயர்நிலை மேலாண்மை அறிக்கைகள், நிகழ்நேர வரைபடங்கள், பதில்வீத அளவீடுகள் மற்றும் பதிவிறக்கக்கூடிய விரிவான CSV அறிக்கைகள்.',
    hi: 'उच्च-स्तरीय संकट विश्लेषिकी, रीयल-टाइम डेटाबेस चार्ट, प्रतिक्रिया प्रगति और डाउनलोड करने योग्य CSV रिपोर्ट।'
  },
  headOfficeCardBtn: {
    en: 'View Command Analytics',
    ta: 'தலைமை புள்ளிவிவரங்கள்',
    hi: 'कमांड एनालिटिक्स देखें'
  },

  // Emergency Safety Notice
  safetyNoticeTitle: {
    en: 'Important Emergency Safety Advisory',
    ta: 'முக்கிய அவசர பாதுகாப்பு அறிவிப்பு',
    hi: 'महत्वपूर्ण आपातकालीन सुरक्षा सलाह'
  },
  safetyNoticeBody: {
    en: 'If you or someone around you is in immediate, severe life-threatening danger, always call 112 (National Emergency Helpline) or local emergency police/fire brigades first. DisasterShield operates as an academic prototype coordination system.',
    ta: 'உங்களுக்கோ அல்லது உங்களைச் சுற்றியுள்ளவர்களுக்கோ உயிருக்கு உடனடி ஆபத்து ஏற்பட்டால், உடனடியாக 112 (தேசிய அவசர உதவி எண்) அல்லது காவல்துறை/தீயணைப்புத் துறையை அழைக்கவும். DisasterShield என்பது கல்வி செயல்விளக்கத்திற்கான ஒருங்கிணைப்பு அமைப்பாகும்.',
    hi: 'यदि आप या आपके आसपास कोई गंभीर जीवन-घातक खतरे में है, तो हमेशा पहले 112 (राष्ट्रीय आपातकालीन हेल्पलाइन) या स्थानीय पुलिस/दमकल सेवा को कॉल करें। डिसास्टरशील्ड एक शैक्षणिक प्रोटोटाइप समन्वय प्रणाली है।'
  },

  // Login Page
  loginHeading: {
    en: 'Portal Access Authentication',
    ta: 'தள அணுகல் உள்நுழைவு',
    hi: 'पोर्टल एक्सेस प्रमाणीकरण'
  },
  loginSubtitle: {
    en: 'Secure role-based access for Citizens, Volunteers, Rescue Personnel, and Head Office Commanders.',
    ta: 'பொதுமக்கள், தன்னார்வலர்கள், மீட்புக் குழுவினர் மற்றும் தலைமை அதிகாரிகளுக்கான பாதுகாப்பான உள்நுழைவு.',
    hi: 'नागरिकों, स्वयंसेवकों, बचाव कर्मियों और मुख्यालय कमांडरों के लिए सुरक्षित भूमिका-आधारित एक्सेस।'
  },
  selectRole: {
    en: 'Select Portal / Role',
    ta: 'தளம் / பொறுப்பைத் தேர்ந்தெடுக்கவும்',
    hi: 'पोर्टल / भूमिका चुनें'
  },
  rolePeople: {
    en: 'Citizen (People Portal)',
    ta: 'பொதுமக்கள் (People Portal)',
    hi: 'नागरिक (People Portal)'
  },
  roleVolunteer: {
    en: 'Volunteer (Field Assistance)',
    ta: 'தன்னார்வலர் (Volunteer)',
    hi: 'स्वयंसेवक (Volunteer)'
  },
  roleRescue: {
    en: 'Rescue Team (Search & Rescue)',
    ta: 'மீட்புக் குழு (Rescue Team)',
    hi: 'राहत दल (Rescue Team)'
  },
  roleHeadOffice: {
    en: 'Head Office (Administration)',
    ta: 'தலைமை அலுவலகம் (Head Office)',
    hi: 'मुख्यालय (Head Office)'
  },
  usernameOrEmail: {
    en: 'Username or Email',
    ta: 'பயனர்பெயர் அல்லது மின்னஞ்சல்',
    hi: 'उपयोगकर्ता नाम या ईमेल'
  },
  password: {
    en: 'Password',
    ta: 'கடவுச்சொல்',
    hi: 'पासवर्ड'
  },
  showPassword: {
    en: 'Show',
    ta: 'காட்டு',
    hi: 'दिखाएँ'
  },
  hidePassword: {
    en: 'Hide',
    ta: 'மறை',
    hi: 'छिपाएँ'
  },
  btnSignIn: {
    en: 'Sign In to Portal',
    ta: 'தளத்தில் உள்நுழைக',
    hi: 'पोर्टल में साइन इन करें'
  },
  quickDemoAccounts: {
    en: 'Quick Demo Credentials (Click to autofill for Viva / Demo):',
    ta: 'மாதிரி கணக்கு விவரங்கள் (தானாக நிரப்ப கிளிக் செய்க):',
    hi: 'त्वरित डेमो क्रेडेंशियल्स (ऑटोफिल के लिए क्लिक करें):'
  },
  orRegisterVolunteer: {
    en: 'New volunteer? Register an account here',
    ta: 'புதிய தன்னார்வலரா? இங்கே பதிவு செய்யுங்கள்',
    hi: 'नए स्वयंसेवक? यहाँ पंजीकरण करें'
  },

  // People Portal Form
  peopleFormHeading: {
    en: 'Submit Emergency Assistance Request',
    ta: 'அவசர உதவி கோரிக்கையை சமர்ப்பிக்கவும்',
    hi: 'आपातकालीन सहायता अनुरोध सबमिट करें'
  },
  peopleFormSubheading: {
    en: 'Your emergency submission is securely recorded in the centralized database and immediately alerted to active rescue dispatchers.',
    ta: 'உங்கள் கோரிக்கை மைய தரவுத்தளத்தில் பதிவு செய்யப்பட்டு உடனடி மீட்புக் குழுவினருக்கு தெரிவிக்கப்படும்.',
    hi: 'आपका अनुरोध केंद्रीय डेटाबेस में सुरक्षित रूप से दर्ज किया जाएगा और बचाव दल को तुरंत सूचित किया जाएगा।'
  },
  fullName: {
    en: 'Full Name',
    ta: 'முழுப் பெயர்',
    hi: 'पूरा नाम'
  },
  contactPhone: {
    en: 'Contact Phone Number',
    ta: 'தொடர்பு தொலைபேசி எண்',
    hi: 'संपर्क फोन नंबर'
  },
  locationArea: {
    en: 'Location / Affected Area / Address',
    ta: 'இருப்பிடம் / பாதிக்கப்பட்ட பகுதி / முகவரி',
    hi: 'स्थान / प्रभावित क्षेत्र / पता'
  },
  emergencyCategory: {
    en: 'Emergency Category',
    ta: 'அவசரநிலைப் பிரிவு',
    hi: 'आपातकालीन श्रेणी'
  },
  peopleAffectedCount: {
    en: 'Number of People Affected',
    ta: 'பாதிக்கப்பட்ட நபர்களின் எண்ணிக்கை',
    hi: 'प्रभावित लोगों की संख्या'
  },
  additionalDetails: {
    en: 'Emergency Description & Special Needs (Optional)',
    ta: 'கூடுதல் விவரங்கள் மற்றும் தேவைகள் (விருப்பத்தேர்வு)',
    hi: 'अतिरिक्त विवरण और आवश्यकताएं (वैकल्पिक)'
  },
  detailsPlaceholder: {
    en: 'E.g., Water rising rapidly, elderly person requiring insulin, power outage, building entrance blocked...',
    ta: 'எ.கா., நீர்மட்டம் உயர்கிறது, முதியவருக்கு அவசர மருந்து தேவை, மின்சாரம் இல்லை...',
    hi: 'उदा. पानी तेजी से बढ़ रहा है, बुजुर्ग व्यक्ति को इंसुलिन की जरूरत है, रास्ता बंद है...'
  },
  btnSubmitEmergency: {
    en: 'Submit Urgent Assistance Request',
    ta: 'அவசர கோரிக்கையை சமர்ப்பிக்கவும்',
    hi: 'आपातकालीन सहायता अनुरोध भेजें'
  },
  submitting: {
    en: 'Submitting to database...',
    ta: 'தரவுத்தளத்தில் பதிவாகிறது...',
    hi: 'डेटाबेस में भेजा जा रहा है...'
  },

  // Categories
  catFlood: {
    en: 'Flood',
    ta: 'வெள்ளம்',
    hi: 'बाढ़'
  },
  catFire: {
    en: 'Fire',
    ta: 'தீ விபத்து',
    hi: 'आग'
  },
  catMedical: {
    en: 'Medical Emergency',
    ta: 'மருத்துவ அவசரநிலை',
    hi: 'चिकित्सा आपातकाल'
  },
  catBuildingDamage: {
    en: 'Building Damage',
    ta: 'கட்டிட சேதம்',
    hi: 'इमारत क्षति'
  },
  catTrappedPerson: {
    en: 'Trapped Person',
    ta: 'சிக்கிய நபர்',
    hi: 'फंसे हुए व्यक्ति'
  },
  catCyclone: {
    en: 'Cyclone',
    ta: 'புயல்',
    hi: 'चक्रवात'
  },
  catEarthquake: {
    en: 'Earthquake',
    ta: 'நிலநடுக்கம்',
    hi: 'भूकंप'
  },
  catOther: {
    en: 'Other',
    ta: 'பிற அவசரநிலை',
    hi: 'अन्य'
  },

  // Statuses
  statusPending: {
    en: 'Pending',
    ta: 'நிலுவையில்',
    hi: 'लंबित'
  },
  statusInProgress: {
    en: 'In Progress',
    ta: 'நடவடிக்கையில்',
    hi: 'प्रगति पर'
  },
  statusCompleted: {
    en: 'Completed',
    ta: 'நிறைவடைந்தது',
    hi: 'पूर्ण'
  },

  // Tracking & Confirmation
  requestConfirmedTitle: {
    en: 'Emergency Request Recorded',
    ta: 'அவசர கோரிக்கை வெற்றிகரமாகப் பதிவானது',
    hi: 'आपातकालीन अनुरोध सफलतापूर्वक दर्ज किया गया'
  },
  requestIdLabel: {
    en: 'Your Unique Request Tracking ID',
    ta: 'உங்கள் பிரத்யேக கண்காணிப்பு அடையாள எண்',
    hi: 'आपकी विशिष्ट ट्रैकिंग आईडी'
  },
  keepIdNote: {
    en: 'Please save this ID to check your status updates anytime.',
    ta: 'நிலை மாற்றங்களை கண்காணிக்க இந்த அடையாள எண்ணை குறித்துக்கொள்ளவும்.',
    hi: 'स्थिति जांचने के लिए कृपया इस ट्रैकिंग आईडी को सुरक्षित रखें।'
  },
  trackHeading: {
    en: 'Track Existing Request Status',
    ta: 'முந்தைய கோரிக்கையின் நிலையைச் சரிபார்க்கவும்',
    hi: 'मौजूदा अनुरोध की स्थिति ट्रैक करें'
  },
  btnTrack: {
    en: 'Search Status',
    ta: 'நிலையைக் கண்டறிக',
    hi: 'स्थिति देखें'
  },

  // Volunteer Portal
  volunteerHeading: {
    en: 'Volunteer Operations Portal',
    ta: 'தன்னார்வலர் இயக்க தளம்',
    hi: 'स्वयंसेवक संचालन पोर्टल'
  },
  volunteerProfile: {
    en: 'Volunteer Profile & Status',
    ta: 'தன்னார்வலர் சுயவிவரம்',
    hi: 'स्वयंसेवक प्रोफ़ाइल और स्थिति'
  },
  availabilityLabel: {
    en: 'Current Availability Status',
    ta: 'தற்போதைய கிடைக்கும் நிலை',
    hi: 'वर्तमान उपलब्धता स्थिति'
  },
  availAvailable: {
    en: 'Available for Missions',
    ta: 'பணிக்கு தயார்',
    hi: 'राहत कार्य हेतु उपलब्ध'
  },
  availBusy: {
    en: 'Currently on Task',
    ta: 'பணியில் உள்ளார்',
    hi: 'वर्तमान में कार्य में व्यस्त'
  },
  availOffDuty: {
    en: 'Off-Duty / Rest',
    ta: 'ஓய்வில் உள்ளார்',
    hi: 'अवकाश पर'
  },
  skillsLabel: {
    en: 'Registered Relief Skills',
    ta: 'பதிவு செய்யப்பட்ட திறன்கள்',
    hi: 'पंजीकृत राहत कौशल'
  },
  assignedTasksHeading: {
    en: 'Your Assigned Relief Tasks',
    ta: 'உங்களுக்கு ஒதுக்கப்பட்ட களப்பணிகள்',
    hi: 'आपको सौंपे गए राहत कार्य'
  },
  noTasksAssigned: {
    en: 'No pending missions assigned at this moment. You will be notified when rescue commanders allocate a relief task in your area.',
    ta: 'தற்போது பணிகள் எதுவும் ஒதுக்கப்படவில்லை. மீட்புக் குழுவினர் பணி ஒதுக்கும்போது இங்கே தோன்றும்.',
    hi: 'इस समय कोई कार्य नहीं सौंपा गया है। कमांडरों द्वारा कार्य सौंपे जाने पर यह यहाँ दिखाई देगा।'
  },
  btnAcceptTask: {
    en: 'Accept Mission',
    ta: 'பணியை ஏற்கவும்',
    hi: 'कार्य स्वीकार करें'
  },
  btnDeclineTask: {
    en: 'Decline',
    ta: 'நிராகரி',
    hi: 'अस्वीकार करें'
  },
  btnCompleteTask: {
    en: 'Mark Mission Completed',
    ta: 'பணி நிறைவடைந்தது எனக் குறிக்கவும்',
    hi: 'कार्य पूर्ण मार्क करें'
  },

  // Rescue Portal
  rescueDashboardTitle: {
    en: 'Rescue Command & Dispatch Dashboard',
    ta: 'மீட்புக் கட்டுப்பாட்டகம் மற்றும் பணி ஒதுக்கீடு',
    hi: 'राहत व बचाव कमान एवं डिस्पैच डैशबोर्ड'
  },
  statTotalRequests: {
    en: 'Total Requests',
    ta: 'மொத்த கோரிக்கைகள்',
    hi: 'कुल अनुरोध'
  },
  statPendingRequests: {
    en: 'Pending Triage',
    ta: 'நிலுவையில் உள்ளவை',
    hi: 'लंबित अनुरोध'
  },
  statInProgress: {
    en: 'Operations in Progress',
    ta: 'நடவடிக்கையில் உள்ளவை',
    hi: 'प्रगति पर कार्य'
  },
  statCompleted: {
    en: 'Successfully Resolved',
    ta: 'நிறைவடைந்தவை',
    hi: 'सफलतापूर्वक पूर्ण'
  },
  statAvailableVolunteers: {
    en: 'Available Volunteers',
    ta: 'தயாராக உள்ள தன்னார்வலர்கள்',
    hi: 'उपलब्ध स्वयंसेवक'
  },
  statPeopleAssisted: {
    en: 'Persons Evacuated / Assisted',
    ta: 'காப்பாற்றப்பட்ட நபர்கள்',
    hi: 'सहायता प्राप्त नागरिक'
  },
  searchPlaceholder: {
    en: 'Search by ID, name, location or details...',
    ta: 'அடையாள எண், பெயர் அல்லது பகுதியால் தேடுக...',
    hi: 'आईडी, नाम या स्थान से खोजें...'
  },
  filterStatus: {
    en: 'Filter by Status',
    ta: 'நிலை வாரியாக வடிகட்டுக',
    hi: 'स्थिति अनुसार फ़िल्टर करें'
  },
  filterCategory: {
    en: 'Filter by Category',
    ta: 'பிரிவு வாரியாக வடிகட்டுக',
    hi: 'श्रेणी अनुसार फ़िल्टर करें'
  },
  btnUpdateStatus: {
    en: 'Update Status',
    ta: 'நிலையை மாற்றுக',
    hi: 'स्थिति बदलें'
  },
  btnAssignVolunteer: {
    en: 'Assign Volunteer',
    ta: 'தன்னார்வலரை நியமிக்க',
    hi: 'स्वयंसेवक नियुक्त करें'
  },
  interactiveIncidentMap: {
    en: 'Incident Geography & Status Map',
    ta: 'சம்பவ வரைபடம் மற்றும் இருப்பிடங்கள்',
    hi: 'घटना स्थल एवं स्थिति मानचित्र'
  },
  liveSyncNotice: {
    en: 'Live Database Polling (Synced every 3s across all connected laptops)',
    ta: 'நிகழ்நேர தரவுத்தள ஒத்திசைவு (ஒவ்வொரு 3 வினாடிக்கும் புதுப்பிக்கப்படுகிறது)',
    hi: 'लाइव डेटाबेस सिंक (प्रत्येक 3 सेकंड में सभी लैपटॉप पर अपडेट)'
  },

  // Head Office Portal
  headOfficeHeading: {
    en: 'Head Office Disaster Command & Analytics',
    ta: 'தலைமை அலுவலக பேரிடர் மேலாண்மை மற்றும் பகுப்பாய்வு',
    hi: 'मुख्यालय आपदा कमान एवं विश्लेषिकी'
  },
  btnExportCsv: {
    en: 'Export Requests as CSV',
    ta: 'CSV கோப்பாக பதிவிறக்குக',
    hi: 'CSV रिपोर्ट डाउनलोड करें'
  },
  categoryDistributionTitle: {
    en: 'Emergency Incidents by Category',
    ta: 'பிரிவு வாரியாக அவசர சம்பவங்கள்',
    hi: 'श्रेणी अनुसार आपातकालीन घटनाएं'
  },
  statusBreakdownTitle: {
    en: 'Operational Status Breakdown',
    ta: 'செயல்பாட்டு நிலை புள்ளிவிவரம்',
    hi: 'परिचालन स्थिति विवरण'
  },
  recentIncidentLog: {
    en: 'Recent Emergency Intake & Audit Feed',
    ta: 'சமீபத்திய அவசர கோரிக்கைகள் பதிவு',
    hi: 'हाल की आपातकालीन प्रविष्टियाँ और ऑडिट'
  },

  // Common actions & table headers
  thRequestId: {
    en: 'Request ID',
    ta: 'கோரிக்கை எண்',
    hi: 'अनुरोध आईडी'
  },
  thRequester: {
    en: 'Requester',
    ta: 'விண்ணப்பதாரர்',
    hi: 'आवेदक'
  },
  thCategory: {
    en: 'Category',
    ta: 'பிரிவு',
    hi: 'श्रेणी'
  },
  thArea: {
    en: 'Area / Location',
    ta: 'பகுதி / இருப்பிடம்',
    hi: 'क्षेत्र / स्थान'
  },
  thPeople: {
    en: 'People Count',
    ta: 'நபர்கள்',
    hi: 'लोग'
  },
  thStatus: {
    en: 'Status',
    ta: 'நிலை',
    hi: 'स्थिति'
  },
  thTime: {
    en: 'Submitted At',
    ta: 'நேரம்',
    hi: 'समय'
  },
  thActions: {
    en: 'Actions',
    ta: 'செயல்கள்',
    hi: 'कार्रवाई'
  },
  noRecordsFound: {
    en: 'No records matching the filter criteria found in the database.',
    ta: 'தேர்வு செய்த வடிகட்டலுக்குரிய பதிவுகள் ஏதும் தரவுத்தளத்தில் இல்லை.',
    hi: 'डेटाबेस में कोई रिकॉर्ड नहीं मिला।'
  },
  closeBtn: {
    en: 'Close',
    ta: 'மூடுக',
    hi: 'बंद करें'
  },
  saveChanges: {
    en: 'Save Changes',
    ta: 'மாற்றங்களைச் சேமிக்க',
    hi: 'परिवर्तन सहेजें'
  },
  cancel: {
    en: 'Cancel',
    ta: 'ரத்து செய்',
    hi: 'रद्द करें'
  }
};

export function getTranslation(key: string, lang: SupportedLanguage): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  if (translations[key] && translations[key].en) {
    return translations[key].en;
  }
  return key;
}
