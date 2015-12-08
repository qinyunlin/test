var info_add_form, relatedProListPanel, relatedProPanel, sendListPanel, sendPanel, infoContentTypeExForm;
var uploadIWin, uploadFWin, relatedProWin;
var infoId, infoPid, pid, tid;
var relatedProStore, proStore, sortStore, sendStore, eidStore, site_form, sortCombo;
var eidWin = null;
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
var oriPicPath;// 初始图片路径
var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var buildFormPanel = function() {
	sortStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/InfoContentType.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'name', 'owner', 'path', 'pid', 'type',
								'amount', 'createBy', 'isLeaf']),
				baseParams : {
					type : 1
				},
				remoteSort : true
			});

	// 处理返回的数据
	sortStore.loadRecords = function(o, options, success) {
		if (!o || success === false) {
			if (success !== false) {
				this.fireEvent("load", this, [], options);
			}
			if (options.callback) {
				options.callback
						.call(options.scope || this, [], options, false);
			}
			return;
		}
		var r = o.records, t = o.totalRecords || r.length;
		if (!options || options.add !== true) {

			if (this.pruneModifiedRecords) {
				this.modified = [];
			}
			for (var i = 0, len = r.length; i < len; i++) {
				/* 处理name */
				var name = "";
				var mark = "";
				var a = r[i].data.path.split("/");
				if (a.length == 3) {
					name = " ├ " + r[i].data.name;
				} else {
					for (var j = 3; j < a.length; j++) {
						mark += " │ ";
					}
					name = mark + " ├ " + r[i].data.name;
					mark = "";
				}
				r[i].data.name = name;
				/* end 处理name */
				r[i].join(this);
			}
			if (this.snapshot) {
				this.data = this.snapshot;
				delete this.snapshot;
			}
			this.data.clear();
			this.data.addAll(r);
			this.totalLength = t;
			this.applySort();
			this.fireEvent("datachanged", this);
		} else {
			this.totalLength = Math.max(t, this.data.length + r.length);
			this.add(r);
		}
		this.fireEvent("load", this, r, options);
		if (options.callback) {
			options.callback.call(options.scope || this, r, options, true);
		}
	}

	sortCombo = new Ext.form.ComboBox({
				id : 'sortCombo',
				hiddenId : 'tid',
				hiddenName : 'tid',
				width : 200,
				store : sortStore,
				typeAhead : true,
				mode : 'remote',
				triggerAction : 'all',
				valueField : "id",
				displayField : "name",
				readOnly : true,
				allowBlank : false,
				fieldLabel : '分类',
				emptyText : '请选择'
			});
			
	sortCombo.on("select", initAtrrbuteEx);			
			
	infoContentTypeExForm = new Ext.form.FormPanel({
		autoHeight : true,
		autoWidth : true,
		hideBorders : true,
		layout : 'form',
		items : [{
					id : 'col1',
					fieldLabel : '扩展属性1',
					name : 'col1',
					xtype : "textfield"
				},{
					id : 'col2',
					fieldLabel : '扩展属性2',
					name : 'col2',
					xtype : "textfield"
				},{
					id : 'col3',
					fieldLabel : '扩展属性3',
					name : 'col3',
					xtype : "textfield"
				},{
					id : 'col4',
					fieldLabel : '扩展属性4',
					name : 'col4',
					xtype : "textfield"
				},{
					id : 'col5',
					fieldLabel : '扩展属性5',
					name : 'col5',
					xtype : "textfield"
				}]
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
			id : 'cp1',
			title : '正常发表记录',
			items : [{
						xtype : "fieldset",
						title : "内容",
						width : 780,
						colspan : 3,
						items : [{
									layout : 'table',
									labelAlign : 'top',
									items : [{
												xtype : 'htmleditorself',
												id : 'acontent',
												width : 750,
												height : 600,
												requestURL : "http://ftp.zjtcn.com",
												requestType : 'RS_INFO',
												fileType : /jpg|JPG|JPEG|jpeg|GIF|gif/
											}]
								}]
					}]
		}, {
			id : 'cp2',
			title : '使用网页链接',
			layout : 'table',
			layoutConfig : {
				columns : 3
			},
			defaults : {
				bodyStyle : 'padding:2px 2px'
			},
			items : [{
						html : '网页链接：'
					}, {
						layout : 'column',
						items : {
							id : 'address',
							name : 'address',
							xtype : "textfield",
							width : 400,
							vtype : 'url'
						}
					}, {
						html : '<span style="color: #FF0000">必须以http://或者ftp://开头</span>'
					}]
		}, {
			id : 'cp3',
			title : '使用上传文件',
			layout : 'table',
			layoutConfig : {
				columns : 4
			},
			defaults : {
				bodyStyle : 'padding:2px 2px'
			},
			items : [{
						html : '上传文件：'
					}, {
						layout : 'column',
						items : {
							id : 'url',
							name : 'url',
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
								showUploadFWin();
							}
						}
					}, {
						html : '<span style="color: #FF0000">支持格式:txt|doc|xls|zip|rar|jpg|gif|htm|mht|</span>'
					}]
		}, {
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
	
	var zhcn = new Zhcn_Select();
		// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	var city = [];
	var city_area = [];
	comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
				store : pro,
				width : 180,
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						city = zhcn.getCity(province);
						comboCities.store.loadData(city);
						comboCities.enable();
					}
				},

				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				emptyText : '请选择',
				editable : false,
				triggerAction : 'all',
				allowBlank : false,
				readOnly : true,
				fieldLabel : '请选择省份'
			});

	comboCities = new Ext.form.ComboBox({
				id : 'comboCities',
				store : city,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				emptyText : '请选择',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				readOnly : true,
				fieldLabel : '选择城市',
				name : 'region',
				disabled : true,
				allowBlank : false,
				width : 180

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
		layout : 'table',
		layoutConfig : {
			columns : 2
		},
		frame : true,
		width : 820,
		buttonAlign : 'left',
		labelAlign : 'right',
		items : [{
			columnWidth : .5,
			xtype : "fieldset",
			title : "基本信息",
			width : 400,
			height : 400,
			layout : 'form',
			items : [sortCombo, {
				layout : 'form',
				items : new Ext.form.ComboBox({
							id : 'issueType',
							width : 180,
							name : 'issueType',
							mode : 'local',
							hiddenId : 'issueTypeId',
							hiddenName : 'issueTypeId',
							readOnly : true,
							triggerAction : 'all',
							fieldLabel : '发表类型',
							emptyText : '请选择',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '正常发表记录'],
												['2', '使用网页链接'],
												['3', '使用上传文件'],
												['4', '上传FLASH']]
									}),
							valueField : 'value',
							displayField : 'text',
							emptyText : '正常发表记录',
							listeners : {
								select : {
									fn : function() {
										var i = Ext.fly("issueTypeId")
												.getValue();
										Ext.getCmp("cardPanel").layout
												.setActiveItem("cp" + i);
										if (i != "1")
											hideEl("summary_btn");
										else
											showEl("summary_btn");
									}
								}
							}
						})
			}, {
				layout : 'form',
				items : {
					id : 'tags',
					name : 'tags',
					fieldLabel : 'Tag标签',
					xtype : "textfield",
					width : 200
				}
			}, {
				layout : 'form',
				items : {
					id : 'title',
					name : 'title',
					fieldLabel : '文章标题',
					xtype : "textfield",
					allowBlank : false,
					width : 200
				}
			}, {
				layout : 'form',
				items : {
					id : 'subTitle',
					name : 'subTitle',
					fieldLabel : '文章副标题',
					xtype : "textfield",
					width : 200,
					tooltip : '用于首页显示'
				}
			}, {
				layout : 'form',
				items : {
					xtype : 'label',
					style : 'margin-left:90px;line-height:20px;',
					html : '<font style="color:red;text-align:center;">副标题用于首页整齐显示，网编需要经常用到。</font>'
				}
			}, {
				layout : 'form',
				items : {
					id : 'source',
					name : 'source',
					fieldLabel : '来源',
					xtype : "textfield",
					width : 200
				}
			}, {
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				items : [{
							layout : 'form',
							items : {
								id : 'eid',
								name : 'eid',
								fieldLabel : '关联企业ID',
								readOnly : true,
								xtype : 'textfield',
								width : 200
							}
						}, {
							style : 'margin-top:-5px;margin-left:5px;',
							xtype : 'button',
							text : '设置',
							handler : openEmpWin
						}]
			}, {
				layout : 'form',
				items : {
					id : 'ename',
					name : 'ename',
					fieldLabel : '关联企业名称',
					xtype : 'textfield',
					readOnly : true,
					width : 200
				}
			}, {
					layout : 'form',
					items : comboProvinces
				}, {
					layout : 'form',
					items : comboCities
				}, {
				layout : 'form',
				items : {
					id : 'sort',
					name : 'sort',
					fieldLabel : '排序',
					xtype : 'numberfield',
					readOnly : compareAuth("INFO_CONTENT_SORT"),
					width : 50,
					allowDecimals : false,
					allowBlank : false,
					value : 0
				}
			}, {
				layout : 'column',
				bodyStyle : 'text-align:right',
				items : [{
							text : "是否置顶:",
							xtype : "label",
							width : 100
						}, {
							layout : 'column',

							items : [new Ext.form.Radio({
												id : 'isTop1',
												fieldLabel : '是否置顶',
												boxLabel : '是',
												inputValue : '1',
												width : 50,
												name : 'isTop'

											}), new Ext.form.Radio({
												id : 'isTop0',
												boxLabel : '否',
												inputValue : '0',
												name : 'isTop',
												width : 50,
												checked : true
											})]
						}]
			}, {
				layout : 'column',
				bodyStyle : 'text-align:right',
				items : [{
							text : "是否热点:",
							xtype : "label",
							width : 100
						}, {
							layout : 'column',

							items : [new Ext.form.Radio({
												id : 'isHot1',
												fieldLabel : '是否热点',
												boxLabel : '是',
												inputValue : '1',
												width : 50,
												name : 'isHot'

											}), new Ext.form.Radio({
												id : 'isHot0',
												boxLabel : '否',
												inputValue : '0',
												name : 'isHot',
												width : 50,
												checked : true
											})]
						}]
			}]
		},  {
			columnWidth : .49,
			layout:'form',
			items : [{
				xtype : "fieldset",
				title : "标题图片",
				width : 400,
				height : 250,
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
			},{
				xtype : "fieldset",
				title : "图片库",
				height:71,
				widht : 400,
				items : [{
					xtype :'button',
					text : '图片库上传',
					handler : function(){
						showUploadBaseWin();
					}
				}]
			}]
		}, {
			id : "attrExPanel",
			title : '扩展属性',
			xtype : 'fieldset',
			width : 800,
			colspan : 3,
			hidden : false,
			items : infoContentTypeExForm
		},{
			colspan : 2,
			width : 803,
			items : cardPanel
		}, {
			xtype : "fieldset",
			title : "内容摘要",
			width : 780,
			colspan : 3,
			items : [{
				layout : 'column',
				labelAlign : 'top',
				items : [{
					id : "summary_btn",
					xtype : "button",
					text : '从内容提取',
					handler : function() {// trim
						var acontent = Ext.util.Format.trim(Ext.util.Format
								.stripTags(Ext.getCmp("acontent").getValue())
								.replace(/&nbsp;/g, ""));
						Ext.fly("summary").dom.value = acontent.length < 101
								? acontent
								: acontent.substring(0, 100);
					}
				}, {
					xtype : 'textarea',
					id : 'summary',
					width : 750,
					height : 100
				}]
			}]
		}],
		buttons : [{
					text : '提交',
					handler : updateInfo,
					hidden : compareAuth("INFO_CONTENT_MOD")
				}, {
					text : '重置',
					handler : function() {
						info_add_form.form.reset();
					}
				}, {
					text : '查看相关项目',
					handler : linkProject
				}, {
					text : '关闭',
					handler : function() {
						window.parent.Ext.getCmp('center').remove("info_edit");
					}
				}]
	});
	
	new Ext.Panel({
				border : false,
				frame : true,
				layout : 'form',
				renderTo : 'info_add',
				items : [site_form, info_add_form]
			});

};

