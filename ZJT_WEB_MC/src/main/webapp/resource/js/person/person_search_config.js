Ext.onReady(init);
var grid, win, ds, fs;
function init() {
	buildGrid();
};
var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var ds_mem = new Ext.data.SimpleStore({
			fields : [{
						name : 'value'
					}, {
						name : 'text'
					}],
			data : memberDegree_combo
		});
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						text : '添加',

						handler : function() {
							addConfigArea('add')
						}
					}, {
						text : '修改',

						handler : function() {
							addConfigArea('edit');
						}
					}, {
						text : '删除',
						handler : function() {
							delConfig();
						}
					}]
		});
function buildGrid() {
	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/MemberProfileServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "content", "createBy", "createOn",
								"updateBy", "updateOn"]),
				baseParams : {
					type : 6,
					site : 'MC',
					cid : 2
				},
				remoteSort : true
			});
	ds.load();
	var sm = new Ext.grid.CheckboxSelectionModel({
		
	});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoScroll : true,
				sm : sm,
				height : parent.Ext.fly("tab_person_search_config_iframe")
						.getHeight(),
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '创建者',
							sortable : true,
							dataIndex : 'createBy'
						}, {
							header : '创建日期',
							sortable : false,
							dataIndex : 'createOn',
							renderer : trimDate
						}, {
							header : '修改人',
							sortable : false,
							dataIndex : 'updateBy'
						}, {
							header : '修改日期',
							sortable : false,
							dataIndex : 'updateOn'
						}],
				tbar : [{
							text : '添加',
							icon : '/resource/images/add.gif',
							handler : function() {
								addConfigArea('add')
							}
						}, {
							text : '修改',
							icon : '/resource/images/edit.gif',
							handler : function() {
								addConfigArea('edit');
							}
						}, {
							text : '删除',
							icon : '/resource/images/delete.gif',
							handler : delConfig
						}],
				renderTo : 'grid',
				listeners : {
					"rowdblclick" : function() {
						addConfigArea('edit');
					}
				}
			});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});

};

