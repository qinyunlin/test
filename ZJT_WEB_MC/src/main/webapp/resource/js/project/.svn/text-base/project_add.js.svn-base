var project_add_form;
var uploadIWin, uploadFWin, relatedProWin;
var infoId, infoPid, pid;
var relatedProStore, proStore, sortStore;
var stageStore, buildTypeStore;
var stageMap = new Map(), buildTypeMap = new Map();
var stageCombo, buildTypeCombo;
var oriPicPath;// 初始图片路径

var projectId;
var zhcn = new Zhcn_Select();
var comboProvinces, comboCities;
var buildFormPanel = function() {
	buildTypeStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/proj/ProjectCatalogServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'name', 'owner', 'path', 'pid', 'type',
								'amount', 'createBy', 'isLeaf']),
				baseParams : {
					type : 1,
					ctype : 'build'
				},
				remoteSort : true
			});

	// 处理返回的数据
	buildTypeStore.loadRecords = function(o, options, success) {
		buildTypeMap = new Map();
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
				buildTypeMap.put(r[i].data.id, r[i].data.name);
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
	};

	buildTypeCombo = new Ext.form.ComboBox({
				id : 'buildTypeCombo',
				width : 180,
				store : buildTypeStore,
				typeAhead : true,
				mode : 'remote',
				triggerAction : 'all',
				valueField : "id",
				displayField : "name",
				readOnly : true,
				fieldLabel : '建筑类型',
				allowBlank : false,
				emptyText : '请选择'
			});

	stageStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/proj/ProjectCatalogServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'name', 'owner', 'path', 'pid', 'type',
								'amount', 'createBy', 'isLeaf']),
				baseParams : {
					type : 1,
					ctype : 'stage'
				},
				remoteSort : true
			});

	// 处理返回的数据
	stageStore.loadRecords = function(o, options, success) {
		stageMap = new Map();
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
				stageMap.put(r[i].data.id, r[i].data.name);
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
	};
	stageCombo = new Ext.form.ComboBox({
				id : 'stageCombo',
				width : 180,
				store : stageStore,
				typeAhead : true,
				mode : 'remote',
				triggerAction : 'all',
				valueField : "id",
				displayField : "name",
				readOnly : true,
				fieldLabel : '项目阶段',
				allowBlank : false,
				emptyText : '请选择'
			});

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
													labelAlign : 'top'

												}]
									}]
						}]
			})
	project_add_form = new Ext.form.FormPanel({
				border : false,
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				width : 803,
				frame : true,
				buttonAlign : 'left',
				labelAlign : 'right',
				items : [{
					xtype : "fieldset",
					title : "基本信息",
					width : 780,
					layout : 'table',
					layoutConfig : {
						columns : 2
					},
					items : [{
								layout : 'form',
								colspan : 2,
								items : {
									id : 'name',
									name : 'name',
									fieldLabel : '项目名称',
									xtype : "textfield",
									allowBlank : false,
									width : 470
								}
							}, {
								layout : 'form',
								items : {
									id : 'tags',
									name : 'tags',
									fieldLabel : 'Tag标签',
									xtype : "textfield",
									width : 180
								}
							}, {
								layout : 'form',
								items : stageCombo
								/*
								 * { id : 'stage', name : 'stage', fieldLabel :
								 * '项目阶段', allowBlank : false, xtype :
								 * "textfield", width : 180 }
								 */
						}	, {
								layout : 'form',
								items : new Ext.form.ComboBox({
											id : 'type',
											name : 'type',
											mode : 'local',
											hiddenId : 'typeId',
											hiddenName : 'typeId',
											readOnly : true,
											triggerAction : 'all',
											fieldLabel : '项目类型',
											emptyText : '请选择',
											width : 180,
											store : new Ext.data.SimpleStore({
														fields : ['value',
																'text'],
														data : [['新建', '新建'],
																['改建', '改建'],
																['扩建', '扩建']]
													}),
											valueField : 'value',
											displayField : 'text',
											emptyText : '新建',
											listeners : {
												select : {
													fn : function() {
														var i = Ext
																.fly("typeId")
																.getValue();

													}
												}
											}
										})
							}, {
								layout : 'form',
								items : buildTypeCombo
								/*
								 * { id : 'buildType', name : 'buildType',
								 * fieldLabel : '建筑类型', allowBlank : false,
								 * xtype : "textfield", width : 180 }
								 */
						}	, {
								layout : 'form',
								items : {
									id : 'addr',
									name : 'addr',
									fieldLabel : '项目地址',
									xtype : "textfield",
									width : 180
								}
							}, {
								layout : 'form',
								items : new Ext.form.DateField({
											id : 'buildDate',
											name : 'buildDate',
											fieldLabel : '立项时间',
											emptyText : '请选择',
											readOnly : true,
											format : 'Y-m-d',
											width : 180
										})
							}, {
								layout : 'form',
								items : comboProvinces
							}, {
								layout : 'form',
								items : comboCities
							}, {
								layout : 'form',
								items : {
									id : 'regNum',
									name : 'regNum',
									fieldLabel : '批准文号',
									xtype : "textfield",
									width : 180
								}
							}, {
								layout : 'form',
								items : {
									id : 'approval',
									name : 'approval',
									fieldLabel : '审批单位',
									xtype : "textfield",
									width : 180
								}
							}, {
								layout : 'form',
								items : {
									id : 'scope',
									name : 'scope',
									fieldLabel : '项目规模',
									xtype : "textfield",
									width : 180
								}
							}, {
								layout : 'form',
								items : {
									id : 'investment',
									name : 'investment',
									fieldLabel : '投资额（万）',
									xtype : "numberfield",
									width : 180
								}
							}, {
								layout : 'form',
								items : {
									id : 'projCost',
									name : 'projCost',
									fieldLabel : '项目工程造价(万)',
									xtype : "numberfield",
									width : 180
								}
							}, {
								layout : 'column',
								bodyStyle : 'text-align:right',
								items : [{
											text : "是否重点:",
											xtype : "label",
											width : 100
										}, {
											layout : 'column',
											items : [
													new Ext.form.Radio({
																id : 'isFocus1',

																boxLabel : '是',
																inputValue : '1',
																name : 'isFocus'
															}),
													new Ext.form.Radio({
																id : 'isFocus0',
																boxLabel : '否',
																inputValue : '0',
																name : 'isFocus',
																checked : true
															})]
										}]
							}, {
								layout : 'column',
								bodyStyle : 'text-align:right',
								items : [{
											text : "是否专题:",
											xtype : 'label',
											width : 100
										}, {
											layout : 'column',
											items : [
													new Ext.form.Radio({
																id : 'isTop1',
																boxLabel : '是',
																inputValue : '1',
																name : 'isTop'
															}),
													new Ext.form.Radio({
																id : 'isTop0',
																boxLabel : '否',
																inputValue : '0',
																name : 'isTop',
																checked : true
															})]
										}]
							}

					]
				}, {
					xtype : "fieldset",
					title : "项目简介",
					width : 780,
					items : [{
								layout : 'table',
								labelAlign : 'top',
								items : [{
											xtype : 'htmleditor',
											id : 'description',
											width : 750,
											height : 450
										}]
							}]
				}, {
					xtype : "fieldset",
					title : "项目概要",
					width : 780,
					items : [{
								xtype : 'button',
								text : '提取摘要',
								handler : addSummary
							}, {
								layout : 'table',
								labelAlign : 'top',
								items : [{
											xtype : 'textarea',
											id : 'summary',
											width : 750,
											height : 100,
											maxLength : 500
										}]
							}]
				}, {
					xtype : "fieldset",
					title : "主要设备材料",
					width : 780,
					items : [{
								layout : 'table',
								labelAlign : 'top',
								items : [{
											xtype : 'htmleditor',
											id : 'mainMaterial',
											width : 750,
											height : 180,
											maxLength : 500
										}]
							}]
				}],
				buttons : [{
							text : '提交',
							handler : updateProject
						}, {
							text : '关闭',
							handler : function() {
								window.parent.Ext.getCmp('center')
										.remove("project_add");
							}
						}]
			});

	new Ext.Panel({
				border : false,
				frame : true,
				layout : 'column',
				renderTo : 'project_add',
				items : [[project_add_form]]
			});
};
/* 更新项目 */
var updateProject = function() {
	if (!project_add_form.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按照要求填写内容");
		return;
	}
	var isFocus = project_add_form.form.findField("isFocus").getGroupValue();
	var isTop = project_add_form.form.findField("isTop").getGroupValue();
	// alert(isFocus);

	var name = Ext.fly("name").getValue();
	var tags = Ext.fly("tags").getValue();
	var province = Ext.fly("comboProvinces").getValue() != "请选择" ? Ext
			.fly("comboProvinces").getValue() : "";
	var region = Ext.fly("comboCities").getValue() != "请选择" ? Ext
			.fly("comboCities").getValue() : "";
			
		
	var type = Ext.fly("type").getValue();
	var addr = Ext.fly("addr").getValue();
	var regNum = Ext.fly("regNum").getValue();
	var approval = Ext.fly("approval").getValue();
	var scope = Ext.fly("scope").getValue();
	var description = Ext.fly("description").getValue();
	var investment = Ext.fly("investment").getValue();
	var buildTypeId = buildTypeCombo.getValue();
	var buildType = buildTypeMap.get(buildTypeId);
	var buildTypePath = "";
	buildTypeStore.each(function(s) {
				if (s.data.id == buildTypeId) {
					buildTypePath = s.data.path;
				}
			});
	var stateId = stageCombo.getValue();
	var stage = stageMap.get(stateId);
	var stagePath = "";
	stageStore.each(function(s) {
				if (s.data.id == stateId) {
					stagePath = s.data.path;
				}
			});
	var buildDate = Ext.get("buildDate").getValue();
	var mainMaterial = Ext.get("mainMaterial").getValue();
	var data = {};
	var content = getPackData(["name", "tags", "addr", "regNum", "approval",
					"scope", "investment", "summary", 'projCost'], "content");
	content += ";province~" + province + ";region~" + region+ ";stage~"
			+ stage + ";stagePath~" + stagePath + ";type~" + type + ";isFocus~"
			+ isFocus + ";isTop~" + isTop + ";buildType~" + buildType
			+ ";buildTypePath~" + buildTypePath + ";buildDate~" + buildDate;
	content += ";isLock~0";
	data["method"] = "add";
	data["content"] = content;
	data["desc"] = description;
	data["mainMaterial"] = mainMaterial;
	submit(data, '添加项目');
}

