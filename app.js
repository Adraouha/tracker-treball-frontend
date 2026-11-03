// Controlador principal de la aplicacion Tracker Treball
// Autor: Hassan Adraou

// Estado global de la aplicacion
const AppState = {
  isLoggedIn: false,
  language: "es",
  theme: "light",
  currentView: "dashboard",
  timerSeconds: 0,
  shiftStarted: false,
  isOnBreak: false,
  isFinished: false,
  timerInterval: null,
  breakInterval: null,
  clockInTime: null,
  clockOutTime: null,
  currentBreak: null,
  breaksHistory: [],
  selectedBreakType: "cafe",
  selectedBreakMinutes: 15,
  selectedBreakTypeName: "Pausa de Café",
  employeeList: [],
  filteredEmployees: [],
  empTabFilter: "all",
  empCurrentPage: 1,
  empPageSize: 8,
  currentUser: {
    id: 1,
    name: "Hassan Adraou",
    email: "hassan.adraou@test.es",
    role: "Arquitecto de Software & Superadministrador",
    privilege: "ADMIN",
    department: "Tecnología",
    status: "Activo",
    avatar: "HA"
  },
  currentExportSource: "employees",
  vacationBalance: { total: 22, used: 5, pending: 4, remaining: 13 },
  myVacations: [],
  supervisorVacations: [],
  holidaysList: [],
  currentVacSubTab: "my",
  weatherData: null,
  trafficData: null
};

// Textos completos en Català y Castellano para traduccion total
const I18N = {
  ca: {
    // Navbar
    searchPlaceholder: "Cercar empleats, projectes, jornades...",
    btnSearch: "Cercar",
    btnTheme: "Mode Nocturn",
    themeNight: "Mode Nocturn",
    themeDay: "Mode Diari",
    themeNightTitle: "Canviar a mode nocturn",
    themeDayTitle: "Canviar a mode diari",
    btnLogout: "Sortir",
    roleAdmin: "Administrador General (ADMIN)",
    
    // Sidebar
    workspace: "ESPAI DE TREBALL",
    navDashboard: "Tauler",
    navEmployees: "Empleats",
    navShifts: "Jornades",
    navBreaks: "Pauses",
    navVacations: "Vacances",
    navMedicalLeaves: "Baixes mèdiques",
    navProjects: "Projectes",
    navPrl: "PRL Help Center",
    helpTitle: "Som aquí per ajudar-te",
    helpSub: "Guies i suport per al teu equip.",
    helpBtn: "Centre d'ajuda PRL →",

    // Login
    loginTitle: "Et donem la benvinguda",
    loginSub: "Accedeix al teu espai de treball amb el teu compte d'organització.",
    lblUser: "Usuari",
    lblPassword: "Contrasenya",
    rememberMe: "Recorda'm",
    forgotPassword: "Recuperar contrasenya",
    btnLogin: "Iniciar sessió",
    btnDemo: "Entrar directament a Empleats / Tauler",
    secureFooter: "Connexió segura · Protecció de dades",

    // Dashboard y Fichaje
    welcome: "Bon dia",
    greetingDate: "Dilluns, 2 de novembre de 2026 · Vic, Barcelona (14°C, Parcialment ennuvolat)",
    badgeNotStarted: "JORNADA NO INICIADA",
    badgeActive: "JORNADA EN CURS",
    badgeBreak: "EN PAUSA",
    badgeFinished: "JORNADA TANCADA",
    lblSchedule: "Horari contractual: 09:00 → 17:30 · Entrada: ",
    lblClockInPending: "Pendent de registre",
    lblClockOutPending: "--:--",
    btnStartShift: "Iniciar Jornada",
    btnStartBreak: "Iniciar Pausa",
    btnEndBreak: "Finalitzar Pausa",
    btnFinishShift: "Finalitzar Jornada",
    breakModalTitle: "Seleccionar tipus de pausa",
    breakModalSub: "Tria la modalitat de pausa reglamentària per computar el temps de descans:",
    breakCafeTitle: "Pausa de Cafè / Esmorzar (15 min)",
    breakCafeDesc: "Pausa curta recomanada per descans visual de pantalles PVD (PRL).",
    breakDescansoTitle: "Pausa de Descans (30 min)",
    breakDescansoDesc: "Pausa de mitja jornada per recuperació de fatiga i desconnexió.",
    breakAlmuerzoTitle: "Pausa de Dinar / Menjar (1 hora)",
    breakAlmuerzoDesc: "Pausa principal diària per dinar estipulada en conveni.",
    btnConfirmBreak: "Iniciar Pausa",
    breakActivePrefix: "Pausa en curs: ",
    breakLimitPrefix: "Límit establert: ",
    breakExcessWarning: "Atenció: Has superat el temps establert de pausa en +{N} minuts.",
    breakExcessAlert: "Has superat el temps de pausa en {N} minuts addicionals.\nS'ha registrat a la base de dades amb el comentari: '+{N} minuts de pausa'.",
    breakNormalAlert: "Pausa finalitzada correctament dins del temps reglamentari.",
    finishShiftConfirm: "Vols finalitzar la jornada laboral d'avui?",
    finishShiftAlert: "Jornada finalitzada i registrada amb èxit. Hash SHA-256 generat.",
    cardProd: "Productivitat",
    cardProdTitle: "Hores setmanals",
    cardProj: "Projecte actual",
    cardCommute: "Desplaçament",
    btnRoute: "Veure ruta recomanada →",
    cardNotices: "Recordatoris i avisos",
    cardCalendar: "Calendari laboral",

    // Empleats
    breadcrumbEmp: "La meva organització › Empleats",
    empHeading: "Persones que fan equip",
    empSub: "Gestiona perfils, departaments i disponibilitat des d'un únic lloc.",
    btnNewEmp: "+ Nou Empleat",
    kpiActives: "Empleats actius",
    kpiActivesNote: "En 4 departaments",
    kpiVacations: "De vacances",
    kpiVacationsNote: "Proper retorn: 10 nov",
    kpiNew: "Noves incorporacions",
    kpiNewNote: "Durant novembre de 2026",
    tabAll: "Tots els empleats · 21",
    tabActives: "Actius · 19",
    tabArchived: "Arxivats · 0",
    searchEmpPlaceholder: "Cercar empleat...",
    optDept: "Departament ⌄",
    optStatus: "Estat ⌄",
    optSupervisor: "Supervisor ⌄",
    btnExport: "Exportar",
    colPhoto: "Foto",
    colName: "Nom",
    colDept: "Departament",
    colRole: "Càrrec",
    colStatus: "Estat",
    colActions: "Accions",
    statusActive: "Actiu",
    statusVacations: "Vacances",
    statusLeave: "Baixa",
    empFooter: "Els perfils són ficticis. Accés a dades personals limitat segons el rol de l'organització.<br>© 2026 Tracker Treball · Dades d'exemple, no reals · Privacitat · Ajuda · Europa / Madrid",

    // Jornades
    breadcrumbShifts: "La meva organització › Jornades Laborals",
    shiftsHeading: "Registre de Jornades Laborals",
    shiftsSub: "Auditoria diària d'entrades, pauses, sortides i còmput d'hores amb signatura SHA-256.",
    btnExportShifts: "Exportar Informe Oficial",
    kpiShiftsToday: "Jornades registrades avui",
    kpiShiftsHours: "Hores treballades equip",
    kpiPunctuality: "Puntualitat de fitxatge",

    // Pauses
    breadcrumbBreaks: "La meva organització › Pauses i Descansos",
    breaksHeading: "Control de Pauses i Descansos",
    breaksSub: "Monitorització de pauses de dinar, descansos visuals obligatoris de PRL i pauses de cafè.",
    btnNewBreak: "+ Registrar Pausa Manual",
    kpiBreaksActive: "Pauses actives ara",
    kpiBreaksDuration: "Durada mitjana diària",
    kpiBreaksPrl: "Conformitat PRL",

    // Vacances
    breadcrumbVac: "La meva organització › Vacances i Absències",
    vacHeading: "Sol·licituds i Calendari de Vacances",
    vacSub: "Planificació anual de descans laboral, aprovacions del supervisor i gestió dinàmica d'absències.",
    btnReqVac: "+ Sol·licitar Vacances",
    kpiVacDays: "Dies anuals de conveni",
    kpiVacToday: "De vacances avui",
    kpiVacPending: "Sol·licituds pendents",
    kpiVacUsed: "Dies gaudits",
    kpiVacRemaining: "Dies disponibles restants",
    subtabMyVac: "Les Meves Sol·licituds i Nova Petició",
    subtabSupervisor: "Bústia del Supervisor (Aprovacions)",
    subtabHolidays: "Festius Oficials (API Espanya / Vic)",
    formVacTitle: "Triar Dies de Vacances",
    formVacSub: "Indica la data d'inici i fi del descans. Caps de setmana i festius oficials queden exclosos automàticament.",
    btnSubmitVac: "Enviar Sol·licitud al Supervisor",
    statusPending: "Pendent",
    statusAccepted: "Acceptada",
    statusRejected: "Rebutjada",
    statusAdjust: "Ajust Sol·licitat",
    btnAccept: "Acceptar",
    btnReject: "Rebutjar",
    btnAdjustDays: "Ajustar Dies",
    btnAskAdjust: "Demanar Ajust",
    lblWeatherCard: "Temps a la teva zona",
    lblTrafficCard: "Trànsit i Desplaçament",

    // Baixes
    breadcrumbLeaves: "La meva organització › Baixes Mèdiques",
    leavesHeading: "Gestió de Baixes Mèdiques i Salut Laboral",
    leavesSub: "Seguiment confidencial de processos d'incapacitat temporal, comunicats mèdics i mútua laboral.",
    btnNewLeave: "+ Registrar Comunicat Mèdic",
    kpiLeavesActive: "Baixes mèdiques actives",
    kpiAbsenteeism: "Taxa d'absentisme mèdic",
    kpiSafeDays: "Dies sense accidents laborals",

    // Projectes
    breadcrumbProj: "La meva organització › Projectes i Sprints",
    projHeading: "Projectes i Assignació de Recursos",
    projSub: "Control d'avanços de Sprint, pressupost d'hores i equip assignat.",
    btnNewProj: "+ Nou Projecte",
    kpiProjActive: "Projectes en curs",
    kpiProjAvg: "Avanç mitjà de Sprints",
    kpiProjHours: "Hores equip imputades",

    // PRL Help Center
    breadcrumbPrl: "La meva organització › PRL Help Center",
    prlHeading: "Prevenció de Riscos Laborals (PRL) & Centre d'Ajuda",
    prlSub: "Seguretat laboral, protocols d'emergència i notificació d'incidents a Osona.",
    btnSos: "EMETRE TRUCADA SOS",
    incTitle: "Registrar incident preventiu",
    incBtn: "Enviar Notificació PRL",
    pasTitle: "Primers Auxilis (Mètode PAS)",
    sosConfirmed: "Alerta SOS transmesa als equips d'emergència de Vic.",
    incidentSuccess: "Incident registrat correctament a Prevenció de Riscos.",

    // Perfil d'Usuari i Javadoc
    navJavadoc: "Javadoc API",
    profileTitle: "Perfil d'Usuari",
    uploadPhoto: "Pujar nova foto",
    removePhoto: "Eliminar foto",
    photoHint: "Formats admesos: JPG, PNG o WebP (màx. 2MB)",
    lblProfileEmail: "Correu corporatiu",
    lblProfileDept: "Departament",
    lblProfileCenter: "Centre de treball",
    lblProfileStatus: "Estat del compte",
    lblProfileSchedule: "Horari contractual",
    lblProfileSecurity: "Seguretat i Signatura",

    // Exportacio Multi-Format
    exportTitle: "Exportar Dades",
    exportDesc: "Trieu el format desitjat per descarregar les dades de la taula actual:",
    exportExcel: "Microsoft Excel (.xlsx / .xls)",
    exportExcelSub: "Full de càlcul natiu amb taules estilitzades i capçaleres destacades.",
    exportCSV: "Valors Separats per Comes (.csv)",
    exportCSVSub: "Fitxer pla estàndard amb codificació UTF-8 i delimitador punt i coma.",
    exportPDF: "Document Imprimible Oficial (.pdf)",
    exportPDFSub: "Informe formal apte per impressió o desat en PDF amb capçalera corporativa.",
    btnCancel: "Cancel·lar",
    btnClose: "Tancar"
  },
  es: {
    // Navbar
    searchPlaceholder: "Buscar empleados, proyectos, jornadas…",
    btnSearch: "Buscar",
    btnTheme: "Modo Nocturno",
    themeNight: "Modo Nocturno",
    themeDay: "Modo Diario",
    themeNightTitle: "Cambiar a modo nocturno",
    themeDayTitle: "Cambiar a modo diario",
    btnLogout: "Salir",
    roleAdmin: "Administrador General (ADMIN)",
    
    // Sidebar
    workspace: "ESPACIO DE TRABAJO",
    navDashboard: "Dashboard",
    navEmployees: "Empleados",
    navShifts: "Jornadas",
    navBreaks: "Pausas",
    navVacations: "Vacaciones",
    navMedicalLeaves: "Bajas médicas",
    navProjects: "Proyectos",
    navPrl: "PRL Help Center",
    helpTitle: "Estamos para ayudarte",
    helpSub: "Guías y soporte para tu equipo.",
    helpBtn: "Centro de ayuda PRL →",

    // Login
    loginTitle: "Te damos la bienvenida",
    loginSub: "Accede a tu espacio de trabajo con tu cuenta de organización.",
    lblUser: "Usuario",
    lblPassword: "Contraseña",
    rememberMe: "Recordarme",
    forgotPassword: "Recuperar contraseña",
    btnLogin: "Iniciar sesión",
    btnDemo: "Entrar directamente a Empleados / Dashboard",
    secureFooter: "Conexión segura · Protección de datos",

    // Dashboard y Fichaje
    welcome: "Buenos días",
    greetingDate: "Lunes, 2 de noviembre de 2026 · Vic, Barcelona (14°C, Parcialmente nublado)",
    badgeNotStarted: "JORNADA NO INICIADA",
    badgeActive: "JORNADA EN CURSO",
    badgeBreak: "EN PAUSA",
    badgeFinished: "JORNADA FINALIZADA",
    lblSchedule: "Horario contractual: 09:00 → 17:30 · Entrada: ",
    lblClockInPending: "Pendiente de registro",
    lblClockOutPending: "--:--",
    btnStartShift: "Iniciar Jornada",
    btnStartBreak: "Iniciar Pausa",
    btnEndBreak: "Finalizar Pausa",
    btnFinishShift: "Finalizar Jornada",
    breakModalTitle: "Seleccionar tipo de pausa",
    breakModalSub: "Elige la modalidad de pausa reglamentaria para computar el tiempo de descanso:",
    breakCafeTitle: "Pausa de Café / Desayuno (15 min)",
    breakCafeDesc: "Pausa corta recomendada para descanso visual de pantallas PVD (PRL).",
    breakDescansoTitle: "Pausa de Descanso (30 min)",
    breakDescansoDesc: "Pausa de media jornada para recuperación de fatiga y desconexión.",
    breakAlmuerzoTitle: "Pausa de Almuerzo / Comida (1 hora)",
    breakAlmuerzoDesc: "Pausa principal diaria para el almuerzo estipulada en convenio.",
    btnConfirmBreak: "Iniciar Pausa",
    breakActivePrefix: "Pausa en curso: ",
    breakLimitPrefix: "Límite establecido: ",
    breakExcessWarning: "Atención: Has superado el tiempo establecido de pausa en +{N} minutos.",
    breakExcessAlert: "Has superado el tiempo de pausa en {N} minutos adicionales.\nSe ha registrado en la base de datos con el comentario: '+{N} minutos de pausa'.",
    breakNormalAlert: "Pausa finalizada correctamente dentro del tiempo reglamentario.",
    finishShiftConfirm: "¿Deseas finalizar la jornada laboral de hoy?",
    finishShiftAlert: "Jornada finalizada y registrada con éxito. Hash SHA-256 generado.",
    cardProd: "Productividad",
    cardProdTitle: "Horas semanales",
    cardProj: "Proyecto actual",
    cardCommute: "Desplazamiento",
    btnRoute: "Ver ruta recomendada →",
    cardNotices: "Recordatorios y avisos",
    cardCalendar: "Calendari laboral",

    // Empleados
    breadcrumbEmp: "Mi organización › Empleados",
    empHeading: "Personas que hacen equipo",
    empSub: "Gestiona perfiles, departamentos y disponibilidad desde un único lugar.",
    btnNewEmp: "+ Nuevo Empleado",
    kpiActives: "Empleados activos",
    kpiActivesNote: "En 4 departamentos",
    kpiVacations: "De vacaciones",
    kpiVacationsNote: "Próxima incorporación: 10 nov",
    kpiNew: "Nuevas incorporaciones",
    kpiNewNote: "Durante noviembre de 2026",
    tabAll: "Todos los empleados · 21",
    tabActives: "Activos · 19",
    tabArchived: "Archivados · 0",
    searchEmpPlaceholder: "Buscar empleado...",
    optDept: "Departamento ⌄",
    optStatus: "Estado ⌄",
    optSupervisor: "Supervisor ⌄",
    btnExport: "Exportar",
    colPhoto: "Foto",
    colName: "Nombre",
    colDept: "Departamento",
    colRole: "Cargo",
    colStatus: "Estado",
    colActions: "Acciones",
    statusActive: "Activo",
    statusVacations: "Vacaciones",
    statusLeave: "Baja",
    empFooter: "Los perfiles son ficticios. Acceso a datos personales limitado según el rol de la organización.<br>© 2026 Tracker Treball · Datos de ejemplo, no reales · Privacidad · Ayuda · Europa / Madrid",

    // Jornadas
    breadcrumbShifts: "Mi organización › Jornadas Laborales",
    shiftsHeading: "Registro de Jornadas Laborales",
    shiftsSub: "Auditoría diaria de entradas, pausas, salidas y cómputo de horas con firma SHA-256.",
    btnExportShifts: "Exportar Informe Oficial",
    kpiShiftsToday: "Jornadas registradas hoy",
    kpiShiftsHours: "Horas trabajadas equipo",
    kpiPunctuality: "Puntualidad de fichaje",

    // Pausas
    breadcrumbBreaks: "Mi organización › Pausas y Descansos",
    breaksHeading: "Control de Pausas y Descansos",
    breaksSub: "Monitorización de pausas de comida, descansos visuales obligatorios de PRL y pausas de café.",
    btnNewBreak: "+ Registrar Pausa Manual",
    kpiBreaksActive: "Pausas activas ahora",
    kpiBreaksDuration: "Duración media diaria",
    kpiBreaksPrl: "Conformidad PRL",

    // Vacaciones
    breadcrumbVac: "Mi organización › Vacaciones y Ausencias",
    vacHeading: "Solicitudes y Calendario de Vacaciones",
    vacSub: "Planificación anual de descanso laboral, aprobaciones del supervisor y gestión dinámica de ausencias.",
    btnReqVac: "+ Solicitar Vacaciones",
    kpiVacDays: "Días anuales de convenio",
    kpiVacToday: "De vacaciones hoy",
    kpiVacPending: "Solicitudes pendientes",
    kpiVacUsed: "Días disfrutados",
    kpiVacRemaining: "Días disponibles restantes",
    subtabMyVac: "Mis Solicitudes y Nueva Petición",
    subtabSupervisor: "Bandeja del Supervisor (Aprobaciones)",
    subtabHolidays: "Festivos Oficiales (API España / Vic)",
    formVacTitle: "Elegir Días de Vacaciones",
    formVacSub: "Indica la fecha de inicio y fin del descanso. Los fines de semana y festivos oficiales quedan excluidos automáticamente.",
    btnSubmitVac: "Enviar Solicitud al Supervisor",
    statusPending: "Pendiente",
    statusAccepted: "Aceptada",
    statusRejected: "Rechazada",
    statusAdjust: "Ajuste Solicitado",
    btnAccept: "Aceptar",
    btnReject: "Rechazar",
    btnAdjustDays: "Ajustar Días",
    btnAskAdjust: "Pedir Ajuste",
    lblWeatherCard: "Tiempo en tu zona",
    lblTrafficCard: "Tráfico y Desplazamiento",

    // Bajas
    breadcrumbLeaves: "Mi organización › Bajas Médicas",
    leavesHeading: "Gestión de Bajas Médicas y Salud Laboral",
    leavesSub: "Seguimiento confidencial de procesos de incapacidad temporal, partes médicos y mutua laboral.",
    btnNewLeave: "+ Registrar Parte Médico",
    kpiLeavesActive: "Bajas médicas activas",
    kpiAbsenteeism: "Tasa de absentismo médico",
    kpiSafeDays: "Días sin accidentes laborales",

    // Proyectos
    breadcrumbProj: "Mi organización › Proyectos y Sprints",
    projHeading: "Proyectos y Asignación de Recursos",
    projSub: "Control de avances de Sprint, presupuesto de horas y equipo asignado.",
    btnNewProj: "+ Nuevo Proyecto",
    kpiProjActive: "Proyectos en curso",
    kpiProjAvg: "Avance medio de Sprints",
    kpiProjHours: "Horas equipo imputadas",

    // PRL Help Center
    breadcrumbPrl: "Mi organización › PRL Help Center",
    prlHeading: "Prevención de Riesgos Laborales (PRL) & Centro de Ayuda",
    prlSub: "Seguridad laboral, protocolos de emergencia y notificación de incidentes en Osona.",
    btnSos: "EMITIR LLAMADA SOS",
    incTitle: "Registrar incidente preventivo",
    incBtn: "Enviar Notificación PRL",
    pasTitle: "Primeros Auxilios (Método PAS)",
    sosConfirmed: "Alerta SOS transmitida a los equipos de emergencia de Vic.",
    incidentSuccess: "Incidente registrado correctamente en Prevención de Riesgos.",

    // Perfil de Usuario y Javadoc
    navJavadoc: "Javadoc API",
    profileTitle: "Perfil de Usuario",
    uploadPhoto: "Subir nueva foto",
    removePhoto: "Eliminar foto",
    photoHint: "Formatos admitidos: JPG, PNG o WebP (máx. 2MB)",
    lblProfileEmail: "Correo corporativo",
    lblProfileDept: "Departamento",
    lblProfileCenter: "Centro de trabajo",
    lblProfileStatus: "Estado de la cuenta",
    lblProfileSchedule: "Horario contractual",
    lblProfileSecurity: "Seguridad y Firma",

    // Exportacion Multi-Formato
    exportTitle: "Exportar Datos",
    exportDesc: "Elija el formato deseado para descargar los datos de la tabla actual:",
    exportExcel: "Microsoft Excel (.xlsx / .xls)",
    exportExcelSub: "Hoja de cálculo nativa con tablas estilizadas y cabeceras destacadas.",
    exportCSV: "Valores Separados por Comas (.csv)",
    exportCSVSub: "Archivo plano estándar con codificación UTF-8 y delimitador punto y coma.",
    exportPDF: "Documento Imprimible Oficial (.pdf)",
    exportPDFSub: "Informe formal apto para impresión o guardado en PDF con cabecera corporativa.",
    btnCancel: "Cancelar",
    btnClose: "Cerrar"
  }
};

