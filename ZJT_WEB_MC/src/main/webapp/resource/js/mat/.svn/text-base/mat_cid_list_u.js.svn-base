Ext.onReady(init);
var grid, ds, win, eid, stuff_form, upload_form, pagesize = 30, pic_ds, pid;
var fname;
var picView;
var temp = new Ext.Template('<p><b>备注:</b> {notes}</p><br>');
var expander;
var stuff = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : Ext.stuff.code
		// from stuff.js
	});
//建材分类store
var cname_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getAllStuff_cid()
});
//建材一级分类store
var cname_1_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getAllStuff_cid_1()
});
//建材二级分类store
var cname_2_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : []
});
//非标分类store(包括所有)
var cname2_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getAllStuff_feibiao()
});
//非标分类store(不包括所有)
var cname2_ds1 = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getStuff_feibiao()
});
//专题一级分类store(包括所有)
var cname1_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getAllStuff_zhuanti()
});
//专题一级分类store(不包括所有)
var cname1_ds1 = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getStuff_zhuanti()
});
function init() {
	eid = getCurArgs("eid");
	fname = decodeURI(getCurArgs("fname"));
	buildGrid();
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '双击信息可以显示备注详细，再次双击可以编辑列表信息。');
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu2',
						text : '修改',
						hidden : compareAuth('FAC_SETCAT'),
						handler : function() {
							var row = grid.getSelectionModel().getSelected();
							if (Ext.isEmpty(row)) {
								Info_Tip("请选择一条信息。");
								return;
							}
							showEditStuff('', row)
						}
					}, {
						id : 'rMenu3',
						text : '修改所有材料',
						hidden : compareAuth('FAC_SETCAT'),
						handler : function() {
							showEditStuff('all');
						}
					}
