
/* 上传图片 */
var buildUploadIWin = function() {
	uploadIWin = new Ext.Window({
				el : 'uploadI_win',
				width : 400,
				height : 150,
				title : '上传图片',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				bodyStyle : 'padding: 20px',
				items : [{
							width : 340,
							contentEl : 'uploadI'
						}],
				buttons : [{
							text : '上传',
							handler : function() {
								upPic();
							}
						}, {
							text : '取消',
							handler : function() {
								uploadIWin.hide();
							}
						}]
			});
}

var showUploadIWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

function up_file_back() {
	Ext.fly("url").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
function up_flash_back() {
	Ext.fly("urlF").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
function upload_fn() {
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;

};

/* end 上传图片 */

/* 上传文件 */

var showUploadFWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.callbackFn = "up_file_back";
	FileUpload_Ext.fileType = /txt|doc|xls|zip|rar|jpg|gif|htm|html|mht/;
	FileUpload_Ext.initComponent();
};

var showUploadFlashWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.callbackFn = "up_flash_back";
	FileUpload_Ext.fileType = /swf/;
	FileUpload_Ext.initComponent();
};

function upfileResult(flag, msg) {
	if (flag) {
		Ext.fly("url").dom.value = msg;
		window.document.uplogoform.reset();
		uploadFWin.hide();
	} else {
		Ext.MessageBox.alert("提示", msg);
	}
}

function upflashResult(flag, msg) {
	if (flag) {
		Ext.fly("urlF").dom.value = msg;
		window.document.uplogoform.reset();
		uploadFWin.hide();
	} else {
		Ext.MessageBox.alert("提示", msg);
	}
}
/* end 上传文件 */