// -----------------------------------------------------------------------------
// 1. Navegacion y Control de Vistas
// -----------------------------------------------------------------------------

// Alterna entre la pantalla de login y el panel autenticado
function toggleAuthScreen(showMain) {
  AppState.isLoggedIn = showMain;
  const loginView = document.getElementById("view-login");
  const mainView = document.getElementById("app-main-container");

  if (showMain) {
    loginView.classList.remove("active");
    mainView.classList.add("active");
    loadDashboardData();
  } else {
    mainView.classList.remove("active");
    loginView.classList.add("active");
    clearInterval(AppState.timerInterval);
  }
}

// Cambia entre pestanyas del sidebar (Dashboard, Empleados, Jornadas, Pausas, Vacaciones, Bajas, Proyectos, PRL)
function navigateTo(viewName) {
  AppState.currentView = viewName;
  const views = ["dashboard", "empleados", "jornadas", "pausas", "vacaciones", "bajas", "proyectos", "prl"];

  views.forEach(name => {
    const el = document.getElementById(`view-${name}`);
    const navBtn = document.getElementById(`nav-btn-${name}`);
    if (el) el.style.display = (name === viewName) ? "block" : "none";
    if (navBtn) navBtn.classList.toggle("active", name === viewName);
  });

  if (viewName === "dashboard") {
    loadDashboardData();
    loadWeatherAndTraffic();
  } else if (viewName === "empleados") {
    loadEmployeesData();
  } else if (viewName === "vacaciones") {
    loadVacationsData();
    loadHolidaysData();
  }
}

// Alias para compatibilidad con llamadas inline del HTML
function switchMainView(viewName) {
  navigateTo(viewName);
}

// Busqueda Global en la Cabecera
function handleGlobalSearch() {
  const input = document.getElementById("global-search-input");
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  if (!q) {
    alert("Introduce un término para buscar en empleados, proyectos, jornadas o ausencias.");
    return;
  }

  if (q.includes("jornad") || q.includes("fichaj") || q.includes("horari") || q.includes("entrad")) {
    navigateTo("jornadas");
  } else if (q.includes("paus") || q.includes("descans") || q.includes("cafe") || q.includes("comid")) {
    navigateTo("pausas");
  } else if (q.includes("vaca") || q.includes("permis") || q.includes("ausenc") || q.includes("festiv")) {
    navigateTo("vacaciones");
  } else if (q.includes("baja") || q.includes("medic") || q.includes("salud") || q.includes("mutua")) {
    navigateTo("bajas");
  } else if (q.includes("proyect") || q.includes("sprint") || q.includes("saas") || q.includes("dedic")) {
    navigateTo("proyectos");
  } else if (q.includes("prl") || q.includes("riesg") || q.includes("sos") || q.includes("accident") || q.includes("auxili")) {
    navigateTo("prl");
  } else {
    // Filtrar por nombre, cargo o departamento en la lista de empleados
    navigateTo("empleados");
    const empInput = document.getElementById("search-emp-input");
    if (empInput) {
      empInput.value = q;
      filterEmployees();
    }
  }
}

