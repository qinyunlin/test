Ext.onReady(init);
var grid, ds, pageSize = 20, fs;
// 供应一级分类store
var cname_1_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : getAllStuff_gongqiu_1()
		});
// 供求二级分类store
var cname_2_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : []
		});
// 供求类型(包括所有)
var type_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : getAllStuff_type()
		});
// 供求类型(不包括所有)
var type_ds1 = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : stuff_type
		});
// 供求分类
var cname_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : getAllStuff_gongqiu()
		});
// 非标分类(包括所有)
var cname1_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : getAllStuff_feibiao()
		});
// 非标分类(不包括所有)
var cname1_ds1 = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : getStuff_feibiao()
		});
function init() {
	buildGrid();
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu3',
						text : '查看/修改',
						hidden : compareAuth('SUPPLY_ADMIN_VIEW'),
						handler : function() {
							supplyInfo('edit');
						}
					}, {
						id : 'rMenu4',
						text : '批量修改',
						hidden : compareAuth('SUPPLY_ADMIN_MOD'),
						handler : batchEdit
					}, {
						id : 'rMenu1',
						text : '审核',
						hidden : compareAuth('SUPPLY_ADMIN_AUDIT'),
						handler : passop
					}, {
						id : 'rMenu2',
						text : '锁定',
						hidden : compareAuth('SUPPLY_ADMIN_LOCK'),
						handler : lockop
					}/*,{
						id : 'rMenu5',
						text : '推荐/取消推荐',
						hidden : compareAuth('SUPPLY_ADMIN_ISRECOMMEND'),
						handler : isRecommended
					}*/]
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpSupplyServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'eid', 'ename', 'cname', 'cname1', 'type',
								'name', 'spec', 'unit', 'code', 'brand',
								'price', 'title', 'addr', 'issueDate',
								'validDate', 'photo', 'saleArea', 'attCount',
								'isAudit', 'isLock', 'updateOn', 'createBy',
								'updateBy', 'createBy', 'title','isRecommended']),
				baseParams : {
					type : 16,
					isLock : 0
				},
				countUrl : '/ep/EpSupplyServlet',
				countParams : {
					type : 15
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	var del_store = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['', '所有'], ["0", "未审核"], ["1", "已审核"]]
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				renderTo : 'grid',
				viewConfig : {
					forceFit : true
				},
				sm : cm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '企业名称',
							sortable : true,
							dataIndex : 'ename'
						}, {
							header : '标题',
							sortable : true,
							dataIndex:"title",
							renderer : function(value, meta, record) {
								var name = record.get("title");
								var isRecommended = record.get("isRecommended");
								if("1" == isRecommended){
									name = "<img src='/resource/images/u13_isTop.gif' title='推荐参考材价' width='16' height='16' style='vertical-align:middle;' />" + name;
								}
								return name;
							}
						}, {
							header : '材料名称',
							sortable : true,
							dataIndex : 'name'
						}, {
							header : '型号',
							sortable : true,
							dataIndex : 'spec'
						}, {
							header : '单位',
							sortable : true,
							dataIndex : 'unit'
						}, {
							header : '价格',
							sortable : true,
							dataIndex : 'price'
						}, {
							header : '供求类型',
							sortable : true,
							dataIndex : 'type',
							renderer : getStuff_type_name
						}, {
							header : '供求分类',
							sortable : true,
							dataIndex : 'cname',
							renderer : changeCname
						}, {
							header : '非标分类',
							sortable : true,
							dataIndex : 'cname1'
						}, {
							header : '产地',
							sortable : true,
							dataIndex : 'addr'
						}, {
							header : '销售地区',
							sortable : true,
							dataIndex : 'saleArea'
						}, {
							header : '发布日期',
							sortable : true,
							dataIndex : 'issueDate'
						}, {
							header : '有效日期',
							sortable : true,
							dataIndex : 'validDate'
						}, {
							header : '审核状态',
							sortable : true,
							dataIndex : 'isAudit',
							renderer : changeAudit
						}, {
							header : '添加人',
							sortable : true,
							dataIndex : 'createBy'
						}, {
							header : '添加时间',
							sortable : true,
							dataIndex : 'createOn'
						}, {
							header : '修改人',
							sortable : true,
							dataIndex : 'updateBy'
						}, {
							header : '修改时间',
							sotable : true,
							dataIndex : 'updateOn'
						}, {
							header : '关注次数 ',
							sortable : true,
							dataIndex : 'attCount'
						}],
				bbar : pagetool,
				tbar : [{
							text : '查看/修改',
							icon : "/resource/images/edit.gif",
							hidden : compareAuth('SUPPLY_ADMIN_VIEW'),
							handler : function() {
								supplyInfo('edit');
							}
						}, {
							text : '批量修改',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('SUPPLY_ADMIN_MOD'),
							handler : function() {
								batchEdit();
							}
						}, {
							text : '审核',
							icon : "/resource/images/tick.png",
							hidden : compareAuth('SUPPLY_ADMIN_AUDIT'),
							handler : passop

						}, {
							text : '锁定',
							icon : "/resource/images/lock.png",
							hidden : compareAuth('SUPPLY_ADMIN_LOCK'),
							handler : lockop
						}/*,{
							
							text : '推荐/取消推荐',
							icon : "/resource/images/tick.png",
							hidden : compareAuth('SUPPLY_ADMIN_ISRECOMMEND'),
							handler : isRecommended
						}*/]
			});
	var searchPanel = new Ext.Panel({
		id : 'searchPanel',
		title : '',
		layout : 'table',
		border : false,
		bodyStyle : 'background:transparent',
		layoutConfig : {
			columns : 2
		},
		items : [{
			xtype : 'panel',
			width : 800,
			border : false,
			layout : 'table',
			layoutConfig : {
				columns : 1
			},
			bodyStyle : 'background:transparent;',
			items : [{
				layout : 'column',
				width : 800,
				border : false,
				bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
				items : [{
							style : 'line-height:22px;',
							xtype : 'label',
							text : '企业名称：'
						}, {
							xtype : 'textfield',
							width : 100,
							id : 'input_ename',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							xtype : 'label',
							cls : 'xtb-sep',
							width : 10
						}, {
							style : 'line-height:22px;',
							xtype : 'label',
							text : '材料名称：'
						}, {
							xtype : 'textfield',
							width : 100,
							id : 'input_name',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							xtype : 'label',
							cls : 'xtb-sep',
							width : 10
						}, {
							style : 'line-height:22px;',
							xtype : 'label',
							text : '销售地区：'
						}, {
							xtype : 'textfield',
							width : 80,
							id : 'input_saleArea',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}

						}, {
							xtype : 'label',
							cls : 'xtb-sep',
							width : 10
						}, {
							style : 'line-height:22px;',
							xtype : 'label',
							text : '供求类型：'
						}, {
							xtype : 'combo',
							width : 80,
							store : type_ds,
							id : 'input_type',
							mode : 'local',
							triggerAction : 'all',
							readOnly : true,
							valueField : 'value',
							displayField : 'text',
							value : '',
							emptyeText : '请选择'
						}, {
							xtype : 'label',
							cls : 'xtb-sep',
							width : 10
						}, {
							style : 'line-height:22px;',
							xtype : 'label',
							text : '非标分类：'
						}, {
							xtype : 'combo',
							width : 80,
							store : cname1_ds,
							id : 'input_cname1',
							mode : 'local',
							triggerAction : 'all',
							readOnly : true,
							valueField : 'value',
							displayField : 'text',
							value : '',
							emptyeText : '请选择'
						}]
			}, {
				layout : 'column',
				width : 800,
				border : false,
				bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
				items : [{
							style : 'line-height:22px;',
							xtype : 'label',
							text : '供求一级分类：'
						}, {
							xtype : 'combo',
							id : 'input_cname_1',
							mode : 'local',
							triggerAction : 'all',
							readOnly : true,
							store : cname_1_ds,
							valueField : 'value',
							displayField : 'text',
							value : '',
							listeners : {
								'select' : function() {
									var cname_1 = Ext.fly('input_cname_1')
											.getValue();
									var cname_2 = Ext.getCmp('input_cname_2');
									if (cname_1 == "所有") {
										cname_2_ds.removeAll();
										cname_2.setDisabled(true);
									} else {
										cname_2.setDisabled(false);
										cname_2_ds
												.loadData(getAllStuff_gongqiu_2(cname_1));
									}
									cname_2.setValue("");
								}
							}
						}, {
							style : 'line-height:22px;',
							xtype : 'label',
							text : '供求二级分类：'
						}, {
							xtype : 'combo',
							id : 'input_cname_2',
							mode : 'local',
							triggerAction : 'all',
							readOnly : true,
							store : cname_2_ds,
							valueField : 'value',
							displayField : 'text',
							disabled : true,
							emptyText : '请选择'
						}, {
							xtype : 'label',
							cls : 'xtb-sep',
							width : 10
						}, {
							style : 'line-height:22px;',
							xtype : 'label',
							text : '审核状态：'
						}, {
							id : 'isAudit',
							xtype : 'combo',
							mode : "local",
							store : del_store,
							triggerAction : "all",
							valueField : 'value',
							displayField : 'text',
							value : "",
							width : 80,
							listeners : {
								"select" : function() {
									searchlist();
								}
							}
						}, {
							xtype : 'label',
							cls : 'xtb-sep',
							width : 10
						}, {
							xtype : 'button',
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			}]
		}]
	});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [searchPanel]
			});
	grid.on("rowdblclick", function() {
				supplyInfo('edit');
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	ds.load();
};
// 查询
function searchlist() {
	var ename = Ext.fly("input_ename").getValue();
	var name = Ext.fly("input_name").getValue();
	var saleArea = Ext.fly("input_saleArea").getValue();
	var type = Ext.getCmp("input_type").getValue();
	var isAudit = Ext.getCmp("isAudit").getValue();
	var cname_1 = Ext.getCmp("input_cname_1").getValue();
	var cname_2 = Ext.getCmp("input_cname_2").getValue();
	var cname = "";
	if (cname_1 != "")
		cname = "/" + cname_1;
	if (cname_2 != "")
		cname = cname + "/" + cname_2;
	if (cname != "")
		cname = cname + "/";

	var cname1 = Ext.getCmp("input_cname1").getValue();
	var content = "ename~" + ename + ";name~" + name + ";saleArea~" + saleArea
			+ ";cname~" + cname + ";cname1~" + cname1 + ";type~" + type;
	ds.baseParams["isAudit"] = isAudit;
	ds.baseParams['content'] = content;
	ds.load();
};
// 审核
function passop() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var ids = [];
	for (var i = 0; i < row.length; i++) {
		ids.push(row[i].get('id'));
	}
	Ext.Msg.confirm("提示", "您确定要审核该信息?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/ep/EpSupplyServlet?type=14",
							{
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("操作成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + ids.toString() + "&isAudit=1");
				}
			});
};

