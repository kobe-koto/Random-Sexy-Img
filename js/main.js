/* Encoding: UTF-8
*  Made with heart by kobe-koto in AGPL-3.0 License License
*  copyright 2021 kobe-koto */

function copyPicShareLink(ToCopyText) {
	try {
		navigator.clipboard.writeText(ToCopyText).then();
		alert("Successful to Copy \r\n\""+ToCopyText+"\"");
	} catch (err) {
		console.error("Cannot copy \""+ToCopyText+"\".")
		alert("Cannot copy \r\n\""+ToCopyText+"\".");
	}
}

function clearData(Value) {
	//clear old data,use for reload a new img
	if (Value === "load") {
		document.getElementById("picNum").innerHTML = "INFO: 載入中";
	}
	document.getElementById("raw").href = "";
	document.getElementById("lock").href = "";
	document.getElementById("download").href = "";
	document.getElementById("download").download = "";
	document.getElementById("CheckImg").style.backgroundImage = "url(../images/load.svg)";
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
	if (r != null) {return r[2];} else {return "";}
}

function GenImgName (SpecifyImgName) {
	if (SpecifyImgName != "") {
		return SpecifyImgName;
	} else {
		/* Random */
		while (true) {
			var RandomImgName = ColorImgJson.pics[(Math.round((ColorImgJson.fileNum) * Math.random()))].name;
			if (RandomImgName != "LetMeFixThisErrorButDoNotThinkSoItIsWorkGood?.jpg") {
				return RandomImgName;
			}
		}
	}
}

function Load(img) {
	//load a new Img from varied API.

	clearData("load");
	picName = GenImgName(img);
	picLink = GetImgAPI + picName;

	if (window.ShareDBTypeSP == "true") {
		ShareLink = window.location.protocol+"//"+window.location.host+window.location.pathname+"?type="+ShareDBType+"&img="+picName;
	} else {
		ShareLink = window.location.protocol+"//"+window.location.host+window.location.pathname+"?img="+picName;
	}

	document.getElementById("colorPic").src = picLink;

	// load error
	document.getElementById("colorPic").onerror = function () {
		document.getElementById("colorPic").onload = null;

		clearData("");

		document.getElementById("colorPic").src = "../images/error.svg";
		document.getElementById("CheckImg").style.backgroundImage = "url(../images/error.svg)";
		document.getElementById("picNum").innerHTML = "在加載 「"+picName+"」 時遇到問題, 請稍後再試." + "<br>" + "<a href=\""+ShareLink+"\">單擊此處以嘗試重新加載</a>";
	}

	// load done
	document.getElementById("colorPic").onload = function () {
		document.getElementById("colorPic").onerror = null;
		document.getElementById("raw").href = picLink;
		document.getElementById("lock").href = ShareLink;
		document.getElementById("download").href = picLink;
		document.getElementById("download").download = picName;

		document.getElementById("picNum").innerHTML = "您要的銫圖 「" + picName + "」 ‼";


		document.getElementById("CheckImg").style.backgroundImage = "url(../images/check.svg)";


		console.log("INFO: 圖像成功載入...您要的銫圖!")
	}
}



function windowload (isMoveInfoZone,databaseType) {

	if (isMoveInfoZone == "true") {
		document.getElementById("InfoZone").onmousedown = function (e) {
			//on mouse press on the element, record the element XY as disX & disY.
			var disX = e.clientX - document.getElementById("InfoZone").offsetLeft;
			var disY = e.clientY - document.getElementById("InfoZone").offsetTop;
			document.onmousemove = function (e) {
				//cale coordinate to move.
				var tX = e.clientX - disX;
				var tY = e.clientY - disY;
				//move the element.
				if (tX >= 0 && tX <= window.innerWidth - document.getElementById("InfoZone").offsetWidth) {
					document.getElementById("InfoZone").style.left = tX + 'px';
				}
				if (tY >= 0 && tY <= window.innerHeight - document.getElementById("InfoZone").offsetHeight) {
					document.getElementById("InfoZone").style.top = tY + 'px';
				}
			}
			//delete event when mouse up.
			document.onmouseup = document.body.onmouseup = function () {
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}
		//「⚠ 衆神歸位 ⚠」resize時InfoZone歸位。
		window.onresize = function () {
			document.getElementById("InfoZone").style.top = "15px";
			document.getElementById("InfoZone").style.left = "15px";
		}
	}

	//定義DBType。
	if (databaseType == "auto") {
		var type = ["fur","gay","transfur"]
		for (r=0;r<type.length;r++) {
			if (GetQueryString("type").toLowerCase() == type[r]) {
				ShareDBTypeSP = "true";
				ShareDBType = type[r];
			}
		}
	}
	if (window.ShareDBTypeSP != "true" && databaseType == "auto") {
		alert("請指定正確的DBType!!")
		return null;
	} else if (databaseType != "auto") {
		ShareDBType = databaseType;
	}

	document.getElementById("picNum").innerHTML = "INFO: 正在載入銫圖列表";
	if (window.location.protocol.match(/(file|data)/i)) {
		alert(window.location.protocol + "下无法加载DataBase");
		console.error(window.location.protocol + "下无法加载DataBase");
	} else {
		//config ColorImg database loc.
		var requestURL = "../database/"+ShareDBType+".txt";

		//request ColorImg database.
		var request = new XMLHttpRequest();
		request.open("GET", requestURL, true);
		request.onerror = function () {
			console.error("ERROR! 未能載入列表.");
			document.getElementById("picNum").innerHTML = "ERROR: 列表無法載入";
			document.getElementById("colorPic").src = "./images/error.svg";
			document.getElementById("CheckImg").style.backgroundImage = "url(./images/error.svg)";
			return null;
		}
		request.onload = function () {
			console.log("INFO: 成功載入了列表!");
			ColorImgJson = JSON.parse(request.response);
			GetImgAPI = "https://file.koto.cc/api/raw/?path=/Image/GetColorImg/"+ShareDBType+"/";
			document.getElementById("PicCount").innerHTML = "隨機色圖"+ShareDBType+"目前已收錄"+ColorImgJson.fileNum+"張色圖!!"

			//mode auto,support Specify & Random.
			var imgRequest = GetQueryString("img").toString()
			if (imgRequest != null) {
				Load(imgRequest);
			} else {
				Load();
			}
		}
		request.send();

	}
}