// -----------------------------------------------------------------------------
// 2. Carga y Enlace del Dashboard con el Backend
// -----------------------------------------------------------------------------

// Consulta datos del asistente y la jornada al backend
async function loadDashboardData() {
  const data = await apiGet("/dashboard/assistant", "dashboard");
  if (!data) return;

  // Actualizar saludo
  const greetingEl = document.getElementById("dash-greeting-name");
  if (greetingEl && data.employee) {
    const t = I18N[AppState.language];
    greetingEl.textContent = `${t.welcome}, ${data.employee.name.split(" ")[0]}`;
  }

  // Actualizar datos de jornada desde backend o estado actual
  if (data.todayShift) {
    AppState.shiftStarted = !!data.todayShift.shiftStarted;
    AppState.isOnBreak = !!data.todayShift.isOnBreak;
    AppState.isFinished = (data.todayShift.status === "FINALIZADA" || !!data.todayShift.isFinished);
    AppState.clockInTime = data.todayShift.clockIn || null;
    AppState.clockOutTime = data.todayShift.clockOut || null;
    AppState.currentBreak = data.todayShift.currentBreak || null;
    if (data.todayShift.workedSeconds !== undefined) {
      AppState.timerSeconds = data.todayShift.workedSeconds;
    }
  }

  updateShiftUI();

  // Actualizar tarjeta de productividad
  if (data.productivity) {
    const p = data.productivity;
    document.getElementById("kpi-hours-weekly").textContent = `${p.hoursWorkedThisWeek}h / ${p.targetHoursPerWeek}h`;
    document.getElementById("bar-prod-fill").style.width = `${p.completionPercentage}%`;
    document.getElementById("kpi-prod-subtext").textContent = `${p.completionPercentage}% completado · ${p.overtimeHours} horas extra registradas`;
  }

  // Actualizar tarjeta de proyecto
  if (data.project) {
    const prj = data.project;
    document.getElementById("proj-name").textContent = prj.name;
    document.getElementById("proj-sprint").textContent = `Sprint ${prj.sprintProgressPercentage}%`;
    document.getElementById("bar-proj-fill").style.width = `${prj.sprintProgressPercentage}%`;
    document.getElementById("proj-subtext").textContent = `${prj.teamMembersCount} miembros en el equipo · ${prj.dedicatedHoursEmployee} h dedicadas`;
  }

  // Actualizar tarjeta de desplazamiento
  if (data.employee) {
    document.getElementById("commute-office").textContent = data.employee.destinationWorkplace || "Oficina Central Vic";
    document.getElementById("commute-minutes").textContent = `${data.employee.commuteMinutesEstimated || 22} min`;
    document.getElementById("commute-status").textContent = `Tráfico: ${data.employee.trafficCondition || "Moderado"} · Trayecto habitual sin incidencias`;
  }

  if (AppState.shiftStarted && !AppState.isOnBreak && !AppState.isFinished) {
    startShiftTimer();
  } else if (AppState.isOnBreak) {
    startBreakTimer();
  }
}

// Actualiza el texto, badge, cronometro y visibilidad dinamica de botones
function updateShiftUI() {
  const t = I18N[AppState.language];
  const badgeContainer = document.getElementById("shift-badge-container");
  const badgeText = document.getElementById("shift-badge-text");
  const valEntrada = document.getElementById("val-entrada");
  const valSalida = document.getElementById("val-salida-prevista");

  const btnIniciar = document.getElementById("btn-iniciar-jornada");
  const btnPausa = document.getElementById("btn-pausa");
  const btnFinPausa = document.getElementById("btn-finalizar-pausa");
  const btnFinalizar = document.getElementById("btn-finalizar");
  const breakBanner = document.getElementById("break-active-banner");

  // Horas de entrada y salida
  if (valEntrada) {
    valEntrada.textContent = AppState.clockInTime || t.lblClockInPending;
  }
  if (valSalida) {
    valSalida.textContent = AppState.clockOutTime || (AppState.shiftStarted ? "17:30" : t.lblClockOutPending);
  }

  // Estado 1: Jornada Finalizada
  if (AppState.isFinished) {
    if (badgeContainer) {
      badgeContainer.className = "shift-tag finished";
    }
    if (badgeText) badgeText.textContent = t.badgeFinished;
    if (btnIniciar) { btnIniciar.style.display = "none"; }
    if (btnPausa) { btnPausa.style.display = "none"; }
    if (btnFinPausa) { btnFinPausa.style.display = "none"; }
    if (btnFinalizar) {
      btnFinalizar.style.display = "inline-flex";
      btnFinalizar.disabled = true;
      btnFinalizar.style.opacity = "0.6";
      const span = btnFinalizar.querySelector("span");
      if (span) span.textContent = t.badgeFinished;
    }
    if (breakBanner) breakBanner.style.display = "none";
    updateShiftDisplay();
    return;
  }

  // Estado 2: En Pausa Activa
  if (AppState.isOnBreak) {
    if (badgeContainer) {
      badgeContainer.className = "shift-tag on-break";
    }
    const breakLabel = AppState.currentBreak ? AppState.currentBreak.typeName : "";
    if (badgeText) badgeText.textContent = `${t.badgeBreak}: ${breakLabel}`;

    if (btnIniciar) btnIniciar.style.display = "none";
    if (btnPausa) btnPausa.style.display = "none";
    if (btnFinPausa) {
      btnFinPausa.style.display = "inline-flex";
      btnFinPausa.disabled = false;
    }
    if (btnFinalizar) {
      btnFinalizar.style.display = "inline-flex";
      btnFinalizar.disabled = true;
      btnFinalizar.style.opacity = "0.5";
      btnFinalizar.title = "Finalitza la pausa abans de tancar la jornada / Finaliza la pausa antes de cerrar la jornada";
    }

    if (breakBanner && AppState.currentBreak) {
      breakBanner.style.display = "block";
      const bTitle = document.getElementById("break-banner-title");
      const bLimit = document.getElementById("break-banner-limit");
      if (bTitle) bTitle.textContent = `${t.breakActivePrefix}${AppState.currentBreak.typeName}`;
      if (bLimit) bLimit.textContent = `${t.breakLimitPrefix}${AppState.currentBreak.limitMinutes} min`;
    }
    updateShiftDisplay();
    return;
  }

  // Estado 3: Jornada en Curso (Trabajando)
  if (AppState.shiftStarted) {
    if (badgeContainer) {
      badgeContainer.className = "shift-tag in-progress";
    }
    if (badgeText) badgeText.textContent = t.badgeActive;

    if (btnIniciar) btnIniciar.style.display = "none";
    if (btnPausa) {
      btnPausa.style.display = "inline-flex";
      btnPausa.disabled = false;
    }
    if (btnFinPausa) btnFinPausa.style.display = "none";
    if (btnFinalizar) {
      btnFinalizar.style.display = "inline-flex";
      btnFinalizar.disabled = false;
      btnFinalizar.style.opacity = "1";
      btnFinalizar.title = "";
      const span = btnFinalizar.querySelector("span");
      if (span) span.textContent = t.btnFinishShift;
    }
    if (breakBanner) breakBanner.style.display = "none";
    updateShiftDisplay();
    return;
  }

  // Estado 4: Jornada No Iniciada (Al conectarse)
  if (badgeContainer) {
    badgeContainer.className = "shift-tag not-started";
  }
  if (badgeText) badgeText.textContent = t.badgeNotStarted;

  if (btnIniciar) {
    btnIniciar.style.display = "inline-flex";
    btnIniciar.disabled = false;
  }
  if (btnPausa) btnPausa.style.display = "none";
  if (btnFinPausa) btnFinPausa.style.display = "none";
  if (btnFinalizar) btnFinalizar.style.display = "none";
  if (breakBanner) breakBanner.style.display = "none";

  const timerEl = document.getElementById("timer-display");
  if (timerEl) timerEl.textContent = "0h 00m 00s";
}

// Inicia la jornada laboral registrando la entrada
async function startShift() {
  if (AppState.shiftStarted || AppState.isFinished) return;

  const nowTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  AppState.shiftStarted = true;
  AppState.clockInTime = nowTime;
  AppState.timerSeconds = 0;
  AppState.isOnBreak = false;
  AppState.isFinished = false;

  updateShiftUI();
  startShiftTimer();

  // Insertar en la tabla de jornadas en vivo
  insertLiveShiftRow(AppState.currentUser.name, nowTime, "17:30", "En Curso");

  await apiPost("/attendance/clock-in", { clockIn: nowTime });
}

// Inicia el cronometro de tiempo trabajado
function startShiftTimer() {
  clearInterval(AppState.timerInterval);
  updateShiftDisplay();

  AppState.timerInterval = setInterval(() => {
    if (AppState.shiftStarted && !AppState.isOnBreak && !AppState.isFinished) {
      AppState.timerSeconds++;
      updateShiftDisplay();
    }
  }, 1000);
}

// Formatea el tiempo trabajado y lo actualiza en el elemento del hero
function updateShiftDisplay() {
  if (!AppState.shiftStarted) {
    const timerEl = document.getElementById("timer-display");
    if (timerEl) timerEl.textContent = "0h 00m 00s";
    return;
  }

  const hours = Math.floor(AppState.timerSeconds / 3600);
  const minutes = Math.floor((AppState.timerSeconds % 3600) / 60);
  const seconds = AppState.timerSeconds % 60;
  
  const timerEl = document.getElementById("timer-display");
  if (timerEl) {
    const padM = String(minutes).padStart(2, "0");
    const padS = String(seconds).padStart(2, "0");
    timerEl.textContent = `${hours}h ${padM}m ${padS}s`;
  }
}

// Abre el modal para elegir la pausa (Cafe 15m, Descanso 30m, Almuerzo 60m)
function openBreakModal() {
  if (!AppState.shiftStarted || AppState.isOnBreak || AppState.isFinished) return;
  const modal = document.getElementById("modal-break");
  if (modal) modal.style.display = "flex";
}

// Cierra el modal de seleccion de pausa
function closeBreakModal() {
  const modal = document.getElementById("modal-break");
  if (modal) modal.style.display = "none";
}

// Confirma el inicio de la pausa con la opcion seleccionada
async function confirmStartBreak() {
  const selectedCard = document.querySelector(".break-option-card.selected") || document.getElementById("opt-break-cafe");
  const breakType = selectedCard ? selectedCard.getAttribute("data-type") : "cafe";
  const breakMinutes = selectedCard ? parseInt(selectedCard.getAttribute("data-minutes"), 10) : 15;
  
  let breakTypeName = "Pausa de Café (15 min)";
  if (breakType === "descanso") breakTypeName = "Pausa de Descanso (30 min)";
  if (breakType === "almuerzo") breakTypeName = "Pausa de Almuerzo (1h)";

  const nowTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  AppState.isOnBreak = true;
  AppState.currentBreak = {
    type: breakType,
    typeName: breakTypeName,
    limitMinutes: breakMinutes,
    startTime: nowTime,
    startEpoch: Date.now(),
    elapsedSeconds: 0,
    excessMinutes: 0
  };

  closeBreakModal();
  clearInterval(AppState.timerInterval);
  updateShiftUI();
  startBreakTimer();

  await apiPost("/attendance/start-break", {
    type: breakType,
    typeName: breakTypeName,
    limitMinutes: breakMinutes,
    startTime: nowTime
  });
}

// Cronometro de control de pausa y detector de exceso en tiempo real
function startBreakTimer() {
  clearInterval(AppState.breakInterval);

  const bannerTimer = document.getElementById("break-banner-timer");
  const excessBox = document.getElementById("break-excess-warning");
  const excessSpan = document.getElementById("break-excess-minutes");
  const banner = document.getElementById("break-active-banner");

  AppState.breakInterval = setInterval(() => {
    if (!AppState.isOnBreak || !AppState.currentBreak) {
      clearInterval(AppState.breakInterval);
      return;
    }

    AppState.currentBreak.elapsedSeconds++;
    const totalSec = AppState.currentBreak.elapsedSeconds;
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;

    if (bannerTimer) {
      bannerTimer.textContent = `(${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")})`;
    }

    const limitSeconds = AppState.currentBreak.limitMinutes * 60;
    if (totalSec > limitSeconds) {
      const excessSec = totalSec - limitSeconds;
      const excessMin = Math.max(1, Math.floor(excessSec / 60) + 1);
      AppState.currentBreak.excessMinutes = excessMin;

      if (excessBox) excessBox.style.display = "block";
      if (excessSpan) excessSpan.textContent = String(excessMin);
      if (banner) banner.classList.add("exceeded");
    } else {
      if (excessBox) excessBox.style.display = "none";
      if (banner) banner.classList.remove("exceeded");
    }
  }, 1000);
}

