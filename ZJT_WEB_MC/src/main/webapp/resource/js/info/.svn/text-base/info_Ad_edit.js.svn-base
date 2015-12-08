var info_add_form, relatedProListPanel, relatedProPanel, sendListPanel, sendPanel;
var uploadIWin, uploadFWin, relatedProWin;
var infoId, infoPid, pid;
var relatedProStore, proStore, sortStore, sendStore, eidStore, site_form;
var eidWin = null;
var empWin = null;
var emp_grid, emp_ds;
var cata_id;
var emp_type_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : emp_type_array
		});
var oriPicPath;// 初始图片路径
var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var buildFormPanel = function() {
	sortStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/Infoad.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'cata_id','parent_id','cname','modify_time','sort','isLeaf']),
				baseParams : {
					type : 1
				},
				remoteSort : true
			});

	var cardPanel = new Ext.Panel({
		id : 'cardPanel',
		layout : 'card',
		activeItem : 0,
		frame : true,
		autoHeight : true,
		width : 803,
		defaults : {
			bodyStyle : 'padding:5px'
		},
		items : [{
			id : 'cp4',
			title : '上传FLASH',
			layout : 'table',
			layoutConfig : {
				columns : 4
			},
			defaults : {
				bodyStyle : 'padding:2px 2px'
			},
			items : [{
						html : '上传FLASH：'
					}, {
						layout : 'column',
						items : {
							id : 'urlF',
							name : 'urlF',
							xtype : "textfield",
							readOnly : true,
							width : 400
						}
					}, {
						layout : 'column',
						defaults : {
							bodyStyle : 'padding-top:10px;'
						},
						items : {
							id : 'title',
							name : 'title',
							text : '上传',
							xtype : "button",
							handler : function() {
								showUploadFlashWin();
							}
						}
					}, {
						html : '<span style="color: #FF0000">支持格式:swf</span>'
					}]
		}]
	});
	site_form = new Ext.form.FormPanel({
				width : 820,
				colspan : 3,
				frame : true,
				items : {
					layout : 'form',
					items : new Ext.form.FieldSet({
								title : '站点显示',
								layout : 'column',
								labelWidth : 40,
								items : Sites_checkbox()
							})
				}
			});
	
	
	info_add_form = new Ext.form.FormPanel({
		border : false,
		width : 820,
		layout : 'table',
		layoutConfig : {
			columns : 3
		},
		frame : true,
		buttonAlign : 'left',
		labelAlign : 'right',
		autoHeight : true,
		items : [{
			columnWidth : .49,
			xtype : "fieldset",
			title : "基本信息",
			width : 500,
			height : 500,
			layout : 'form',
			
			items : [
			 {
						layout : 'form',
						items : {
							id : 'cname',
							name : 'cname',
							fieldLabel : '广告名称',
							xtype : "textfield",
							allowBlank : false,
							width : 200
						}
					},
						{
						layout : 'column',
						bodyStyle : 'text-align:right',
						
						items : [{
									text : "广告状态:",
									xtype : "label",
									width : 100
								}, {
									layout : 'column',

									items : [new Ext.form.Radio({
														id : 'status1',
														fieldLabel : '是否关闭',
														boxLabel : '开启',
														inputValue : '1',
														width : 50,
														name : 'status'

													}), new Ext.form.Radio({
														id : 'status0',
														boxLabel : '关闭',
														inputValue : '0',
														name : 'status',
														width : 50,
														checked : true
													})]
								}]
					}, {
						layout : 'form',
						items : {
							id : 'adv_text',
							name : 'adv_text',
							fieldLabel : '文字描述',
							xtype : "textfield",
							allowBlank : false,
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'trans_url',
							name : 'trans_url',
							fieldLabel : '转向地址',
							xtype : "textfield",
							width : 200,
							tooltip:'用于首页显示'
						}
					}, {
						layout : 'table',
						layoutConfig : {
							columns : 2
						},
						items : [{
									layout : 'form',
									items : {
										id : 'weight',
										name :'weight',
										fieldLabel : '权重排序',
										xtype : 'textfield',
										width : 200
									}
								}]
					}, {
						id:'note',
	    	    		fieldLabel:'备注',
	    	    		name:'note',
	    	    	    xtype:'textarea',
	    	    		anchor:'90%-100'
	    	    	} ,{
	    	    		id:'extension1',
	    	    		fieldLabel:'扩展属性一',
	    	    		name:'extension1',
	    	    		xtype : "textfield",
	    	    		anchor:'90%'
	    	    	},{
	    	    		id:'extension2',
	    	    		fieldLabel:'扩展属性二',
	    	    		name:'extension2',
	    	    		xtype : "textfield",
	    	    		anchor:'90%'
	    	    	},{
	    	    		id:'extension3',
	    	    		fieldLabel:'扩展属性三',
	    	    		name:'extension3',
	    	    		xtype : "textfield",
	    	    		anchor:'90%'
	    	    	},{
	    	    		id:'extension4',
	    	    		fieldLabel:'扩展属性四',
	    	    		name:'extension4',
	    	    		xtype : "textfield",
	    	    		anchor:'90%'
	    	    	}]
		}, {
			columnWidth : .02
		}, {
			columnWidth : .49,
			xtype : "fieldset",
			title : "标题图片",
			width : 400,
			height : 330,
			items : [{
				layout : 'form',
				items : [{
					html : '<img id="picPath" src="" width="200px" height="150px" />'
				}, {
					layout : 'table',
					items : [{
								xtype : "button",
								text : '上传',
								handler : function() {
									showUploadIWin();
								}
							}, {
								xtype : "button",
								text : '取消',
								handler : function() {
									Ext.fly("picPath").dom.src = "";

								}
							}]
				}]
			}]
		}, {
			colspan : 3,
			width : 803,
			autoHeight : true,
			items : cardPanel
		}],
		buttons : [{
					text : '提交',
					handler : updateInfo
				}, {
					text : '重置',
					handler : function() {
						info_add_form.form.reset();
					}
				}, {
					text : '关闭',
					handler : function() {
						window.parent.Ext.getCmp('center').remove("info_Ad_edit");
					}
				}]
	});
	new Ext.Panel({
				border : false,
				frame : true,
				layout : 'form',
				renderTo : 'info_add',
				items : [info_add_form]
			});

};

