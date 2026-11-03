// Cliente API REST y datos de prueba locales
// Autor: Hassan Adraou

// ============================================================================
// CONFIGURACION DE ENTORNO Y URL BASE DE LA API
// ============================================================================
// URL de despliegue en Render (reemplazar con tu subdominio de Render si es diferente)
const RENDER_BACKEND_URL = (typeof window !== "undefined" && window.RENDER_API_URL)
  ? window.RENDER_API_URL
  : "https://tracker-treball-backend.onrender.com";

// Deteccion automatica de entorno: local (localhost / 127.0.0.1) vs produccion (GitHub Pages)
const isLocalhost = Boolean(
  typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]" ||
    window.location.protocol === "file:"
  )
);

// URL base unificada para todos los endpoints
const API_BASE = isLocalhost
  ? "http://localhost:8080/api/v1"
  : `${RENDER_BACKEND_URL}/api/v1`;

console.log(`[Tracker Treball] Entorno: ${isLocalhost ? "LOCAL" : "PRODUCCION (Render)"} | Base: ${API_BASE}`);

// 21 usuarios corporativos
const TEST_USERS = [
  { id: 1, name: "Hassan Adraou", username: "hassan.adraou", email: "hassan.adraou@test.es", department: "Tecnología", role: "Administrador General & Tech Lead", privilege: "ADMIN", status: "Activo", avatar: "HA" },
  { id: 2, name: "Albert Guiteras", username: "albert.guiteras", email: "albert.guiteras@test.es", department: "Tecnología", role: "Tech Lead & Arquitecto Software", privilege: "SUPERVISOR", status: "Activo", avatar: "AG" },
  { id: 3, name: "Albert Profe", username: "albert.profe", email: "albert.profe@test.es", department: "Tecnología", role: "Director Académico y Tutor Técnico", privilege: "SUPERVISOR", status: "Activo", avatar: "AP" },
  { id: 4, name: "Alba Garcia", username: "alba.garcia", email: "alba.garcia@test.es", department: "Personas", role: "Responsable de Recursos Humanos", privilege: "SUPERVISOR", status: "Activo", avatar: "AG" },
  { id: 5, name: "Jose Daniel Calicchio", username: "josedaniel.calicchio", email: "josedaniel.calicchio@test.es", department: "Operaciones", role: "Coordinador General de Operaciones", privilege: "SUPERVISOR", status: "Activo", avatar: "JC" },
  { id: 6, name: "Alba Sanz", username: "alba.sanz", email: "alba.sanz@test.es", department: "Administración", role: "Técnica de Contabilidad y Facturación", privilege: "EMPLOYEE", status: "Activo", avatar: "AS" },
  { id: 7, name: "Aldana Diaz", username: "aldana.diaz", email: "aldana.diaz@test.es", department: "Tecnología", role: "Ingeniera de QA y Testing", privilege: "EMPLOYEE", status: "Activo", avatar: "AD" },
  { id: 8, name: "Barbara Orduz Romero", username: "barbara.orduz", email: "barbara.orduz@test.es", department: "Personas", role: "Especialista en Selección y PRL", privilege: "RRHH_PRL", status: "Activo", avatar: "BO" },
  { id: 9, name: "David Vélez", username: "david.velez", email: "david.velez@test.es", department: "Tecnología", role: "Ingeniero Cloud y DevOps", privilege: "EMPLOYEE", status: "Activo", avatar: "DV" },
  { id: 10, name: "Eduardo Vázquez", username: "eduardo.vazquez", email: "eduardo.vazquez@test.es", department: "Tecnología", role: "Científico de Datos e IA", privilege: "EMPLOYEE", status: "Activo", avatar: "EV" },
  { id: 11, name: "Elena Sánchez", username: "elena.sanchez", email: "elena.sanchez@test.es", department: "Personas", role: "Gestora de Nóminas y Contratos", privilege: "RRHH_PRL", status: "Vacaciones", avatar: "ES" },
  { id: 12, name: "Gabriel Bonnin", username: "gabriel.bonnin", email: "gabriel.bonnin@test.es", department: "Operaciones", role: "Analista de Procesos y Logística", privilege: "EMPLOYEE", status: "Activo", avatar: "GB" },
  { id: 13, name: "Héctor Moreno", username: "hector.moreno", email: "hector.moreno@test.es", department: "Administración", role: "Auditor Financiero y Control", privilege: "EMPLOYEE", status: "Activo", avatar: "HM" },
  { id: 14, name: "Ingrid Diaz", username: "ingrid.diaz", email: "ingrid.diaz@test.es", department: "Personas", role: "Coordinadora de Formación y PRL", privilege: "RRHH_PRL", status: "Activo", avatar: "ID" },
  { id: 15, name: "Luiggi Josue", username: "luiggi.josue", email: "luiggi.josue@test.es", department: "Tecnología", role: "Desarrollador Móvil Android", privilege: "EMPLOYEE", status: "Activo", avatar: "LJ" },
  { id: 16, name: "Marc Barranco Cordero", username: "marc.barranco", email: "marc.barranco@test.es", department: "Tecnología", role: "Desarrollador Backend Spring Boot", privilege: "EMPLOYEE", status: "Activo", avatar: "MB" },
  { id: 17, name: "Michael Xavier Puentestar", username: "michael.puentestar", email: "michael.puentestar@test.es", department: "Tecnología", role: "Desarrollador Fullstack", privilege: "EMPLOYEE", status: "Activo", avatar: "MP" },
  { id: 18, name: "Mohammed Alisawi Aloroza", username: "mohammed.alisawi", email: "mohammed.alisawi@test.es", department: "Tecnología", role: "Desarrollador Frontend UI/UX", privilege: "EMPLOYEE", status: "Activo", avatar: "MA" },
  { id: 19, name: "Roger Umpiérrez", username: "roger.umpierrez", email: "roger.umpierrez@test.es", department: "Operaciones", role: "Administrador de Sistemas y Soporte", privilege: "EMPLOYEE", status: "Baja", avatar: "RU" },
  { id: 20, name: "Silvia Navarro", username: "silvia.navarro", email: "silvia.navarro@test.es", department: "Administración", role: "Responsable de Compras", privilege: "EMPLOYEE", status: "Activo", avatar: "SN" },
  { id: 21, name: "YingYing Xu", username: "yingying.xu", email: "yingying.xu@test.es", department: "Administración", role: "Controller Financiero", privilege: "EMPLOYEE", status: "Activo", avatar: "YX" }
];