// Finaliza la pausa activa, audita si hubo exceso y lo registra con comentario
async function endBreak() {
  if (!AppState.isOnBreak || !AppState.currentBreak) return;

  clearInterval(AppState.breakInterval);

  const t = I18N[AppState.language];
  const b = AppState.currentBreak;
  const totalSeconds = b.elapsedSeconds;
  const limitSeconds = b.limitMinutes * 60;
  const nowTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const durationMin = Math.max(1, Math.round(totalSeconds / 60));
  let excessMin = 0;
  let comment = "Dentro de tiempo reglamentario";

  if (totalSeconds > limitSeconds) {
    excessMin = Math.max(1, Math.round((totalSeconds - limitSeconds) / 60));
    comment = `+${excessMin} minutos de pausa`;
    
    // Notificacion formal al usuario con los minutos adicionales
    const msg = t.breakExcessAlert.replace(/\{N\}/g, excessMin);
    alert(msg);
  }

  const finishedRecord = {
    id: AppState.breaksHistory.length + 1,
    employee: AppState.currentUser.name,
    type: b.typeName,
    limitMinutes: b.limitMinutes,
    durationMinutes: durationMin,
    startTime: b.startTime,
    endTime: nowTime,
    status: "Completada",
    excessMinutes: excessMin,
    comment: comment
  };

  AppState.breaksHistory.unshift(finishedRecord);
  insertLiveBreakRow(finishedRecord);

  AppState.isOnBreak = false;
  AppState.currentBreak = null;

  updateShiftUI();
  startShiftTimer();

  await apiPost("/attendance/end-break", finishedRecord);
}

// Inserta fila de pausa en tiempo real en la tabla de la vista de Pausas
function insertLiveBreakRow(record) {
  const tbody = document.getElementById("pausas-table-body");
  if (!tbody) return;

  const tr = document.createElement("tr");
  const commentHtml = record.excessMinutes > 0
    ? `<span class="status-pill" style="background: #FEE2E2; color: #DC2626; font-weight: 700; font-size: 0.78rem;">${record.comment}</span>`
    : `<span style="font-size: 0.82rem; color: var(--text-muted);">${record.comment}</span>`;

  tr.innerHTML = `
    <td><strong>${record.employee}</strong></td>
    <td>${record.type}</td>
    <td>${record.limitMinutes} min</td>
    <td>${record.startTime}</td>
    <td>${record.endTime}</td>
    <td>${record.durationMinutes} min</td>
    <td><span class="status-pill badge-active">${record.status}</span></td>
    <td>${commentHtml}</td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);
}

// Inserta fila de jornada en vivo en la tabla de la vista de Jornadas
function insertLiveShiftRow(empName, clockIn, clockOut, status) {
  const tbody = document.getElementById("jornadas-table-body");
  if (!tbody) return;

  const tr = document.createElement("tr");
  tr.id = "live-current-shift-row";
  tr.innerHTML = `
    <td><strong>${empName}</strong> (Tú)</td>
    <td>${new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</td>
    <td>${clockIn}</td>
    <td class="col-shift-exit">${clockOut}</td>
    <td>Presencial Vic</td>
    <td><span class="status-pill badge-active col-shift-status">${status}</span></td>
    <td><span style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted);">SHA: Pendiente salida</span></td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);
}

// Cierra la jornada laboral y solicita firma digital
async function finishShift() {
  if (AppState.isFinished) {
    alert("La jornada ya ha sido cerrada.");
    return;
  }
  if (AppState.isOnBreak) {
    alert("Debes finalizar la pausa activa antes de poder cerrar la jornada laboral.");
    return;
  }

  const t = I18N[AppState.language];
  const ok = confirm(t.finishShiftConfirm);
  if (!ok) return;

  AppState.isFinished = true;
  clearInterval(AppState.timerInterval);

  const nowTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  AppState.clockOutTime = nowTime;

  updateShiftUI();

  // Actualizar fila en la tabla de jornadas
  const liveRow = document.getElementById("live-current-shift-row");
  if (liveRow) {
    const exitCell = liveRow.querySelector(".col-shift-exit");
    const statusCell = liveRow.querySelector(".col-shift-status");
    if (exitCell) exitCell.textContent = nowTime;
    if (statusCell) {
      statusCell.className = "status-pill badge-active";
      statusCell.textContent = "Finalizada";
    }
  }

  await apiPost("/attendance/clock-out", { clockOut: nowTime });
  alert(t.finishShiftAlert);
}

// -----------------------------------------------------------------------------
// 3. Modales y Widgets Interactivos del Dashboard
// -----------------------------------------------------------------------------

// Abre el modal de ruta recomendada
function openRouteModal() {
  const modal = document.getElementById("modal-route");
  if (modal) modal.style.display = "flex";
}

// Cierra el modal de ruta
function closeRouteModal() {
  const modal = document.getElementById("modal-route");
  if (modal) modal.style.display = "none";
}

// Abre el modal de creacion de nuevo empleado
function openNewEmpModal() {
  const modal = document.getElementById("modal-new-emp");
  if (modal) modal.style.display = "flex";
}

// Cierra el modal de nuevo empleado
function closeNewEmpModal() {
  const modal = document.getElementById("modal-new-emp");
  if (modal) modal.style.display = "none";
}

// Muestra informacion contextual de dias del calendario
function handleCalendarDayClick(dayText, isHoliday, isToday) {
  if (isHoliday) {
    alert(`Día ${dayText} de Noviembre: Festivo oficial. No laborable según calendario laboral de Vic.`);
  } else if (isToday) {
    alert(`Día ${dayText} de Noviembre (Hoy): Jornada laboral en curso (09:00 - 17:30).`);
  } else {
    alert(`Día ${dayText} de Noviembre: Jornada ordinaria planificada.`);
  }
}

// -----------------------------------------------------------------------------
// 4. Gestion de Empleados
// -----------------------------------------------------------------------------

// Carga empleados desde la API o usa datos de prueba
async function loadEmployeesData() {
  const data = await apiGet("/employees", "employees");
  AppState.employeeList = Array.isArray(data) ? data : (data.employees || TEST_DATA.employees);
  AppState.filteredEmployees = [...AppState.employeeList];
  AppState.empCurrentPage = 1;
  filterEmployees();
}

// Renderiza las filas paginadas de la tabla de empleados
function renderEmployeeTable(list) {
  const tbody = document.getElementById("emp-table-body");
  if (!tbody) return;

  const total = list.length;
  const pageSize = AppState.empPageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Ajustar pagina actual dentro de los limites
  if (AppState.empCurrentPage > totalPages) AppState.empCurrentPage = totalPages;
  if (AppState.empCurrentPage < 1) AppState.empCurrentPage = 1;

  const startIdx = (AppState.empCurrentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pagedList = list.slice(startIdx, endIdx);

  // Actualizar texto de paginacion
  const paginationInfo = document.getElementById("emp-pagination-info");
  if (paginationInfo) {
    paginationInfo.textContent = total > 0 
      ? `Mostrando ${startIdx + 1}-${endIdx} de ${total} empleados`
      : "No se encontraron empleados coincidentes";
  }

  // Actualizar estado activo en botones de pagina
  document.querySelectorAll(".page-number-btn").forEach(btn => {
    const pageNum = parseInt(btn.getAttribute("data-page"), 10);
    btn.classList.toggle("active", pageNum === AppState.empCurrentPage);
    btn.style.display = (pageNum <= totalPages) ? "inline-block" : "none";
  });

  if (pagedList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">
          No se encontraron resultados para los filtros seleccionados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pagedList.map(emp => {
    const statusClass = emp.status === "Activo" ? "badge-active" : 
                       (emp.status === "Vacaciones" ? "badge-vacations" : "badge-leave");
    
    const statusLabel = AppState.language === "ca"
      ? (emp.status === "Activo" ? "Actiu" : (emp.status === "Vacaciones" ? "Vacances" : "Baixa"))
      : emp.status;

    return `
      <tr>
        <td>
          <div class="emp-avatar-circle">${emp.avatar || emp.name.substring(0, 2).toUpperCase()}</div>
        </td>
        <td>
          <div class="emp-name-text">${emp.name}</div>
          <div class="emp-email-text">${emp.email}</div>
        </td>
        <td>${emp.department}</td>
        <td>${emp.role}</td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td style="text-align: right;">
          <button class="btn-action-icon" type="button" title="Editar" onclick="editEmployee(${emp.id})">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="btn-action-icon" type="button" title="Opciones" onclick="showEmployeeMenu(${emp.id})">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Filtra empleados por pestañas, texto de busqueda, departamento, estado y supervisor
function filterEmployees() {
  const query = (document.getElementById("search-emp-input")?.value || "").toLowerCase();
  const dept = document.getElementById("filter-dept")?.value || "";
  const status = document.getElementById("filter-status")?.value || "";
  const supervisor = document.getElementById("filter-supervisor")?.value || "";

  AppState.filteredEmployees = AppState.employeeList.filter(emp => {
    // Filtro de pestañas superiores (Todos / Activos / Archivados)
    if (AppState.empTabFilter === "active" && emp.status !== "Activo") return false;
    if (AppState.empTabFilter === "archived" && emp.status !== "Baja") return false;

    // Filtro de texto de busqueda
    const matchText = emp.name.toLowerCase().includes(query) ||
                      emp.email.toLowerCase().includes(query) ||
                      emp.role.toLowerCase().includes(query);

    // Filtro de desplegables
    const matchDept = !dept || emp.department === dept;
    const matchStatus = !status || emp.status === status;
    const matchSupervisor = !supervisor || (
      supervisor === "Hassan Adraou" ? true :
      supervisor === "Albert Guiteras" ? emp.department === "Tecnología" :
      supervisor === "Alba Garcia" ? emp.department === "Personas" :
      supervisor === "Jose Daniel Calicchio" ? emp.department === "Operaciones" : true
    );

    return matchText && matchDept && matchStatus && matchSupervisor;
  });

  renderEmployeeTable(AppState.filteredEmployees);
}

// Cambia de pestaña en la seccion de empleados
function setEmployeeTabFilter(tabKey) {
  AppState.empTabFilter = tabKey;
  AppState.empCurrentPage = 1;

  document.getElementById("tab-emp-all")?.classList.toggle("active", tabKey === "all");
  document.getElementById("tab-emp-active")?.classList.toggle("active", tabKey === "active");
  document.getElementById("tab-emp-archived")?.classList.toggle("active", tabKey === "archived");

  filterEmployees();
}

// Cambia la pagina activa en la tabla
function goToEmployeePage(pageNum) {
  AppState.empCurrentPage = pageNum;
  renderEmployeeTable(AppState.filteredEmployees);
}

// -----------------------------------------------------------------------------
// Gestion del Perfil de Usuario y Foto de Perfil
// -----------------------------------------------------------------------------

function applyUserAvatar(customPhotoUrl) {
  const user = AppState.currentUser || { id: 1, name: "Hassan Adraou", avatar: "HA" };
  const navAvatarEl = document.getElementById("nav-user-avatar");
  const modalAvatarInitials = document.getElementById("profile-avatar-initials");
  const modalAvatarImg = document.getElementById("profile-avatar-img");
  const btnRemovePhoto = document.getElementById("btn-remove-photo");

  const photo = customPhotoUrl !== undefined ? customPhotoUrl : localStorage.getItem(`user_custom_avatar_${user.id}`);

  if (photo) {
    if (navAvatarEl) {
      navAvatarEl.innerHTML = `<img src="${photo}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
    if (modalAvatarImg) {
      modalAvatarImg.src = photo;
      modalAvatarImg.style.display = "block";
    }
    if (modalAvatarInitials) {
      modalAvatarInitials.style.display = "none";
    }
    if (btnRemovePhoto) {
      btnRemovePhoto.style.display = "inline-flex";
    }
  } else {
    const initials = user.avatar || user.name.split(" ").map(p => p[0]).join("").substring(0, 2).toUpperCase();
    if (navAvatarEl) {
      navAvatarEl.innerHTML = initials;
    }
    if (modalAvatarImg) {
      modalAvatarImg.style.display = "none";
      modalAvatarImg.src = "";
    }
    if (modalAvatarInitials) {
      modalAvatarInitials.textContent = initials;
      modalAvatarInitials.style.display = "block";
    }
    if (btnRemovePhoto) {
      btnRemovePhoto.style.display = "none";
    }
  }
}

function openProfileModal() {
  const user = AppState.currentUser || {
    id: 1,
    name: "Hassan Adraou",
    email: "hassan.adraou@test.es",
    role: "Arquitecto de Software & Superadministrador",
    privilege: "ADMIN",
    department: "Tecnología",
    status: "Activo",
    avatar: "HA"
  };

  const nameEl = document.getElementById("profile-full-name");
  if (nameEl) nameEl.textContent = user.name;
  const roleEl = document.getElementById("profile-role-badge");
  if (roleEl) roleEl.textContent = `${user.role} (${user.privilege || 'ADMIN'})`;
  const emailEl = document.getElementById("profile-email-val");
  if (emailEl) emailEl.textContent = user.email || `${user.name.toLowerCase().replace(/ /g, '.')}@test.es`;
  const deptEl = document.getElementById("profile-dept-val");
  if (deptEl) deptEl.textContent = user.department || "Tecnología";
  const statusEl = document.getElementById("profile-status-val");
  if (statusEl) statusEl.textContent = `${user.status || 'Activo'} · Verificat`;

  applyUserAvatar();

  const modal = document.getElementById("modal-profile");
  if (modal) modal.style.display = "flex";
}

function closeProfileModal() {
  const modal = document.getElementById("modal-profile");
  if (modal) modal.style.display = "none";
}

function initProfileAvatarFeature() {
  const fileInput = document.getElementById("inp-avatar-upload");
  const uploadBtn = document.getElementById("btn-upload-photo");
  const removeBtn = document.getElementById("btn-remove-photo");

  uploadBtn?.addEventListener("click", () => {
    fileInput?.click();
  });

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Si us plau, seleccioneu un fitxer d'imatge vàlid (JPG, PNG o WebP).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("La mida de la imatge no pot superar els 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      const user = AppState.currentUser || { id: 1 };
      localStorage.setItem(`user_custom_avatar_${user.id}`, dataUrl);
      applyUserAvatar(dataUrl);
      alert("Foto de perfil actualitzada correctament a la barra i al perfil.");
    };
    reader.readAsDataURL(file);
  });

  removeBtn?.addEventListener("click", () => {
    const user = AppState.currentUser || { id: 1 };
    localStorage.removeItem(`user_custom_avatar_${user.id}`);
    applyUserAvatar(null);
    alert("S'ha restablert la foto de perfil a les inicials predeterminades.");
  });
}

