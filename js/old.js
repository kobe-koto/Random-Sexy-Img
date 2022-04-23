// Encoding: UTF-8
// Made with heart by kobe-koto in AGPL-3.0 License License
// copyright 2021 kobe-koto

function random (intmin,intmax) {
	//get a random num
	while (!isNaN(intmax) && !isNaN(intmin) && !intmax.toString().match(/(-)/i)) {
		var randomno = Math.round(intmax * Math.random());
		if (randomno <= intmax && randomno >= intmin) {
			return randomno;
		}
	}
}
function FullScreen() {
	//let img fullscreen
	document.getElementById("colorPic").style.position = "fixed";
	document.getElementById("colorPic").style.width = "100%";
	document.getElementById("colorPic").style.top = "0";
	document.getElementById("colorPic").style.left = "0";
	document.getElementById("colorPic").style.zIndex = "999999";
	document.getElementById("colorPic").style.padding = "0";
	document.getElementById("colorPic").style.margin = "0";
	document.getElementById("colorPic").style.borderRadius = "0";

	document.getElementById("glass_main").style.display = "contents";

	document.body.style.padding = "0";
	document.body.style.margin = "0";
}

function clearData(Value) {
	//clear old data,use for reload a new img
	switch (Value) {
		case "load":
			document.getElementById("raw").href = "";
			document.getElementById("raw").innerHTML = "";
			document.getElementById("download").href = "";
			document.getElementById("download").download = "";
			document.getElementById("download").innerHTML = "";

			document.getElementById("PicShareLink").innerHTML = "";
			document.getElementById("picNum").innerHTML = "loading";
			document.getElementById("loader").style.display = "unset";
			console.log("loading");
		break;

		case "":
		default:
			document.getElementById("loader").style.display = "none";
			document.getElementById("raw").href = "";
			document.getElementById("raw").innerHTML = "";
			document.getElementById("download").href = "";
			document.getElementById("download").download = "";
			document.getElementById("download").innerHTML = "";
		break;
	}
}

function windowload() {
	//on window loaded,request ColorImg database(?) & auto parse data,support n/r|r,n|clean.
	document.getElementById("picNum").innerHTML = "loading files list data";
	
	var requestURL = "../database/fur.txt";
	var request = new XMLHttpRequest();
	request.open("GET", requestURL,true);
	request.send(null);
	request.onerror = function () {
		document.getElementById("picNum").innerHTML = "ERROR! cannot loading files list data.";
		console.error("ERROR! cannot loading files list data.");
	}
	request.onload = function () {
		ColorImgJson = JSON.parse(request.response);
		FileMax = ColorImgJson.fileNum - 1;
		//var PicNumMax

		API1 = "https://drive-koto.vercel.app/api/raw/?path=/Image/GetColorImg/";
		API2 = "https://image-koto.000webhostapp.com/?/Image/GetColorImg/";
		GetImgAPI = API1;
		//var APIs

		console.log("load List Done!");

		if (!GetQueryString("img").toString() == "") {
			var img = GetQueryString("img");
			Load(img);
		} else {
			Load("");
		}
		//mode auto,support Specify & Random.
	}

}
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
	var context = "";

	if (r != null)
		context = r[2];
	reg = null;
	r = null;
	return context == null || context == "" || context == "undefined" ? "" : context;
}
function Load(img) {
	//load a new Img from varied API.
	if (img == "") {
		// Random img load
		console.log("Random mode.");
		picNum = random("0",FileMax);
		picName = ColorImgJson.pics[picNum].name;
		picLink = GetImgAPI + picName;
	} else if (!img == "") {
		// Specify img load
		console.log("Specify mode.");
		picLink = GetImgAPI + img;
		picName = img;
	} else {
		console.error("value error.");
		return null;
	}

	clearData("load");

	document.getElementById("colorPic").src = picLink;

	// load done
	document.getElementById("colorPic").onload = function () {

		document.getElementById("raw").href = picLink;
		document.getElementById("raw").innerHTML = "VIEW RAW";
		document.getElementById("download").href = picLink;
		document.getElementById("download").download = picName;
		document.getElementById("download").innerHTML = "DOWNLOAD";

		document.getElementById("loader").style.display = "none";
		document.getElementById("picNum").innerHTML = "Pic = " + picName;

		document.getElementById("PicShareLink").innerHTML = "Share the image with this link!<br>" + window.location.protocol + "//" + window.location.host + window.location.pathname + "?img=" + picName;
		console.log("Image load successfully.")
	}

	// load error
	document.getElementById("colorPic").onerror = function () {

		clearData("");

		try {
			if (GetImgAPI == API1) { 
				document.getElementById("picNum").innerHTML = "API1 may has error.try API2";
				console.error("API1 may has error,try API2");
				GetImgAPI = API2;
				Load(img);
			} else if (GetImgAPI == API2) {
				document.getElementById("picNum").innerHTML = "API2 may has error.";
				console.error("API2 may has error.");
			} else {
				document.getElementById("picNum").innerHTML = "Pic cannot load.Check you network connect.";
				console.error("Pic cannot load.Check you network connect.");
			}
		} catch (err) {
			document.getElementById("picNum").innerHTML = "switch API error,we will try fix the issue.";
			console.error("switch API error,we will try fix the issue.");
		}
	}
}


