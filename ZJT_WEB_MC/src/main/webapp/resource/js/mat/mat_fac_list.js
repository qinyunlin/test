Ext.onReady(init);
function init() {
	buildGrid();
};
var ds, grid, query_type, ds2, grid2;
var stuff = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : Ext.stuff.code
		// from stuff.js
	});
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu1',
						text : '查看供应商报价',
						hidden : compareAuth("FAC_VIEW"),
						handler : function() {
							openInfo(1);
						}
					}, {
						text : '上传材料',
						hidden : compareAuth('FAC_UPLOAD'),
						handler : showUpArea
					}]
		});

function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "createOn"]),
				baseParams : {
					type : 2,
					page : 1,
					types : 'fac',
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 9,
					types : 'fac'
				},
				remoteSort : true
			});
	ds.setDefaultSort("createOn", "DESC");
	ds.load();
	var ds_type = new Ext.data.SimpleStore({
				fields : [{
							name : 'value'
						}, {
							name : 'text'
						}],
				data : [['fname', '厂商名称'], ['fid', '厂商ID'], ['fctg', '厂商分类']]
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '厂商ID',
							sortable : false,
							dataIndex : 'eid'
						}, {
							header : 'id',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '厂商名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '厂商简称',
							sortable : false,
							dataIndex : 'fname'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				renderTo : 'mat_grid',
				bbar : pagetool,
				tbar : [{
							text : '查看供应商报价',
							hidden : compareAuth('FAC_VIEW'),
							handler : function() {
								openInfo(1);
							},
							icon : '/resource/images/report_magnify.png'
						}, {
							text : '上传材料',
							icon : '/resource/images/page_add.png',
							hidden : compareAuth('FAC_UPLOAD'),
							handler : showUpArea
						}, {
							text : '未审核材料供应商',
							handler : function() {
								window.parent.createNewWidget(
										"mat_fac_list_wsh", '未审核材料供应商',
										'/module/mat/mat_fac_list_wsh.jsp?');
							},
							icon : '/resource/images/application_double.png',
							hidden : compareAuth("FAC_AUDIT")
						}, {
							text : '生成企业材料编号',
							handler : function() {
								createMaterialCode();
							},
							icon : '/resource/images/application_double.png'
						}]
			});
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							text : '查询厂商：',
							xtype : 'label'
						}, query_type = new Ext.form.ComboBox({
									id : 'query_type',
									store : ds_type,
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									displayField : "text",
									readOnly : true,
									value : 'fname'
								}), {
							xtype : 'textfield',
							id : 'input_value',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							id : 'stuff_area',
							xtype : 'container',
							items : [new Ext.form.ComboBox({
										id : 'stype_input',
										fieldLabel : "材料分类",
										store : stuff,
										emptyText : "请选择",
										mode : "local",
										triggerAction : "all",
										valueField : "value",
										displayField : "text",
										hiddenName : "stuffcode",
										readOnly : true,
										value : 1

									})]
						}, {
							text : '查询',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}]

			});
	hideEl('stuff_area');
	hideEl("mat_grid_u");
	query_type.on('select', function(combo) {
				if (combo.getValue() == 'fctg') {
					showEl('stuff_area');
					hideEl('input_value');
				} else {
					hideEl('stuff_area');
					showEl('input_value');
				}
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});

};

function searchlist() {
	var content = '';
	var type = query_type.getValue();
	ds.baseParams['cid'] = "";
	switch (type) {
		case 'fname' :
			content += 'name~' + Ext.fly('input_value').getValue();
			ds.baseParams['content'] = content;
			ds.baseParams['type'] = 2;
			ds.countParams['type'] = 9;
			break;
		case 'fid' :
			content += 'eid~' + Ext.fly('input_value').getValue();
			ds.baseParams['content'] = content;
			ds.baseParams['type'] = 2;
			ds.countParams['type'] = 9;
			break;
		default :
			ds.baseParams['type'] = 17;
			ds.countParams['type'] = 16;
			ds.baseParams['cid'] = Ext.fly('stuffcode').getValue();
	}
	ds.load();

};

// 打开
function openInfo(v) {
	var row;
	row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息");
		return;
	}
	var id = row.get("eid");
	var fname = encodeURI(row.get("fname"));
	window.parent.createNewWidget("mat_fac_detail", '供应商材料报价',
			'/module/mat/mat_fac_detail.jsp?eid=' + id + "&fname=" + fname);
};
//生成企业材料编号
function createMaterialCode(){
	var row;
	row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息");
		return;
	}
	var id = row.get("eid");
	Ext.MessageBox.confirm("确认操作", "你确认要生成该企业的编号吗？", function(o) {
				if (o == "yes") {
					Ext.lib.Ajax.request("post", '/FacMaterial.do?type=18', {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,commonResultFunc, jsondata.result)) {
										Info_Tip("生成该企业的编号成功。");
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "fid=" + id);
				}
			});	
}
// 显示上传区域
function showUpArea() {
	upload_form = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'padding:6px;',
				labelWidth : 60,
				fileUpload : true,
				items : [{
							layout : 'column',
							bodyStyle : 'border:none;',
							items : [{
										columnWidth : 0.5,
										layout : 'form',
										bodyStyle : 'border:none;',
										items : {
											xtype : 'textfield',
											inputType : 'file',
											fieldLabel : '上传文件',
											allowBlank : false
										}
									}, {
										columnWidth : 0.5,
										layout : 'form',
										bodyStyle : 'border:none;',
										items : {
											bodyStyle : 'border:none;',
											html : "<a href='"
													+ FileSite
													+ "/doc/fac_price_sample.xls"
													+ "' >标准文档下载</a>"
										}
									}]
						}]
			});
	win = new Ext.Window({
				title : '材料报价上传',
				closeable : true,
				width : 640,
				height : 160,
				colseAction : 'close',
				modal : true,
				border : false,
				plain : true,
				draggable : true,
				buttonAlign : 'center',
				items : [upload_form],
				buttons : [{
							text : '上传',
							handler : uploadFile
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

// 上传
function uploadFile() {
	submitForm();
};

// 上传操作
function submitForm(append) {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择厂商。");
		return;
	}
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/FacMaterialUpload.do?type=1&fid=' + row.get('eid')
					+ "&append=" + append,
			waitMsg : '上传文件中...',
			success : function(upload_form, o) {
				// msg('Success', 'Processed file
				// "'+o.result.file+'" on
				// the server');
			}
		});
	} else
		Info_Tip("请正确填写信息。");
};
function getResult(flag, msg) {
	if (flag) {
		Info_Tip("上传成功。", mat_price);
		win.close();
		// ds.reload();
	} else {
		Info_Tip(msg);
	}
};
// 进入厂商报价未审核列表
function mat_price() {
	var row = grid.getSelectionModel().getSelected();
	window.parent.createNewWidget("mat_fac_detail_u", '未审核材料列表',
			'/module/mat/mat_fac_detail_u.jsp?eid=' + row.get('eid')
					+ "&fname=" + encodeURI(row.get('fname')));
};
