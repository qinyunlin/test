var project_add_form, win;
var uploadIWin, uploadFWin, relatedProWin;
var pid;
var relatedProStore, proStore, sortStore, infoStore, fieldSet;
var oriPicPath;// 初始图片路径
var department, department_ds;// 相关单位
var projectId;
var pname, ds, proInfo = {};

var stageStore, buildTypeStore;
var stageMap = new Map(), buildTypeMap = new Map();
var stageCombo, buildTypeCombo;
var stage, buildType;
var stagePath, buildTypePath;
var zhcn = new Zhcn_Select();
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
	department_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/project/ProjectServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "type", "ename"]),
				baseParams : {
					method : 'getProjectTogether',
					pid : projectId
				},
				// countUrl : '/project/ProjectServlet',
				// countParams : {
				// content : "islock~0",
				// degree : 8,
				// type : 32
				// },
				remoteSort : true
			});
	department_ds.load();
	department = new Ext.form.FieldSet({
				title : '相关单位',
				layout : 'form',
				width : 790,
				autoHeight : true,
				items : [new Ext.grid.GridPanel({
							autoWidth : true,
							id : 'dep_grid',
							store : department_ds,
							height : 300,
							autoScroll : true,
							viewConfig : {
								forceFit : true
							},
							columns : [{
										header : '类型',
										dataIndex : 'type',
										renderer : changeDepartment
									}, {
										header : '企业名称',
										dataIndex : 'ename'
									}, {
										header : 'id',
										dataIndex : 'id',
										hidden : true
									}],
							tbar : [{
										text : '添加',
										icon : '/resource/images/add.gif',
										hidden : compareAuth('PROJ_MOD'),
										handler : showDepartmentArea
									}, {
										text : "删除",
										icon : "/resource/images/delete.gif",
										hidden : compareAuth('PROJ_MOD'),
										handler : delOP
									}]
						})]
			});
	Ext.getCmp('dep_grid').on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});

	// 省份城市级联选择
	var pro =  zhcn.getProvince(true);
	var city = [];
	var area=[];
	var comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
				store : pro,
				width : 180,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				emptyText : '请选择',
				editable : false,
				triggerAction : 'all',
				allowBlank : true,
				readOnly : true,
				fieldLabel : '省',
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						city=zhcn.getCity(province);
						comboCities.store.loadData(city);
						comboCities.enable();
						
					}
				}

			});
	var comboCities = new Ext.form.ComboBox({
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
				allowBlank : true,
				readOnly : true,
				fieldLabel : '市',
				name : 'region',
			
				listeners : {
					select : function(combo, record, index) {
						comboAretes.reset();
						var area_db = combo.getValue();
						area=zhcn.getArea(area_db);
						comboAretes.store.loadData(area);
						comboAretes.enable();
					}
				}

			});
			
			var comboAretes = new Ext.form.ComboBox({
				id : 'comboAretes',
				store : area,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				emptyText : '请选择',
				hiddenName : 'area',
				editable : false,
				triggerAction : 'all',
				readOnly : true,
				fieldLabel : '区(县)',
				name : 'area',
				allowBlank : true,
				width : 180

			});
			
	project_add_form = new Ext.form.FormPanel({
		border : false,
		layout : 'table',
		layoutConfig : {
			columns : 1
		},
		// layout : 'form',
		width : 803,
		autoHeight : true,
		frame : true,
		buttonAlign : 'left',
		labelAlign : 'right',
		items : [{
					xtype : 'textfield',
					inputType : 'hidden',
					id : 'id',
					name : 'id'
				}, {
					layout : 'table',
					layoutConfig : {
						columns : 3
					},
					items : [{
						xtype : "fieldset",
						title : "基本信息",
						width : 616,
						autoHeight : true,
						height: 280,
						layout : "table",
						layoutConfig : {
							columns : 2
						},
						items : [{
									layout : 'form',
									labelWidth : 98,
									colspan : 2,
									items : {
										id : 'name',
										name : 'name',
										fieldLabel : '项目名称',
										xtype : "textfield",
										allowBlank : false,
										width : 460
									}
								}, {
									layout : 'form',
									height : 26,
									labelWidth : 98,
									items : {
										id : 'tags',
										name : 'tags',
										fieldLabel : 'Tag标签',
										xtype : "textfield",
										width : 180
									}
								}, {
									layout : 'form',
									height : 26,
									labelWidth : 98,
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
									labelWidth : 98,
									height : 26,
									items : comboProvinces
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : comboCities
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : comboAretes
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : stageCombo
									/*
									 * { id : 'stage', name : 'stage',
									 * fieldLabel : '项目阶段', allowBlank : false,
									 * xtype : "textfield", width : 155 }
									 */
							}	, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : new Ext.form.ComboBox({
												id : 'type',
												name : 'type',
												mode : 'local',
												hiddenId : 'typeId',
												hiddenName : 'typeId',
												readOnly : true,
												triggerAction : 'all',
												fieldLabel : '项目类型',
												allowBlank : false,
												emptyText : '请选择',
												width : 180,
												valueField : 'value',
												displayField : 'text',
												store : new Ext.data.SimpleStore(
														{
															fields : ['value',
																	'text'],
															data : [
																	['新建', '新建'],
																	['改建', '改建'],
																	['扩建', '扩建']]
														}),
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
								}

								, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : buildTypeCombo
									/*
									 * { id : 'buildType', name : 'buildType',
									 * fieldLabel : '建筑类型', allowBlank : false,
									 * xtype : "textfield", width : 155 }
									 */
							}	, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : {
										id : 'addr',
										name : 'addr',
										fieldLabel : '项目地址',
										xtype : "textfield",
										width : 180
									}
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : {
										id : 'regNum',
										name : 'regNum',
										fieldLabel : '批准文号',
										xtype : "textfield",
										width : 180
									}
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : {
										id : 'approval',
										name : 'approval',
										fieldLabel : '审批单位',
										xtype : "textfield",
										width : 180
									}
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : {
										id : 'scope',
										name : 'scope',
										fieldLabel : '项目规模',
										xtype : "textfield",
										width : 180
									}
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
									items : {
										id : 'investment',
										name : 'investment',
										fieldLabel : '投资额（万）',
										xtype : "textfield",
										width : 180
									}
								}, {
									layout : 'form',
									labelWidth : 98,
									height : 26,
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
															fieldLabel : '是否重点',
															boxLabel : '是',
															inputValue : '1',
															width : 50,
															name : 'isFocus'

														}),
														new Ext.form.Radio({
																	id : 'isFocus0',
																	boxLabel : '否',
																	inputValue : '0',
																	name : 'isFocus',
																	width : 50,
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
															fieldLabel : '是否专题',
															boxLabel : '是',
															inputValue : '1',
															width : 50,
															name : 'isTop'
														}),
														new Ext.form.Radio({
																	id : 'isTop0',
																	boxLabel : '否',
																	inputValue : '0',
																	name : 'isTop',
																	width : 50,
																	checked : true
																})]
											}]
								}

						]
					}, {
						width : 3,
						bodyStyle : 'border:none'
					}, {
						xtype : "fieldset",
						title : "标题图片",
						width : 170,
						height : 280,
						items : [{
							layout : 'form',
							items : [{
								html : '<img id="picPath" src="" width="150px" height="150px" />'
							}, {
								layout : 'table',
								items : [{
											xtype : "button",
											text : '修改',
											handler : function() {
												showUploadIWin();
											}
										}]
							}]
						}]
					}]
				}, {
					xtype : "fieldset",
					title : "项目简介",
					width : 790,
					colspan : 2,
					items : [{
								layout : 'table',
								labelAlign : 'top',
								items : [{
											xtype : 'htmleditor',
											id : 'description',
											width : 770,
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
											height : 100,
											maxLength : 500
										}]
							}]
				}, department],
		buttons : [{
					text : '提交',
					hidden : compareAuth('PROJ_MOD'),
					handler : updateProject
				}, {
					text : '查看相关信息',
					handler : linkInfo
				}, {
					text : '关闭',
					handler : function() {
						window.parent.Ext.getCmp('center')
								.remove("project_edit");
					}
				}]
	});

	new Ext.Panel({
				border : false,
				frame : true,
				layout : 'form',
				renderTo : 'project_add',
				items : project_add_form

			});

};