// 锁定
function lockop() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择信息。");
		return;
	}
	var ids = [];
	for (var i = 0; i < row.length; i++) {
		ids.push(row[i].get('id'));
	}
	Ext.lib.Ajax.request("post", "/ep/EpSupplyServlet?type=12", {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip("操作成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "id=" + ids.toString() + "&isLock=1");
};

// 修改\添加
function supplyInfo(op) {
	if (op == "add") {
		buildSupplyInfo(op);
	} else if (op == "edit") {
		var row = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(row)) {
			Info_Tip("请选择一条信息。");
			return;
		}
		Ext.lib.Ajax.request("post", "/ep/EpSupplyServlet?type=8", {
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							var data = json.result;
							for (var v in data) {
								data[v] = data[v] ? data[v] : "";
							}
							buildSupplyInfo(op, data)
						}
					},
					failure : function() {
						Warn_Tip();
					}
				}, "id=" + row.get("id"));
	}
};


//审核
function isRecommended() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var isAudit=row[0].get('isAudit');
	if(parseInt(isAudit)!=1){
		Info_Tip("只能推荐审核通过的信息。");
		return;
	}
	var isRecommended=row[0].get('isRecommended');
	var html="您确定要推荐该信息";
	if(parseInt(isRecommended)==1){
		isRecommended=0;
		html="您确定要取消推荐该信息吗？";
	}else{
		isRecommended=1;
	}
	var ids = [];
