Ext.onReady(init);
var grid, ds, ds2, pageSize = 20, query_type, query_input, query_con, win, row, thiseid, fs, vip_grid, memgrid, memds, empgrid, empds, empwin;
var eidGlobal;
var isShows = [];
var zhcn = new Zhcn_Select();
var query_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["eid", "企业ID"], ["ename", "企业名称"]]
});

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};
// 工具栏
var toolbar = [{
			text : '查看/修改',
			hidden : compareAuth('CREDIT_PURCHASE_EP_DETAIL'),
			handler : editCreditEpAccount,
			icon : '/resource/images/edit.gif'
		}, {
			text : '诚信积分详情',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth('CREDIT_PURCHASE_EP_SCORE_DETAIL'),
			handler : openCreditScoreDetail
		}, {
			text : '添加诚信采购商',
			hidden : compareAuth('CREDIT_PURCHASE_EP_ADD'),
			handler : addCreditEpAccount,
			icon : '/resource/images/edit.gif'
		}];
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : toolbar
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "ename", "degree", "updateBy",
								"updateOn", "createOn", "mod_Ask", "mod_Mat",
								"mod_Proj", "mod_Sup", "mod_Sup_Cat",
								"mod_Sys", "mod_Users","province","city", "validDate","isLock","auditor","auditDate","effectDate","isIntegrity","creditScore","authContent"]),
				baseParams : {
					page : 1,
					type : 17,
					pageSize : pageSize
				},
				countUrl : '/ep/EpAccountServlet',
				countParams : {
					type : 18
				},
				remoteSort : true
			});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				clicksToEdit : 1,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
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
							header : '企业名称',
							sortable : true,
							width : 160,
							dataIndex : 'ename',
							renderer : function(value, metaData, record){
								var name = record.get("ename");
								/*var isIntegrity = record.get("isIntegrity");
								if(isIntegrity ==1){
									return "<span style='float:left;'><img src='/resource/images/icon_cheng.gif'></span>" + name;
								}*/
								return name;
							}
						}, {
							header : '区域',
							sortable : true,
							dataIndex : 'area',
							renderer : function(value, metaData, record){
								var province = record.get("province");
								var city = record.get("city");
								if (province == null) province = "";
								if (city == null) city = "";
								return province + " " + city;
							}
						}, {
							header : '诚信积分',
							sortable : true,
							dataIndex : 'creditScore'
						}, {
							header : '认证年限',
							sortable : false,
							width : 50,
							dataIndex : 'authContent',
							renderer : function(value, metaData, record){
								var authContent = record.get("authContent");
								if (authContent == null || "" == authContent) return "";
								var authContentArr = authContent.split(";");
								return authContentArr.length + "年";
							}
						}, {
							header : '最新认证时间',
							sortable : true,
							width : 120,
							//dataIndex : 'authContent',
							dataIndex : 'auditDate',
							renderer : function(value, metaData, record){
								var authContent = record.get("authContent");
								var auditDate = record.get("auditDate");
								if (authContent == null || "" == authContent) return "";
								var authContentArr = authContent.split(";");
								var tipMsg = "";
								for (var i = authContentArr.length, j = 0; i > j; i --){
									var curr_content = authContentArr[i - 1];
									var dateArr = curr_content.split("-");
									var curr_year = dateArr[0];
									var curr_month = dateArr[1];
									tipMsg += "&nbsp;&nbsp;&nbsp;<B>第" + (i) + "年</B> &nbsp;&nbsp;&nbsp;";
									tipMsg += curr_year + "年" + curr_month + "月认证&nbsp;&nbsp;&nbsp;</br>";
								}
								
								tipMsg = "<b><B>认证详情：</B></b></br>" + tipMsg;
								var trimtext = new cycleTrim();
								var temp = trimtext.cycleTrim(tipMsg, 60);
								trimtext.init();
								// meta.attr = 'ext:qtitle="' + '' + '"' + '
								// ext:qwidth=500 ext:qtip="' + notes + '"';
								metaData.attr = 'ext:qtitle="' + '' + '"'
										+ ' ext:qtip="' + tipMsg + '"';
								//return authContentArr[authContentArr.length - 1];
								if (auditDate == null || "" == auditDate) return "";
								return auditDate;
							}
						}, {
							header : '有效时间',
							sortable : true,
							width : 150,
							dataIndex : 'effectDate'
						}],
				tbar : toolbar,
				bbar : pagetool,
				renderTo : 'grid'
			});
	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = ["全部城市"];
	var comboProvinces = new Ext.form.ComboBox({
				id : 'province',
				store : pro,
				width : 80,
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						if(province =="全部省份")
						{
							city=["全部城市"];
							
					    }
					    else
					    {
						    city = zhcn.getCity(province).concat();
						    city.unshift("全部城市");
					    }
						comboCities.store.loadData(city);
						comboCities.enable();
						searchlist();
					}
				},

				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部省份',
				editable : false,
				triggerAction : 'all',
				allowBlank : false,
				readOnly : true,
				fieldLabel : '请选择省份'
			});

	var comboCities = new Ext.form.ComboBox({
				id : 'city',
				store : city,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部城市',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				readOnly : true,
				fieldLabel : '选择城市',
				name : 'region',
				disabled : true,
				allowBlank : false,
				width : 80,
				listeners : {
					'select' : searchlist
				}

			});
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
					xtype : "combo",
					id : 'query_key',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 100,
					editable : false,
					store : query_ds,
					value : "eid"
				}, {
							xtype : "textfield",
							id : "query_input",
							fieldLabel : "关键字",
							width : 100,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, "-", {
							text : "查询",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						},'-',{
							xtype : "label",
							text : "省份："
						},comboProvinces,{
							xtype : "label",
							text : "城市："
						},comboCities]
			});

	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		editCreditEpAccount();
			});
};
// 步骤切换
var cardNav = function(incr) {
	var l = Ext.getCmp('card-wizard-panel').getLayout();
	var i = l.activeItem.id.split('card-')[1];
	var next = parseInt(i, 10) + incr;
	if (!Ext.isEmpty(Ext.getCmp("card-0"))) {
		var row = Ext.getCmp("card-0").getSelectionModel().getSelected();
		if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}
	}
	if (next == 1) {
		checkVip(next);

	} else if (next == 2) {
		var sels = Ext.getCmp("card-1").getSelectionModel().getSelections();
		var mids = [];
		for (var i = 0; i < sels.length; i++) {
			isShows.push(sels[i].get("name"));
		}
		l.setActiveItem(next);
		Ext.getCmp('card-prev').setDisabled(next == 0);
		Ext.getCmp('card-next').setDisabled(next == 2);
		Ext.fly("emp_name").replaceWith({
			id : 'emp_name',
			tag : 'div',
			style : 'color:red;font;font-weight:bold;margin:0 auto;text-align:center;margin-bottom:4px;font-size:14px;',
			html : row.get("name")
		});
		Ext.getCmp("eid").setValue(row.get("eid"));
	} else {
		l.setActiveItem(next);
		Ext.getCmp('card-prev').setDisabled(next == 0);
		Ext.getCmp('card-next').setDisabled(next == 2);
	}
};
// 开通VIP库
function openVipLib() {
	empds = new Ext.data.SelfStore({
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
					pageSize : pageSize
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					content : "islock~0",
					type : 9
				},
				remoteSort : true
			});

	var pagetool = new Ext.ux.PagingToolbar({
				store : empds,
				displayInfo : true,
				pageSize : 20
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	var tbar = [new Ext.form.ComboBox({
				mode : "local",
				triggerAction : "all",
				id : 'condition',
				width : 80,
				store : [["eid", "企业id"], ["name", "企业名称"], ["fname", "企业简称"],
						["area", "所在地区"]],
				triggerAction : "all",
				value : 'name'

			}), "-", {
		xtype : "label",
		text : "关键字："
	}, {
		xtype : "textfield",
		textLabel : "关键字",
		id : "searchtitle",
		width : 220,
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
	}];
	empgrid = new Ext.grid.GridPanel({
				id : 'card-0',
				store : empds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : parent.Ext.get("tab_0303_iframe").getHeight() / 2,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
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
							width : 240,
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
							header : '联系电话',
							sortable : false,
							dataIndex : 'phone'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : tbar,
				bbar : pagetool
			});
	var ds_vip = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["name", "value"]),
				baseParams : {
					eid : thiseid,
					type : 14

				},
				remoteSort : true
			});
	ds_vip.load();
	var cs = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "value",
				handleMouseDown : Ext.emptyFn
			});
	var vip_module = new Ext.grid.GridPanel({
				id : 'card-1',
				store : ds_vip,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : cs,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cs, {
							header : '模块名称',
							sortable : false,
							dataIndex : 'name'

						}]
			});
	var form = new Ext.form.FormPanel({
		id : 'card-2',
		layout : "form",
		bodyStyle : 'padding:6px;',
		autoWidth : true,
		autoHeight : true,
		labelWidth : 160,
		labelAlign : 'right',
		frame : true,
		border : true,
		buttonAlign : 'right',
		items : [{
					id : 'emp_name',
					xtype : 'label'
				}, {
					id : 'eid',
					name : 'eid',
					xtype : 'hidden'
				}, {
					xtype : 'combo',
					id : "degree",
					name : "degree",
					store : [['8', 'VIP会员'], ['9', '企业会员']],
					triggerAction : "all",
					value : "8",
					width : 220,
					readOnly : true,
					fieldLabel : '企业等级',
					listeners : {
						"select" : function(combo) {
							switch (combo.value) {
								case "8" :
									Ext.getCmp("mod_Ask")
											.setValue(jifenConfig["mod_Ask"]);
									Ext.getCmp("mod_Mat")
											.setValue(jifenConfig["mod_Mat"]);
									Ext.getCmp("mod_Proj")
											.setValue(jifenConfig["mod_Proj"]);
									Ext.getCmp("mod_Sup")
											.setValue(jifenConfig["mod_Sup"]);
									Ext
											.getCmp("mod_Sup_Cat")
											.setValue(jifenConfig["mod_Sup_Cat"]);
									Ext.getCmp("mod_Users")
											.setValue(jifenConfig["mod_Users"]);
									Ext.getCmp("mod_Sys")
											.setValue(jifenConfig["mod_Sys"]);
									break;
								case "9" :
									Ext.getCmp("mod_Ask").setValue(Math
											.floor(jifenConfig["mod_Ask"] / 2));
									Ext.getCmp("mod_Mat").setValue(Math
											.floor(jifenConfig["mod_Mat"] / 2));
									Ext
											.getCmp("mod_Proj")
											.setValue(Math
													.floor(jifenConfig["mod_Proj"]
															/ 2));
									Ext.getCmp("mod_Sup").setValue(Math
											.floor(jifenConfig["mod_Sup"] / 2));
									Ext.getCmp("mod_Sup_Cat").setValue(Math
											.floor(jifenConfig["mod_Sup_Cat"]
													/ 2));
									Ext
											.getCmp("mod_Users")
											.setValue(Math
													.floor(jifenConfig["mod_Users"]
															/ 2));
									Ext.getCmp("mod_Sys").setValue(Math
											.floor(jifenConfig["mod_Sys"] / 2));
									break;
							}
						}
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'ask_area',
					hidden : true,
					items : {
						xtype : 'numberfield',
						id : 'mod_Ask',
						name : 'mod_Ask',
						width : 220,
						fieldLabel : '询价数量设置',
						allowBlank : false,
						value : jifenConfig["mod_Ask"],
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'mat_area',
					hidden : true,
					items : {
						xtype : 'numberfield',
						id : 'mod_Mat',
						name : 'mod_Mat',
						width : 220,
						fieldLabel : '材价库材料数量设置',
						allowBlank : false,
						value : jifenConfig["mod_Mat"],
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'pro_area',
					hidden : true,
					items : {
						xtype : 'numberfield',
						id : 'mod_Proj',
						name : 'mod_Proj',
						width : 220,
						fieldLabel : '项目库材料数量设置',
						allowBlank : false,
						value : jifenConfig["mod_Proj"],
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'sup_area',
					hidden : true,
					items : {
						xtype : 'numberfield',
						id : 'mod_Sup',
						name : 'mod_Sup',
						width : 220,
						fieldLabel : '供应商库供应商数量设置',
						allowBlank : false,
						value : jifenConfig["mod_Sup"],
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'container',
					layout : 'form',
					id : 'supC_area',
					hidden : true,
					items : {
						xtype : 'numberfield',
						id : 'mod_Sup_Cat',
						name : 'mod_Sup_Cat',
						width : 220,
						fieldLabel : '供应商库目录层级数量设置',
						allowBlank : false,
						value : jifenConfig["mod_Sup_Cat"],
						minValue : 0,
						allowNegative : false,
						allowDecimals : false
					}
				}, {
					xtype : 'numberfield',
					id : 'mod_Users',
					name : 'mod_Users',
					width : 220,
					fieldLabel : 'VIP会员数量设置',
					allowBlank : false,
					value : jifenConfig["mod_Users"],
					minValue : 1,
					allowNegative : false,
					allowDecimals : false
				}, {
					xtype : 'numberfield',
					id : 'mod_Sys',
					name : 'mod_Sys',
					width : 220,
					fieldLabel : '用户组层级数量设置',
					allowBlank : false,
					value : jifenConfig["mod_Sys"],
					minValue : 1,
					allowNegative : false,
					allowDecimals : false
				}, {
					id : 'startDate',
					xtype : 'datefield',
					name : 'startDate',
					width : 220,
					fieldLabel : '开始日期',
					allowBlank : false,
					format : 'Y-m-d',
					vtype : 'daterange',
					endDateField : "validDate",
					value : now
				}, {
					id : 'validDate',
					xtype : 'datefield',
					name : 'validDate',
					width : 220,
					fieldLabel : '有效期',
					allowBlank : false,
					format : 'Y-m-d',
					vtype : 'daterange',
					startDateField : 'startDate'
				}],
		buttons : [{
					text : '确定',
					handler : openAction
				}, {
					text : '关闭',
					handler : function() {
						Ext.getCmp("empAdd_Win").close();
					}
				}],
		listeners : {
			"show" : function() {
				var len = isShows.length;
				for (var i = 0; i < len; i++) {
					switch (isShows[i]) {
						case "询价库" :
							Ext.getCmp("ask_area").setVisible(true);
							break;
						case "材料库" :
							Ext.getCmp("mat_area").setVisible(true);
							break;
						case "供应商库" :
							Ext.getCmp("sup_area").setVisible(true);
							Ext.getCmp("supC_area").setVisible(true);
							break;
					}
				}
			}
		}
	});
	var empWizard = {
		id : 'card-wizard-panel',
		layout : 'card',
		activeItem : 0,
		defaults : {
			border : false,
			frame : true
		},
		bbar : ['->', {
					id : 'card-prev',
					text : '&laquo; 上一步',
					handler : cardNav.createDelegate(this, [-1]),
					disabled : true
				}, {
					id : 'card-next',
					text : '下一步 &raquo;',
					handler : cardNav.createDelegate(this, [1])
				}],
		items : [empgrid, vip_module, form]
	}
	empwin = new Ext.Window({
				id : 'empAdd_Win',
				modal : true,
				resizable : true,
				width : parent.Ext.get("tab_0303_iframe").getWidth() / 2,
				autoHeight : true,
				title : "开通VIP库",
				items : empWizard
			});
	empds.load();
	empwin.show();
};
// 查询
function searchlist() {
	var query_key = Ext.getCmp("query_key").getValue();
	var query_value = Ext.getCmp("query_input").getValue();
	var content = query_key + "~" + query_value + ";";
	
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		content += "province~" + province;
		
		if(city != "全部城市"){
			content += ";city~" + city;
		}
	}
	
	ds.baseParams['content'] = content;
	ds.load();
};

// 查询企业
function searchEmpList() {
	var query = Ext.getCmp("condition").getValue() + "~"
			+ Ext.fly("searchtitle").getValue() + ";islock~0";

	empds.baseParams["content"] = query;
	empds.countParams["content"] = query;
	empds.load();
};
// 获得企业权限
function getEmpAuth() {
	row = grid.getSelectionModel().getSelected()
			|| Ext.getCmp("card-1").getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	thiseid = row.get("eid");
	Ext.lib.Ajax.request("post", "/ep/EpAccountServlet?type=13", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						showVipModule(thiseid, jsondata.result);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "eid=" + thiseid);
};

// 显示VIP模块控制区域
function showVipModule(thiseid, obj) {
	row = grid.getSelectionModel().getSelected();
	ds2 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["name", "value"]),
				baseParams : {
					eid : thiseid,
					type : 14

				},
				remoteSort : true
			});
	ds2.load();
	ds2.on('load', function(store, records, options) {
				var arr = [];
				for (var i = 0; i < records.length; i++) {

					var record = records[i];
					var isMatch = obj.indexOf(record.get('name')) != -1;
					if (isMatch) {
						arr.push(record);
					}
				}
				cs.selectRecords(arr);
			}, this, {
				delay : 500
			})
	var cs = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "value",
				handleMouseDown : Ext.emptyFn
			});
	vip_grid = new Ext.grid.GridPanel({

				store : ds2,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : cs,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cs, {
							header : '模块名称',
							sortable : false,
							dataIndex : 'name'

						}]
			});
	win = new Ext.Window({
				title : "<font style='color:red'>" + row.get("ename")
						+ "</font>&nbsp;&nbsp;&nbsp;&nbsp;VIP模块控制",
				width : 420,
				autoHeight : true,
				closable : true,
				closeAction : "close",
				modal : true,
				items : [vip_grid],
				buttons : [{
							text : "保存",
							handler : function() {
								setAuth(thiseid);
							}
						}, {
							text : "取消",
							handler : function() {
								win.close();
							}
						}]

			});
	win.show();
};

