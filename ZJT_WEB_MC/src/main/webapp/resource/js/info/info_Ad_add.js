var info_add_form, site_form;
var uploadIWin, uploadFWin;
var cataId,parentId;
var sortStore;
var sortCombo;
var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var empWin = null;
var emp_grid, emp_ds;
var emp_type_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : emp_type_array
		});

var buildFormPanel = function() {
	
	var cardPanel = new Ext.Panel({
		id : 'cardPanel',
		layout : 'card',
		activeItem : 0,
		autoHeight : true,
		width : 803,
		defaults : {
			bodyStyle : 'padding:5px'
		},
		items : [{
			id : 'cp4',
			title : '上传 ',
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
					frame : true,
						layout : 'column',
						items : {
							id : 'urlF',
							name : 'urlF',
							xtype : "textfield",
							readOnly : true,
							width : 300
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
	})
	
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
					handler : addInfo
				}, {
					text : '重置',
					handler : function() {
						info_add_form.form.reset();
						}
				}, {
					text : '关闭',
					handler : function() {
						window.parent.Ext.getCmp('center').remove("info_add");
					}
				}]
	});
	new Ext.Panel({
				border : false,
				frame : true,
				layout : 'column',
				renderTo : 'info_add',
				items : [{
							columnWidth : .05,
							html : '&nbsp;'
						}, {
							columnWidth : .9,

							items : [info_add_form]

						}, {
							columnWidth : .05,
							html : '&nbsp;'
						}]
			});
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

/* 添加信息 */
var addInfo = function() {
	if (!info_add_form.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按照要求填写表单!");
		return;
	}
	var cname      = Ext.fly("cname").getValue();
	var note       = Ext.fly("note").getValue();
    var adv_text   = Ext.fly("adv_text").getValue();
	var attribute1 = Ext.fly("extension1").getValue();
	var attribute2 = Ext.fly("extension2").getValue();
	var attribute3 = Ext.fly("extension3").getValue();
	var attribute4 = Ext.fly("extension4").getValue();
	var weight     = Ext.fly("weight").getValue();
	var status     = Ext.get("status1").dom.checked?"1":"0";
	
	var picPath = "";
	if(Ext.fly("picPath").dom.src!=""){
		picPath = Ext.fly("picPath").dom.src.split('/');
		picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
		if (picPath.lastIndexOf('/') == picPath.length - 1 || picPath.lastIndexOf('.jsp') == picPath.length - 4) {
			picPath = "";
		}
	}
	
	var trans_url=Ext.get("trans_url").getValue().trim();	
	
	//替换上传的FTP地址前缀
	var url = "";
	if(Ext.fly("urlF").getValue()!=""){
		url = Ext.fly("urlF").getValue().split("/");
		url = "/" + url.slice(3).toString().replace(/,/g, "/");
	}
	
	var data = {};
	data["content"] ="issueType~4"+";cata_id~" + cataId+";flash_url~" + url+ ";cname~" + cname
			+ ";adv_text~" + adv_text + ";photo_url~" + picPath+";status~"+status
			+ ";weight~" + weight + ";" +";trans_url~"+trans_url+ ";extension1~" + attribute1+ ";extension2~" + attribute2+ ";extension3~" + attribute3+ ";extension4~" + attribute4;
	data["note"] = note;
	data["type"] = 2;

	submit(data);

	
};
/* end 添加信息 */

var submit = function(data) {


	Ext.Ajax.request({
		method : 'post',
		url : '/SearchInfoAd.do?type=2',
		params : data,
		timeout : 1000 * 60 * 5,
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.MessageBox.alert("提示", "添加信息成功！", closeWin);
				parent.tab_0613_iframe.ds.load({
								params:{
									cata_id : cataId
								}
								});			
			} else {
				Ext.MessageBox.alert("提示", "添加信息失败!");
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
}

var init = function() {
	cataId   = getCurArgs("cataId");
	Ext.QuickTips.init(true);
	buildFormPanel();

};

Ext.onReady(init);
function closeWin() {
	window.parent.Ext.getCmp('center').remove("info_Ad_add");
};