/*	for (var i = 0; i < row.length; i++) {*/
		ids.push(row[0].get('id'));
	//}
	Ext.Msg.confirm("提示", html, function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/ep/EpSupplyServlet?type=22",
							{
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("操作成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + ids.toString()+"&isRecommend="+isRecommended);
				}
			});

};
// 创建供求信息窗口
function buildSupplyInfo(op, data) {
	var btn_text;
	if (op == "add") {
		btn_text = "添加";
		fs = new Ext.form.FormPanel({
					layout : 'form',
					labelWidth : 60,
					height : parent.Ext.fly('tab_1201_iframe').getHeight() / 2,
					autoScroll : true,
					autoWidth : true,
					bodyStyle : 'padding:6px',
					items : []
				});
	} else if (op == "edit") {
		btn_text = "修改";
		var path = "";
		if (data['photo'] != null && data['photo'] != "") {
			path = data['photo'].split(".");
			path = path[0] + "_230." + path[1];
		} else {
			path = "/ep/default/eplogo.jpg";
		}
		fs = new Ext.form.FormPanel({
			layout : 'form',
			height : parent.Ext.fly('tab_1201_iframe').getHeight() / 2,
			autoScroll : true,
			autoWidth : true,
			bodyStyle : 'padding:6px;',
			labelAlign : 'right',
			labelWidth : 80,
			items : [{
				layout : 'column',
				bodyStyle : 'border:none;',
				items : [{
							layout : 'form',
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							items : [{
										fieldLabel : '标题',
										id : 'd_title',
										width : 164,
										xtype : 'textfield',
										maxLength : '50',
										allowBlank : false,
										value : data['title']
									}, {
										fieldLabel : '名称',
										id : 'd_name',
										width : 164,
										xtype : 'textfield',
										maxLength : '128',
										allowBlank : false,
										value : data['name']
									}, {
										fieldLabel : '规格',
										id : 'd_spec',
										width : 164,
										xtype : 'textfield',
										maxLength : 200,
										value : data["spec"]
									}, {
										fieldLabel : '单位',
										id : 'd_unit',
										width : 164,
										xtype : 'textfield',
										maxLength : 50,
										value : data["unit"]
									}, {
										fieldLabel : '价格',
										id : 'd_price',
										width : 164,
										xtype : 'textfield',
										regex : /^(\d){0,12}(.){0,1}(\d){0,4}$/,
										regexText : '请正确填写价格',
										value : data["price"]
									}, {
										fieldLabel : '产地',
										id : 'd_addr',
										width : 164,
										xtype : 'textfield',
										allowBlank : true,
										maxLength : 50,
										value : data["addr"]
									}, {
										fieldLabel : '品牌',
										id : 'd_brand',
										width : 164,
										xtype : 'textfield',
										allowBlank : true,
										maxLength : 50,
										value : data["brand"]
									}, {
										id : 'd_type',
										xtype : 'combo',
										fieldLabel : '供求类型',
										store : stuff_type,
										emptyText : "请选择",
										mode : "local",
										triggerAction : "all",
										valueField : "value",
										displayField : "text",
										readOnly : true,
										value : data['type']
									}, {
										fieldLabel : '供求分类',
										id : 'd_cname',
										xtype : 'combo',
										store : cname_ds,
										emptyText : "请选择",
										mode : "local",
										triggerAction : "all",
										valueField : "value",
										displayField : "text",
										readOnly : true,
										value : data['cname']
									}, {
										fieldLabel : '非标分类',
										id : 'd_cname1',
										xtype : 'combo',
										width : 164,
										store : cname1_ds1,
										emptyText : '请选择',
										mode : 'local',
										triggerAction : 'all',
										valueField : 'value',
										displayField : 'text',
										readOnly : true,
										value : data['cname1']
									}, {
										fieldLabel : '有效时间',
										xtype : 'datefield',
										id : 'd_validDate',
										format : "Y-m-d",
										readOnly : true
									}]
						}, {
							columnWidth : 0.5,
							ayout : 'form',
							bodyStyle : 'border:none;',
							labelAlign : 'right',
							items : [{
								bodyStyle : 'border:1px solid #ccc;',
								width : 230,
								height : 230,
								html : "<img id='photo' width='230' height='230'  src='"
										+ FileSite + path + "'/>"
							}, {
								xtype : 'button',
								text : '更新图片',
								handler : showUploadImgWin
							}]
						}]
			}, {
				layout : 'column',
				bodyStyle : 'border:none;',
				items : [{
							layout : "form",
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							labelWidth : 80,
							items : [{
										fieldLabel : '联系人',
										id : 'd_linkman',
										xtype : 'textfield',
										maxLength : 50,
										value : data['linkman']
									}, {
										fieldLabel : 'QQ',
										id : 'd_qq',
										xtype : 'textfield',
										maxLength : 50,
										value : data['qq']
									}, {
										fieldLabel : '邮箱',
										id : 'd_email',
										xtype : 'textfield',
										maxLength : 50,
										value : data['email']
									}]
						}, {
							layout : "form",
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							labelWidth : 30,
							items : [{
										fieldLabel : '电话',
										id : 'd_phone',
										xtype : 'textfield',
										maxLength : 50,
										value : data['phone']
									}, {
										fieldLabel : 'MSN',
										id : 'd_msn',
										xtype : 'textfield',
										maxLength : 50,
										value : data['msn']
									}]
						}]
			}, {
				xtype : "textarea",
				fieldLabel : '备注',
				id : "d_notes",
				width : 350,
				value : data["notes"]
			}]
		});
	}
	win = new Ext.Window({
				title : btn_text + '供求信息',
				width : 600,
				items : [fs],
				modal : true,
				autoHeight : true,
				buttonAlign : 'right',
				buttons : [{
					text : btn_text,
					hidden : op == 'add'
							? compareAuth('SUPPLY_ADMIN_VIEW')
							: compareAuth('SUPPLY_ADMIN_MOD'),
					handler : function() {
						saveSupply(op);
					}
				}, {
					text : '取消',
					handler : function() {
						win.close();
					}
				}]
			});
	win.show();
	if (op == "edit")
		setValidDate('d_validDate', data['validDate'])
};
// 批量修改
function batchEdit() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var kind_ds = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['type', '供求类型'], ['cname', '供求分类'], ['cname1', '非标分类']]
			});
	fs = new Ext.form.FormPanel({
				layout : 'form',
				height : 70,
				autoScroll : true,
				autoWidth : true,
				bodyStyle : 'padding:6px;',
				labelAlign : 'right',
				labelWidth : 60,
				items : [{
							fieldLabel : '分类名称',
							xtype : 'combo',
							store : kind_ds,
							id : 't_kind',
							emptyText : "请选择",
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							displayField : "text",
							readOnly : true,
							value : 'type',
							listeners : {
								select : function() {
									var value = Ext.getCmp('t_kind').getValue();
									switch (value) {
										case 'type' :
											hideEl('t_cname_form');
											hideEl('t_cname1_form');
											showEl('t_type_form');
											break;
										case 'cname' :
											hideEl('t_cname1_form');
											hideEl('t_type_form');
											showEl('t_cname_form');
											break;
										case 'cname1' :
											hideEl('t_cname_form');
											hideEl('t_type_form');
											showEl('t_cname1_form');
											break;
										default :
											break;
									}
								}
							}
						}, {
							layout : 'form',
							labelAlign : 'right',
							labelWidth : 60,
							border : false,
							id : 't_type_form',
							items : {
								fieldLabel : '供求类型',
								xtype : 'combo',
								store : type_ds1,
								id : 't_type',
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								displayField : "text",
								readOnly : true
							}
						}, {
							layout : 'form',
							labelAlign : 'right',
							labelWidth : 60,
							border : false,
							id : 't_cname_form',
							items : {
								fieldLabel : '供求分类',
								xtype : 'combo',
								store : cname_ds,
								id : 't_cname',
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								displayField : "text",
								readOnly : true
							}
						}, {
							layout : 'form',
							labelAlign : 'right',
							labelWidth : 60,
							border : false,
							id : 't_cname1_form',
							items : {
								fieldLabel : '非标分类',
								xtype : 'combo',
								store : cname1_ds1,
								id : 't_cname1',
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								displayField : "text",
								readOnly : true
							}
						}]
			});
	win = new Ext.Window({
				title : '批量修改供求信息',
				width : 280,
				items : [fs],
				modal : true,
				autoHeight : true,
				buttonAlign : 'right',
				buttons : [{
							text : '修改',
							hidden : compareAuth('SUPPLY_ADMIN_MOD'),
							handler : function() {
								saveSupply('batchEdit');
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}],
				listeners : {
					show : function() {
						hideEl('t_cname_form');
						hideEl('t_cname1_form');
					}
				}
			});
	win.show();
};
// 保存信息
function saveSupply(op) {
	var data = "";
	var tips = "";
	if (op == "add") {

	} else if (op == "edit") {
		var title = Ext.fly("d_title").getValue();
		var name = Ext.fly("d_name").getValue();
		var cname = Ext.getCmp("d_cname").getValue();
		var cname1 = Ext.getCmp("d_cname1").getValue();
		var spec = Ext.fly("d_spec").getValue();
		var unit = Ext.fly("d_unit").getValue();
		var addr = Ext.fly("d_addr").getValue();
		var brand = Ext.fly("d_brand").getValue();
		var validDate = Ext.fly("d_validDate").getValue();
		var type = Ext.getCmp("d_type").getValue();
		var linkman = Ext.fly("d_linkman").getValue();
		var phone = Ext.fly("d_phone").getValue();
		var qq = Ext.fly("d_qq").getValue();
		var msn = Ext.fly("d_msn").getValue();
		var email = Ext.fly("d_email").getValue();
		var notes = Ext.fly("d_notes").getValue();
		notes = notes != "" ? notes : " ";
		var content = "title~" + title + ";name~" + name + ";cname~" + cname
				+ ";cname1~" + cname1 + ";spec~" + spec + ";unit~" + unit
				+ ";addr~" + addr + ";brand~" + brand + ";validDate~"
				+ validDate + ";type~" + type + ";linkman~" + linkman
				+ ";phone~" + phone + ";qq~" + qq + ";msn~" + msn + ";email~"
				+ email + ";notes~" + notes;
		var row = grid.getSelectionModel().getSelected();
		data = "type=" + 3 + "&id=" + row.get("id") + "&content=" + content;
		tips = "修改信息成功!";
	} else if (op = 'batchEdit') {
		var ctype = Ext.getCmp("t_kind").getValue();
		var cname = "";
		switch (ctype) {
			case 'type' :
				cname = Ext.getCmp('t_type').getValue();
				break;
			case 'cname' :
				cname = Ext.getCmp("t_cname").getValue();
				break;
			case 'cname1' :
				cname = Ext.getCmp("t_cname1").getValue();
				break;
			default :
				break;
		}
		var row = grid.getSelectionModel().getSelections();
		var ids = [];
		for (var i = 0; i < row.length; i++) {
			ids.push(row[i].get('id'));
		}
		data = "type=" + 18 + "&id=" + ids.toString() + "&ctype=" + ctype
				+ "&cname=" + cname;
		tips = "修改信息成功!";
	}
	Ext.lib.Ajax.request("post", "/ep/EpSupplyServlet", {
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Info_Tip(tips);
						win.close();
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, data);
};
// 设置有效日期
function setValidDate(id, date) {
	if (date)
		Ext.fly(id).dom.value = date.slice(0, 10);
};

// 供求分类
function changeCname(v) {
	if (v) {
		var array = v.split('/');
		if (array.length > 1)
			return array[array.length - 2];
	}
	return "";
};

// 显示单条材料图片
// 上传图片
// 显示上传图片窗口
var showUploadImgWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|jpeg/;
	FileUpload_Ext.initComponent();
};
function upload_fn() {
//	debugger;
	var row = grid.getSelectionModel().getSelected();
	if (row.length < 1) {
		Info_Tip("请选择信息。");
		return;
	}
	var path1 = FileUpload_Ext.callbackMsg.split(".");
	path1 = path1[0] + "_230." + path1[1];
	Ext.Ajax.request({
				url : '/ep/EpSupplyServlet',
				params : {
					type : 3,
					content : 'photo~' + FileUpload_Ext.callbackMsg,
					id : row.get("id")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Ext.fly("photo").dom.src = FileUpload_Ext.requestURL
								+ path1;
						Info_Tip("图片设置成功。");
						ds.reload();
//						win.close();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});

};




//批量修改
function batchEdit() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var kind_ds = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['type', '供求类型'], ['cname', '供求分类'], ['cname1', '非标分类']]
			});
	fs = new Ext.form.FormPanel({
				layout : 'form',
				height : 70,
				autoScroll : true,
				autoWidth : true,
				bodyStyle : 'padding:6px;',
				labelAlign : 'right',
				labelWidth : 60,
				items : [{
							fieldLabel : '分类名称',
							xtype : 'combo',
							store : kind_ds,
							id : 't_kind',
							emptyText : "请选择",
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							displayField : "text",
							readOnly : true,
							value : 'type',
							listeners : {
								select : function() {
									var value = Ext.getCmp('t_kind').getValue();
									switch (value) {
										case 'type' :
											hideEl('t_cname_form');
											hideEl('t_cname1_form');
											showEl('t_type_form');
											break;
										case 'cname' :
											hideEl('t_cname1_form');
											hideEl('t_type_form');
											showEl('t_cname_form');
											break;
										case 'cname1' :
											hideEl('t_cname_form');
											hideEl('t_type_form');
											showEl('t_cname1_form');
											break;
										default :
											break;
									}
								}
							}
						}, {
							layout : 'form',
							labelAlign : 'right',
							labelWidth : 60,
							border : false,
							id : 't_type_form',
							items : {
								fieldLabel : '供求类型',
								xtype : 'combo',
								store : type_ds1,
								id : 't_type',
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								displayField : "text",
								readOnly : true
							}
						}, {
							layout : 'form',
							labelAlign : 'right',
							labelWidth : 60,
							border : false,
							id : 't_cname_form',
							items : {
								fieldLabel : '供求分类',
								xtype : 'combo',
								store : cname_ds,
								id : 't_cname',
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								displayField : "text",
								readOnly : true
							}
						}, {
							layout : 'form',
							labelAlign : 'right',
							labelWidth : 60,
							border : false,
							id : 't_cname1_form',
							items : {
								fieldLabel : '非标分类',
								xtype : 'combo',
								store : cname1_ds1,
								id : 't_cname1',
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								displayField : "text",
								readOnly : true
							}
						}]
			});
	win = new Ext.Window({
				title : '批量修改供求信息',
				width : 280,
				items : [fs],
				modal : true,
				autoHeight : true,
				buttonAlign : 'right',
				buttons : [{
							text : '修改',
							hidden : compareAuth('SUPPLY_ADMIN_MOD'),
							handler : function() {
								saveSupply('batchEdit');
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}],
				listeners : {
					show : function() {
						hideEl('t_cname_form');
						hideEl('t_cname1_form');
					}
				}
			});
	win.show();
};



/* end 上传图片 */