// 保存搜索器条件
function saveSearch() {
	if (fs.getForm().isValid()) {
		var row = grid.getSelectionModel().getSelected();
		var fs_con = "";
		var regdate = '';
		var validate = 'diff=';
		var type = 1;
		var ra = "isvoid=" + fs.form.findField('memType').getGroupValue() + ';';

		fs_con += setUpCondition(fs);
		regdate += dateSetup(Ext.fly('createOn&start').getValue(), Ext
						.fly('createOn&end').getValue(), "createOn", "=")
				+ ";";
		validate += dateSetup(Ext.fly('validDate&start').getValue(), Ext
						.fly('validDate&end').getValue(), "validDate", "~")
				+ ';';
		Ext.Ajax.request({
			url : '/mc/MemberProfileServlet',
			params : {
				type : 5,
				cid : 2,
				name : row.get('name'),
				site : 'MC'
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					if (jsondata.result != null) {
						type = 3;
						id = jsondata.result["id"];
					}
					Ext.Ajax.request({
								url : '/mc/MemberProfileServlet',
								params : {
									cid : 2,
									name : fs.getForm().items.map["name#"]
											.getValue(),
									value : ra + validate + fs_con + regdate,
									type : type,
									id : id
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("搜索器设置成功.");
										ds.reload();
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();
};

// 保存（only）
function saveOnly() {
	if (fs.getForm().isValid()) {
		var row = grid.getSelectionModel().getSelected();
		var fs_con = "";
		var regdate = '';
		var validate = 'diff=';
		var type = 1;
		var ra = "isvoid=" + fs.form.findField('memType').getGroupValue() + ';';

		fs_con += setUpCondition(fs);
		regdate += dateSetup(Ext.fly('createOn&start').getValue(), Ext
						.fly('createOn&end').getValue(), "createOn", "=")
				+ ";";
		validate += dateSetup(Ext.fly('validDate&start').getValue(), Ext
						.fly('validDate&end').getValue(), "validDate", "~");
//		if(validate!=""){
//			ra="isvoid=;";
//		}	
		Ext.Ajax.request({
			url : '/mc/MemberProfileServlet',
			params : {
				cid : 2,
				name : fs.getForm().items.map["name#"].getValue(),
				value : ra + validate +";"+ fs_con + regdate,
				type : 1
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("搜索器设置成功.");
					ds.reload();
					win.close();
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	} else
		Info_Tip();
};

// 绑定搜索器条件
function bindSearch() {
	var row = grid.getSelectionModel().getSelected();
	Ext.Ajax.request({
				url : '/mc/MemberProfileServlet',
				params : {
					type : 4,
					id : row.get("id")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.fly("name#").dom.value = jsondata.result["name"];
						var obj = decodeSearchcontent(jsondata.result["content"]);
						fs.getForm().setValues(obj[0]);
						fs.getForm().setValues(obj[1]);
						// debugger;
						fs.getForm().setValues(decodeDate(obj[1]['createOn'],
								'createOn', false));
						var diff = obj[0]["diff"];
						// debugger;
						fs.getForm().setValues(decodeDate(obj[0]["diff"],
								"diff", true));
						fs.form.findField('memType').setValue(obj[0]["isvoid"]);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 删除配置
function delConfig() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条配置。");
			return;
	}
	var ids = [];
	for (var i = 0; i < row.length; i++) {
		ids.push(row[i].get("id"));
	}
	Ext.Msg.confirm("确认操作", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {	
					Ext.Ajax.request({
								url : '/mc/MemberProfileServlet',
								params : {
									type : 2,
									id : ids.toString()
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功。");
										ids = [];
										ds.reload();
									}
								},
								failure : function() {
								}
							});
				}
			})

};

// 添加区域
function addConfigArea(op) {
	var btn_add = false;
	var btn_edit = false;
	switch (op) {
		case "add" :
			btn_edit = true;
			break;
		case "edit" :
			btn_add = true;
			break;
	}
	fs = new Ext.FormPanel({
				autoWidth : true,
				bodyStyle : 'padding:6px',
				/*
				height : parent.Ext.fly('tab_person_search_config_iframe')
						.getHeight()
						/ 2,
				*/
				height : 220,
				layout : 'table',
				layoutConfig : {
					columns : 2
				},
				items : [{
							colspan : 2,
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'textfield',
								fieldLabel : '搜索器名称',
								width : 340,
								id : 'name#',
								name : 'name',
								allowBlank : false
							}
						}, {
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'combo',
								fieldLabel : '访问区域',
								id : 'province#',
								name : 'province',
								store : getUser_WenProvince(),
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "text",
								readOnly : true,
								displayField : "text",
								width : 128,
								allowBlank : false
							}
						}, {
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'textfield',
								fieldLabel : '会员ID',
								id : 'memberID',
								name : 'memberID'
							}
						}, {
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'combo',
								fieldLabel : '会员类型',
								id : 'degree',
								name : 'degree',
								store : ds_mem,
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								readOnly : true,
								displayField : "text",
								width : 128,
								allowBlank : false
							}

						}, {
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'textfield',
								fieldLabel : '会员名称',
								id : 'trueName',
								name : 'trueName'
							}
						}, {
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'textfield',
								fieldLabel : '公司名称',
								id : 'corpName',
								name : 'corpName'
							}
						}, {
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'textfield',
								fieldLabel : '注册地区',
								id : 'regProvince',
								name : 'regProvince'
							}

						}, {
							layout : 'table',
							layoutConfig : {
								columns : 2
							},
							colspan : 2,
							bodyStyle : 'border:none',
							items : [{
										layout : 'form',
										labelWidth : 80,
										labelAlign : 'right',
										bodyStyle : 'border:none',
										items : {
											xtype : 'datefield',
											width : 128,
											fieldLabel : '注册日期开始',
											format : 'Y-m-d',
											id : 'createOn&start',
											name : 'createOn&start'
										}
									}, {
										layout : 'form',
										labelWidth : 80,
										labelAlign : 'right',
										bodyStyle : 'border:none',
										items : {
											xtype : 'datefield',
											width : 128,
											fieldLabel : '注册日期结束',
											format : 'Y-m-d',
											id : 'createOn&end',
											name : 'createOn&end'
										}
									}]
						}, {
							layout : 'form',
							labelWidth : 80,
							labelAlign : 'right',
							bodyStyle : 'border:none',
							items : {
								xtype : 'textfield',
								fieldLabel : '信息价地区',
								id : 'webArea',
								name : 'webArea'
							}
						}, {
							layout : 'column',
							colspan : 3,
							bodyStyle : 'border:none',
							items : [{
										xtype : "radio",
										boxLabel : "有效会员",
										inputValue : "1",
										name : "memType",
										id : 'val1&'
									}, {
										xtype : "radio",
										boxLabel : "过期会员",
										inputValue : "-1",
										id : 'val2&',
										name : "memType"
									}, {
										xtype : "radio",
										boxLabel : "所有会员",
										inputValue : "0",
										id : 'val3&',
										name : "memType",
										checked : true
									}]
						}, {
							layout : 'table',
							layoutConfig : {
								columns : 2
							},
							colspan : 3,
							id : 'validate_area',
							bodyStyle : 'border:none;',
							items : [{
										layout : 'form',
										labelWidth : 80,
										labelAlign : 'right',
										bodyStyle : 'border:none',
										items : {
											xtype : 'datefield',
											width : 128,
											fieldLabel : '有效日期开始',
											format : 'Y-m-d',
											id : 'validDate&start',
											name : 'validDate&start'
										}
									}, {
										layout : 'form',
										labelWidth : 80,
										labelAlign : 'right',
										bodyStyle : 'border:none',
										items : {
											xtype : 'datefield',
											width : 128,
											fieldLabel : '有效日期结束',
											format : 'Y-m-d',
											id : 'validDate&end',
											name : 'validDate&end'
										}
									}]
						}]
			});
	win = new Ext.Window({
				title : '配置器设置',
				modal : true,
				width : 500,
				autoHeight : true,
				items : fs,
				buttons : [{
							text : '添加',
							handler : saveOnly,
							hidden : btn_add
						}, {
							text : '修改',
							hidden : btn_edit,
							handler : saveSearch
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	if (!btn_edit) {
		bindSearch();
	}
};