/* 上传图片 */
var view, chooser;
var showUploadIWin = function() {
	chooser = new ImageDetail({
				url : '/Project/ProjPicServlet',
				width : 780,
				height : 470,
				method : 'list',
				pid : projectId,
				proInfo : proInfo
			});
	chooser.show();
};

// 上传图片
function uploadImg() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestId = projectId;
	FileUpload_Ext.requestType = "RS_PROJ";
	FileUpload_Ext.initComponent();
};
function upload_fn() {

	savePic(FileUpload_Ext.callbackMsg);
};
// 保存上传图片信息
function savePic(path) {
	Ext.Ajax.request({
				url : '/Project/ProjPicServlet',
				params : {
					method : 'update',
					path : path,
					id : projectId,
					desc : '',
					name : ''
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.fly('picPath').dom.src = FileUpload_Ext.requestURL
								+ FileUpload_Ext.callbackMsg;
					}

				},
				failure : function() {
					Warn_Tip();
				}
			});
};

/* end 上传图片 */

/* 更新项目 */
var updateProject = function() {
	if (!project_add_form.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按照要求填写内容");
		return;
	}
	var isFocus = project_add_form.form.findField("isFocus").getGroupValue();
	var isTop = project_add_form.form.findField("isTop").getGroupValue();
	// alert(isFocus);

	var projectId = Ext.fly("id").getValue();
	var name = Ext.fly("name").getValue();
	var tags = Ext.fly("tags").getValue();
	var province = Ext.fly("comboProvinces").getValue() != "请选择" ? Ext
			.fly("comboProvinces").getValue() : "";
	var area =Ext.fly("comboAretes").getValue() != "请选择" ? Ext
			.fly("comboAretes").getValue() : "";
	var region = Ext.fly("comboCities").getValue() != "请选择" ? Ext
			.fly("comboCities").getValue() : "";
	var type = Ext.fly("type").getValue();
	var addr = Ext.fly("addr").getValue();
	var regNum = Ext.fly("regNum").getValue();
	var approval = Ext.fly("approval").getValue();
	var scope = Ext.fly("scope").getValue();
	var description = Ext.fly("description").getValue();
	var investment = Ext.fly("investment").getValue();

	var stageId = stageCombo.getValue();
	if (Ext.isEmpty(stageId)) {
		if (Ext.isEmpty(stagePath)) {
			Ext.Msg.alert("提示", "请选择项目阶段");
			return;
		}
	} else {
		stage = stageMap.get(stageId);
		stageStore.each(function(s) {
					if (s.data.id == stageId) {
						stagePath = s.data.path;
					}
				});
	}
	var buildTypeId = buildTypeCombo.getValue();
	if (Ext.isEmpty(buildTypeId)) {
		if (Ext.isEmpty(buildTypePath)) {
			Ext.Msg.alert("提示", "请选择建筑类型");
			return;
		}
	} else {
		buildType = buildTypeMap.get(buildTypeId);
		buildTypeStore.each(function(s) {
					if (s.data.id == buildTypeId) {
						buildTypePath = s.data.path;
					}
				});
	}
	var buildDate = Ext.get("buildDate").getValue();
	var mainMaterial = Ext.get("mainMaterial").getValue();
	var content = getPackData(["name", "tags", "addr", "regNum", "approval",
					"scope", "investment", "summary", 'projCost'], "content");
	content += ";province~" + province + ";area~"+area+";region~" + region + ";stage~"
			+ stage + ";stagePath~" + stagePath + ";type~" + type + ";isFocus~"
			+ isFocus + ";isTop~" + isTop + ";buildType~" + buildType
			+ ";buildTypePath~" + buildTypePath + ";buildDate~" + buildDate;
	content += ";pid~" + pid;
	var data = {};
	data["id"] = projectId;
	data["content"] = content;
	data["desc"] = description;
	data["mainMaterial"] = mainMaterial;
	refer(data, '修改项目');
}

