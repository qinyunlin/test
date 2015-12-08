<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>中建普联数据管理系统</title>
		<link rel="stylesheet" href="/ext/resource/css/ext-all.css" type="text/css" media="screen,projection" />
		<link rel="stylesheet" type="text/css" href="/ext/resource/css/ext-patch.css" />
		<script src="/ext/adapter/ext/ext-base.js"></script>	
		<script src="/resource/js/jyeeda.js"></script>
		<script src="/ext/ext-all.js"></script>
		<script src="/ext/adapter/locale/ext-lang-zh_CN-min.js"></script>	
		<script src="/resource/js/common_mc.js"></script>
		
		<script>
			// 获取个人信息
			function getAuthCodeHeader() {
				var ds = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : "/files/authcode.json"
							}),
					reader : new Ext.data.JsonReader({
								root : "result"
							}, []),
					autoLoad : true
				});
				ds.load();
				currUser_mc_auth = ds;	
			};			
			// 获取个人信息
			function getPersonInfoHeader() {
				Ext.lib.Ajax.request("post", "/account/UserLogin.do", {
							success : function(response) {
								var data = eval("(" + response.responseText + ")");
								if (data) {
									currUser_mc = data.result;
									cur_user_id = currUser_mc.uid;
								}
			
							}
						}, "method=isLogin")
			
			};
			function initPage() {
				getAuthCodeHeader();
				getPersonInfoHeader();
			}
			//initPage();
		</script>			
		<script type="text/javascript" src="/resource/js/msg.js"></script>
		<decorator:head />
	</head>
	<body >
		<decorator:body />
	</body>
	<script>
	</script>
</html>