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
				width : 200,
				hiddenId : 'tid',
				hiddenName : 'tid',
				store : sortStore,
				typeAhead : true,
				mode : 'remote',
				triggerAction : 'all',
				valueField : "id",
				displayField : "name",
				readOnly : true,
				fieldLabel : '分类',
				allowBlank : false,
				emptyText : '请选择'
			});
			
			
	sortCombo.on("select", function(){
		Ext.Ajax.request({
			url : '/InfoContentType.do',
			method : 'POST',
			params: {
				id : this.getValue(),
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
		
	});
	
	infoContentTypeExForm = new Ext.form.FormPanel({
		id : 'exForm',
		autoHeight : true,
		autoWidth : true,
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
						autoHeight : true,
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
	site_form = new Ext.form.FormPanel({
				width : 820,
				colspan : 3,
				layout:'fit',
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
			width : 400,
			height : 400,
			layout : 'form',
			items : [{
						layout : 'form',
						items : sortCombo
					}, {
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
									allowBlank : false,
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
									emptyText : '请选择',
									value : '1',
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
							tooltip:'用于首页显示'
						}
					}, {
						layout : 'form',
						items : {
							xtype:'label',
							style:'margin-left:90px;line-height:20px;',
							html:'<font style="color:red;text-align:center;">副标题用于首页整齐显示，网编需要经常用到。</font>'
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
		}, {
			columnWidth : .02
		}, {
			columnWidth : .49,
			layout:'form',
			items : [{
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
			}]
		}, {
			xtype : "fieldset",
			id : 'attrExPanel',
			title : '扩展属性',
			width : 800,
			colspan : 3,
			hidden : true,
			items : infoContentTypeExForm
		}, {
			colspan : 3,
			width : 803,
			autoHeight : true,
			items : cardPanel
		}, {
			xtype : "fieldset",
			title : "内容摘要",
			autoHeight : true,
			frame : true,
			width : 800,
			colspan : 3,
			items : [{
				layout : 'column',
				labelAlign : 'top',
				items : [{
					id : 'summary_btn',
					xtype : "button",
					text : '从内容提取',
					handler : function() {
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
					handler : addInfo
				}, {
					text : '重置',
					handler : function() {
						info_add_form.form.reset();
						if (!isEmpty(getCurArgs("addNote"))) {
							var tpath = getCurArgs("tpath");
							var typename = decodeURI(getCurArgs("typename"));
							var tid = getCurArgs("tid");
							var sortCbValue = " ├ " + typename;
							for (var i = 0; i < tpath.split("/").length - 3; i++) {
								sortCbValue = " │ " + sortCbValue;
							}
							Ext.get("sortCombo").dom.value = sortCbValue;
							Ext.get("tid").dom.value = tid;
							sortCombo.setDisabled(true);
						}
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

							items : [site_form, info_add_form]

						}, {
							columnWidth : .05,
							html : '&nbsp;'
						}]
			});
};


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
	var typename = Ext.fly("sortCombo").getValue();
	if (typename == "请选择") {
		Ext.MessageBox.alert("提示", "请选择分类！")
		return;
	} else {
		typename = typename.substring(typename.indexOf("├") + 2,
				typename.length);
	}
	var title = Ext.fly("title").getValue();
	if (title == "") {
		Ext.MessageBox.alert("提示", "请输入文章标题！")
		return;
	}
    var province = Ext.fly("comboProvinces").getValue();
    if(province == "" || province == "请选择")
    {
      Ext.MessageBox.alert("提示","请选择省份")
    }
     var city = Ext.fly("comboCities").getValue();
    if(city == "" || city == "请选择")
    {
      Ext.MessageBox.alert("提示","请选择地区")
    }
        // shawn添加，默认摘要为空时自动添加摘要;
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
	var acontent = Ext.fly("acontent").getValue();
	var summary = Ext.fly("summary").getValue();
	var issueType = Ext.fly("issueType").getValue();
	var tags = Ext.fly("tags").getValue();
	var isTop = info_add_form.form.findField("isTop").getGroupValue();
	var isHot = info_add_form.form.findField("isHot").getGroupValue();
	var picPath = Ext.fly("picPath").dom.src.split('/');
	picPath = "/" + picPath.slice(3).toString().replace(/,/g, "/");
	if (picPath.lastIndexOf('/') == picPath.length - 1
			|| picPath.lastIndexOf('.jsp') == picPath.length - 4) {
		picPath = "";
	}
	var subTitle=Ext.get("subTitle").getValue().trim();
	if(Ext.isEmpty(subTitle))
		subTitle=title;
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
	var tpath = "";
	if (getCurArgs("addNote")) {
		tpath = getCurArgs("tpath");
		tid = getCurArgs("tid");
	}
	
	sortStore.each(function(s) {
				if (s.data.id == tid) {
					tpath = s.data.path;
				}
			});
	var data = {};
	if (issueType == "正常发表记录") {
		if (acontent.toText() == "") {
			Ext.MessageBox.alert("提示", "请输入内容！");
			return;
		}
		data["desc"] = acontent;
		data["content"] = "issueType~1;summary~" + summary + ";title~" + title
				+ ";isHot~" + isHot + ";source~" + source + ";isTop~" + isTop
				+ ";tid~" + tid + ";typename~" + typename + ";tpath~" + tpath
				+ ";tags~" + tags + ";eid~" + eid + ";picPath~" + picPath
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle+";province~"+province+";city~"+city;
		data["type"] = 1;
		submit(data);
	} else if (issueType == "使用网页链接") {
		var address = Ext.fly("address").getValue();
		if (address == "") {
			Ext.MessageBox.alert("提示", "请输入网页链接！");
			return;
		}
		var data = {};
		data["content"] = "issueType~2;summary~" + summary + ";url~" + address
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid + ";picPath~" + picPath
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle+";province~"+province+";city~"+city;
		data["type"] = 1;
		submit(data);

	} else if (issueType == "使用上传文件") {
		var url = Ext.fly("url").getValue().split("/");

		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Ext.MessageBox.alert("提示", "请先上传文件！");
			return;
		}

		var data = {};
		data["content"] = "issueType~3;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle+";province~"+province+";city~"+city;
		data["type"] = 1;
		submit(data);
	} else if (issueType == "上传FLASH") {

		var url = Ext.fly("urlF").getValue().split("/");

		url = "/" + url.slice(3).toString().replace(/,/g, "/");
		if (url == "" || url == "/") {
			Ext.MessageBox.alert("提示", "请先上传FLASH文件！");
			return;
		}
		var data = {};
		data["content"] = "issueType~4;summary~" + summary + ";url~" + url
				+ ";title~" + title + ";isHot~" + isHot + ";source~" + source
				+ ";isTop~" + isTop + ";tid~" + tid + ";typename~" + typename
				+ ";tpath~" + tpath + ";tags~" + tags + ";eid~" + eid
				+ ";ename~" + ename + ";sort~" + sort + ";" + sites+";subTitle~"+subTitle+";province~"+province+";city~"+city;
		data["type"] = 1;

		submit(data);

	}
};
/* end 添加信息 */

var submit = function(data) {

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
		url : '/InfoContent.do',
		params : data,
		timeout : 1000 * 60 * 5,
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				var iframe;
				if (getCurArgs("addNote"))
					iframe = parent.tab_0603_iframe;
				else {
					iframe = parent.tab_0602_iframe;
					iframe.Ext.fly("sortCombo").dom.value = Ext
							.fly("sortCombo").getValue();
					iframe.Ext.fly("tid").dom.value = Ext.fly("tid").getValue();
				}
				iframe.Ext.getCmp("exStatus").setValue('1');
				// iframe.Ext.fly("area_sel").dom.value = Ext.fly("area_sel")
				// .getValue();
				iframe.showEl("sh_menuItem");
				iframe.search();
				Ext.MessageBox.alert("提示", "添加信息成功,请审核！", closeWin);

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
	Ext.QuickTips.init(true);
	buildFormPanel();
	var addNote = getCurArgs("addNote");
	if (addNote) {
		var tpath = getCurArgs("tpath");
		var typename = decodeURI(getCurArgs("typename"));
		var tid = getCurArgs("tid");
		var sortCbValue = " ├ " + typename;
		for (var i = 0; i < tpath.split("/").length - 3; i++) {
			sortCbValue = " │ " + sortCbValue;
		}
		Ext.get("sortCombo").dom.value = sortCbValue;
		Ext.get("tid").dom.value = tid;
		sortCombo.setDisabled(true);
		Ext.fly("picPath").dom.src = "";

	}
};

Ext.onReady(init);
function closeWin() {
	window.parent.Ext.getCmp('center').remove("info_add");
};