// 更新信息
var refer = function(data, msg) {
	data["method"] = "update";
	Ext.Ajax.request({
				method : 'post',
				url : '/project/ProjectServlet',
				params : data,
				timeout : 2 * 60 * 1000,
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", msg + "成功！");
						if (parent.tab_0702_iframe)
							parent.tab_0702_iframe.ds.reload();
					} else {
						Ext.MessageBox.alert(msg + "失败！");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
}

/* 初始化数据 */
var initInfo = function() {
	var data = "";
	data = "method=get&id=" + projectId;
	Ext.lib.Ajax.request('post', '/project/ProjectServlet', {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			var result = data.result;
			if (data && data.state == 'success') {
				pname = data.result['name'];
				project_add_form.getForm().setValues(result);
				Ext.get("buildDate").dom.value = result["buildDate"] ? trimDate(result["buildDate"]) : "";
				if (result["isFocus"] == "1") {
					Ext.get("isFocus1").dom.checked = true
				} else {
					Ext.get("isFocus0").dom.checked = true
				}
				if (result["isTop"] == "1") {
					Ext.get("isTop1").dom.checked = true
				} else {
					Ext.get("isTop0").dom.checked = true
				}
				if (result["flagPic"] != null) {
					oriPicPath = FileUpload_Ext.requestURL
							+ result["flagPic"].replace(/\/\//g, "/");
					Ext.get("picPath").dom.src = oriPicPath;
				}
				if (!Ext.isEmpty(result["province"])) {
					Ext.get("comboProvinces").dom.value = result["province"];
				}
				if(!Ext.isEmpty(result["region"]))
				{
				    Ext.get("comboCities").dom.value=result["region"];
				}
				if(!Ext.isEmpty(result["area"]))
				{
				    Ext.get("comboAretes").dom.value=result["area"]
				}
				
				pid = result["pid"];

				stage = result["stage"];
				var stageStr = " ├ " + result["stage"];;
				if (!Ext.isEmpty(result['stagePath'])) {
					stagePath = result['stagePath'];
					for (var i = 0; i < result["stagePath"].split("/").length
							- 3; i++) {
						stageStr = " │ " + stageStr;
					}
				}
				Ext.get("stageCombo").dom.value = stageStr;

				buildType = result["buildType"];
				var buildTypeStr = " ├ " + result["buildType"];;
				if (!Ext.isEmpty(result['buildTypePath'])) {
					buildTypePath = result['buildTypePath'];
					for (var i = 0; i < result["buildTypePath"].split("/").length
							- 3; i++) {
						buildTypeStr = " │ " + buildTypeStr;
					}
				}
				Ext.get("buildTypeCombo").dom.value = buildTypeStr;
				Ext.get("summary").dom.value=result["summary"];
				proInfo["flagPic"] = result["flagPic"];
				proInfo["name"] = result["name"];
				
			} else {
				alert("获取信息失败！");
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	}, data);
};

// 相关信息
function linkInfo() {
	var tagsAll = Ext.fly("tags").getValue();
	if (isEmpty(tagsAll)) {
		tagsAll = "";
		Ext.Msg.alert("提示", "标签为空,没有相关信息");
		return;
	}
	window.parent.createNewWidget("link_info", '相关信息',
			'/module/info/info_manage.jsp?link=1&tagsAll=' + tagsAll);
};
// 查看相关信息
/*
 * function showinfoedit(id) { window.parent.createNewWidget("info_edit",
 * '修改信息', '/module/info/info_edit.jsp?infoId=' + id); };
 */
// 初使化
var init = function() {
	projectId = getCurArgs("id");
	Ext.QuickTips.init(true);
	buildFormPanel();
	initInfo();
	Ext.TipSelf.msg('提示', '填写标签可自动关联标签相同的信息。');
};
// 显示相关单位区域
function showDepartmentArea() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"phone", "createOn"]),
				baseParams : {
					page : 1,
					type : 2,
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 9
				},
				remoteSort : true
			});

	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	var grid = new Ext.grid.GridPanel({
				store : ds,
				id : 'department_grid',
				autoWidth : true,
				height : parent.Ext.fly('tab_project_edit_iframe').getHeight()
						/ 2,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [sm, new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '企业ID',
							dataIndex : 'eid'
						}, {
							header : '企业名称',
							dataIndex : 'name'
						}, {
							header : '企业简称',
							dataIndex : 'fname'
						}, {
							header : 'ID',
							dataIndex : 'id',
							hidden : true
						}],
				tbar : [{
					xtype : 'combo',
					store : [['eid', '企业id'], ['name', '企业名称'],
							['fname', '企业简称']],
					triggerAction : 'all',
					id : 'query_type',
					value : 'name'
				}, {
					xtype : 'textfield',
					id : 'query_input'
				}, {
					text : '查询',
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}],
				bbar : pagetool
			});
	win = new Ext.Window({
				title : '添加相关企业',
				modal : true,
				width : 600,
				autoHeight : true,
				items : grid,
				buttons : [{
							text : "企业类型:",
							xtype : 'label'
						}, {
							xtype : 'combo',
							id : 'emp_type',
							store : departmentType,
							triggerAction : 'all',
							allowBlank : false
						}, {
							text : '保存',
							handler : addDepartment
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}],
				listeners : {
					'show' : function() {
						ds.load();
					}
				}
			});
	win.show();
};
function searchlist() {
	var type = Ext.getCmp("query_type").getValue();
	var content = Ext.fly("query_input").getValue();
	ds.baseParams["content"] = type + "~" + content;
	ds.load();
};