var initAtrrbuteEx = function(){
	Ext.Ajax.request({
			url : '/InfoContentType.do',
			method : 'POST',
			params: {
				id : sortCombo.getValue(),
				type : 7
			},
			success : function(response){
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					var result = data.result;
					if(!Ext.isEmpty(result)){
						Ext.getCmp("attrExPanel").show();
						if(!Ext.isEmpty(result["col1"])){
							Ext.getCmp("col1").enable();
							Ext.getCmp("col1").getEl().up('.x-form-item').setDisplayed(true);
							Ext.query('label[for=col1]')[0].innerHTML = result["col1"] + ":";
						}else{
							Ext.getCmp("col1").disable();// for validation
   							Ext.getCmp("col1").getEl().up('.x-form-item').setDisplayed(false); // hide label
						}
						
						if(!Ext.isEmpty(result["col2"])){
							Ext.getCmp("col2").enable();
							Ext.getCmp("col2").getEl().up('.x-form-item').setDisplayed(true);
							Ext.query('label[for=col2]')[0].innerHTML = result["col2"] + ":";
						}else{
						    Ext.getCmp("col2").disable();// for validation
   							Ext.getCmp("col2").getEl().up('.x-form-item').setDisplayed(false); // hide label
						}
						
						if(!Ext.isEmpty(result["col3"])){
							Ext.getCmp("col3").enable();
							Ext.getCmp("col3").getEl().up('.x-form-item').setDisplayed(true);
							Ext.query('label[for=col3]')[0].innerHTML = result["col3"] + ":";
						}else{
							Ext.getCmp("col3").disable();// for validation
    						Ext.getCmp("col3").getEl().up('.x-form-item').setDisplayed(false); // hide label
						}
						
						if(!Ext.isEmpty(result["col4"])){
							Ext.getCmp("col4").enable();
							Ext.getCmp("col4").getEl().up('.x-form-item').setDisplayed(true);
							Ext.query('label[for=col4]')[0].innerHTML = result["col4"] + ":";
						}else{
							Ext.getCmp("col4").disable();// for validation
    						Ext.getCmp("col4").getEl().up('.x-form-item').setDisplayed(false); // hide label
						}
						
						if(!Ext.isEmpty(result["col5"])){
							Ext.getCmp("col5").enable();
							Ext.getCmp("col5").getEl().up('.x-form-item').setDisplayed(true);
							Ext.query('label[for=col5]')[0].innerHTML = result["col5"] + ":";
						}else{
							Ext.getCmp("col5").disable();// for validation
    						Ext.getCmp("col5").getEl().up('.x-form-item').setDisplayed(false); // hide label
						}
					}else{
						Ext.getCmp("attrExPanel").hide();
					}
				}
			},
			failure : function(){
				
			}
		});
}