// -----------------------------------------------------------------------------
// Exportacion Multi-Formato: Excel, CSV y PDF segun eleccion del usuario
// -----------------------------------------------------------------------------

function openExportModal(source = 'employees') {
  AppState.currentExportSource = source;
  const modal = document.getElementById("modal-export");
  if (modal) modal.style.display = "flex";
}

function closeExportModal() {
  const modal = document.getElementById("modal-export");
  if (modal) modal.style.display = "none";
}

function getExportData() {
  const source = AppState.currentExportSource || 'employees';
  if (source === 'employees') {
    const list = AppState.filteredEmployees.length > 0 ? AppState.filteredEmployees : AppState.employeeList;
    const headers = ["ID", "Nom", "Correu", "Departament", "Carrec", "Estat", "Privilegis"];
    const rows = list.map(e => [
      e.id,
      e.name,
      e.email,
      e.department,
      e.role,
      e.status,
      e.privilege || "EMPLOYEE"
    ]);
    return { title: "Llistat Oficial d'Empleats", filename: `empleats_tracker_treball_${new Date().toISOString().slice(0, 10)}`, headers, rows };
  } else if (source === 'jornadas') {
    const headers = ["Empleat", "Data", "Entrada", "Pausa", "Sortida", "Total", "Estat", "Signatura SHA-256"];
    const rows = [
      ["Laura Serra", "02/11/2026", "08:55", "35m", "17:30", "8h 00m", "Conforme", "9a2f7c00181d4a"],
      ["Marc Puig", "02/11/2026", "08:58", "45m", "En curs", "6h 15m", "En curs", "3b4e1a9972c8f1"],
      ["Jordi Vila", "02/11/2026", "08:45", "40m", "17:15", "8h 00m", "Conforme", "e4d7a12255f2d0"],
      ["Hassan Adraou", "02/11/2026", "08:50", "30m", "En curs", "6h 25m", "Conforme", "f8c2b57719a4e9"]
    ];
    return { title: "Registre Diari de Jornades Laborals", filename: `jornades_tracker_treball_${new Date().toISOString().slice(0, 10)}`, headers, rows };
  } else if (source === 'vacaciones') {
    const headers = ["Empleat", "Tipus", "Inici", "Final", "Dies Sol·licitats", "Estat", "Aprovador"];
    const rows = [
      ["Anna Soler", "Vacances anuals", "28/10/2026", "04/11/2026", "6 dies", "Aprovat", "Laura Serra"],
      ["Marc Barranco", "Assumptes propis", "10/11/2026", "11/11/2026", "1 dia", "Pendent", "Hassan Adraou"],
      ["Mohammed Alisawi", "Vacances d'hivern", "22/12/2026", "07/01/2027", "11 dies", "Aprovat", "Hassan Adraou"]
    ];
    return { title: "Sol·licituds de Vacances i Permisos", filename: `vacances_tracker_treball_${new Date().toISOString().slice(0, 10)}`, headers, rows };
  }
  
  const list = AppState.employeeList;
  const headers = ["ID", "Nom", "Correu", "Departament", "Carrec", "Estat"];
  const rows = list.map(e => [e.id, e.name, e.email, e.department, e.role, e.status]);
  return { title: "Dades de Tracker Treball", filename: `export_tracker_treball_${new Date().toISOString().slice(0, 10)}`, headers, rows };
}