// 添加相关单位
function addDepartment() {
	var rows = Ext.getCmp('department_grid').getSelectionModel()
			.getSelections();
	var ids = '';
	for (var i = 0; i < rows.length; i++) {
		ids += rows[i].get('eid') + ',' + rows[i].get("name") + ';';
	}
	ids = ids.slice(0, ids.lastIndexOf(";"));
	var type = Ext.getCmp('emp_type').getValue();
	if (Ext.isEmpty(type)) {
		Info_Tip("请选择企业类型。");
		return;
	}
	Ext.Ajax.request({
				url : '/project/ProjectServlet',
				params : {
					method : 'addTogether',
					pid : projectId,
					pname : pname,
					content : ids,
					type : type
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("添加成功");
						win.close();
						department_ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 删除相关企业
function delOP() {
	Ext.Msg.confirm('确认操作', '您确认要删除选中的信息吗?', function(op) {
				if (op == "yes") {
					var rows = Ext.getCmp('dep_grid').getSelectionModel()
							.getSelections();
					var ids = [];
					for (var i = 0; i < rows.length; i++) {
						ids.push(rows[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/project/ProjectServlet',
								params : {
									method : 'deleteTogether',
									id : ids.toString()
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功");
										department_ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};

// 提取简介
function addSummary() {
	Ext.get("summary").dom.value = Ext.util.Format.trim(Ext.util.Format
			.stripTags(Ext.getCmp("description").getValue()).replace(/&nbsp;/g,
					"")).toString().slice(0, 500);
};
Ext.onReady(init);