/* 上传图片库 */
var view, chooser;
var showUploadBaseWin = function() {
	chooser = new ImageDetail({
				url : '/InfoContent.do',
				width : 780,
				height : 470,
				type : 25,
				cid : infoId,
			});
	chooser.show();
};


/* 初始化数据 */
var initInfo = function() {
	var data = "";
	data = "type=1&id=" + infoId;
	Ext.lib.Ajax.request('post', '/SearchInfoContent.do', {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (json && json.state == 'success') {
						json = json.result;
						info_add_form.getForm().setValues(json);
						if (json["eid"] != null)
							Ext.get("eid").dom.value = json["eid"];
						if (json["ename"] != null)
							Ext.get("ename").dom.value = json["ename"];
						if (json['sort'] != null)
							Ext.get("sort").dom.value = json["sort"];

						if (json["title"] == null)
							Ext.get("title").dom.value = "";
						else
							Ext.get("title").dom.value = json["title"];
						if (json["source"] == null)
							json["source"] = "";
						else
							Ext.get("source").dom.value = json["source"];
						if (json["tags"] == null)
							json["tags"] = "";
						else
							Ext.get("tags").dom.value = json["tags"];
						if (json["isTop"] == "1") {
							Ext.get("isTop1").dom.checked = true
						} else {
							Ext.get("isTop0").dom.checked = true
						}
						if (json["isHot"] == "1") {
							Ext.get("isHot1").dom.checked = true
						} else {
							Ext.get("isHot0").dom.checked = true
						}
						if (json["picPath"] != null) {
							oriPicPath = FileUpload_Ext.requestURL
									+ json["picPath"];
							Ext.get("picPath").dom.src = oriPicPath;
						}

						var siteform = site_form.getForm().items;
						var len = siteform.length;

						for (var i = 0; i < len; i++) {
							if (json[siteform.keys[i]] == "1") {
								Ext.getCmp(siteform.keys[i]).setValue(true);
								// siteform.map[siteform.keys[i]].checked =
								// true;
							}
						}
						if (json["issueType"] == "1") {
							if (json["summary"] != null)
								Ext.get("summary").dom.value = json["summary"];
							else
								Ext.get("summary").dom.value = "";
							// initInfoCon();
							if (json["content"] == null)
								Ext.getCmp("acontent").setValue("");
							else
								Ext.getCmp("acontent")
										.setValue(json["content"]);
						} else if (json["issueType"] == "2") {
							Ext.get("issueType").dom.value = "使用网页链接";
							Ext.get("address").dom.value = json["url"];
							Ext.getCmp("cardPanel").layout.setActiveItem("cp2");
						} else if (json["issueType"] == "3") {
							Ext.get("issueType").dom.value = "使用上传文件";
							Ext.get("url").dom.value = FileUpload_Ext.requestURL
									+ json["url"];
							Ext.getCmp("cardPanel").layout.setActiveItem("cp3");
						} else if (json["issueType"] == "4") {
							Ext.get("issueType").dom.value = "上传FLASH";
							Ext.get("urlF").dom.value = FileUpload_Ext.requestURL
									+ json["url"];
							Ext.getCmp("cardPanel").layout.setActiveItem("cp4");
						}
						Ext.get("tid_temp").dom.value = json["tid"];
						Ext.get("tid").dom.value = json["tid"];
						Ext.get("path_temp").dom.value = json["tpath"];
						var sortCbValue = " ├ " + json["typename"];
						for (var i = 0; i < json["tpath"].split("/").length - 3; i++) {
							sortCbValue = " │ " + sortCbValue;
						}
						Ext.get("sortCombo").dom.value = sortCbValue;
						//Ext.get("summary").dom.value = json["summary"];
						/*
						 * if(tpath.substring(0, 3) == "/3/") { }
						 */
						 
						 
						initAtrrbuteEx();
					} else {
						alert("获取信息失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
};
/*
 * var initInfoCon = function() { var data = ""; data = "type=10&id=" + infoId;
 * Ext.lib.Ajax.request('post', '/SearchInfoContent.do', { success :
 * function(response) { var json = eval("(" + response.responseText + ")"); if
 * (json && json.state == 'success') { json = json.result.content;
 * Ext.getCmp("acontent").setValue(json.toString()); } else {
 * alert("获取信息内容失败！"); return ""; } }, failure : function() {
 * Ext.Msg.alert('警告', '操作失败。'); return ""; } }, data); };
 */
/* end 初始化数据 */

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

/* 打开关联企业窗口 */
var openEmpWin = function() {
	emp_ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"createOn"]),
				baseParams : {
					page : 1,
					type : 2,
					content : "islock~0",
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 9
				},
				remoteSort : true
			});
	emp_ds.setDefaultSort('createOn', 'DESC');
	var cm = new Ext.grid.CheckboxSelectionModel({});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : emp_ds,
				displayInfo : true
			});
	emp_grid = new Ext.grid.GridPanel({
				store : emp_ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : 300,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 100,
							dataIndex : 'name'
						}, {
							header : '企业简称',
							sortable : true,

							dataIndex : 'fname'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [new Ext.form.ComboBox({
									id : 'emp_type',
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : emp_type_ds,
									width : 80,
									valueField : "value",
									displayField : "text",
									readOnly : true,
									value : '0'
								}), "-", new Ext.form.ComboBox({
									id : 'emp_query_key',
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : emp_query_key_ds,
									width : 80,
									valueField : "value",
									displayField : 'text',
									readOnly : true,
									value : 'eid'
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchKey",
							width : 150,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchEmpList();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchEmpList
						}],
				bbar : pagetool
			});
	empWin = new Ext.Window({
				title : '企业列表',
				layout : 'fit',
				width : 600,
				height : 360,
				border : false,
				modal : true,
				frame : true,
				labelAlign : 'right',
				closeAction : 'close',
				items : [emp_grid],
				buttons : [{
							text : '确定',
							handler : function() {
								setLinkEmp();
							}
						}, {
							text : '取消',
							handler : function() {
								empWin.close();
							}
						}]
			});
	empWin.show();
	emp_ds.load();
};

