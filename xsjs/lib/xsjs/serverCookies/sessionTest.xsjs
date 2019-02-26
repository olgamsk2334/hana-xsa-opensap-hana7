/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, no-inner-declarations:0 */
/*eslint-env node, es6 */
$.import("xsjs.severCookies", "session");
var SESSION = $.xsjs.serverCookies.session;

var conn = $.db.getConnection();
var pstmt;
var rs;
var tblName;

function getRS() {
	tblName = $.request.parameters.get("tblName");
	tblName = typeof tblName !== "undefined" ? tblName : "UserData.User";

	var query = `select * from "${tblName}"`;
	pstmt = conn.prepareStatement(query);
	rs = pstmt.executeQuery();
	return rs;
}

function getJSON() {
	tblName = $.request.parameters.get("tblName");
	tblName = typeof tblName !== "undefined" ? tblName : "UserData.User";

	var query = `select * from "${tblName}"`;
	console.log(query);
	pstmt = conn.prepareStatement(query);
	rs = pstmt.executeQuery();

	return SESSION.recordSetToJSON(rs);

}

function outputExcel(body) {
	$.response.setBody(body);
	$.response.contentType = "application/vnd.ms-excel";
	$.response.headers.set("Content-Disposition",
		"attachment; filename=Excel.xls");
	$.response.status = $.net.http.OK;

}

function textTest() {
	var textOut = SESSION.recordSetToText(getRS(), true, "\t");
	outputExcel(textOut);
}

function csvTest() {
	var csvOut = SESSION.recordSetToText(getRS(), true, ",");
	outputExcel(csvOut);
}

function jsonTest() {
	var jsonOut = getJSON();
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(jsonOut));
	$.response.status = $.net.http.OK;
}

function setSessionTest() {
	SESSION.set_session_variable("test", "sap.hana.democontent.epm.services.SessionTest", "Test1");
	SESSION.set_session_variable("test2", "sap.hana.democontent.epm.services.SessionTest", "Test2");
	SESSION.set_session_variable("test3", "sap.hana.democontent.epm.services.SessionTest", "Test3");
	$.response.setBody("Several session variables set");
	$.response.status = $.net.http.OK;

}

function sessionTest() {
	try {
		var body = SESSION.get_session_variable("test", "sap.hana.democontent.epm.services.SessionTest");
		$.response.setBody(body);
		$.response.status = $.net.http.OK;
	} catch (e) {
		$.response.setBody(e.toString());
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	}

}

function sessionsTest() {
	$.response.contentType = "application/json";
	var body = SESSION.get_session_variables("sap.hana.democontent.epm.services.SessionTest");
	$.response.setBody(JSON.stringify(body));
	$.response.status = $.net.http.OK;

}

function setApplicationTest() {
	SESSION.set_application_variable("test", "sap.hana.democontent.epm.services.SessionTest", "Application Test1");
	SESSION.set_application_variable("test2", "sap.hana.democontent.epm.services.SessionTest", "Application Test2");
	$.response.setBody("Several application variables set");
	$.response.status = $.net.http.OK;

}

function applicationTest() {
	try {
		var body = SESSION.get_application_variable("test", "sap.hana.democontent.epm.services.SessionTest");

		$.response.setBody(body);
		$.response.status = $.net.http.OK;
	} catch (e) {
		$.response.setBody(e.toString());
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	}
}

function applicationsTest() {
	$.response.contentType = "application/json";
	var body = SESSION.get_application_variables("sap.hana.democontent.epm.services.SessionTest");
	$.response.setBody(JSON.stringify(body));
	$.response.status = $.net.http.OK;

}

function tableTest() {

	var jsonOut = getJSON();
	SESSION.set_application_variable("tables", "sap.hana.democontent.epm.services.SessionTest", JSON.stringify(jsonOut));

	$.response.contentType = "application/json";
	var body = SESSION.get_application_variable("tables", "sap.hana.democontent.epm.services.SessionTest");

	$.response.setBody(body);
	$.response.status = $.net.http.OK;

}

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
case "getSessionInfo":
	SESSION.fillSessionInfo();
	break;
case "textTest":
	textTest();
	break;
case "csvTest":
	csvTest();
	break;
case "jsonTest":
	jsonTest();
	break;
case "setSessionTest":
	setSessionTest();
	break;
case "getSessionTest":
	sessionTest();
	break;
case "getSessionsTest":
	sessionsTest();
	break;
case "setApplicationTest":
	setApplicationTest();
	break;
case "getApplicationTest":
	applicationTest();
	break;
case "getApplicationsTest":
	applicationsTest();
	break;
case "getTableTest":
	tableTest();
	break;
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody("Invalid Request Command");
}