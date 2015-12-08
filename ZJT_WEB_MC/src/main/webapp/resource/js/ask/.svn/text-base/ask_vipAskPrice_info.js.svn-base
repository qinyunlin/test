var askinfo, win;
var selectinfo = getCurArgs("id");
var sysncFlag = "0";
var fid;
// 创建表格
function buildAskinfo() {
	Ext.lib.Ajax.request("post", "/mc/EpEnterpriseAskPriceServlet", {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			askinfo = data.result;
			sysncFlag = askinfo["state"];
			fid = askinfo["fid"];
			
			panel = new Ext.form.FormPanel({
				autoHeight : true,
				renderTo : "askinfo_grid",
				layout : "table",
				border : false,
				bodyStyle : {
					background : '#DFE8F6'
				},
				items : [new Ext.form.FieldSet({
					title : '询价信息',
					layout : "table",
					width : 820,
					autoHeight : true,
					bodyStyle : {
						background : '#FFFFFF'
					},
					layoutConfig : {
						columns : 5
					},
					items : [{
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "企业ID："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["fid"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "型号规格："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["spec"]
								}]
					}, {
						rowspan:5,
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;margin-left:80px;',
						items : [{
							width : 120,
							height : 120,
							html : "<img id='picPath' src='/resource/images/def_info.jpg' style='cursor:pointer;' width='120' height='120' onclick='showPic();' />"
						}, {
							xtype : "tbbutton",
							width : 120,
							text : "上传图片",
							handler : showPic,
							hidden : compareAuth("VIP_OFFLINE_ASKPRICE_IMGUPLOAD")
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "企业名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["fname"]
								}]
					},{
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "单位："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						colspan:2,
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["unit"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "工程名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["proName"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "单价（元）："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						colspan:2,
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["price"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "材料名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["name"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "供应商："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						colspan:2,
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : (askinfo["supplyName"]) 
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "二级分类："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : (askinfo["subcid"]) 
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "回复日期："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						colspan:2,
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : (askinfo["recoveryTime"]) 
									
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "材料编码："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["code"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "备注："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						colspan:2,
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["notes"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "上传时间："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["createOn"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "上传人："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						colspan:2,
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : askinfo["createBy"]
									
						}]
					}]
				})]
			});
			fillInfo(askinfo);
		},
		failure : function() {
			Ext.MessageBox.alert(data.result);

		}
	}, "method=get&id=" + selectinfo);


};

//填充信息(相片)
function fillInfo(data) {
	if (!Ext.isEmpty(data["picPath"])) {
		Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL
				+ data["picPath"].replace(/(\\)|(\/\/)/g, "/");
	}
};

//显示修改相片区域
function showPic() {
	FileUpload_Ext.requestId = selectinfo;
	FileUpload_Ext.requestType = "RS_ASK";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif|png|PNG/;
	FileUpload_Ext.fileName = "";
	FileUpload_Ext.initComponent();
};

// 上传图片回调函数2
function upload_fn() {
	updateImgSrc(FileUpload_Ext.callbackMsg);
};

function updateImgSrc(imgSrc){
	var content = "id~" + selectinfo + ";picPath~" + imgSrc;
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
	});
}


function init() {
	buildAskinfo();
};
Ext.onReady(function() {
			init();
			Ext.QuickTips.init();
		});