/* 设置关联企业 */
var setLinkEmp = function() {
	var row = emp_grid.getSelectionModel().getSelected();
	if (isEmpty(row)) {
		Ext.Msg.alert("提示", "请选择企业");
		return;
	}
	Ext.fly("eid").dom.value = row.get("eid");
	Ext.fly("ename").dom.value = row.get("name");
	empWin.close();
};
/* 搜索企业 */
var searchEmpList = function() {
	var query = Ext.getCmp("emp_query_key").getValue() + "~"
			+ Ext.fly("searchKey").getValue() + ";islock~0";
	if (parseInt(Ext.getCmp("emp_type").getValue()) != 0)
		query += ";type~" + Ext.getCmp("emp_type").getValue();
	emp_ds.baseParams["content"] = query;
	emp_ds.load();
};

/* 显示相关项目 */
var initRelatedPro = function() {
	// 项目资讯才可以添加相关项目
	relatedProStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/InfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'name']),
				baseParams : {
					id : infoId,
					type : 10
				},
				remoteSort : true
			});
	relatedProStore.load();
	var relateGridPanel = new Ext.grid.GridPanel({
				store : relatedProStore,
				loadMask : true,
				height : 180,
				autoScroll : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '项目名称',
							dataIndex : 'name',
							width : 200
						}],
				viewConfig : {
					forceFit : true
				},
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				tbar : [{
							text : '新增',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							handler : function() {
								showRelatedProWin();
							}
						}, '-', {
							id : 'del',
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : function() {
								delRelationPro();
							}
						}],
				listeners : {
					rowclick : {
						fn : function() {
							this.getSelectionModel().each(function(rec) {
										infoPid = rec.get("id");
									})
						}
					}
				}
			});
	Ext.getCmp("relatedProFs").add(relateGridPanel)
	Ext.getCmp("relatedProFs").doLayout()
}
/* end 显示相关项目 */