// Datos de prueba para desarrollo local
const TEST_DATA = {
  user: TEST_USERS[0],
  stats: {
    activos: 19,
    departamentos: 4,
    vacaciones: 1,
    proximaIncorporacion: "10 nov",
    nuevasIncorporaciones: 3,
    total: 21,
    archivados: 0
  },
  employees: TEST_USERS,
  dashboard: {
    employee: {
      name: "Hassan Adraou",
      role: "Administrador General & Tech Lead",
      homeLocation: "Vic, Barcelona",
      destinationWorkplace: "Oficina Central Vic",
      commuteMinutesEstimated: 22,
      trafficCondition: "Moderado"
    },
    todayShift: {
      shiftStarted: false,
      clockIn: null,
      expectedExit: "17:30",
      status: "NO_INICIADA",
      workedSeconds: 0,
      isOnBreak: false,
      isFinished: false,
      currentBreak: null,
      breaksHistory: []
    },
    productivity: {
      hoursWorkedThisWeek: 31,
      targetHoursPerWeek: 40,
      completionPercentage: 78,
      overtimeHours: 2
    },
    project: {
      name: "Tracker Treball SaaS",
      sprintProgressPercentage: 85,
      teamMembersCount: 21,
      dedicatedHoursEmployee: 24
    },
    weather: {
      location: "Vic, Barcelona",
      temperatureCelsius: 14,
      conditionDescription: "Parcialmente nublado"
    }
  }
};

// Peticiones GET con retorno de datos de prueba si falla la conexion
async function apiGet(endpoint, fallbackKey) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (res.ok) return await res.json();
  } catch (err) {
    // Modo desconectado: usar datos de prueba
  }
  return fallbackKey ? TEST_DATA[fallbackKey] : null;
}

// Peticiones POST simples con JSON
async function apiPost(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // Modo desconectado: simular respuesta correcta
  }
  return { status: "SUCCESS", mock: true };
}

// Peticiones PUT con JSON
async function apiPut(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // Modo desconectado: simular respuesta correcta
  }
  return { status: "SUCCESS", mock: true };
}