function exportData(format) {
  const { title, filename, headers, rows } = getExportData();

  if (format === 'excel') {
    let xml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
    xml += '<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Dades</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; } th { background-color: #A7333A; color: #ffffff; border: 1px solid #CBD5E1; padding: 10px 14px; text-align: left; font-weight: bold; } td { border: 1px solid #CBD5E1; padding: 8px 12px; }</style></head><body>';
    xml += `<h2 style="color: #A7333A; font-family: Arial, sans-serif; margin-bottom: 4px;">TRACKER TREBALL - ${title}</h2>`;
    xml += `<p style="color: #64748B; font-size: 10pt; font-family: Arial, sans-serif; margin-top: 0;">Generat: ${new Date().toLocaleString()} · Centre: Vic Central · Autor: Hassan Adraou</p>`;
    xml += '<table><thead><tr>';
    headers.forEach(h => { xml += `<th>${h}</th>`; });
    xml += '</tr></thead><tbody>';
    rows.forEach(r => {
      xml += '<tr>';
      r.forEach(cell => { xml += `<td>${cell !== null && cell !== undefined ? cell : ''}</td>`; });
      xml += '</tr>';
    });
    xml += '</tbody></table></body></html>';

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeExportModal();
    alert("Dades exportades correctament en format Excel (.xls).");
  } else if (format === 'csv') {
    const bom = "\uFEFF";
    const csvLines = [headers.map(h => `"${h}"`).join(";")];
    rows.forEach(r => {
      csvLines.push(r.map(c => `"${(c !== null && c !== undefined ? c : '').toString().replace(/"/g, '""')}"`).join(";"));
    });
    const blob = new Blob([bom + csvLines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeExportModal();
    alert("Dades exportades correctament en format CSV.");
  } else if (format === 'pdf') {
    closeExportModal();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Si us plau, permeteu finestres emergents per obrir l'informe PDF.");
      return;
    }
    let tableHtml = '<table style="width:100%; border-collapse: collapse; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; margin-top: 15px;"><thead><tr style="background-color: #A7333A; color: white;">';
    headers.forEach(h => {
      tableHtml += `<th style="padding: 9px 12px; border: 1px solid #cbd5e1; text-align: left;">${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    rows.forEach((row, i) => {
      const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
      tableHtml += `<tr style="background-color: ${bg};">`;
      row.forEach(c => {
        tableHtml += `<td style="padding: 7px 12px; border: 1px solid #e2e8f0;">${c !== null && c !== undefined ? c : ''}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - Tracker Treball</title>
        <style>
          @page { size: A4 landscape; margin: 15mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; margin: 0; padding: 24px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #A7333A; padding-bottom: 12px; }
          .logo-text { font-size: 22px; font-weight: 700; color: #A7333A; letter-spacing: 0.5px; }
          .meta { font-size: 11px; color: #64748b; text-align: right; line-height: 1.5; }
          .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo-text">TRACKER TREBALL</div>
            <div style="font-size: 14px; font-weight: 600; color: #334155; margin-top: 4px;">${title}</div>
          </div>
          <div class="meta">
            <div><strong>Centre:</strong> Vic Central (Edifici A)</div>
            <div><strong>Generat:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Emissor:</strong> ${AppState.currentUser ? AppState.currentUser.name : 'Hassan Adraou'} (Signat SHA-256)</div>
          </div>
        </div>
        ${tableHtml}
        <div class="footer">
          <div>Document oficial generat pel sistema de gestio Tracker Treball - Edicio Enterprise</div>
          <div>Pagina 1 de 1</div>
        </div>
        <div class="no-print" style="margin-top: 24px; text-align: right;">
          <button onclick="window.print()" style="background:#A7333A; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:600; font-size:14px;">Imprimir / Guardar com a PDF</button>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}

// Envia creacion de nuevo empleado al backend
async function submitNewEmployee(e) {
  e.preventDefault();
  const name = document.getElementById("inp-emp-name").value;
  const email = document.getElementById("inp-emp-email").value;
  const department = document.getElementById("sel-emp-dept").value;
  const role = document.getElementById("inp-emp-role").value;

  const res = await apiPost("/employees", { name, email, department, role });
  const newEmp = (res && res.employee) ? res.employee : {
    id: AppState.employeeList.length + 1,
    name, email, department, role, status: "Activo", avatar: name.substring(0, 2).toUpperCase()
  };

  AppState.employeeList.unshift(newEmp);
  renderEmployeeTable(AppState.employeeList);
  
  const activosEl = document.getElementById("kpi-emp-activos");
  if (activosEl) activosEl.textContent = parseInt(activosEl.textContent || "128", 10) + 1;

  closeNewEmpModal();
  document.getElementById("form-create-emp")?.reset();
  alert(`Empleado ${name} creado con exito en el sistema.`);
}

function editEmployee(id) {
  const emp = AppState.employeeList.find(e => e.id === id);
  if (emp) alert(`Editar ficha: ${emp.name} (${emp.role})`);
}

function showEmployeeMenu(id) {
  alert(`Opciones de empleado #${id}: Ver jornada, historial o solicitar permiso.`);
}

// -----------------------------------------------------------------------------
// 5. Modulo PRL
// -----------------------------------------------------------------------------

async function triggerSOS() {
  const ok = confirm("AVISO DE SEGURIDAD: Deseas emitir una llamada de emergencia SOS?");
  if (!ok) return;

  await apiPost("/prl/sos", { location: "Vic, Barcelona - Planta 1" });
  alert(I18N[AppState.language].sosConfirmed);
}

async function registerIncident(e) {
  e.preventDefault();
  const location = document.getElementById("inc-location")?.value || "";
  const desc = document.getElementById("inc-desc")?.value || "";
  const action = document.getElementById("inc-action")?.value || "";

  await apiPost("/prl/incidents", { location, description: desc, suggestedAction: action });

  const msg = document.getElementById("inc-status-msg");
  if (msg) {
    msg.textContent = I18N[AppState.language].incidentSuccess;
    msg.style.color = "var(--success)";
  }
  document.getElementById("incident-form")?.reset();
}

// -----------------------------------------------------------------------------
// 5.5. Modulo Vacaciones, Meteorologia y Trafico (APIs en Vivo)
// -----------------------------------------------------------------------------

async function loadWeatherAndTraffic() {
  try {
    const weather = await apiGet("/external/weather");
    if (weather) {
      AppState.weatherData = weather;
      const tempEl = document.getElementById("weather-temp");
      const descEl = document.getElementById("weather-desc");
      const metaEl = document.getElementById("weather-meta");
      const locEl = document.getElementById("weather-location");
      const srcEl = document.getElementById("weather-source");
      if (tempEl) tempEl.textContent = `${weather.temperatureCelsius} °C`;
      if (descEl && weather.condition) {
        descEl.textContent = AppState.language === 'ca' ? weather.condition.ca : weather.condition.es;
      }
      if (metaEl) {
        metaEl.textContent = `Humedad: ${weather.relativeHumidity}% · Viento: ${weather.windSpeedKmh} km/h`;
      }
      if (locEl && weather.location) locEl.textContent = weather.location;
      if (srcEl && weather.source) srcEl.textContent = weather.source;
    }

    const traffic = await apiGet("/external/traffic");
    if (traffic) {
      AppState.trafficData = traffic;
      const minEl = document.getElementById("commute-minutes");
      const statusEl = document.getElementById("commute-status");
      const srcEl = document.getElementById("traffic-source");
      if (minEl) minEl.textContent = `${traffic.estimatedMinutes} min`;
      if (statusEl) {
        const isCa = AppState.language === 'ca';
        const stText = isCa ? traffic.statusCa : traffic.status;
        const descText = isCa ? traffic.descriptionCa : traffic.description;
        statusEl.textContent = `Tráfico: ${stText} · ${descText}`;
      }
      if (srcEl && traffic.source) srcEl.textContent = traffic.source;
    }
  } catch (err) {
    console.error("Error cargando tiempo o tráfico:", err);
  }
}

async function loadHolidaysData() {
  try {
    const res = await apiGet("/external/holidays");
    if (res && res.holidays) {
      AppState.holidaysList = res.holidays;
      renderHolidaysTable();
      const srcEl = document.getElementById("lbl-holidays-source");
      if (srcEl && res.source) srcEl.textContent = `Fuente: ${res.source}`;
    }
  } catch (err) {
    console.error("Error cargando festivos oficiales:", err);
  }
}

function renderHolidaysTable() {
  const tbody = document.getElementById("tbody-official-holidays");
  if (!tbody) return;
  if (!AppState.holidaysList || AppState.holidaysList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">Cargando festivos oficiales...</td></tr>`;
    return;
  }

  tbody.innerHTML = AppState.holidaysList.map(h => {
    let scopeClass = "holiday-scope-nacional";
    if (h.scopeCode === "ES-CT") scopeClass = "holiday-scope-cat";
    else if (h.scopeCode === "VIC") scopeClass = "holiday-scope-vic";

    const dateFormatted = new Date(h.date).toLocaleDateString(AppState.language === 'ca' ? 'ca-ES' : 'es-ES', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
    });

    return `
      <tr>
        <td><strong>${h.date}</strong> <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">${dateFormatted}</span></td>
        <td><strong>${h.localName}</strong></td>
        <td><span class="holiday-scope-badge ${scopeClass}">${h.scope}</span></td>
        <td><code>${h.scopeCode}</code></td>
        <td style="text-align: right;"><span class="status-pill badge-rejected" style="font-size: 0.74rem;">No laborable</span></td>
      </tr>
    `;
  }).join("");
}

function calculateWorkingDays(startStr, endStr) {
  if (!startStr || !endStr) return 0;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dayOfWeek = cur.getDay(); // 0: Dom, 6: Sab
    const isoDate = cur.toISOString().split('T')[0];
    const isHoliday = AppState.holidaysList.some(h => h.date === isoDate);
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function updateVacationCalcDisplay() {
  const start = document.getElementById("vac-input-start")?.value;
  const end = document.getElementById("vac-input-end")?.value;
  const days = calculateWorkingDays(start, end);
  const el = document.getElementById("val-vac-calc-days");
  if (el) {
    el.textContent = AppState.language === 'ca' ? `${days} dies laborables` : `${days} días laborables`;
  }
}

function updateEmpAdjustCalcDisplay() {
  const start = document.getElementById("emp-adjust-new-start")?.value;
  const end = document.getElementById("emp-adjust-new-end")?.value;
  const days = calculateWorkingDays(start, end);
  const el = document.getElementById("val-emp-adjust-days-calc");
  if (el) {
    el.textContent = AppState.language === 'ca' ? `${days} dies` : `${days} días`;
  }
}

async function loadVacationsData() {
  try {
    const res = await apiGet("/vacations/requests");
    if (res && res.status === "SUCCESS") {
      AppState.vacationBalance = res.balance || { total: 22, used: 5, pending: 4, remaining: 13 };
      AppState.myVacations = res.myRequests || [];
      AppState.supervisorVacations = res.allRequests || [];

      // Actualizar KPIs de balance
      const b = AppState.vacationBalance;
      const dSuffix = AppState.language === 'ca' ? 'dies' : 'días';
      const kpiTotal = document.getElementById("vac-kpi-total");
      const kpiUsed = document.getElementById("vac-kpi-used");
      const kpiPending = document.getElementById("vac-kpi-pending");
      const kpiRemaining = document.getElementById("vac-kpi-remaining");
      if (kpiTotal) kpiTotal.textContent = `${b.total} ${dSuffix}`;
      if (kpiUsed) kpiUsed.textContent = `${b.used} ${dSuffix}`;
      if (kpiPending) kpiPending.textContent = `${b.pending} ${dSuffix}`;
      if (kpiRemaining) kpiRemaining.textContent = `${b.remaining} ${dSuffix}`;

      // Badge de contador pendiente para el supervisor
      const pendingCount = AppState.supervisorVacations.filter(r => r.status === 'PENDIENTE' || r.status === 'AJUSTE_SOLICITADO').length;
      const badgeSup = document.getElementById("badge-supervisor-count");
      if (badgeSup) badgeSup.textContent = pendingCount;

      renderVacationsTables();
    }
  } catch (err) {
    console.error("Error cargando vacaciones:", err);
  }
}

function renderVacationsTables() {
  const t = I18N[AppState.language] || I18N.es;
  const dSuffix = AppState.language === 'ca' ? 'dies' : 'días';

  // 1. Tabla Mis Solicitudes
  const tbodyMy = document.getElementById("tbody-my-vacations");
  if (tbodyMy) {
    if (!AppState.myVacations || AppState.myVacations.length === 0) {
      tbodyMy.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--text-muted);">No tienes solicitudes de vacaciones registradas.</td></tr>`;
    } else {
      tbodyMy.innerHTML = AppState.myVacations.map(r => {
        let badgeHtml = '';
        let actionHtml = `<span style="color: var(--text-muted); font-size: 0.8rem;">--</span>`;

        if (r.status === 'PENDIENTE') {
          badgeHtml = `<span class="badge-pending">${t.statusPending}</span>`;
        } else if (r.status === 'ACEPTADA') {
          badgeHtml = `<span class="badge-accepted">${t.statusAccepted}</span>`;
        } else if (r.status === 'RECHAZADA') {
          badgeHtml = `<span class="badge-rejected">${t.statusRejected}</span>`;
        } else if (r.status === 'AJUSTE_SOLICITADO') {
          badgeHtml = `<span class="badge-adjust">${t.statusAdjust}</span>`;
          actionHtml = `<button type="button" class="btn-clean btn-clean-primary btn-open-emp-adjust" data-id="${r.id}" style="padding: 4px 10px; font-size: 0.78rem; background: #D97706; border-color: #B45309; font-weight: 700;">${t.btnAdjustDays}</button>`;
        }

        const noteText = r.supervisorNote ? `<span style="color: #B45309; font-weight: 600;">${r.supervisorNote}</span>` : `<span style="color: var(--text-muted);">--</span>`;

        return `
          <tr>
            <td><strong>${r.startDate} &rarr; ${r.endDate}</strong></td>
            <td><strong>${r.daysCount}</strong> ${dSuffix}</td>
            <td><div><strong>${r.type}</strong></div><div style="font-size: 0.78rem; color: var(--text-muted);">${r.reason || ""}</div></td>
            <td>${r.requestDate}</td>
            <td>${badgeHtml}</td>
            <td>${noteText}</td>
            <td style="text-align: right;">${actionHtml}</td>
          </tr>
        `;
      }).join("");

      tbodyMy.querySelectorAll(".btn-open-emp-adjust").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-id"), 10);
          openEmployeeAdjustModal(id);
        });
      });
    }
  }

  // 2. Tabla Supervisor
  const tbodySup = document.getElementById("tbody-supervisor-vacations");
  if (tbodySup) {
    if (!AppState.supervisorVacations || AppState.supervisorVacations.length === 0) {
      tbodySup.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: var(--text-muted);">No hay solicitudes pendientes en la bandeja de supervisión.</td></tr>`;
    } else {
      tbodySup.innerHTML = AppState.supervisorVacations.map(r => {
        let badgeHtml = '';
        let actionsHtml = '';

        if (r.status === 'PENDIENTE') {
          badgeHtml = `<span class="badge-pending">${t.statusPending}</span>`;
          actionsHtml = `
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
              <button type="button" class="btn-clean btn-clean-primary btn-sup-accept" data-id="${r.id}" style="padding: 4px 8px; font-size: 0.76rem; background: #059669; border-color: #047857; color: #FFFFFF; font-weight: 700;">${t.btnAccept}</button>
              <button type="button" class="btn-clean btn-clean-outline btn-sup-reject" data-id="${r.id}" style="padding: 4px 8px; font-size: 0.76rem; border-color: #DC2626; color: #DC2626; font-weight: 700;">${t.btnReject}</button>
              <button type="button" class="btn-clean btn-sup-adjust" data-id="${r.id}" style="padding: 4px 8px; font-size: 0.76rem; background: #D97706; border-color: #B45309; color: #FFFFFF; font-weight: 700;">${t.btnAskAdjust}</button>
            </div>
          `;
        } else if (r.status === 'AJUSTE_SOLICITADO') {
          badgeHtml = `<span class="badge-adjust">${t.statusAdjust}</span>`;
          actionsHtml = `
            <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
              <span style="font-size: 0.74rem; color: #B45309; font-weight: 600;">Esperando reajuste</span>
              <button type="button" class="btn-clean btn-sup-accept" data-id="${r.id}" style="padding: 3px 6px; font-size: 0.72rem; background: #059669; color: #FFFFFF;">${t.btnAccept}</button>
              <button type="button" class="btn-clean btn-sup-reject" data-id="${r.id}" style="padding: 3px 6px; font-size: 0.72rem; color: #DC2626; border: 1px solid #DC2626;">${t.btnReject}</button>
            </div>
          `;
        } else if (r.status === 'ACEPTADA') {
          badgeHtml = `<span class="badge-accepted">${t.statusAccepted}</span>`;
          actionsHtml = `<span style="font-size: 0.8rem; color: #059669; font-weight: 600;">Aprobada</span>`;
        } else if (r.status === 'RECHAZADA') {
          badgeHtml = `<span class="badge-rejected">${t.statusRejected}</span>`;
          actionsHtml = `<span style="font-size: 0.8rem; color: #DC2626; font-weight: 600;">Rechazada</span>`;
        }

        const noteText = r.supervisorNote ? `<span style="font-size: 0.8rem; color: var(--text-muted);">${r.supervisorNote}</span>` : `<span style="color: var(--text-muted);">--</span>`;

        return `
          <tr>
            <td><strong>${r.employeeName}</strong></td>
            <td>${r.department}</td>
            <td><strong>${r.startDate} &rarr; ${r.endDate}</strong></td>
            <td><strong>${r.daysCount}</strong> ${dSuffix}</td>
            <td><div style="font-size: 0.84rem;">${r.reason || r.type}</div></td>
            <td>${badgeHtml}</td>
            <td>${noteText}</td>
            <td style="text-align: right;">${actionsHtml}</td>
          </tr>
        `;
      }).join("");

      tbodySup.querySelectorAll(".btn-sup-accept").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-id"), 10);
          reviewVacation(id, "accept");
        });
      });

      tbodySup.querySelectorAll(".btn-sup-reject").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-id"), 10);
          reviewVacation(id, "reject");
        });
      });

      tbodySup.querySelectorAll(".btn-sup-adjust").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = parseInt(btn.getAttribute("data-id"), 10);
          openSupervisorAdjustModal(id);
        });
      });
    }
  }
}

async function submitVacationRequest() {
  const start = document.getElementById("vac-input-start")?.value;
  const end = document.getElementById("vac-input-end")?.value;
  const type = document.getElementById("vac-select-type")?.value || "Vacaciones Anuales";
  const reason = document.getElementById("vac-input-reason")?.value || "Descanso reglamentario";

  if (!start || !end) {
    alert("Por favor selecciona las fechas de inicio y fin de las vacaciones.");
    return;
  }

  const days = calculateWorkingDays(start, end);
  if (days <= 0) {
    alert("El período seleccionado no contiene días laborables válidos.");
    return;
  }

  const res = await apiPost("/vacations/requests", {
    startDate: start,
    endDate: end,
    daysCount: days,
    type: type,
    reason: reason
  });

  if (res && res.request) {
    alert(`Solicitud enviada correctamente al supervisor: ${days} días laborables solicitados del ${start} al ${end}.`);
    await loadVacationsData();
  } else {
    alert("Error al procesar la solicitud de vacaciones.");
  }
}

async function reviewVacation(id, action, note) {
  let defaultNote = "";
  if (action === "accept") defaultNote = "Solicitud aprobada por supervisión.";
  if (action === "reject") defaultNote = prompt("Indica el motivo de denegación de las vacaciones:") || "Denegada por cobertura de servicio.";

  const res = await apiPost(`/vacations/requests/${id}/review`, {
    action: action,
    note: note || defaultNote
  });

  if (res && res.request) {
    alert(`Solicitud de ${res.request.employeeName} actualizada a estado: ${res.request.status}`);
    await loadVacationsData();
  }
}

function openSupervisorAdjustModal(id) {
  const req = AppState.supervisorVacations.find(r => r.id === id);
  if (!req) return;

  const targetId = document.getElementById("sup-adjust-target-id");
  const nameEl = document.getElementById("sup-adjust-info-emp");
  const datesEl = document.getElementById("sup-adjust-info-dates");
  const commentEl = document.getElementById("sup-adjust-comment");

  if (targetId) targetId.value = id;
  if (nameEl) nameEl.textContent = req.employeeName;
  if (datesEl) datesEl.textContent = `Período actual: ${req.startDate} - ${req.endDate} (${req.daysCount} días)`;
  if (commentEl) commentEl.value = "";

  const modal = document.getElementById("modal-supervisor-adjust");
  if (modal) modal.style.display = "flex";
}

