var info_add_form, site_form;
var uploadIWin, uploadFWin;
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
var emp_query_key_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["eid", "企业ID"], ["name", "企业名称"], ["fname", "企业简称"],
					["area", "所在地区"]]
		});
var buildFormPanel = function() {
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
			id : 'cp1',
			title : '正常发表记录',
			items : [{
						xtype : "fieldset",
						title : "模板内容",
						width : 780,
						colspan : 3,
						autoHeight : true,
						items : [{
									layout : 'table',
									labelAlign : 'top',
									items : [{
												xtype : 'textarea',
												id : 'acontent',
												width : 750,
												height: 600
											}]
								}]
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
			title : "模板基本信息",
			width : 400,
			height : 330,
			layout : 'form',
			items : [{
						layout : 'form',
						items : {
							id : 'cname',
							name : 'cname',
							fieldLabel : '模板中文名',
							xtype : "textfield",
							allowBlank : false,
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'ename',
							name : 'ename',
							fieldLabel : '模板英文名',
							xtype : "textfield",
							allowBlank : false,
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							xtype:'label',
							style:'margin-left:110px;line-height:18px;',
							html:'<font style="color:red;text-align:center;">模板英文名不能包含下划线</font>'
						}
					}, {
						layout : 'column',
						bodyStyle : 'text-align:right',
						items : [{
									text : "模板类型:",
									xtype : "label",
									width : 100
								}, {
									layout : 'column',

									items : [new Ext.form.Radio({
														id : 'type1',
														fieldLabel : '模板类型',
														boxLabel : '单页',
														inputValue : '1',
														width : 50,
														checked : true,
														name : 'type'

													}), new Ext.form.Radio({
														id : 'type2',
														boxLabel : '多页',
														inputValue : '2',
														name : 'type',
														width : 50,
													}), new Ext.form.Radio({
														id : 'type3',
														boxLabel : '专题',
														inputValue : '3',
														name : 'type',
														width : 50
													}), new Ext.form.Radio({
														id : 'type4',
														boxLabel : '分页',
														inputValue : '4',
														name : 'type',
														width : 50
													})]
								}]
					}, {
						layout : 'form',
						items : new Ext.form.ComboBox({
									id : 'suffix',
									width : 180,
									name : 'suffix',
									mode : 'local',
									hiddenId : 'suffixId',
									hiddenName : 'suffixId',
									readOnly : true,
									triggerAction : 'all',
									fieldLabel : '生成文件后缀',
									emptyText : '请选择',
									store : new Ext.data.SimpleStore({
												fields : ['value', 'text'],
												data : [['', '--请选择--'],
														['1', '.js'],
														['2', '.css'],
														['3', '.html'],
														['4', '.seg']]
											}),
									valueField : 'value',
									displayField : 'text',
									listeners : {
									}
								})
					}, {
						layout : 'form',
						items : {
							id : 'extension1',
							name : 'extension1',
							fieldLabel : '扩展属性一',
							xtype : "textfield",
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'extension2',
							name : 'extension2',
							fieldLabel : '扩展属性二',
							xtype : "textfield",
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'extension3',
							name : 'extension3',
							fieldLabel : '扩展属性三',
							xtype : "textfield",
							width : 200
						}
					}, {
						layout : 'form',
						items : {
							id : 'extension4',
							name : 'extension4',
							fieldLabel : '扩展属性四',
							xtype : "textfield",
							width : 200
						}
					}]
		}, {
			columnWidth : .02
		}, {
			columnWidth : .49,
			xtype : "fieldset",
			title : "效果图",
			width : 400,
			height : 330,
			items : [{
				layout : 'form',
				items : [{
					html : '<img id="picPath" src="" width="350px" height="250px" />'
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
		}, {
			xtype : "fieldset",
			title : "备注",
			autoHeight : true,
			frame : true,
			width : 800,
			colspan : 3,
			items : [{
				layout : 'column',
				labelAlign : 'top',
				items : [{
					xtype : 'textarea',
					id : 'note',
					width : 750,
					height : 100
				}]
			}]
		}],
		buttons : [{
					text : '提交保存',
					handler : addInfo
				}, {
					text : '保存并预览',
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
	//检测中英文名输入格式
	var cname = Ext.fly("cname").getValue();
	var cn = cname.match(/^([\u4e00-\u9fa5\0-9 ]){1,24}$/);
	if(!cn){
		Ext.MessageBox.alert("提示", "请正确填写模板中文名！");
		return ;
	}
	var ename = Ext.fly("ename").getValue();
	var en = ename.match(/^[a-zA-Z0-9]+$/);
	if(!cn){
		Ext.MessageBox.alert("提示", "请正确填写模板英文名！");
		return ;
	}
	var type = info_add_form.form.findField("type").getGroupValue();
	var suffix = Ext.fly("suffix").getValue();
	if(type==1&&suffix == "请选择"){
		Ext.MessageBox.alert("提示", "请选择生成文件的后缀！");
		return ;
	}


	var cname = Ext.fly("cname").getValue().trim();
	var ename = Ext.fly("ename").getValue();
//	var page_url = Ext.fly("page_url").getValue();
	var suffix = Ext.fly("suffix").getValue();
	var extension1 = Ext.fly("extension1").getValue();
	var extension2 = Ext.fly("extension2").getValue();
	var extension3 = Ext.fly("extension3").getValue();
	var extension4 = Ext.fly("extension4").getValue();
	var acontent = Ext.fly("acontent").getValue();
	var note = Ext.fly("note").getValue();
	var picPath = Ext.fly("picPath").dom.src.split('/');
	picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
	if (picPath.lastIndexOf('/') == picPath.length - 1
			|| picPath.lastIndexOf('.jsp') != -1) {
		picPath = "";
	}
	var data = {};
		if (acontent.toText() == "") {
			Ext.MessageBox.alert("提示", "请输入模板内容！");
			return;
		}
		data["desc"] = acontent;
		data["content"] = ";parent_id~" + cataId + ";cname~" + cname 
						+ ";ename~" + ename + ";type~" + type + ";suffix~" + suffix + ";photo_url~" + picPath 
						+ ";extension1~" + extension1 + ";extension2~" + extension2 
						+ ";extension3~" + extension3 + ";extension4~" + extension4 
						+ ";note~" + note;
		data["type"] = 3;
		submit(data);
};
/* end 添加信息 */

var submit = function(data) {
	Ext.Ajax.request({
		method : 'post',
		url : '/TemplateBase.do',
		params : data,
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.MessageBox.alert("提示", "添加模板成功！", closeWin);
				window.parent.tab_0606_iframe.infoStore.reload();
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
	cataId = getCurArgs("cataId");
	if(cataId==""||cataId.length<5){
		Ext.MessageBox.alert("提示", "请选择模板所在的分类！");
		window.parent.Ext.getCmp('center').remove("template_add");
	}
	Ext.QuickTips.init(true);
	buildFormPanel();
};

Ext.onReady(init);
function closeWin() {
	window.parent.Ext.getCmp('center').remove("template_add");
};