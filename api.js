// ============================================================================
// MODULO DE COMUNICACION CON LA API REST (TRACKER TREBALL)
// Capa cliente HTTP con sincronizacion segura en UTF-8 y soporte RBAC
// Autor: Hassan Adraou
// ============================================================================

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "");

const isLocalBackend = false; // true si corre backend local en puerto 8080

// URL oficial del microservicio Spring Boot en Railway
const RAILWAY_BACKEND_URL = "https://tracker-treball-backend-production-e9cd.up.railway.app";

const API_BASE = isLocalBackend
  ? "http://localhost:8080/api/v1"
  : `${RAILWAY_BACKEND_URL}/api/v1`;

// Helper de cabeceras seguras con codificacion UTF-8 y credenciales RBAC
function getApiHeaders() {
  const headers = { 
    "Content-Type": "application/json; charset=utf-8",
    "Accept": "application/json; charset=utf-8"
  };
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("tt_token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const role = (typeof AppState !== "undefined" && AppState.currentUser)
    ? (AppState.currentUser.rol || AppState.currentUser.privilege || "EMPLOYEE")
    : "ADMIN";
  headers["X-User-Role"] = role;

  const empId = (typeof AppState !== "undefined" && AppState.currentUser && AppState.currentUser.id)
    ? AppState.currentUser.id
    : 1;
  headers["X-User-Id"] = String(empId);

  return headers;
}

// Peticiones GET con proteccion de contingencia
async function apiGet(endpoint, fallbackKey) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: getApiHeaders()
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // Modo contingencia silencioso
  }
  return fallbackKey ? TEST_DATA[fallbackKey] : null;
}

// Peticiones POST con JSON y UTF-8
async function apiPost(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: getApiHeaders(),
      body: payload ? JSON.stringify(payload) : null
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { 
        status: "ERROR", 
        error: (data && (data.message || data.error)) || `Error ${res.status}`, 
        data 
      };
    }
    return data || { status: "SUCCESS" };
  } catch (err) {
    return { status: "ERROR", error: err.message };
  }
}

// Peticiones PUT con JSON y UTF-8
async function apiPut(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: getApiHeaders(),
      body: payload ? JSON.stringify(payload) : null
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { 
        status: "ERROR", 
        error: (data && (data.message || data.error)) || `Error ${res.status}`, 
        data 
      };
    }
    return data || { status: "SUCCESS" };
  } catch (err) {
    return { status: "ERROR", error: err.message };
  }
}

// Peticiones DELETE con autorizacion RBAC
async function apiDelete(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      headers: getApiHeaders()
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { 
        status: "ERROR", 
        error: (data && (data.message || data.error)) || `Error ${res.status}`, 
        data 
      };
    }
    return data || { status: "SUCCESS" };
  } catch (err) {
    return { status: "ERROR", error: err.message };
  }
}

// ============================================================================
// FUNCIONES ESPECIFICAS DEL SISTEMA TRACKER TREBALL
// ============================================================================
async function apiLogin(email, password) {
  return await apiPost("/auth/login", { email, password });
}

async function apiChangePassword(email, currentPassword, newPassword) {
  return await apiPost("/auth/change-password", { email, currentPassword, newPassword });
}

async function apiClockIn(employeeId, modality = "PRESENCIAL") {
  return await apiPost('/attendance/clock-in?employeeId=' + encodeURIComponent(employeeId) + '&modality=' + encodeURIComponent(modality), { employeeId, modality });
}

async function apiClockOut(employeeId) {
  return await apiPost('/attendance/clock-out?employeeId=' + encodeURIComponent(employeeId), { employeeId });
}

async function apiGetTodayAttendance(employeeId) {
  return await apiGet('/attendance/today?employeeId=' + encodeURIComponent(employeeId));
}

async function apiStartBreak(employeeId, breakType, minutes) {
  return await apiPost(`/attendance/break/start?employeeId=${encodeURIComponent(employeeId)}&breakType=${encodeURIComponent(breakType)}&minutes=${encodeURIComponent(minutes)}`);
}

async function apiFinishBreak(employeeId) {
  return await apiPost(`/attendance/break/finish?employeeId=${encodeURIComponent(employeeId)}`);
}

async function apiGetReports(employeeId) {
  return await apiGet(`/attendance/reports/employee/${encodeURIComponent(employeeId)}`);
}