function closeSupervisorAdjustModal() {
  const modal = document.getElementById("modal-supervisor-adjust");
  if (modal) modal.style.display = "none";
}

async function confirmSupervisorAdjust() {
  const id = parseInt(document.getElementById("sup-adjust-target-id")?.value, 10);
  const comment = document.getElementById("sup-adjust-comment")?.value.trim();

  if (!id) return;
  if (!comment) {
    alert("Por favor escribe la indicación o motivo por el cual el empleado debe ajustar sus fechas.");
    return;
  }

  const res = await apiPost(`/vacations/requests/${id}/review`, {
    action: "adjust",
    note: comment
  });

  if (res && res.request) {
    closeSupervisorAdjustModal();
    alert(`Petición de ajuste enviada al empleado ${res.request.employeeName}: "${comment}"`);
    await loadVacationsData();
  }
}

function openEmployeeAdjustModal(id) {
  const req = AppState.myVacations.find(r => r.id === id);
  if (!req) return;

  const targetId = document.getElementById("emp-adjust-target-id");
  const noteEl = document.getElementById("emp-adjust-note-text");
  const startEl = document.getElementById("emp-adjust-new-start");
  const endEl = document.getElementById("emp-adjust-new-end");
  const reasonEl = document.getElementById("emp-adjust-new-reason");

  if (targetId) targetId.value = id;
  if (noteEl) noteEl.textContent = req.supervisorNote || "Por favor modifica las fechas solicitadas.";
  if (startEl) startEl.value = req.startDate;
  if (endEl) endEl.value = req.endDate;
  if (reasonEl) reasonEl.value = req.reason || "";

  updateEmpAdjustCalcDisplay();

  const modal = document.getElementById("modal-employee-adjust");
  if (modal) modal.style.display = "flex";
}

function closeEmployeeAdjustModal() {
  const modal = document.getElementById("modal-employee-adjust");
  if (modal) modal.style.display = "none";
}

async function confirmEmployeeAdjust() {
  const id = parseInt(document.getElementById("emp-adjust-target-id")?.value, 10);
  const start = document.getElementById("emp-adjust-new-start")?.value;
  const end = document.getElementById("emp-adjust-new-end")?.value;
  const reason = document.getElementById("emp-adjust-new-reason")?.value;

  if (!id || !start || !end) {
    alert("Por favor selecciona las nuevas fechas de vacaciones.");
    return;
  }

  const days = calculateWorkingDays(start, end);
  if (days <= 0) {
    alert("El rango de fechas no contiene días laborables válidos.");
    return;
  }

  const res = await apiPut(`/vacations/requests/${id}`, {
    startDate: start,
    endDate: end,
    daysCount: days,
    reason: reason
  });

  if (res && res.request) {
    closeEmployeeAdjustModal();
    alert(`Fechas de vacaciones reajustadas con éxito: ${days} días laborables del ${start} al ${end}. Solicitud reenviada al supervisor.`);
    await loadVacationsData();
  }
}

function switchVacationSubTab(tab) {
  AppState.currentVacSubTab = tab;
  const btnMy = document.getElementById("btn-subtab-my");
  const btnSup = document.getElementById("btn-subtab-supervisor");
  const btnHol = document.getElementById("btn-subtab-holidays");

  const panelMy = document.getElementById("vac-panel-my");
  const panelSup = document.getElementById("vac-panel-supervisor");
  const panelHol = document.getElementById("vac-panel-holidays");

  if (btnMy) btnMy.classList.toggle("active", tab === "my");
  if (btnSup) btnSup.classList.toggle("active", tab === "supervisor");
  if (btnHol) btnHol.classList.toggle("active", tab === "holidays");

  if (panelMy) panelMy.style.display = tab === "my" ? "block" : "none";
  if (panelSup) panelSup.style.display = tab === "supervisor" ? "block" : "none";
  if (panelHol) panelHol.style.display = tab === "holidays" ? "block" : "none";
}

// -----------------------------------------------------------------------------
// 6. Idioma y Tema Visual
// -----------------------------------------------------------------------------

function setLanguage(lang) {
  AppState.language = lang;
  document.documentElement.lang = lang;

  document.getElementById("btn-lang-ca")?.classList.toggle("active", lang === "ca");
  document.getElementById("btn-lang-es")?.classList.toggle("active", lang === "es");

  const t = I18N[lang];
  if (!t) return;

  // 1. Barra de Navegacion Superior
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
  const btnSearchSpan = document.querySelector("#btn-global-search span");
  if (btnSearchSpan) btnSearchSpan.textContent = t.btnSearch;
  updateThemeButtonUI();
  const btnLogoutSpan = document.querySelector("#btn-nav-logout span");
  if (btnLogoutSpan) btnLogoutSpan.textContent = t.btnLogout;
  const navRole = document.getElementById("nav-user-role");
  if (navRole) navRole.textContent = t.roleAdmin;

  // 2. Sidebar Lateral
  setElementText(".sidebar-heading", t.workspace);
  setElementText("#nav-btn-dashboard span", t.navDashboard);
  setElementText("#nav-btn-empleados span", t.navEmployees);
  setElementText("#nav-btn-jornadas span", t.navShifts);
  setElementText("#nav-btn-pausas span", t.navBreaks);
  setElementText("#nav-btn-vacaciones span", t.navVacations);
  setElementText("#nav-btn-bajas span", t.navMedicalLeaves);
  setElementText("#nav-btn-proyectos span", t.navProjects);
  setElementText("#nav-btn-prl span", t.navPrl);
  setElementText(".sidebar-footer-title", t.helpTitle);
  setElementText(".sidebar-footer-sub", t.helpSub);
  setElementText("#link-prl-direct", t.helpBtn);

  // 3. Pantalla de Login
  setElementText(".login-title", t.loginTitle);
  setElementText(".login-subtitle", t.loginSub);
  setElementText('label[for="login-email"]', t.lblUser);
  setElementText('label[for="login-password"]', t.lblPassword);
  setElementText(".login-remember-me span", t.rememberMe);
  setElementText(".login-forgot-link", t.forgotPassword);
  setElementText("#btn-submit-login span", t.btnLogin);
  setElementText("#btn-login-demo", t.btnDemo);
  setElementText(".login-secure-footer span", t.secureFooter);

  // 4. Dashboard (Smart Work Assistant)
  const greetingEl = document.getElementById("dash-greeting-name");
  if (greetingEl) {
    const parts = greetingEl.textContent.split(",");
    const currentName = parts.length > 1 ? parts[1] : " Hassan";
    greetingEl.textContent = `${t.welcome},${currentName}`;
  }
  setElementText(".greeting-sub", t.greetingDate);
  setElementText("#lbl-shift-schedule-prefix", `${t.lblSchedule} `);
  setElementText("#txt-btn-iniciar", t.btnStartShift);
  setElementText("#txt-btn-pausa", t.btnStartBreak);
  setElementText("#txt-btn-finalizar-pausa", t.btnEndBreak);
  setElementText("#txt-btn-finalizar", t.btnFinishShift);
  setElementText("#btn-ver-ruta", t.btnRoute);

  // Modal de Pausa
  setElementText("#lbl-break-modal-title", t.breakModalTitle);
  setElementText("#lbl-break-modal-sub", t.breakModalSub);
  setElementText("#lbl-break-cafe-title", t.breakCafeTitle);
  setElementText("#lbl-break-cafe-desc", t.breakCafeDesc);
  setElementText("#lbl-break-descanso-title", t.breakDescansoTitle);
  setElementText("#lbl-break-descanso-desc", t.breakDescansoDesc);
  setElementText("#lbl-break-almuerzo-title", t.breakAlmuerzoTitle);
  setElementText("#lbl-break-almuerzo-desc", t.breakAlmuerzoDesc);
  setElementText("#txt-cancel-break", t.btnCancel);
  setElementText("#txt-confirm-break", t.btnConfirmBreak);

  updateShiftUI();

  // 5. Seccion Empleados
  setElementText("#view-empleados .emp-breadcrumb", t.breadcrumbEmp);
  setElementText("#view-empleados .emp-page-title", t.empHeading);
  setElementText("#view-empleados .emp-page-sub", t.empSub);
  setElementText("#btn-modal-new-emp span", t.btnNewEmp);
  setElementText("#tab-emp-all", t.tabAll);
  setElementText("#tab-emp-active", t.tabActives);
  setElementText("#tab-emp-archived", t.tabArchived);
  const searchEmp = document.getElementById("search-emp-input");
  if (searchEmp) searchEmp.placeholder = t.searchEmpPlaceholder;
  setElementText("#btn-export-employees span", t.btnExport);
  const empLegal = document.querySelector(".emp-legal-footer");
  if (empLegal) empLegal.innerHTML = t.empFooter;

  // Cabeceras de tabla de empleados
  const empThs = document.querySelectorAll("#view-empleados .emp-table thead th");
  if (empThs.length >= 6) {
    empThs[0].textContent = t.colPhoto;
    empThs[1].textContent = t.colName;
    empThs[2].textContent = t.colDept;
    empThs[3].textContent = t.colRole;
    empThs[4].textContent = t.colStatus;
    empThs[5].textContent = t.colActions;
  }

  // 6. Seccion Jornadas
  setElementText("#view-jornadas .emp-breadcrumb", t.breadcrumbShifts);
  setElementText("#view-jornadas .emp-page-title", t.shiftsHeading);
  setElementText("#view-jornadas .emp-page-sub", t.shiftsSub);
  setElementText("#view-jornadas .btn-clean-primary span", t.btnExportShifts);

  // 7. Seccion Pausas
  setElementText("#view-pausas .emp-breadcrumb", t.breadcrumbBreaks);
  setElementText("#view-pausas .emp-page-title", t.breaksHeading);
  setElementText("#view-pausas .emp-page-sub", t.breaksSub);
  setElementText("#view-pausas .btn-clean-primary span", t.btnNewBreak);

  // 8. Seccion Vacaciones
  setElementText("#view-vacaciones .emp-breadcrumb", t.breadcrumbVac);
  setElementText("#lbl-vac-title", t.vacHeading);
  setElementText("#lbl-vac-sub", t.vacSub);
  setElementText("#txt-btn-quick-vac", t.btnReqVac);
  setElementText("#lbl-kpi-vac-total", t.kpiVacDays);
  setElementText("#lbl-kpi-vac-used", t.kpiVacUsed);
  setElementText("#lbl-kpi-vac-pending", t.kpiVacPending);
  setElementText("#lbl-kpi-vac-remaining", t.kpiVacRemaining);
  setElementText("#txt-subtab-my", t.subtabMyVac);
  setElementText("#txt-subtab-supervisor", t.subtabSupervisor);
  setElementText("#txt-subtab-holidays", t.subtabHolidays);
  setElementText("#lbl-form-vac-title", t.formVacTitle);
  setElementText("#lbl-form-vac-sub", t.formVacSub);
  setElementText("#txt-btn-submit-vac", t.btnSubmitVac);
  setElementText("#lbl-card-weather", t.lblWeatherCard);
  setElementText("#lbl-card-traffic", t.lblTrafficCard);

  renderVacationsTables();
  renderHolidaysTable();
  updateVacationCalcDisplay();

  // 9. Seccion Bajas Medicas
  setElementText("#view-bajas .emp-breadcrumb", t.breadcrumbLeaves);
  setElementText("#view-bajas .emp-page-title", t.leavesHeading);
  setElementText("#view-bajas .emp-page-sub", t.leavesSub);
  setElementText("#view-bajas .btn-clean-primary span", t.btnNewLeave);

  // 10. Seccion Proyectos
  setElementText("#view-proyectos .emp-breadcrumb", t.breadcrumbProj);
  setElementText("#view-proyectos .emp-page-title", t.projHeading);
  setElementText("#view-proyectos .emp-page-sub", t.projSub);
  setElementText("#view-proyectos .btn-clean-primary span", t.btnNewProj);

  // 11. Seccion PRL Help Center
  setElementText("#view-prl .emp-breadcrumb", t.breadcrumbPrl);
  setElementText("#view-prl .emp-page-title", t.prlHeading);
  setElementText("#view-prl .emp-page-sub", t.prlSub);
  setElementText("#btn-sos-main", t.btnSos);

  // Sincronizar badge de jornada y re-renderizar empleados con traduccion
  updateShiftBadge();
  renderEmployeeTable(AppState.filteredEmployees.length > 0 ? AppState.filteredEmployees : AppState.employeeList);

  // Boton Javadoc en Navbar y Sidebar
  setElementText("#btn-nav-javadoc span", t.navJavadoc);
  setElementText("#nav-btn-javadoc span", t.navJavadoc);

  // Textos del Modal de Perfil
  setElementText("#profile-modal-title", t.profileTitle);
  setElementText("#txt-upload-photo", t.uploadPhoto);
  setElementText("#txt-remove-photo", t.removePhoto);
  setElementText("#txt-photo-hint", t.photoHint);
  setElementText("#lbl-profile-email", t.lblProfileEmail);
  setElementText("#lbl-profile-dept", t.lblProfileDept);
  setElementText("#lbl-profile-center", t.lblProfileCenter);
  setElementText("#lbl-profile-status", t.lblProfileStatus);
  setElementText("#lbl-profile-schedule", t.lblProfileSchedule);
  setElementText("#lbl-profile-security", t.lblProfileSecurity);
  setElementText("#txt-profile-logout", t.btnLogout);
  setElementText("#txt-profile-close", t.btnClose);

  // Textos del Modal de Exportacion
  setElementText("#export-modal-title", t.exportTitle);
  setElementText("#export-modal-desc", t.exportDesc);
  setElementText("#lbl-export-excel-title", t.exportExcel);
  setElementText("#lbl-export-excel-sub", t.exportExcelSub);
  setElementText("#lbl-export-csv-title", t.exportCSV);
  setElementText("#lbl-export-csv-sub", t.exportCSVSub);
  setElementText("#lbl-export-pdf-title", t.exportPDF);
  setElementText("#lbl-export-pdf-sub", t.exportPDFSub);
  setElementText("#txt-export-cancel", t.btnCancel);
}