// 设定VIP模块权限
function setAuth(thisid) {
	var sels = vip_grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("value"));
	}
	Ext.Msg.confirm("提示", "您确定要保存此设置?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/ep/EpAccountServlet?type=12", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("模块设置成功。");
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "eid=" + thisid + "&codes=" + mids.toString());
				}
			});
};
// 设定VIP模块权限
function setAuth_add(thisid) {

	var sels = Ext.getCmp("card-1").getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("value"));
	}
	Ext.lib.Ajax.request("post", "/ep/EpAccountServlet?type=12", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "eid=" + thisid + "&codes=" + mids.toString());

};

// 导入供应商模板
function importArea() {
	importBol = true;
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.Ajax.request({
				url : '/ep/EnterpriseTempCatalogServlet',
				params : {
					type : 7
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						var len = json.result.length;
						var data = json.result;
						var cmb_array = [];
						for (var i = 0; i < len; i++) {
							cmb_array.push("['" + data[i]["type"] + "','"
									+ data[i]["owner"] + "']");
						}
						cmb_array = eval("([" + cmb_array + "])");
						fs = new Ext.FormPanel({
									layout : 'form',
									autoWidth : true,
									height : 80,
									labeiWidth : 60,
									bodyStyle : 'padding:6px;',
									items : [{
												fieldLabel : '模板名称',
												xtype : 'combo',
												store : cmb_array,
												id : 'tempname',
												triggerAction : "all",
												valueField : "value",
												displayField : "text",
												allowBlank : false,
												emptyText : '请选择模板名称'
											}, {
												fieldLabel : '分类名称',
												xtype : 'textfield',
												id : 'temp_cname',
												width : 162,
												allowBlank : false,
												blankText : '请选择材料分类',
												value : '中建普联推荐'
											}]
								});
						win = new Ext.Window({
									title : '导入模板',
									mode : true,
									width : 340,
									autoHeight : true,
									items : fs,
									modal : true,
									border : false,
									plain : true,
									buttonAlign : 'right',
									buttons : [{
												text : '导入',
												handler : function() {
													importTemplate(row
															.get("eid"));
												}
											}, {
												text : '取消',
												handler : function() {
													win.close();
												}
											}]
								});
						win.show();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});

};

var importBol = true;
// 导入
function importTemplate(thiseid) {
	if (!importBol)
		return;
	if (fs.getForm().isValid()) {

		// Ext.Msg.progress("提示","导入中...","waiting...");
		Ext.Msg.wait("导入中...", "提示");
		Ext.Ajax.request({
			url : '/ep/EpTemplateServlet',
			params : {
				type : 1,
				eid : thiseid,
				tempType : fs.getForm().items.map["tempname"].getValue(),
				tempName : fs.getForm().items.map["tempname"].lastSelectionText,
				cname : fs.getForm().items.map["temp_cname"].getValue()
			},
			timeout : 1000 * 60 * 5,
			success : function(response) {
				var json = eval("(" + response.responseText + ")");
				if (getState(json.state, commonResultFunc, json.result)) {
					Info_Tip("导入成功。");
					importBol = true;
				}
				win.close();
			},
			failure : function() {
				importBol = true;
				Warn_Tip();
			}
		});
	} else
		Info_Tip("请填写必要信息。");
};

// 锁定企业
function lockEmp() {
	var ids = [];
	var rows = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一条信息。");
		return;
	}

	var con = "eid=" + rows.get("eid");
	Ext.MessageBox.confirm("确认操作", "您确定要锁定选中的用户吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/ep/EpAccountServlet?type=2",
							{
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("锁定成功。");
										ds.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							}, con)
				}
			})
};
// 修改信息
function empDetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var form = new Ext.form.FormPanel({
		id : 'form_panel_edit',
		frame : true,
		autoWidth : true,
		height : Math
				.floor(parent.Ext.fly("tab_0303_iframe").getHeight() / 1.5),
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		layout : 'form',
		items : [{
					xtype : 'textfield',
					fieldLabel : 'EID',
					id : 'eid',
					name : 'eid',
					width : 220,
					allowBlank : false,
					readOnly : true
				}, {
					xtype : 'textfield',
					fieldLabel : '企业名称',
					width : 220,
					id : 'ename',
					name : 'ename',
					allowBlank : false
				}, {
					xtype : 'combo',
					id : 'degree',
					width : 220,
					name : 'degree',
					store : [["8", "VIP会员"], ["9", "企业会员"]],
					triggerAction : "all",
					fieldLabel : '企业等级',
					listeners : {
						"select" : function(combo) {
							switch (combo.value) {
								case "8" :
									Ext
											.getCmp("mod_Ask")
											.setValue(parseInt(oldData["mod_Ask"]));
									Ext
											.getCmp("mod_Mat")
											.setValue(parseInt(oldData["mod_Mat"]));
									Ext
											.getCmp("mod_Proj")
											.setValue(parseInt(oldData["mod_Proj"]));
									Ext
											.getCmp("mod_Sup")
											.setValue(parseInt(oldData["mod_Sup"]));
									Ext
											.getCmp("mod_Sup_Cat")
											.setValue(parseInt(oldData["mod_Sup_Cat"]));
									Ext
											.getCmp("mod_Users")
											.setValue(parseInt(oldData["mod_Users"]));
									Ext
											.getCmp("mod_Sys")
											.setValue(parseInt(oldData["mod_Sys"]));
									break;
								case "9" :
									Ext.getCmp("mod_Ask").setValue(Math
											.floor(parseInt(Ext
													.getCmp("mod_Ask")
													.getValue())
													/ 2));
									Ext.getCmp("mod_Mat").setValue(Math
											.floor(parseInt(Ext
													.getCmp("mod_Mat")
													.getValue())
													/ 2));
									Ext.getCmp("mod_Proj").setValue(Math
											.floor(parseInt(Ext
													.getCmp("mod_Proj")
													.getValue())
													/ 2));
									Ext.getCmp("mod_Sup").setValue(Math
											.floor(parseInt(Ext
													.getCmp("mod_Sup")
													.getValue())
													/ 2));
									Ext.getCmp("mod_Sup_Cat").setValue(Math
											.floor(parseInt(Ext
													.getCmp("mod_Sup_Cat")
													.getValue())
													/ 2));
									Ext.getCmp("mod_Users").setValue(Math
											.floor(parseInt(Ext
													.getCmp("mod_Users")
													.getValue())
													/ 2));
									Ext.getCmp("mod_Sys").setValue(Math
											.floor(parseInt(Ext
													.getCmp("mod_Sys")
													.getValue())
													/ 2));
									break;
							}
						}
					}
				}, {
					xtype : 'textfield',
					fieldLabel : '创建人',
					width : 220,
					id : 'createBy',
					name : 'createBy',
					allowBlank : false,
					readOnly : true
				}, {
					xtype : 'numberfield',
					fieldLabel : '询价库询价数量',
					width : 220,
					id : 'mod_Ask',
					name : 'mod_Ask',
					allowBlank : false
				}, {
					xtype : 'numberfield',
					fieldLabel : '材料库收藏材料数',
					width : 220,
					id : 'mod_Mat',
					name : 'mod_Mat',
					allowBlank : false
				}, {
					xtype : 'numberfield',
					fieldLabel : '项目库收藏材料数',
					width : 220,
					id : 'mod_Proj',
					name : 'mod_Proj',
					allowBlank : false
				}, {
					xtype : 'numberfield',
					fieldLabel : '供应商库供应商数',
					width : 220,
					id : 'mod_Sup',
					name : 'mod_Sup',
					allowBlank : false
				}, {
					xtype : 'numberfield',
					fieldLabel : '供应商库层级数量',
					width : 220,
					id : 'mod_Sup_Cat',
					name : 'mod_Sup_Cat',
					allowBlank : false
				}, {
					xtype : 'numberfield',
					fieldLabel : '用户数量',
					width : 220,
					id : 'mod_Users',
					name : 'mod_Users',
					allowBlank : false
				}, {
					xtype : 'numberfield',
					fieldLabel : '用户层级数',
					width : 220,
					id : 'mod_Sys',
					name : 'mod_Sys',
					allowBlank : false
				}, {
					xtype : 'datefield',
					fieldLabel : '开始时间',
					width : 220,
					id : 'startDate',
					name : 'startDate',
					allowBlank : false,
					format : "Y-m-d",
					vtype : 'daterange',
					endDateField : "validDate"
				}, {
					xtype : 'datefield',
					fieldLabel : '有效期',
					width : 220,
					id : 'validDate',
					name : 'validDate',
					allowBlank : false,
					format : "Y-m-d",
					vtype : 'daterange',
					startDateField : 'startDate'
				}],
		buttonAlign : "left",
		labelWidth : 140,
		labelAlign : "right"
	});
	var win = new Ext.Window({
				id : 'vip_edit_win',
				title : '修改VIP信息',
				modal : true,
				width : 500,
				autoHeight : true,
				items : form,
				buttons : [{
							text : '修改',
							handler : function() {
								editEmp(row.get("eid"));
							}
						}, {
							text : '还原',
							handler : function() {
								getInfo(row.get("eid"));
							}
						}]
			});
	win.show();
	getInfo(row.get("eid"));
};