/* 初始化数据 */
var initInfo = function() {
	var data = "";
	data = "type=4&id=" + infoId;
	Ext.lib.Ajax.request('post', '/SearchInfoAd.do', {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (json && json.state == 'success') {
						json = json.result;
						info_add_form.getForm().setValues(json);
						
						if (json['cname'] != null)
							Ext.get("cname").dom.value = json["cname"];
						if (json['adv_text'] != null)
							Ext.get("adv_text").dom.value = json["adv_text"];

						if (json["trans_url"] == null)
							Ext.get("trans_url").dom.value = "";
						else
							Ext.get("trans_url").dom.value = json["trans_url"];
							
						if (json["weight"] == null)
							json["weight"] = "";
						else
							Ext.get("weight").dom.value = json["weight"];
						if (json["note"] == null)
							json["note"] = "";
						else
							Ext.get("note").dom.value = json["note"];
						if (json["extension1"] == null)
							json["extension1"] = "";
						else
							Ext.get("extension1").dom.value = json["extension1"];
						if (json["extension2"] == null)
							json["extension2"] = "";
						else
							Ext.get("extension2").dom.value = json["extension2"];
						if (json["extension3"] == null)
							json["extension3"] = "";
						else
							Ext.get("extension3").dom.value = json["extension3"];
						if (json["extension4"] == null)
							json["extension4"] = "";
						else
							Ext.get("extension4").dom.value = json["extension4"];
							
						if (json["status"] == "1") {
							Ext.get("status1").dom.checked = true
						} else {
							Ext.get("status0").dom.checked = true
						}
						
						if (json["photo_url"] != null && json["photo_url"]!="") {
							oriPicPath = FileUpload_Ext.requestURL + json["photo_url"];
							Ext.get("picPath").dom.src = oriPicPath;
						}
						if(json["flash_url"] !=null && json["flash_url"]!="") {
							Ext.get("urlF").dom.value = FileUpload_Ext.requestURL + json["flash_url"];
							Ext.getCmp("cardPanel").layout.setActiveItem("cp4");
							
			         	}
						
						cata_id = json["cata_id"];
					} else {
						alert("获取信息失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
};


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


/* 更新项目 */
var updateInfo = function() {
	
	
	var cname=Ext.fly("cname").getValue();
	var note=Ext.fly("note").getValue();
	var adv_text=Ext.fly("adv_text").getValue();
	var attribute1=Ext.fly("extension1").getValue();
	var attribute2=Ext.fly("extension2").getValue();
	var attribute3=Ext.fly("extension3").getValue();
	var attribute4=Ext.fly("extension4").getValue();
	var weight = Ext.fly("weight").getValue();
	
	var picPath = Ext.fly("picPath").dom.src.split('/');	
	if(picPath!=""){
		picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
		if (picPath.lastIndexOf('/') == picPath.length - 1 || picPath.lastIndexOf('.jsp') == picPath.length - 4) {
			picPath = "";
		}
	}
	
	var trans_url=Ext.get("trans_url").getValue().trim();
	
		var url = Ext.fly("urlF").getValue().split("/");
		if(url!=""){
			url = "/" + url.slice(3).toString().replace(/,/g, "/");
		}
		
		var data = {};
		data["content"] ="issueType~4"+";flash_url~" + url+ ";cname~" + cname
				+ ";adv_text~" + adv_text + ";photo_url~" + picPath
				+ ";weight~" + weight + ";" +";trans_url~"+trans_url+ ";extension1~" + attribute1+ ";extension2~" + attribute2+ ";extension3~" + attribute3+ ";extension4~" + attribute4;
		data["id"]  = infoId;
		data["note"] = note;

		refer(data, '修改信息');

};

var refer = function(data, msg) {

	Ext.Ajax.request({
				method : 'post',
				url : "/SearchInfoAd.do?type=5",
				params : data,
				timeout : 1000 * 60 * 5,
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "修改广告信息成功!");
					parent.tab_0613_iframe.ds.load({
								params:{
									cata_id : cata_id
								}
								});		
						window.parent.Ext.getCmp('center').remove("info_Ad_edit");
					} else {
						Ext.MessageBox.alert("提示", "修改广告信息失败 !");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
}

var init = function() {
	infoId = getCurArgs("infoId");
	Ext.QuickTips.init(true);
	buildFormPanel();
	initInfo();
	//Ext.TipSelf.msg('提示', '填写标签可自动关联标签相同的项目。');
};

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

Ext.onReady(init);