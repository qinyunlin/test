var id, eid;
var oldPath;

Ext.onReady(function() {
	Ext.QuickTips.init();
	buildForm();
});

function buildForm() {
	id = getCurArgs("id");
	eid = getCurArgs("eid");
	// 查询报价记录
	Ext.Ajax
			.request({
				url : '/ep/EpAttachServlet',
				params : {
					type : 3,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						var info = data.result;
						stuff_form = new Ext.form.FormPanel(
								{
									id : 'info_grid',
									frame : true,
									layout : 'form',
									width : 900,
									border : false,
									buttonAlign : "left",
									labelAlign : 'right',
									renderTo : 'grid',
									items : [{
										layout : 'column',
										bodyStyle : 'border:none;margin-right:15px;',
										items : [ {
											layout : 'table',
											bodyStyle : 'border:none;',
											layoutConfig : {
												columns : 2
											},
											width : 800,
											xtype : 'fieldset',
											title : '荣誉资质',
											items : [{
												width : 80,
												autoHeight : true,
												bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
												items : [{
															xtype : "label",
															text : "荣誉名称："
														}]
											}, {
												width : 180,
												autoHeight : true,
												cls : 'ask_content',
												bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
												items : [{
															id : 'filename',
															xtype : 'textfield',
															value : info["filename"]
														}]
											},{
												colspan:2,
												bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;margin-left:80px;',
												items : [{
													width : 120,
													height : 120,
													html : "<img id='picPath' src='/resource/images/def_info.jpg' style='cursor:pointer;' width='120' height='120' onclick='showPic();' />"
												},/*{
													xtype:"label",
													html:"仅支持JPG,JPEG,PNG,GIF格式,建议尺寸500*375像素，图片大小请不要超过300K"
												},*/ {
													xtype : "tbbutton",
													width : 120,
													text : "上传图片",
													handler : showPic,
													hidden : compareAuth("VIP_OFFLINE_ASKPRICE_IMGUPLOAD")
												}]}]}]}],
									buttons : [ {
										text : '保存',
										hidden : compareAuth("CORP_SHOP_EPATTACH_EDIT"),
										handler : function(){
											save(info);
										}
									}] 
								});
						oldPath = info["path"];
						$("#picPath").attr("src", FileUpload_Ext.requestURL + oldPath);
						var sunshineWin = new Ext.Panel({
							autoHeight : true,
							renderTo : "grid",
							buttonAlign : "center",
							bodyStyle : "border:none;",
							items : [ stuff_form ]
						});
						sunshineWin.show();
					}
				}
			});
}

function save(info){
	var oldName = info["filename"];
	var filename = Ext.getCmp('filename').getValue();
	if (filename == null || "" == filename){
		Ext.MessageBox.alert("提示", "资质名称不能为空！");
		return false;
	}
	if (filename == oldName && oldPath == info["path"]){
		Ext.MessageBox.alert("提示", "数据未改变，无需保存！");
		return false;
	}
	var content = "path~" + FileUpload_Ext.callbackMsg + ";filename~" + filename + ";size~" + FileUpload_Ext.fileSize;
	Ext.Ajax.request({
		url : '/ep/EpAttachServlet',
		method : 'POST',
		params : {
			type : 6,
			content : content,
			id : id
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "保存成功！",close);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

//显示修改相片区域
function showPic() {
	FileUpload_Ext.requestId = eid;
	FileUpload_Ext.requestType = "RS_EP";
	FileUpload_Ext.fileType = /jpg|jpeg|PNG|png|JPEG|JPG|GIF|gif/;
	FileUpload_Ext.showFlag = false;
	FileUpload_Ext.initComponent();
};

//上传图片回调函数2
function upload_fn() {
	FileUpload_Ext.upload_win.close();
	var path = FileUpload_Ext.callbackMsg;
	$("#picPath").attr("src", FileUpload_Ext.requestURL + path);
	oldPath = path;
	//updateImgSrc(FileUpload_Ext.callbackMsg);
};

function close(){
	if (window.parent.tab_epAttach_list_iframe){
		window.parent.tab_epAttach_list_iframe.ds.reload();
	}
	window.parent.Ext.getCmp('center').remove("epAttach_detail");
}

function updateImgSrc(imgSrc){
	/*var content = "id~" + selectinfo + ";picPath~" + imgSrc;
	Ext.lib.Ajax.request("post", "/mc/EpEnterpriseAskPriceServlet?method=upImgSrc&content=" + content, 
	{
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc,
					jsondata.result)) {
				Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + FileUpload_Ext.callbackMsg;
				if ("1" == sysncFlag){
					Ext.lib.Ajax.request("post", "/mc/EpEnterpriseAskPriceServlet?method=sysncImgToVipEpMaterial&id=" + selectinfo + "&picPath=" + imgSrc + "&fid=" + fid, 
							{
								success : function(response) {
									var jsondata = eval("(" + response.responseText + ")");
									if (getState(jsondata.state, commonResultFunc,
											jsondata.result)) {
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});*/
}