/* 显示相关项目 */
var buildRelatedProWin = function() {
	proStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/project/ProjectServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'code', 'name', 'buildDate']),
				baseParams : {
					method : 'search'
				},
				countUrl : '/project/ProjectServlet',
				countParams : {
					method : 'searchCount'
				},
				remoteSort : true
			});
	proStore.load();
	relatedProWin = new Ext.Window({
		el : 'related_pro_win',
		width : 550,
		height : 500,
		title : '选择相关项目',
		layout : 'column',
		border : false,
		frame : true,
		buttonAlign : 'center',
		labelAlign : 'right',
		closeAction : 'hide',
		bodyStyle : 'padding: 15px',
		items : [new Ext.grid.GridPanel({
					store : proStore,
					loadMask : true,
					autoScroll : true,
					height : 400,
					width : 500,
					columns : [new Ext.grid.RowNumberer({
										width : 30
									}), {
								header : '项目编号',
								dataIndex : 'code'
							}, {
								header : '项目名称',
								dataIndex : 'name',
								width : 240
							}, {
								header : '立项日期',
								dataIndex : 'buildDate'
							}],
					bbar : new Ext.ux.PagingToolbar({
								store : proStore,
								displayInfo : true
							}),
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					tbar : [new Ext.form.ComboBox({
								id : 'kwType',
								name : 'kwType',
								mode : 'local',
								readOnly : true,
								triggerAction : 'all',
								anchor : '90%',
								store : new Ext.data.SimpleStore({
											fields : ['value', 'text'],
											data : [['0', '项目编号'],
													['1', '项目名称']]
										}),
								valueField : 'value',
								displayField : 'text',
								width : 80,
								emptyText : '项目名称'
							}), {
						id : 'keyword',
						xtype : 'textfield'
					}, {
						text : '查询',
						cls : 'x-btn-text-icon',
						icon : '/resource/images/zoom.png',
						handler : function() {
							proStore.baseParams = {};
							if (Ext.get("kwType").dom.value == "项目名称") {
								proStore.baseParams["method"] = "search";
								proStore.baseParams["name"] = Ext
										.get("keyword").dom.value;
							} else if (Ext.get("kwType").dom.value == "项目编号") {
								proStore.baseParams["method"] = "search";
								proStore.baseParams["code"] = Ext
										.get("keyword").dom.value;
							}
							proStore.load();
						}
					}],
					listeners : {
						rowclick : {
							fn : function() {
								this.getSelectionModel().each(function(rec) {
											pid = rec.get("id");
										})
							}
						}
					}
				})],
		buttons : [{
			text : '确定',
			handler : function() {
				if (pid == null) {
					Ext.MessageBox.alert("提示", "请选择项目!");
					return;
				}
				var data = "";
				data += "id=" + infoId;
				data += "&pid=" + pid;
				data += "&type=8";
				Ext.lib.Ajax.request('post', '/InfoContent.do', {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							pid = null;
							relatedProWin.hide();
							relatedProStore.load();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				}, data);
			}
		}, {
			text : '取消',
			handler : function() {
				relatedProWin.hide();
			}
		}]
	});
}

