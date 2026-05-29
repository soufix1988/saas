// ============================================================
// Code.gs — Backend Principal
// Universal SaaS CRM & Booking System
// Google Apps Script
// ============================================================

const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1zwQwhV6Thvi9cev7iZiXKAd6a7g36dFD7tOT0kJ9HRo/edit";
const ENABLE_APPOINTMENTS = true;
const SHEETS = { 
  CONFIG: "Config_Formulaires", CHAMPS: "Structure_Champs", 
  DROITS: "Gestion_Droits", ARCHIVE: "Archive_Global", 
  APP: "Config_App", USERS: "Comptes_Utilisateurs" 
};

function doGet(e) {
  initDB();
  let template = HtmlService.createTemplateFromFile('Index');
  const formId = (e && e.parameter && e.parameter.formId) ? e.parameter.formId : "";
  template.requestedFormId = formId;
  template.initialBodyClass = formId ? "shared-mode bg-solid" : "login-mode bg-solid";
  return template.evaluate()
    .setTitle('Smart Clinic CRM & Appointments')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function initDB() {
  const ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const requiredSheets = [
    { name: SHEETS.APP, headers: ["App_Name","App_Icon","App_Color","App_Text_Color","App_Lang","App_Logo","App_Pattern","App_BgColor","App_BgImg"] },
    { name: SHEETS.USERS, headers: ["ID_User","Mot_de_passe","Email_Associe","Nom","Prenom"] },
    { name: SHEETS.CONFIG, headers: ["ID","Nom","Langue","RTL","Theme","Font","Color","Statut","TextColor","Icon","AdvConfig"] },
    { name: SHEETS.CHAMPS, headers: ["ID_Form","Label","Type","Options","Requis","Logique","Ordre","Is_Unique","Description","DescStyle","CorrectAnswer","Points","ImageUrl"] },
    { name: SHEETS.DROITS, headers: ["Identifiant","ID_Form","Is_Admin","Can_View_Table","Can_Edit_Row","Can_Delete_Row"] },
    { name: SHEETS.ARCHIVE, headers: ["Timestamp","ID_Form","User","Action"] }
  ];
  requiredSheets.forEach(sheetData => {
    let sheet = ss.getSheetByName(sheetData.name);
    if (!sheet) { 
      sheet = ss.insertSheet(sheetData.name); 
      sheet.appendRow(sheetData.headers); 
      sheet.getRange("A1:Z1").setFontWeight("bold"); 
      if (sheetData.name === SHEETS.APP) {
        sheet.appendRow(["FormSaaS","fa-layer-group","#111827","#ffffff","fr","","bg-solid","#f7f9fc",""]); 
      }
    }
  });
}

function getGlobalConfig() {
  const ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const appSheet = ss.getSheetByName(SHEETS.APP);
  if (!appSheet) return { name: "Smart Clinic", lang: "fr", enableApt: true };
  const appData = appSheet.getDataRange().getValues()[1] || ["FormSaaS","fa-layer-group","#111827","#ffffff","fr","","bg-solid","#f7f9fc",""];
  return { 
    name: appData[0], icon: (appData[1]&&appData[1].trim()!=='')?appData[1].trim():"fa-layer-group", 
    color: appData[2], textColor: appData[3], lang: appData[4]||'fr', logo: appData[5]||'', 
    pattern: appData[6]||'bg-solid', bgColor: appData[7]||'#f7f9fc', bgImg: appData[8]||'',
    enableApt: ENABLE_APPOINTMENTS 
  };
}

function authenticateUser(identifiant, password) {
  try {
    const ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    const data = ss.getSheetByName(SHEETS.USERS).getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if ((data[i][0].toString().toLowerCase()===identifiant.toLowerCase().trim() || 
           data[i][2].toString().toLowerCase()===identifiant.toLowerCase().trim()) && 
           data[i][1].toString()===password.toString()) {
        return { success: true, identifier: data[i][0].toString() };
      }
    }
    throw new Error("Erreur ID");
  } catch (e) { return { success: false, error: e.message }; }
}

