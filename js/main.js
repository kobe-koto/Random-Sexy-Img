/* Encoding: UTF-8
* Made with heart by kobe-koto in AGPL-3.0 License License
* copyright 2021 kobe-koto */


function random (intmin,intmax) {
	//get a random num
	while (!isNaN(intmax) && !isNaN(intmin) && !intmax.toString().match(/(-)/i)) {
		var randomno = Math.round(intmax * Math.random());
		if (randomno <= intmax && randomno >= intmin) {
			return randomno;
		}
	}
}

function copyPicShareLink() {
	try {
		navigator.clipboard.writeText(ShareLink).then();
		console.log("successful.");
		alert("successful.");
	} catch (err) {
		console.error("cannot copy link.")
		alert("cannot copy link.");
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
	if (window.location.toString().match(/(gay\/|fur\/)/i)) {
		document.getElementById("CheckImg").style.backgroundImage = "url(../images/load.svg)";
	} else if (window.location.toString().match(/(gay|fur)/i)) {
		document.getElementById("CheckImg").style.backgroundImage = "url(../images/load.svg)";
	} else {
		document.getElementById("CheckImg").style.backgroundImage = "url(./images/load.svg)";
	}
}
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配

	if (r != null) {
		return r[2];
	} else {
		return "";
	}
}
function Load(img) {
	//load a new Img from varied API.
	if (img == "") {
		// Random img load
		console.log("隨機圖像模式");
		while (true) {
			picName = ColorImgJson.pics[(Math.round((ColorImgJson.fileNum) * Math.random()))].name;
			if (picName != "LetMeFixThisErrorButDoNotThinkSoItIsWorkGood?.jpg") {
				picLink = GetImgAPI + picName;
				break;
			}
		}

		/* picName = ColorImgJson.pics[(random("0",(ColorImgJson.fileNum - 1)))].name;
		 * picLink = GetImgAPI + picName;
		 */


	} else if (img != null) {
		// Specify img load
		console.log("指定圖像Name模式.");
		picName = img;
		picLink = GetImgAPI + img;
	} else {
		console.error("數·值·錯·誤·!");
		if (window.location.toString().match(/(gay|fur)/i)) {
			document.getElementById("colorPic").src = "../images/error.svg";
			document.getElementById("CheckImg").style.backgroundImage = "url(../images/error.svg)";
		} else {
			document.getElementById("colorPic").src = "./images/error.svg";
			document.getElementById("CheckImg").style.backgroundImage = "url(./images/error.svg)";
		}
		return null;
	}

	clearData("load");

	ShareLink = window.location.protocol + "//" + window.location.host + window.location.pathname + "?img=" + picName;
	document.getElementById("colorPic").src = picLink;

	// load error
	document.getElementById("colorPic").onerror = function () {
		document.getElementById("colorPic").onload = null;

		clearData("");

		if (window.location.toString().match(/(gay|fur)/i)) {
			document.getElementById("colorPic").src = "../images/error.svg";
			document.getElementById("CheckImg").style.backgroundImage = "url(../images/error.svg)";
		} else {
			document.getElementById("colorPic").src = "./images/error.svg";
			document.getElementById("CheckImg").style.backgroundImage = "url(./images/error.svg)";
		}
		request = new XMLHttpRequest();
		request.open("GET", picLink, true);
		request.send();
		request.onerror = request.onload = function () {
			if (request.status == '404') {
				document.getElementById("picNum").innerHTML = "ERROR: 請求的圖像不·存·在·!";
				console.error("請求的圖像不·存·在·!");
				return null;
			} else if (window.navigator.onLine == false) {
				document.getElementById("picNum").innerHTML = "ERROR: 您似乎未連接上網際網路.";
				console.error("似乎未連接上網際網路.");
				return null;
			} else if (GetQueryString("img") != null && request.status != '200' && window.navigator.onLine == true) {
				document.getElementById("picNum").innerHTML = "ERROR: 可能是傳入的圖像name未找到, 或是您無法鏈接至 API.";
				console.error("可能是傳入的圖像name未找到, 或是您無法鏈接至 API.");
				return null;
			} else {
				document.getElementById("picNum").innerHTML = "ERROR: 未知錯誤, 請打開瀏覽器F12調試器, 轉到控制臺截下全部内容並在GitHub或者發郵件到admin@koto.cc進行反饋.";
				console.error("未知錯誤, 請打開瀏覽器F12調試器, 轉到控制臺截下全部内容並在GitHub或者發郵件到admin@koto.cc進行反饋.");
				return null;
			}

		}

	}

	// load done
	document.getElementById("colorPic").onload = function () {
		document.getElementById("colorPic").onerror = null;

		document.getElementById("raw").href = picLink;
		document.getElementById("lock").href = ShareLink;
		document.getElementById("download").href = picLink;
		document.getElementById("download").download = picName;

		document.getElementById("picNum").innerHTML = "您要的銫圖 「" + picName + "」‼";

		if (window.location.toString().match(/(gay|fur)/i)) {
			document.getElementById("CheckImg").style.backgroundImage = "url(../images/check.svg)";
		} else {
			document.getElementById("CheckImg").style.backgroundImage = "url(./images/check.svg)";
		}

		console.log("INFO: 圖像成功載入...您要的銫圖!")
	}
}

function windowload (isMoveInfoZone,databaseType) {

	window.onresize = function () {
		document.getElementById("InfoZone").style.top = "15px";
		document.getElementById("InfoZone").style.left = "15px";
	}


	if (isMoveInfoZone === "false") {
		console.log("將不會讓InfoZone可拖動。");
	} else if (isMoveInfoZone == "true") {
		console.log("將會讓InfoZone可拖動。");
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
	}

	document.getElementById("picNum").innerHTML = "INFO: 正在載入銫圖列表";

	if (window.location.protocol.match(/(file|data)/i)) {
		alert(window.location.protocol + "下无法加载DataBase");
		console.log(window.location.protocol + "下无法加载DataBase");
	} else {
		//config ColorImg database loc.
		if (window.location.toString().match(/(gay|fur)/i)) {
			requestURL = "../database/"+databaseType+".txt";
		} else {
			requestURL = "./database/"+databaseType+".txt";
		}

		//request ColorImg database.
		request = new XMLHttpRequest();
		request.open("GET", requestURL, true);
		request.send();
		request.onerror = function () {
			document.getElementById("picNum").innerHTML = "ERROR: 列表無法載入";
			console.error("ERROR! cannot loading files list data.");
			document.getElementById("colorPic").src = "./images/error.svg";
			document.getElementById("CheckImg").style.backgroundImage = "url(./images/error.svg)";
			return null;
		}
		request.onload = function () {
			//parse data as JSON.
			ColorImgJson = JSON.parse(request.response);

			//get %PicCount, put it on $PicCount.
			document.getElementById("PicCount").innerHTML = "隨機色圖"+databaseType+"目前已收錄"+ColorImgJson.fileNum+"張色圖!!"

			//var API.
			GetImgAPI = "https://file.koto.cc/api/raw/?path=/Image/GetColorImg/"+databaseType+"/";


			console.log("INFO: 成功載入了列表!");

			//mode auto,support Specify & Random.
			if (GetQueryString("img").toString() != null) {
				var img = GetQueryString("img");
				Load(img);
			} else {
				Load("");
			}

		}
	}

}