var showRelatedProWin = function() {
	if (relatedProWin == null) {
		buildRelatedProWin();
		relatedProWin.show();
	} else {
		relatedProWin.show();
	}
};
/* end 显示相关项目 */

/* 更新项目 */
var updateInfo = function() {
	if (!info_add_form.getForm().isValid()) {
		Info_Tip("请按照要求填写表单!");
		return;
	}
	var typename = Ext.fly("sortCombo").getValue();
	if (typename == "请选择") {
		Info_Tip("请选择栏目！");
		return;
	} else if (typename.lastIndexOf("├") > 0) {
		typename = typename.substring(typename.indexOf("├") + 2,
				typename.length);
	}
	var title = Ext.fly("title").getValue();
	if (title == "") {
		Info_Tip("请选择文章标题！")
		return;
	}

	/** ******************shawn添加，默认摘要为空时自动添加摘要;********************** */
	if (Ext.fly("summary").dom.value.length <= 0) {
		var acontent = Ext.util.Format.trim(Ext.util.Format.stripTags(Ext
				.getCmp("acontent").getValue()).replace(/&nbsp;/g, ""));
		Ext.fly("summary").dom.value = acontent.length < 101
				? acontent
				: acontent.substring(0, 100);
	}
	// *******************************

	var eid = Ext.fly("eid").getValue();
	var ename = Ext.fly("ename").getValue();
	var sort = Ext.fly("sort").getValue();
	var source = Ext.fly("source").getValue();
	var tid = Ext.fly("tid").getValue();
	var acontent = Ext.getCmp("acontent").getValue();
	var summary = Ext.fly("summary").getValue();
	var issueType = Ext.fly("issueType").getValue();
	var isTop = info_add_form.form.findField("isTop").getGroupValue();
	var isHot = info_add_form.form.findField("isHot").getGroupValue();
	var picPath = Ext.fly("picPath").dom.src.split('/');
	picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
	if (picPath.lastIndexOf('/') == picPath.length - 1
			|| picPath.lastIndexOf('.jsp') == picPath.length - 4) {
		picPath = "";
	}
	var tid = Ext.fly("tid").getValue();
	var tags = Ext.fly("tags").getValue();
	var tpath = "";
	var eids = [];
	var type = "3";
	var subTitle = Ext.get("subTitle").getValue().trim();
	if (Ext.isEmpty(subTitle))
		subTitle = title;
	var sites = [];
	var siteform = site_form.getForm().items;
	var len = siteform.length;
	for (var i = 0; i < len; i++) {
		if (siteform.map[siteform.keys[i]].checked == true)
			sites.push(siteform.keys[i] + "~1");
		else
			sites.push(siteform.keys[i] + "~0");
	}
	sites = sites.join().replace(/,/g, ";");
	if (tid != "") {
		sortStore.each(function(s) {
					if (s.data.id == tid) {
						tpath = s.data.path;
					}
				});
	} else {
		tpath = Ext.fly("path_temp").getValue();
		tid = Ext.fly("tid_temp").getValue();
	}

	if (issueType == "正常发表记录") {
		if (acontent.toText() == "") {
			Ext.MessageBox.alert("提示", "请输入内容！");
			return;
		}

		var data = {};
		data["desc"] = acontent;
		data["id"] = infoId;
		data["type"] = type;
		data["content"] = "issueType~1;summary~" + summary + ";title~" + title
				+ ";isHot~" + isHot + ";source~" + source + ";isTop~" + isTop
				+ ";tid~" + tid + ";typename~" + typename + ";tpath~" + tpath
				+ ";tags~" + tags + ";eid~" + eid + ";ename~" + ename
				+ ";sort~" + sort + ";" + sites+";subTitle~"+subTitle;
		if (type == 8) {
			data["eids"] = eids.toString();
		}
		refer(data, '修改信息');
	} else if (issueType == "使用网页链接") {
		var address = Ext.fly("address").getValue();
		if (address == "") {
			Info_Tip("请输入网页链接！");
			return;
		}
		var data = {};
		data["content"] = "issueType~2;summary~" + summary + ";url~" + address
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename + ";picPath~" + picPath
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle;
		data["id"] = infoId;
		data["type"] = type;
		if (type == 8) {
			data["eids"] = eids.toString();
		}
		refer(data, '修改信息');
	} else if (issueType == "使用上传文件") {
		var url = Ext.fly("url").getValue().split("/");
		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Info_Tip("请先上传文件！");
			return;
		}
		var data = {};
		data["content"] = "issueType~3;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle;
		data["id"] = infoId;
		data["type"] = type;
		if (type == 8) {
			data["eids"] = eids.toString();
		}
		refer(data, '修改信息');
	} else if (issueType == "上传FLASH") {
		var url = Ext.fly("urlF").getValue().split("/");
		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Info_Tip("请先上传FLASH文件！");
			return;
		}
		var data = {};
		data["content"] = "issueType~4;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle;
		data["id"] = infoId;
		data["type"] = type;
		if (type == 8) {
			data["eids"] = eids.toString();
		}

		refer(data, '修改信息');
	}
};