function getUserContext(identifierOverride) {
  if (!identifierOverride && (!Session.getActiveUser() || Session.getActiveUser().getEmail()==="")) {
    return { identifier: "", isAdmin: false, rights: {}, appConfig: getGlobalConfig(), scriptUrl: ScriptApp.getService().getUrl() };
  }
  const activeGoogleEmail = Session.getActiveUser().getEmail(); 
  const sessionIdentifier = identifierOverride || activeGoogleEmail;
  if (!sessionIdentifier || sessionIdentifier==="") {
    return { identifier: "", isAdmin: false, rights: {}, appConfig: getGlobalConfig(), scriptUrl: ScriptApp.getService().getUrl() };
  }
  const cache = CacheService.getScriptCache();
  const cacheKey = "user_ctx_v6_" + sessionIdentifier;
  const cached = cache.get(cacheKey);
  let finalContext;
  if (cached) { finalContext = JSON.parse(cached); } 
  else {
    const ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    let resolvedId = sessionIdentifier; let userEmail = sessionIdentifier; let userFullName = "Utilisateur";
    const userSheet = ss.getSheetByName(SHEETS.USERS);
    if(userSheet) {
      const userData = userSheet.getDataRange().getValues();
      let searchId = sessionIdentifier.toString().toLowerCase().trim();
      for(let i=1;i<userData.length;i++) {
        let sheetId = userData[i][0]?userData[i][0].toString().toLowerCase():"";
        let sheetEmail = userData[i][2]?userData[i][2].toString().toLowerCase():"";
        if(sheetId===searchId||sheetEmail===searchId) { 
          resolvedId=userData[i][0]; userEmail=userData[i][2]; 
          userFullName=(userData[i][3]||"")+" "+(userData[i][4]||""); break; 
        }
      }
    }
    const droitsSheet = ss.getSheetByName(SHEETS.DROITS); 
    let isAdmin = false; let rights = {};
    if (droitsSheet) {
      const data = droitsSheet.getDataRange().getValues();
      let resIdLower = resolvedId?resolvedId.toString().toLowerCase():"";
      let emailLower = userEmail?userEmail.toString().toLowerCase():"";
      for (let i=1;i<data.length;i++) {
        let droitIdentifiant = data[i][0]?data[i][0].toString().trim().toLowerCase():"";
        if (droitIdentifiant!==""&&(droitIdentifiant===resIdLower||droitIdentifiant===emailLower)) { 
          if(data[i][2]===true) isAdmin=true; 
          else rights[data[i][1]] = { view:data[i][3]===true, edit:data[i][4]===true, del:data[i][5]===true, viewDashboard:data[i][6]===true }; 
        }
      }
    }
    if(activeGoogleEmail&&userEmail&&userEmail.toLowerCase()===activeGoogleEmail.toLowerCase()) isAdmin=true;
    if(resolvedId==="SUPER_ADMIN"||resolvedId==="admin") isAdmin=true;
    finalContext = { identifier:resolvedId, email:userEmail||resolvedId, fullName:userFullName.trim(), isAdmin:isAdmin, rights:rights, scriptUrl:ScriptApp.getService().getUrl() };
    cache.put(cacheKey, JSON.stringify(finalContext), 3600);
  }
  finalContext.appConfig = getGlobalConfig(); 
  return finalContext;
}

// ... [Les fonctions saveForm, updateForm, deleteForm, submitForm,
//      getFormEntries, deleteFormEntry, updateFormEntry,
//      getDashboardData, getAppointmentsInitData,
//      createSaaSUser, deleteSaaSUser, saveUserAccessWithDashboard,
//      removeUserAccess, getAdminAccessData, saveAppConfig,
//      duplicateSaaSForm, getMyProjects, getFormStructure,
//      clearDashCache, forceClearUserCache sont incluses dans le
//      code complet — voir la conversation source pour le code intégral]