// 更新信息
var refer = function(data, msg) {
	Ext.lib.Ajax.request('post', '/project/ProjectServlet?method=update', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", msg + "成功！");
					} else {
						Ext.MessageBox.alert(msg + "失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
}

// 提交信息
var submit = function(data) {
	Ext.Ajax.request({
				method : 'post',
				url : '/project/ProjectServlet',
				params : data,
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						parent.tab_0702_iframe.ds.reload();
						Ext.MessageBox.alert("提示", "添加项目成功！", closeWin);
						// project_add_form.form.reset();
						// comboCities.setDisabled(true);
					} else {
						Ext.MessageBox.alert("提示", "添加项目失败!");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

/* 初始化数据 */
var initInfo = function() {
	var data = "";
	data = "method=get&id=" + projectId;
	Ext.lib.Ajax.request('post', '/project/ProjectServlet', {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (json && json.state == 'success') {
						json = json.result;
						Ext.get("id").dom.value = json["id"];
						Ext.get("name").dom.value = json["name"];
						Ext.get("province").dom.value = json["province"];
						Ext.get("stage").dom.value = json["stage"];
						Ext.get("type").dom.value = json["type"];
						Ext.get("buildType").dom.value = json["buildType"];
						Ext.get("addr").dom.value = json["addr"];
						Ext.get("description").dom.value = json["description"];
						Ext.get("regNum").dom.value = json["regNum"];
						Ext.get("approval").dom.value = json["approval"];
						Ext.get("scope").dom.value = json["scope"];
						Ext.get("investment").dom.value = json["investment"];
						if (json["isFocus"] == "1") {
							Ext.get("isFocus1").dom.checked = true
						} else {
							Ext.get("isFocus0").dom.checked = true
						}
						if (json["isTop"] == "1") {
							Ext.get("isTop1").dom.checked = true
						} else {
							Ext.get("isTop0").dom.checked = true
						}

					} else {
						alert("获取信息失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
};

// 提取简介
function addSummary() {
	Ext.get("summary").dom.value = Ext.util.Format.trim(Ext.util.Format
			.stripTags(Ext.getCmp("description").getValue()).replace(/&nbsp;/g,
					"")).toString().slice(0, 500);
};

// 初使化
var init = function() {
	Ext.QuickTips.init(true);
	buildFormPanel();

	// Ext.TipSelf.msg('提示', '只有项目资讯才可以添加相关项目。');
};
Ext.onReady(init);
function closeWin() {
	window.parent.Ext.getCmp('center').remove("project_add");
};