// 添加会员
function addMember() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("eid");
	var ename = encodeURI(row.get("ename"));
	window.parent.createNewWidget("purchase_enterprise_vip_mem_add", '添加采购会员',
			'/module/enterprise/purchase_enterprise_vip_mem_add.jsp?eid=' + thisid
					+ "&ename=" + ename);
};
// 验证是否VIP
function checkVip(index) {
	var row = empgrid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("eid");
	Ext.Ajax.request({
				url : '/ep/EpAccountServlet',
				params : {
					type : 9,
					eid : thisid
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (!json.result) {
						var l = Ext.getCmp('card-wizard-panel').getLayout();
						var next = parseInt(index);
						l.setActiveItem(next);
						Ext.getCmp('card-prev').setDisabled(next == 0);
						Ext.getCmp('card-next').setDisabled(next == 2);
					} else
						Info_Tip("该企业已开通VIP了。");
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 开通库action
function openAction() {
	var row = Ext.getCmp("card-0").getSelectionModel().getSelected();
	var form = Ext.getCmp("card-2").getForm();
	var content = "";
	content = getDataPack_form(form, "content", false, true);
	content += ';ename~' + Ext.fly("emp_name").dom.innerHTML;
	if (validateForm(form, true)) {
		Info_Tip("请正确填写必要信息。");
		return;
	}
	Ext.MessageBox.wait("开通中...请稍候","温馨提示");
	Ext.Ajax.request({
				url : '/ep/EpAccountServlet',
				params : {
					type : 1,
					eid : row.get("eid"),
					content : content
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip("开通成功。");
						setAuth_add(row.get("eid"))
						Ext.getCmp("empAdd_Win").close();
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});

};

// 修改信息
function editInfo(eid, field, value) {
	Ext.Ajax.request({
				url : '/ep/EpAccountServlet',
				params : {
					type : 10,
					eid : eid,
					content : field + "~" + value
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						grid.stopEditing();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 获取信息
function getInfo(eid) {
	eidGlobal = eid;
	Ext.Ajax.request({
				url : '/ep/EpAccountServlet',
				params : {
					type : 11,
					eid : eid
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Ext.getCmp("form_panel_edit").getForm()
								.setValues(json.result);
						oldData = json.result;
						Ext
								.getCmp("startDate")
								.setValue(json.result["startDate"].slice(0, 10));
						Ext
								.getCmp("validDate")
								.setValue(json.result["validDate"].slice(0, 10));
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 修改vip企业信息
function editEmp() {
	Ext.MessageBox.confirm("温馨提示", "您确认要修改该企业的信息吗？", function(op) {
		if (op == "yes") {
			var form = Ext.getCmp("form_panel_edit").getForm();
			if (form.isValid) {
				var content = getDataPack_form(form, "content", false, true);
				Ext.Ajax.request({
					url : '/ep/EpAccountServlet',
					params : {
						type : 10,
						eid : eidGlobal,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("更新成功。", function() {
										closeTab("enterprise_vip_edit");
									});
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			} else
				Info_Tip();
		}
	});
};

function openLockList(){
	window.parent.createNewWidget("purchase_enterprise_vip_lock", '已锁定采购企业',
	'/module/enterprise/purchase_enterprise_vip_lock.jsp');
}

/**
 * 诚信联盟采购商
 */
function viewCreditPurEp(){
	window.parent.createNewWidget("credit_purchase_ep_list", '诚信联盟采购商',
	'/module/enterprise/credit_purchase_ep_list.jsp');
}

function addCreditEpAccount(){
	window.parent.createNewWidget("credit_purchase_ep_add", '申请为诚信采购商',
			'/module/enterprise/credit_purchase_ep_add.jsp');
}

function editCreditEpAccount(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一个商铺");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	window.parent.createNewWidget("credit_purchase_ep_detail", '查看/修改',
			'/module/enterprise/credit_purchase_ep_detail.jsp?id=' + row.get("id") + '&eid=' + row.get("eid"));
}

/**
 * 诚信积分详情
 */
function openCreditScoreDetail(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一个商铺");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	window.parent.createNewWidget("ep_credit_score_detail", '诚信积分详情',
			'/module/enterprise/ep_credit_score_detail.jsp?eid=' + row.get("eid"));
}