function setElementText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function toggleDarkMode() {
  AppState.theme = (AppState.theme === "light") ? "dark" : "light";
  const isDark = AppState.theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);
  
  const logoImg = document.getElementById("app-logo");
  if (logoImg) {
    logoImg.src = isDark 
      ? "assets/logo_dark_cropped.png" 
      : "assets/logo_horizontal_cropped.png";
  }

  const loginLogo = document.getElementById("login-logo");
  if (loginLogo) {
    loginLogo.src = isDark 
      ? "assets/logo_dark_cropped.png" 
      : "assets/logo_horizontal_cropped.png";
  }

  updateThemeButtonUI();
}

function updateThemeButtonUI() {
  const isDark = AppState.theme === "dark";
  const t = I18N[AppState.language] || I18N.es;
  const moonIcon = document.querySelector(".theme-icon-moon");
  const sunIcon = document.querySelector(".theme-icon-sun");
  const themeText = document.getElementById("txt-theme-toggle");
  const themeBtn = document.getElementById("btn-theme-toggle");

  if (moonIcon && sunIcon) {
    if (isDark) {
      moonIcon.style.display = "none";
      sunIcon.style.display = "inline-block";
    } else {
      moonIcon.style.display = "inline-block";
      sunIcon.style.display = "none";
    }
  }

  if (themeText) {
    themeText.textContent = isDark ? t.themeDay : t.themeNight;
  }
  if (themeBtn) {
    themeBtn.title = isDark ? t.themeDayTitle : t.themeNightTitle;
  }
}

// -----------------------------------------------------------------------------
// 7. Eventos al Cargar el Documento
// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Login
  document.getElementById("form-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email")?.value;
    const pwd = document.getElementById("login-password")?.value;

    const res = await apiPost("/auth/login", { email, password: pwd });
    if (res.user) {
      AppState.currentUser = res.user;
      document.getElementById("nav-user-name").textContent = res.user.name;
      document.getElementById("nav-user-role").textContent = res.user.role;
      applyUserAvatar();
    }
    toggleAuthScreen(true);
    navigateTo("dashboard");
  });

  // Acceso rapido Demo
  document.getElementById("btn-login-demo")?.addEventListener("click", () => {
    toggleAuthScreen(true);
    navigateTo("dashboard");
    applyUserAvatar();
  });

  // Salir
  document.getElementById("btn-nav-logout")?.addEventListener("click", () => {
    toggleAuthScreen(false);
  });

  // Toggle contrasenya
  document.getElementById("btn-toggle-pwd")?.addEventListener("click", () => {
    const input = document.getElementById("login-password");
    if (input) input.type = (input.type === "password") ? "text" : "password";
  });

  // Inicializar caracteristicas de Avatar de Perfil y Tema
  applyUserAvatar();
  initProfileAvatarFeature();
  updateThemeButtonUI();

  // Apertura y Cierre de Modal de Perfil
  document.getElementById("user-badge-profile")?.addEventListener("click", openProfileModal);
  document.getElementById("btn-close-profile")?.addEventListener("click", closeProfileModal);
  document.getElementById("btn-profile-close")?.addEventListener("click", closeProfileModal);
  document.getElementById("btn-profile-logout")?.addEventListener("click", () => {
    closeProfileModal();
    toggleAuthScreen(false);
  });

  // Navegacion Sidebar Completa (Todas las Vistas)
  document.getElementById("nav-btn-dashboard")?.addEventListener("click", () => navigateTo("dashboard"));
  document.getElementById("nav-btn-empleados")?.addEventListener("click", () => navigateTo("empleados"));
  document.getElementById("nav-btn-jornadas")?.addEventListener("click", () => navigateTo("jornadas"));
  document.getElementById("nav-btn-pausas")?.addEventListener("click", () => navigateTo("pausas"));
  document.getElementById("nav-btn-vacaciones")?.addEventListener("click", () => navigateTo("vacaciones"));
  document.getElementById("nav-btn-bajas")?.addEventListener("click", () => navigateTo("bajas"));
  document.getElementById("nav-btn-proyectos")?.addEventListener("click", () => navigateTo("proyectos"));
  document.getElementById("nav-btn-prl")?.addEventListener("click", () => navigateTo("prl"));
  document.getElementById("link-prl-direct")?.addEventListener("click", () => navigateTo("prl"));
  document.getElementById("brand-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("dashboard");
  });

  // Buscador Global de Cabecera
  const btnGlobalSearch = document.getElementById("btn-global-search");
  if (btnGlobalSearch) {
    btnGlobalSearch.addEventListener("click", handleGlobalSearch);
  }

  // Controles de Jornada y Fichaje Dinamico del Dashboard
  document.getElementById("btn-iniciar-jornada")?.addEventListener("click", startShift);
  document.getElementById("btn-pausa")?.addEventListener("click", openBreakModal);
  document.getElementById("btn-finalizar-pausa")?.addEventListener("click", endBreak);
  document.getElementById("btn-finalizar")?.addEventListener("click", finishShift);

  // Modal Seleccion de Tipo de Pausa (Cafe 15m, Descanso 30m, Almuerzo 60m)
  document.getElementById("btn-close-break")?.addEventListener("click", closeBreakModal);
  document.getElementById("btn-cancel-break")?.addEventListener("click", closeBreakModal);
  document.getElementById("btn-confirm-break")?.addEventListener("click", confirmStartBreak);

  // Seleccion interactiva de tarjetas de tipo de pausa
  document.querySelectorAll(".break-option-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".break-option-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Modal Ver Ruta
  document.getElementById("btn-ver-ruta")?.addEventListener("click", openRouteModal);
  document.getElementById("btn-close-route")?.addEventListener("click", closeRouteModal);
  document.getElementById("btn-route-ok")?.addEventListener("click", closeRouteModal);

  // Modal Nuevo Empleado
  document.getElementById("btn-modal-new-emp")?.addEventListener("click", openNewEmpModal);
  document.getElementById("btn-close-new-emp")?.addEventListener("click", closeNewEmpModal);
  document.getElementById("btn-cancel-new-emp")?.addEventListener("click", closeNewEmpModal);
  document.getElementById("form-create-emp")?.addEventListener("submit", submitNewEmployee);

  // Interaccion del Calendario Laboral
  document.querySelectorAll(".cal-day-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      const isHoliday = cell.classList.contains("holiday");
      const isToday = cell.classList.contains("today");
      handleCalendarDayClick(cell.textContent.trim(), isHoliday, isToday);
    });
  });

  // Pestañas de Filtro de Empleados
  document.getElementById("tab-emp-all")?.addEventListener("click", () => setEmployeeTabFilter("all"));
  document.getElementById("tab-emp-active")?.addEventListener("click", () => setEmployeeTabFilter("active"));
  document.getElementById("tab-emp-archived")?.addEventListener("click", () => setEmployeeTabFilter("archived"));

  // Filtros de Empleados (Input, Departamento, Estado y Supervisor)
  document.getElementById("search-emp-input")?.addEventListener("input", () => {
    AppState.empCurrentPage = 1;
    filterEmployees();
  });
  document.getElementById("filter-dept")?.addEventListener("change", () => {
    AppState.empCurrentPage = 1;
    filterEmployees();
  });
  document.getElementById("filter-status")?.addEventListener("change", () => {
    AppState.empCurrentPage = 1;
    filterEmployees();
  });
  document.getElementById("filter-supervisor")?.addEventListener("change", () => {
    AppState.empCurrentPage = 1;
    filterEmployees();
  });

  // Botones de Exportar (Excel, CSV, PDF segun eleccion del usuario)
  document.getElementById("btn-export-employees")?.addEventListener("click", () => openExportModal("employees"));
  document.querySelectorAll(".btn-clean-primary").forEach(btn => {
    if (btn.textContent.includes("Exportar") || btn.id === "btn-export-shifts") {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openExportModal("jornadas");
      });
    }
  });

  document.getElementById("btn-close-export")?.addEventListener("click", closeExportModal);
  document.getElementById("btn-export-cancel")?.addEventListener("click", closeExportModal);
  document.getElementById("btn-do-export-excel")?.addEventListener("click", () => exportData("excel"));
  document.getElementById("btn-do-export-csv")?.addEventListener("click", () => exportData("csv"));
  document.getElementById("btn-do-export-pdf")?.addEventListener("click", () => exportData("pdf"));

  // Paginacion de Empleados
  document.querySelectorAll(".page-number-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.getAttribute("data-page"), 10);
      goToEmployeePage(page);
    });
  });

  document.getElementById("btn-page-prev")?.addEventListener("click", () => {
    if (AppState.empCurrentPage > 1) {
      goToEmployeePage(AppState.empCurrentPage - 1);
    }
  });

  document.getElementById("btn-page-next")?.addEventListener("click", () => {
    const totalPages = Math.ceil(AppState.filteredEmployees.length / AppState.empPageSize);
    if (AppState.empCurrentPage < totalPages) {
      goToEmployeePage(AppState.empCurrentPage + 1);
    }
  });

  // PRL
  document.getElementById("btn-sos-main")?.addEventListener("click", triggerSOS);
  document.getElementById("incident-form")?.addEventListener("submit", registerIncident);

  // Idioma y Tema
  document.getElementById("btn-lang-ca")?.addEventListener("click", () => setLanguage("ca"));
  document.getElementById("btn-lang-es")?.addEventListener("click", () => setLanguage("es"));
  document.getElementById("btn-theme-toggle")?.addEventListener("click", toggleDarkMode);

  // Subpestañas de Vacaciones
  document.getElementById("btn-subtab-my")?.addEventListener("click", () => switchVacationSubTab("my"));
  document.getElementById("btn-subtab-supervisor")?.addEventListener("click", () => switchVacationSubTab("supervisor"));
  document.getElementById("btn-subtab-holidays")?.addEventListener("click", () => switchVacationSubTab("holidays"));
  document.getElementById("btn-quick-new-vacation")?.addEventListener("click", () => {
    switchVacationSubTab("my");
    document.getElementById("card-new-vacation-form")?.scrollIntoView({ behavior: "smooth" });
  });

  // Calculo automatico de dias laborables en formulario de vacaciones
  document.getElementById("vac-input-start")?.addEventListener("change", updateVacationCalcDisplay);
  document.getElementById("vac-input-end")?.addEventListener("change", updateVacationCalcDisplay);
  document.getElementById("btn-submit-vacation-request")?.addEventListener("click", submitVacationRequest);

  // Modal Supervisor Pedir Ajuste
  document.getElementById("btn-close-sup-adjust")?.addEventListener("click", closeSupervisorAdjustModal);
  document.getElementById("btn-cancel-sup-adjust")?.addEventListener("click", closeSupervisorAdjustModal);
  document.getElementById("btn-confirm-sup-adjust")?.addEventListener("click", confirmSupervisorAdjust);

  // Modal Empleado Ajustar Dias
  document.getElementById("btn-close-emp-adjust")?.addEventListener("click", closeEmployeeAdjustModal);
  document.getElementById("btn-cancel-emp-adjust")?.addEventListener("click", closeEmployeeAdjustModal);
  document.getElementById("btn-confirm-emp-adjust")?.addEventListener("click", confirmEmployeeAdjust);
  document.getElementById("emp-adjust-new-start")?.addEventListener("change", updateEmpAdjustCalcDisplay);
  document.getElementById("emp-adjust-new-end")?.addEventListener("change", updateEmpAdjustCalcDisplay);

  // Cargas iniciales en segundo plano
  loadWeatherAndTraffic();
  loadHolidaysData();
  loadVacationsData();
  updateVacationCalcDisplay();
});