var refer = function(data, msg) {
	
	//*****************扩展属性************//
	var items = infoContentTypeExForm.form.items;
	var param = "";
	for(var i=0;i<items.length;i++){
		if(!items.get(i).disabled){
			items.get(i).name;
			items.get(i).getValue();
			param += ";" + items.get(i).name + "~" + items.get(i).getValue();
		}
	}
	data["content"] = data["content"] + param;
	
	Ext.Ajax.request({
				method : 'post',
				url : "/InfoContent.do",
				params : data,
				timeout : 1000 * 60 * 5,
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Info_Tip(msg + "成功！");
					} else {
						Info_Tip(msg + "失败！");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
}
/* end 更新项目 */

/* 去除相关项目 */
var delRelationPro = function() {
	Ext.MessageBox.confirm("提示", "确定要去除相关项目?", function(btn) {
				if (btn == "yes") {
					var data = "";
					data += "id=" + infoId;
					data += "&pid=" + infoPid;
					data += "&type=9";
					Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									if (infoPid == null) {
										Ext.MessageBox.alert("提示", "请先选择项目！");
										return;
									}
									var data = eval("(" + response.responseText
											+ ")");
									if (data && data.state == 'success') {
										infoPid = null;
										relatedProStore.load();
									} else {
										Ext.MessageBox.alert("提示", "删除相关项目失败！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
				}
			});
};
/* end 去除相关项目 */

var init = function() {
	infoId = getCurArgs("infoId");
	tid = getCurArgs("tid");
	Ext.QuickTips.init(true);
	buildFormPanel();
	initInfo();
	Ext.TipSelf.msg('提示', '填写标签可自动关联标签相同的项目。');
};

// 查看相关项目
function linkProject() {
	var tagsAll = Ext.fly("tags").dom.value;
	if (isEmpty(tagsAll)) {
		tagsAll = "";
		Ext.Msg.alert("提示", "标签为空, 无相关项目");
		return;
	}
	window.parent
			.createNewWidget("link_project", '相关项目',
					'/module/project/project_manage.jsp?tagsAll=' + tagsAll
							+ "&link=1");
};

// 查看关联企业
function see_eid_link() {
	var tid = Ext.fly("tid").getValue();
	if (tid != "404") {
		Ext.Msg.alert("提示", "只有<font color='red'>企业公告类型</font>的信息才有关联企业!");
		return;
	}

	var info_title = encodeURI(Ext.get("title").dom.value);
	window.parent.createNewWidget("eid_link", '查看关联企业',
			'/module/info/eid_link.jsp?id=' + infoId + '&info_title='
					+ info_title);
}

// 删除关联企业
/*
 * function deleteEid(){ var eid = ""; var row =
 * sendListPanel.getSelectionModel().getSelected(); if(isEmpty(row)){
 * Ext.Msg.alert("提示", "请选择相关企业"); return ; }
 * 
 * eid = row.get("eid"); var data = "type=9&id=" + infoId + "&eid=" + eid;
 * Ext.Msg.confirm("提示", "您确定要删除选中的相关企业?", function(op){ if(op == "yes"){
 * Ext.lib.Ajax.request('post', '/InfoContent.do', { success :
 * function(response) { var data = eval("(" + response.responseText + ")"); if
 * (data && data.state == 'success') { Ext.MessageBox.alert("提示", "删除成功!");
 * sendStore.load(); } else { Ext.MessageBox.alert("提示", "删除相关企业失败！"); } },
 * failure : function() { Ext.Msg.alert('警告', '操作失败。'); } }, data); } }); }
 */
function searchlist() {
	var query = Ext.fly("query_type").getValue() + "~"
			+ Ext.fly("searchtitle").getValue() + ";islock~0";
	eidStore.baseParams["content"] = query;
	eidStore.countParams["content"] = query;
	eidStore.load();
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