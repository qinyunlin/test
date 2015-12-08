<%@ page language="java"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="/resource/plugins/file_upload_ext/upload_file.js"></script>
<title>会员套餐首页</title>
<script>
/**
 * 上传成功案例(zip格式的图片压缩包)
 */
function uploadRationLib(){
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestMethod = "/file/MultiRalibUpload";
	FileUpload_Ext.fileType = /zip/;
	FileUpload_Ext.callbackFn = "up_file_back";
	FileUpload_Ext.showFlag = false;
	FileUpload_Ext.fileSize = 102400;
	FileUpload_Ext.initComponent("&nbsp;&nbsp;&nbsp;(上传格式为zip压缩包格式，所含图片类型：JPG,JPEG格式，)");
}

/**
 * 上传图片回调函数
 */
function up_file_back(){
	var result =FileUpload_Ext.callbackMsg;
	if (result == "success")
		Info_Tip("上传成功。");
	FileUpload_Ext.upload_win.close();
}
</script>
</head>
<body>
<br />
<br />
<br />
<a href="javascript:void(0)" onclick="uploadRationLib();">上传</a>
</body>
</html>