//					, {
//						id : 'rMenu1',
//						text : '修改已审核材料分类',
//						hidden : compareAuth('FAC_SETCAT'),
//						handler : function(){
//							mat_price();
//						}
//					}
					]
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/AdvSearchMaterialForBaselib'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "spec", "unit", "issueDate", "notes",
								 "p1", "p2", "p3", "p4",
								"grade", "cid", "addr", "brand", "topPhoto",
								"pricem", "code", "code2010", "cname", "cname1", "cname2"]),
				baseParams : {
					 type : 'fac_ex',
//					type : 'fac',
					page : 1,
					pageSize : pagesize,
					content : 'fid~' + eid,
					isaudit : 0
				},
				countUrl : '/CountMaterialForBaselib',
				countParams : {
					types : 2
				},
				remoteSort : true,
				timeout:2*60*1000
			});
	ds.setDefaultSort("updateOn", "DESC");

	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});

	expander = new Ext.ux.grid.RowExpander({
				expandOnDblClick : false,
				tpl : temp,
				expendable : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
				title : "<font color='red'>" + fname + "</font>-修改材料报价分类",

				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				autoScroll : true,
				store : ds,
				loadMask : true,
				plugins : [expander],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, expander, {
							header : '公司编码',
							sortable : false,
							dataIndex : 'code'	
						}, {
							header : '2010编码',
							sortable : false,
							dataIndex : 'code2010'
						}, {
							header : '材料名称',
							sortable : false,
							dataIndex : 'name'

						}, {
							header : 'id',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '型号',
							sortable : false,
							dataIndex : 'spec'

						}, {
							header : '单位',
							sortable : false,
							dataIndex : 'unit'

						}, {
							header : areaAccess["pricem"],
							sortable : false,
							dataIndex : 'pricem'
						}, {
							header : areaAccess["p1"],
							sortable : false,
							dataIndex : 'p1'

						}, {
							header : areaAccess["p2"],
							sortable : false,
							dataIndex : 'p2'

						}, {
							header : areaAccess["p3"],
							sortable : false,
							dataIndex : 'p3'

						}, {
							header : areaAccess["p4"],
							sortable : false,
							dataIndex : 'p4'

						}, {
							header : '建材分类',
							sortable : true,
							dataIndex : 'cname',
							renderer : changeCname
//							editor : {
//								xtype : 'combo',
//								allowBlank : true,
//								store : cname_ds,
//								emptyText : '请选择',
//								mode : 'local',
//								triggerAction : 'all',
//								valueField : 'value',
//								displayField : 'text',
//								readOnly : true
//							}
						}, {
							header : '专题分类',
							sortable : true,
							dataIndex : 'cname1',
							renderer : changeCname,
							editor : {
								xtype : 'combo',
								allowBlank : true,
								store : cname1_ds1,
								emptyText : '请选择',
								mode : 'local',
								triggerAction : 'all',
								valueField : 'value',
								displayField : 'text',
								readOnly : true
							}
						}, {
							header : '非标分类',
							sortable : true,
							dataIndex : 'cname2',
							editor : {
								xtype : 'combo',
								allowBlank : true,
								store : cname2_ds1,
								emptyText : '请选择',
								mode : 'local',
								triggerAction : 'all',
								valueField : 'text',
								displayField : 'text',
								readOnly : true
							}
						}, {
							header : '品牌',
							sortable : true,
							dataIndex : 'brand'
						}, {
							header : '产地',
							sortable : true,
							dataIndex : 'addr'
						}],
				renderTo : 'mat_grid',
				bbar : pagetool,
				tbar : [{
							text : '修改',
							icon : '/resource/images/edit.gif',
							tooltip : '单条材料修改',
							handler : function() {

								var row = grid.getSelectionModel()
										.getSelected();
								if (Ext.isEmpty(row)) {
									Info_Tip("请选择一条信息。");
									return;
								}
								showEditStuff('', row)
							},
							hidden : compareAuth('FAC_SETCAT')
						}, '-', {
							text : '修改所有材料',
							icon : '/resource/images/edit.gif',
							tooltip : '该供应商所有材料修改',
							handler : function() {
								showEditStuff('all')
							},
							hidden : compareAuth('FAC_SETCAT')
						}
//						, '-', {
//							text : '修改已审核材料分类',
//							icon : '/resource/images/edit.gif',
//							handler : function(){
//								mat_price();
//							},
//							hidden : compareAuth('FAC_SETCAT')
//						}
						]
			});
	var searchPanel = new Ext.Panel({
		id : 'searchPanel',
		title : '',
		layout : 'table',
		border: false,
		bodyStyle : 'background:transparent',
		items : [{
			xtype : 'panel',
			width:720,
			border: false,
			layout : 'table',
			layoutConfig : {
				columns : 2
			},
			bodyStyle : 'background:transparent;',
			items : [{
				layout : 'column',
				width: 720,
				border : false,
				bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
				items : [{
					layout : 'column',
					width: 720,
					border : false,
					bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
					items : [{
							style: 'line-height:22px;',
							text : "建材一级分类：",
							xtype : 'label'
						},{
							xtype : 'combo',
							id : 'cname_1',
							mode : 'local',
							triggerAction : 'all',
							readOnly : true,
							store : cname_1_ds,
							valueField : 'value',
							displayField : 'text',
							value : '',
							listeners : {
								'select' : function(){
									var cname_1 = Ext.fly('cname_1').getValue();
									var cname_2 = Ext.getCmp('cname_2');
									if(cname_1 == "所有"){
										cname_2_ds.removeAll();
										cname_2.setDisabled(true);
									}
									else{
										cname_2.setDisabled(false);
										cname_2_ds.loadData(getAllStuff_cid_2(cname_1));
									}
									cname_2.setValue("");
								}
							}
						},{
							style: 'line-height:22px;',
							text : "建材二级分类：",
							xtype : 'label'
						},{
							xtype : 'combo',
							id : 'cname_2',
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
							style: 'line-height:22px;',
							text : "非标分类：",
							xtype : 'label'
						}, {
							xtype : 'combo',
							id : 'cname2_input',
							mode : 'local',
							width : 100,
							triggerAction : 'all',
							readOnly : true,
							store : cname2_ds,
							valueField : 'value',
							displayField : 'text',
							value : ''
						}]
				},{
					layout : 'column',
					width: 720,
					border : false,
					bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
					items : [{
								style: 'line-height:22px;',
								text : "专题分类：",
								xtype : 'label'
							}, {
								xtype : 'combo',
								id : 'cname1_input',
								mode : 'local',
								triggerAction : 'all',
								readOnly : true,
								store : cname1_ds,
								valueField : 'value',
								displayField : 'text',
								value : '',
								width : 120
							}, {
								xtype : 'label',
								cls : 'xtb-sep',
								width : 10
							}, { 
								style: 'line-height:22px;',
								text : "名称：",
								xtype : 'label'
							}, {
								xtype : 'textfield',
								id : 'input_name',
								width: 100
							}, {
								xtype : 'label',
								cls : 'xtb-sep',
								width : 10
							}, {
								style: 'line-height:22px;',
								xtype : 'label',
								text : '型号规格：'
							}, {
								xtype : 'textfield',
								id : 'input_spec',
								width: 100
							}, {
								xtype : 'label',
								cls : 'xtb-sep',
								width : 10
							}, {
								style: 'line-height:22px;',
								text : '材料产地：',
								xtype : 'label'
							}, {
								xtype : 'textfield',
								id : 'input_addr',
								width: 100
						}]
				}, {
					layout : 'column',
					width: 720,
					border : false,
					bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
					items : [{
								style: 'line-height:22px;',
								xtype : "label",
								text : '品牌：'
							}, {
								xtype : 'textfield',
								id : 'input_brand',
								width: 100
							}]
				}]
			}]
		}, {
				xtype : 'button',
				icon : '/resource/images/zoom.png',
				text : '查询',
				handler : searchlist
						
		}]
	});
	
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [searchPanel]
			});
	ds.load();
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	ds.on("load", function(ds, records, option) {
				var len = records.length;
				var temp = "";
				for (var i = 0; i < len; i++) {
					temp += records[i].json;
				}
				if (temp == "您的权限不足") {
					Ext.MessageBox.alert("温馨提示", temp, function() {
								window.parent.Ext.getCmp('center')
										.remove("mat_fac_detail");
							});
					return;
				}
			});

	grid.on('beforeedit', function(e){
		if(!compareAuth('FAC_SETCAT'))
			return true;
		else
			return false;
	});
	
	grid.on("validateedit", function(e) {
				if (e.value.length == 0 && !e.record.data[e.field]) {
					return false;
				}
				switch (e.field) {
					case 'code' :
						if(e.value.gblen() == 0){
							Info_Tip("公司编码不能为空。", function() {
								grid.startEditing(e.row, e.column);
							});
							return false;
						}
						if(e.value.gblen() > 10){
							Info_Tip("公司编码长度不能大于10", function() {
								grid.startEditing(e.row, e.column);
							});
							return false;
						}
						break;
					case 'code2010' : 
						if (e.value.gblen() == 0){
							Info_Tip("2010编码不能为空。", function(){
								grid.startEditing(e.row, e.column);
							});
							return false;
						}
						if(e.value.gblen() > 10){
							Info_Tip("2010编码长度不能大于10", function(){
								grid.startEditing(e.row, e.column);
							});
							return false;
						}
					case 'name' :
						if (e.value.gblen() == 0) {
							Info_Tip("材料名称不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (e.value.gblen() > 200) {
							Info_Tip("材料名称长度不能大于200。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'spec' :
						if (e.value.gblen() == 0) {
							Info_Tip("型号规格不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (e.value.gblen() > 128) {
							Info_Tip("型号规格长度不能大于128。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'unit' :
						if (e.value.gblen() == 0) {
							Info_Tip("单位不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (e.value.gblen() > 18) {
							Info_Tip("型号规格长度不能大于18。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'quotjyj' :
						if (e.value.length == 0) {
							Info_Tip("建议价系数不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (parseFloat(e.value) > 1 || parseFloat(e.value) < 0) {
							Info_Tip("建议价系数不能小于0或大于1", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'quotgcj' :
						if (e.value.length == 0) {
							Info_Tip("工程价系数不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (parseFloat(e.value) > 1 || parseFloat(e.value) < 0) {
							Info_Tip("工程价系数不能小于0或大于1", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
					case 'p1' :
					case 'p2' :
					case 'p3' :
					case 'p4' :
					case 'pricem' :
						var field = areaAccess[e.field] + "价";
						if (e.value.length == 0) {
							Info_Tip(field + "不能为空。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						if (parseFloat(e.value) < 0) {
							Info_Tip(field + "不能小于0。", function() {
										grid.startEditing(e.row, e.column);
									});
							return false;
						}
						break;
				}
				return true;
			});

	grid.on("afteredit", function(e) {
				if (compareAuth('FAC_SETCAT')) {
					return;
				}
				saveInfo_list(e.record.id, e.field, e.record.data[e.field]);
			});
};

// 保存列表修改信息
function saveInfo_list(thisid, field, data) {

	var content = "&content=" + field + "~" + handlerSpec(data);
	Ext.lib.Ajax.request("post", "/FacMaterial.do?type=10", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						if (jsondata.state == "failed") {
							Info_Tip("修改材料失败。");
							ds.reload();
						} else if (jsondata.state == "success") {
							Info_Tip("修改材料成功。");
							ds.reload();
						}
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "id=" + thisid + content)
};

// 查询列表
function searchlist() {
	//建材一级分类
	var cname_1 = Ext.getCmp("cname_1").getValue();
	//建材二级分类
	var cname_2 = Ext.getCmp("cname_2").getValue();
	//建材分类
	var cname = "";
	if(cname_1 != "")
		cname = "/" + cname_1;
	if(cname_2 != "")
		cname = cname + "/" + cname_2;
	if(cname != "")
		cname = cname + "/";
	//非标分类
	var cname2 = Ext.getCmp("cname2_input").getValue();
	//专题分类
	var cname1 = Ext.getCmp("cname1_input").getValue();
	var content = "fid~" + eid + ";cname~" + cname + ";cname1~" + cname1 + ";cname2~" + cname2;
	content += ";name~" + Ext.fly("input_name").getValue() + ";spec~"
			+ Ext.fly("input_spec").getValue() + ";addr~"
			+ Ext.fly("input_addr").getValue() + ";brand~"
			+ Ext.fly("input_brand").getValue();
	ds.baseParams["content"] = content;
	ds.load();
};

// 显示修改材料分类
function showEditStuff(v, data) {
	var bol = false, bolall = false;
	var title = "";
	if (Ext.isEmpty(v)) {
		bol = false;
		bolall = true;
		title = '修改材料分类<br/><font color="red">' + data.get("name") + '</font>';
		stuff_form = new Ext.form.FormPanel({
					layout : 'form',
					bodyStyle : 'padding:6px;',
					labelAlign : 'right',
					labelWidth : 80,
					items : [ /*{
										id : 'cname',
										xtype : 'combo',
										fieldLabel : '建材分类',
										store : cname_ds,
										emptyText : "请选择",
										mode : "local",
										triggerAction : "all",
										valueField : 'value',
										displayField : 'text',
										readOnly : true,
										value : data.get("cname")
									},*/ {
										id : 'cname1',
										xtype : 'combo',
										fieldLabel : '专题分类',
										store : cname1_ds1,
										emptyText : '请选择',
										mode : 'local',
										triggerAction : 'all',
										valueField : 'value',
										displayField : 'text',
										readOnly : true,
										value : data.get("cname1") 
									}, {
										id : 'cname2',
										xtype : 'combo',
										fieldLabel : '非标分类',
										store : cname2_ds1,
										emptyText : '请选择',
										mode : "local",
										triggerAction : "all",
										valueField : 'text',
										displayField : 'text',
										readOnly : true,
										value : data.get("cname2")
							}]
				});
	} else {
		bol = true;
		bolall = false;
		title = '修改该厂商所有材料分类';
		stuff_form = new Ext.form.FormPanel({
					layout : 'form',
					labelWidth : 80,
					labelAlign : 'right',
					bodyStyle : 'padding:6px;',
					items : [/*{
						id : 'cname',
						xtype : 'combo',
						fieldLabel : '建材分类',
						store : cname_ds,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : 'value',
						displayField : 'text',
						readOnly : true
					},*/ {
						id : 'cname1',
						xtype : 'combo',
						fieldLabel : '专题分类',
						store : cname1_ds1,
						emptyText : '请选择',
						mode : 'local',
						triggerAction : 'all',
						valueField : 'value',
						displayField : 'text',
						readOnly : true
					}, {
						id : 'cname2',
						xtype : 'combo',
						fieldLabel : '非标分类',
						store : cname2_ds1,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : 'text',
						displayField : 'text',
						readOnly : true
					}]
				});
	}
	win = new Ext.Window({
				title : title,
				width : 310,
				// height : 480,
				autoHeight : true,
				closeable : true,
				colseAction : 'close',
				modal : true,
				border : false,
				plain : true,
				draggable : true,
				items : [stuff_form],
				buttonAlign : 'center',
				bodyStyle : 'padding:6px;',
				buttons : [{
							text : '修改',
							handler : function() {
								saveEditInfo(data.get('id'));
							},
							hidden : bol
						}, {
							text : '修改',
							handler : saveAllInfo,
							hidden : bolall
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

// 保存修改材料信息
function saveEditInfo(thisid) {
	if (stuff_form.getForm().isValid()) {
		var content = [];
		var len = stuff_form.getForm().items.length;
		for (var i = 0; i < len; i++) {
			content.push(stuff_form.getForm().items.keys[i]
					+ "~"
					+ handlerSpec(stuff_form.getForm().items.map[stuff_form
							.getForm().items.keys[i]].getValue()));
		}
		content = content.toString().replace(/,/g, ";");
		Ext.Ajax.request({
			url : '/FacMaterial.do?type=10',
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改材料成功。");
					ds.reload();
					win.close();
				}
			},
			failure : function() {
				Warn_Tip();
			},
			params : {
				content : content,
				id : thisid
			}
		});
	} else {
		Info_Tip("请正确填写内容。");
	}
};

// 保存修改所有材料信息
function saveAllInfo() {
	if (stuff_form.getForm().isValid()) {
		var ids = [];
		var len = stuff_form.getForm().items.getCount();
		for (var i = 0; i < len; i++) {
			if (!Ext.isEmpty(stuff_form.getForm().items.map[stuff_form
					.getForm().items.keys[i]].getValue())) {
				if (stuff_form.getForm().items.keys[i] == "issueDate")
					ids.push(stuff_form.getForm().items.keys[i]
							+ "~"
							+ stuff_form.getForm().items.map[stuff_form
									.getForm().items.keys[i]].getValue()
									.format('Y-m-d'));
				else
					ids.push(stuff_form.getForm().items.keys[i]
							+ "~"
							+ stuff_form.getForm().items.map[stuff_form
									.getForm().items.keys[i]].getValue());
			}
		}
		ids = ids.join();
		ids = ids.replace(/,/g, ";");
		Ext.Ajax.request({
			url : '/FacMaterial.do?type=11',
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改材料成功。");
					ds.reload();
					win.close();
				}
			},
			failure : function() {
				Warn_Tip();
			},
			params : {
				content : ids,
				fid : eid
			}
		});
	} else
		Info_Tip("请正确填写内容。");
};

// 进入厂商报价审核列表
function mat_price() {
	window.parent.createNewWidget("mat_cid_list", '修改已审核材料分类',
			'/module/mat/mat_cid_list.jsp?eid=' + eid + "&fname="
					+ encodeURI(fname));
};


//建材分类
function changeCname(v){
	if(v){
		var array = v.split('/');
		if(array.length > 1)
			return array[array.length-2];
	}
	return "";
};