/* Encoding: UTF-8
*  Made with heart by kobe-koto in AGPL-3.0 License License
*  copyright 2021 kobe-koto */

function Report(text) {
	var ReportURL = "https://report-bot.wirt.tk/bot5525281875:abab-HereNotAnyBotToken-abab?";
	var ReportXHR = new XMLHttpRequest();
	ReportXHR.open("GET", ReportURL+"title=RSI-Report&text="+text, true);
	ReportXHR.onerror = function () {
		ReportXHR.onload = function(){};
		document.getElementById("ReportStatus").innerHTML = "發送失敗!<br>傳回訊息<br>" + ReportXHR.response;
	}
	ReportXHR.onload = function () {
		ReportXHR.onerror = function(){};
		document.getElementById("ReportStatus").innerHTML = ReportXHR.response;
	}
	ReportXHR.send();
}