async function apiGetReminders(employeeId) {
  return await apiGet(`/reminders/employee/${encodeURIComponent(employeeId)}`);
}

async function apiGetWorkCenters() {
  return await apiGet("/work-centers");
}

async function apiGetWorkCenterHolidays(workCenterId) {
  return await apiGet(`/work-centers/${encodeURIComponent(workCenterId)}/holidays`);
}

async function apiDeleteEmployee(id, permanent = false) {
  return await apiDelete(`/employees/${encodeURIComponent(id)}?permanent=${permanent}`);
}

// ============================================================================
// GESTOR VISUAL DE BASE DE DATOS (ADMIN VISOR / ADMINER INTEGRADO)
// ============================================================================
async function apiGetAdminTables() {
  return await apiGet("/admin/tables");
}

async function apiGetAdminTableData(tableName, limit = 100, search = "") {
  let url = `/admin/tables/${encodeURIComponent(tableName)}?limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  return await apiGet(url);
}

async function apiInsertAdminTableRow(tableName, data) {
  return await apiPost(`/admin/tables/${encodeURIComponent(tableName)}`, data);
}

async function apiUpdateAdminTableRow(tableName, id, data) {
  return await apiPut(`/admin/tables/${encodeURIComponent(tableName)}/${encodeURIComponent(id)}`, data);
}

async function apiDeleteAdminTableRow(tableName, id) {
  return await apiDelete(`/admin/tables/${encodeURIComponent(tableName)}/${encodeURIComponent(id)}`);
}

// 21 usuarios corporativos para contingencia / modo desconectado con RBAC estricto
const TEST_USERS = [
  { id: 1, name: "Hassan Adraou", username: "hassan.adraou", email: "hassan.adraou@test.es", department: "Tecnología", role: "Director General & Administrador", rol: "ADMIN", privilege: "ADMIN", status: "Activo", avatar: "HA", centroTrabajo: "Barcelona", workCenterId: 1, nss: "280000000145" },
  { id: 2, name: "Albert Guiteras", username: "albert.guiteras", email: "albert.guiteras@test.es", department: "Tecnología", role: "Tech Lead & Manager de Tecnología", rol: "MANAGER", privilege: "MANAGER", status: "Activo", avatar: "AG", centroTrabajo: "Barcelona", workCenterId: 1, nss: "280000000245" },
  { id: 3, name: "Albert Profe", username: "albert.profe", email: "albert.profe@test.es", department: "Tecnología", role: "Director Académico & Manager", rol: "MANAGER", privilege: "MANAGER", status: "Activo", avatar: "AP", centroTrabajo: "Barcelona", workCenterId: 1, nss: "280000000345" },
  { id: 4, name: "Alba Garcia", username: "alba.garcia", email: "alba.garcia@test.es", department: "Personas", role: "Manager de Recursos Humanos", rol: "MANAGER", privilege: "MANAGER", status: "Activo", avatar: "AG", centroTrabajo: "Barcelona", workCenterId: 1, nss: "280000000445" },
  { id: 5, name: "Jose Daniel Calicchio", username: "josedaniel.calicchio", email: "josedaniel.calicchio@test.es", department: "Operaciones", role: "Coordinador General de Operaciones", rol: "MANAGER", privilege: "MANAGER", status: "Activo", avatar: "JC", centroTrabajo: "Madrid", workCenterId: 2, nss: "280000000545" },
  { id: 6, name: "Alba Sanz", username: "alba.sanz", email: "alba.sanz@test.es", department: "Administración", role: "Técnica de Contabilidad y Facturación", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "AS", centroTrabajo: "Madrid", workCenterId: 2, nss: "280000000645" },
  { id: 7, name: "Aldana Diaz", username: "aldana.diaz", email: "aldana.diaz@test.es", department: "Tecnología", role: "Ingeniera de QA y Testing", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "AD", centroTrabajo: "Madrid", workCenterId: 2, nss: "280000000745" },
  { id: 8, name: "Barbara Orduz Romero", username: "barbara.orduz", email: "barbara.orduz@test.es", department: "Personas", role: "Manager de PRL y Talento", rol: "MANAGER", privilege: "MANAGER", status: "Activo", avatar: "BO", centroTrabajo: "Madrid", workCenterId: 2, nss: "280000000845" },
  { id: 9, name: "David Vélez", username: "david.velez", email: "david.velez@test.es", department: "Tecnología", role: "Ingeniero Cloud y DevOps", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "DV", centroTrabajo: "Bilbao", workCenterId: 3, nss: "280000000945" },
  { id: 10, name: "Eduardo Vázquez", username: "eduardo.vazquez", email: "eduardo.vazquez@test.es", department: "Tecnología", role: "Científico de Datos e IA", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "EV", centroTrabajo: "Bilbao", workCenterId: 3, nss: "280000001045" },
  { id: 11, name: "Elena Sánchez", username: "elena.sanchez", email: "elena.sanchez@test.es", department: "Personas", role: "Gestora de Nóminas y Contratos", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Vacaciones", avatar: "ES", centroTrabajo: "Bilbao", workCenterId: 3, nss: "280000001145" },
  { id: 12, name: "Gabriel Bonnin", username: "gabriel.bonnin", email: "gabriel.bonnin@test.es", department: "Operaciones", role: "Manager Regional Andalucía", rol: "MANAGER", privilege: "MANAGER", status: "Activo", avatar: "GB", centroTrabajo: "Sevilla", workCenterId: 4, nss: "280000001245" },
  { id: 13, name: "Héctor Moreno", username: "hector.moreno", email: "hector.moreno@test.es", department: "Administración", role: "Auditor Financiero y Control", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "HM", centroTrabajo: "Sevilla", workCenterId: 4, nss: "280000001345" },
  { id: 14, name: "Ingrid Diaz", username: "ingrid.diaz", email: "ingrid.diaz@test.es", department: "Personas", role: "Manager Regional Levante & PRL", rol: "MANAGER", privilege: "MANAGER", status: "Activo", avatar: "ID", centroTrabajo: "Valencia", workCenterId: 5, nss: "280000001445" },
  { id: 15, name: "Luiggi Josue", username: "luiggi.josue", email: "luiggi.josue@test.es", department: "Tecnología", role: "Desarrollador Móvil Android", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "LJ", centroTrabajo: "Valencia", workCenterId: 5, nss: "280000001545" },
  { id: 16, name: "Marc Barranco Cordero", username: "marc.barranco", email: "marc.barranco@test.es", department: "Tecnología", role: "Desarrollador Backend Spring Boot", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "MB", centroTrabajo: "Barcelona", workCenterId: 1, nss: "280000001645" },
  { id: 17, name: "Michael Xavier Puentestar", username: "michael.puentestar", email: "michael.puentestar@test.es", department: "Tecnología", role: "Desarrollador Fullstack", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "MP", centroTrabajo: "Barcelona", workCenterId: 1, nss: "280000001745" },
  { id: 18, name: "Mohammed Alisawi Aloroza", username: "mohammed.alisawi", email: "mohammed.alisawi@test.es", department: "Tecnología", role: "Desarrollador Frontend UI/UX", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "MA", centroTrabajo: "Barcelona", workCenterId: 1, nss: "280000001845" },
  { id: 19, name: "Roger Umpiérrez", username: "roger.umpierrez", email: "roger.umpierrez@test.es", department: "Operaciones", role: "Administrador de Sistemas y Soporte", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Baja", avatar: "RU", centroTrabajo: "Extranjero", workCenterId: 6, nss: "280000001945" },
  { id: 20, name: "Silvia Navarro", username: "silvia.navarro", email: "silvia.navarro@test.es", department: "Administración", role: "Responsable de Compras", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "SN", centroTrabajo: "Valencia", workCenterId: 5, nss: "280000002045" },
  { id: 21, name: "YingYing Xu", username: "yingying.xu", email: "yingying.xu@test.es", department: "Administración", role: "Controller Financiero", rol: "EMPLOYEE", privilege: "EMPLOYEE", status: "Activo", avatar: "YX", centroTrabajo: "Extranjero", workCenterId: 6, nss: "280000002145" }
];

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
      role: "Director General & Administrador",
      homeLocation: "Vic, Barcelona",
      destinationWorkplace: "Oficina Central Vic",
      commuteMinutesEstimated: 22,
      trafficCondition: "Fluido"
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
      location: "Barcelona",
      temperatureCelsius: 17,
      conditionDescription: "Soleado con brisa"
    }
  }
};
