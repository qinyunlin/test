<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

		<meta http-equiv="pragma" content="no-cache">
		<link rel="stylesheet" type="text/css" href="/resource/swf/history.css" />
		<script src="/resource/swf/AC_OETags.js" language="javascript"></script>
		<script src="/resource/swf/history.js" language="javascript"></script>
		<script src="/resource/js/common_mc.js" language="javascript"></script>
		<style>
body {
	margin: 0px;
	overflow: hidden
}
</style>
		<script language="JavaScript" type="text/javascript">
var requiredMajorVersion = 9;
// Minor version of Flash required
var requiredMinorVersion = 0;
// Minor version of Flash required
var requiredRevision = 28;
function getroot(){
	var temp=window.location.href;
	temp=temp.split("/");
	return "http://"+temp[2];
};
function getArea(){
	var temp="中国,广东,广西,四川,深圳";
	temp=temp.toString();
	return temp;
};
</script>
	</head>

	<body scroll="no">
		<script language="JavaScript" type="text/javascript">
<!--
// Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
var hasProductInstall = DetectFlashVer(6, 0, 65);

// Version check based upon the values defined in globals
var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

if ( hasProductInstall && !hasRequestedVersion ) {
	// DO NOT MODIFY THE FOLLOWING FOUR LINES
	// Location visited after installation is complete if installation is required
	var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
	var MMredirectURL = window.location;
    document.title = document.title.slice(0, 47) + " - Flash Player Installation";
    var MMdoctitle = document.title;

	AC_FL_RunContent(
		"src", "/resource/swf/playerProductInstall",
		"FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
		"width", "100%",
		"height", "610",
		"align", "middle",
		"id", "member_prop_stat",
		"quality", "high",
		"bgcolor", "#ffffff",
		"wmode","opaque",
		"name", "member_prop_stat",
		"allowScriptAccess","sameDomain",
		"type", "application/x-shockwave-flash",
		"pluginspage", "http://www.adobe.com/go/getflashplayer"
	);
} else if (hasRequestedVersion) {
	// if we've detected an acceptable version
	// embed the Flash Content SWF when all tests are passed
	AC_FL_RunContent(
			"src", "/resource/swf/member_prop_stat",
			"width", "100%",
			"height", "610",
			"align", "middle",
			"id", "member_prop_stat",
			"quality", "high",
			"wmode","opaque",
			"bgcolor", "#ffffff",
			"name", "member_prop_stat",
			"allowScriptAccess","sameDomain",
			"type", "application/x-shockwave-flash",
			"pluginspage", "http://www.adobe.com/go/getflashplayer"
	);
  } else {  // flash is too old or we can't detect the plugin
    var alternateContent = 'Alternate HTML content should be placed here. '
  	+ 'This content requires the Adobe Flash Player. '
   	+ '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
    document.write(alternateContent);  // insert non-flash content
  }
// -->
</script>
		<noscript>
			<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
				id="member_prop_stat" width="100%" height="100%"
				codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
				<param name="movie" value="/resource/swf/member_prop_stat.swf" />
				<param name="quality" value="high" />
				<param name="bgcolor" value="#ffffff" />
				<param name="allowScriptAccess" value="sameDomain" />
				<embed src="member_prop_stat.swf" quality="high" bgcolor="#ffffff"
					width="100%" height="610" name="member_prop_stat" align="middle"
					play="true" loop="false" quality="high"
					wmode="opaque"
					allowScriptAccess="sameDomain" type="application/x-shockwave-flash"
					pluginspage="http://www.adobe.com/go/getflashplayer">
				</embed>
			</object>
		</noscript>
	</body>
</html>
