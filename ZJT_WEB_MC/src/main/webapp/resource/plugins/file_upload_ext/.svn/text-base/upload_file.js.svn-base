var FileUpload_Ext = {
	requestURL : 'http://ftp.zjtcn.com',//不填则为本站点
	requestMethod:'/file/CommonUpload',//上传请求路径
	callbackPath : window.location.href.split('/')[2],//回调站点
	requestId : '',
	requestType : '',//图片类型
	upload_win : null,
	basePath : '/resource/plugins/file_upload_ext/',
	callbackMsg : '',
	callbackFn : '',
	fileType : /[\w]/,
	fileSize:'150',
	fileName:'',
	showFlag:true, //是否弹出上传插件的提示框，默认true
	
	initComponent : function(msg) {
		//增加文字提示
		var addMsg = "";
		if (msg != null && "" != msg && msg != "undefined" && typeof(msg) != undefined){
			addMsg = "<font color='red'>" + msg + "</font>";
		}
		var template = new Ext.Template('<form id="uploadform" name="uploadform" target="uploadtarget" method="post" enctype="multipart/form-data" >'
				+ '<div style="margin:0 auto;padding:6px">上传文件：<input type="file" name="file_input" id="file_input"/></div>'
				+ addMsg
				+ '<iframe  frameborder="0" id="uploadtarget" name="uploadtarget" src="" width="0" height="0"></iframe></form>');
		this.container = new Ext.Container({
					bodyStyle : 'padding:6px',
					autoWidth : true,
					autoHeight : true,
					items : template
				});
		this.upload_win = new Ext.Window({
					title : '文件上传',
					modal : true,
					width : 380,
					autoHeight : true,
					items : template,
					buttons : [{
								text : '上传',
								handler : function() {
									FileUpload_Ext.submitAction();
								}
							}, {
								text : '取消',
								handler : function() {
									FileUpload_Ext.upload_win.close();
								}
							}]

				});
		this.upload_win.show();

	},
	submitAction : function() {
		var file = Ext.fly('file_input').getValue().slice(Ext.fly('file_input')
				.getValue().lastIndexOf('.'));
		if (this.checkFileType(file)) {
			var url = "http://" + FileUpload_Ext.callbackPath
					+ FileUpload_Ext.basePath + "UploadResult.jsp";
			document.uploadform.action = FileUpload_Ext.requestURL
					+ FileUpload_Ext.requestMethod + "?id=" + FileUpload_Ext.requestId
					+ "&rstype=" + FileUpload_Ext.requestType + "&path=" + url
					+ "&callbackFn=" + this.callbackFn;
			//添加图片名称welson 2012-07-20
			if (FileUpload_Ext.fileName != null
					&& FileUpload_Ext.fileName != "") {
				document.uploadform.action += "&filename=" + FileUpload_Ext.fileName;
			}
			document.uploadform.submit();
		}
	},
	clearConfig : function() {
		this.callbackMsg = "";
		this.callbackFn = "";
		this.requestType="";
		this.requestId="";
	},
	checkFileType : function(v) {
		this.v = v.slice(v.lastIndexOf('.')).toLowerCase();
		var patrn = this.fileType;
		if (!patrn.test(this.v)) {
			Info_Tip("你上传的类型错误");
			return false;
		}
		return true;
	}
};
function uploadFileResult(flag, msg, fn,size) {
	if (flag) {
		FileUpload_Ext.callbackMsg = msg;
		FileUpload_Ext.fileSize=size;
		FileUpload_Ext.fileName = document.uploadform.file_input.value.split(".")[0];
		if (FileUpload_Ext.showFlag){
			if (fn == undefined || fn == null || fn == ""){
				Info_Tip("上传成功。", upload_fn);
			}
			else
				Info_Tip("上传成功。", eval(fn));
			FileUpload_Ext.upload_win.close();
		}else{
			if (fn == undefined || fn == null || fn == ""){
				upload_fn();
			}
			else{
				this.fn = eval(fn);
				this.fn();
			}
		}
	} else {
		Info_Tip(msg);
	}
};