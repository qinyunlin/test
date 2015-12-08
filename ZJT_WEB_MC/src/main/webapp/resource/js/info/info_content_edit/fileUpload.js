
var oriPicPath;// 初始图片路径
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
	FileUpload_Ext.requestId = infoId;
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

function upload_fn() {
	savePic(FileUpload_Ext.callbackMsg)

};
/* end 上传图片 */

var showUploadFWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestId = infoId;
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.callbackFn = "up_file_back";
	FileUpload_Ext.fileType = /txt|doc|xls|zip|rar|jpg|gif|htm|html|mht/;
	FileUpload_Ext.initComponent();
};

var showUploadFlashWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestId = infoId;
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.callbackFn = "up_flash_back";
	FileUpload_Ext.fileType = /swf|SWF/;
	FileUpload_Ext.initComponent();
};
// 返回调用的函数，用于将上传的文件路径写入控件中
function up_file_back() {
	Ext.fly("url").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};

function up_flash_back() {
	Ext.fly("urlF").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
/* end 上传文件 */
// 保存上传图片
function savePic(path) {
	Ext.Ajax.request({
				url : '/InfoContent.do',
				params : {
					type : 3,
					content : "picPath~" + path,
					id : infoId
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL
								+ FileUpload_Ext.callbackMsg;
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};