Ext.onReady(init);
var grid, ds, win, eid, stuff_form, upload_form, pagesize = 30, pic_ds, pid;
var fname;
var stuff = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : Ext.stuff.code
		// from stuff.js
	});

var cidArray = getCidNameArray();
var cidStore = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : cidArray
});

var subcidStore = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : []
});

/**
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
var comboProvinces = new Ext.form.ComboBox({
	id : 'comboProvinces',
	store : pro,
	width : 80,
	valueField : "value",
	displayField : "text",
	mode : 'local',
	forceSelection : true,
	emptyText : '请选择',
	editable : false,
	triggerAction : 'all',
	allowBlank : false,
	bodyStyle:'float:left;margin-left:5px;',
	readOnly : true,
	fieldLabel : '省',
	listeners : {
		select : function(combo, record, index) {
			comboCities.reset();
			var province = combo.getValue();
			city = zhcn.getCity(province);
			comboCities.store.loadData(city);
			comboCities.enable();
		}
	}
})

var city = [];
var comboCities = new Ext.form.ComboBox({
	id : 'comboCities',
	store : city,
	width : 80,
	valueField : "value",
	displayField : "text",
	mode : 'local',
	forceSelection : true,
	emptyText : '请选择',
	hiddenName : 'region',
	editable : false,
	triggerAction : 'all',
	bodyStyle:'float:left;',
	allowBlank : false,
	readOnly : true,
	fieldLabel : '市',
	name : 'city'

});
**/

function init() {
	eid = getCurArgs("eid");
	fname = decodeURI(getCurArgs("fname"));
	buildGrid();
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '双击信息可以显示备注详细，再次双击可以编辑列表信息。');
};

//跳转到查看/修改
function gotoUpdatePage(){
	var rows = grid.getSelectionModel().getSelections();
	if(!rows){
		Ext.MessageBox.alert("提示","请选择一条材料");
		return;
	}
	var id = rows[0].get("id");
	window.parent.createNewWidget("matFacUpdate", '查看/修改','/module/mat/mat_fac_update.jsp?id='+id);
}
// 右键菜单
var rightClick = new Ext.menu.Menu({
	id : 'rightClickCont',
	shadom : false,
	items : [{
				id : 'rMenu1',
				text : '图片库',
				handler : function() {
					showPicArea();
				}
			}, {
				id : 'rMenu2',
				text : '查看/修改',
				hidden : compareAuth('FAC_MOD'),
				handler : function() {

					var row = grid.getSelectionModel().getSelected();
					if (Ext.isEmpty(row)) {
						Info_Tip("请选择一条信息。");
						return;
					}
					//showEditStuff('', row)
				}
			}/*, {
				id : 'rMenu3',
				text : '批量修改',
				hidden : compareAuth('FAC_MOD'),
				handler : function() {
					if (grid.getSelectionModel().getCount() > 0) {

						Ext.Msg.show({
							title : '修改',
							msg : '由于您选择了数据，可点击相应按钮执行不同操作。',
							buttons : {yes:' 批量修改所选 ',no:'修改全部',cancel:'取消'}	,
							fn : function(bn, text) {
								if (bn == "yes") {

									var rows = grid.getSelectionModel()
											.getSelections();

									for (var i = 0; i < rows.length; i++) {
										if (i != 0) {
											row += "," + rows[i].get('id');
										} else {
											row = rows[i].get('id');
										}
									}
									showEditStuff('mult', row);
									// Ext.Msg.alert(grid.getSelectionModel().getSelections()[]);

								} else if (bn == "no") {
									showEditStuff('all');
								}
							}
						});

					} else {
						showEditStuff('all');
					}
				}
			}*/, {
				id : 'rMenu4',
				text : '导出材价',
				tooltip : '不选择材料则导出全部材料',
				hidden : compareAuth('FAC_DOWNLOAD'),
				handler : downFile
			}, {
				id : 'rMenu5',
				text : '上传材料',
				hidden : compareAuth('FAC_UPLOAD'),
				handler : showUpArea
			}, {
				id : 'rMenu6',
				text : '批量删除',
				handler : del_sel,
				hidden : compareAuth('FAC_DEL')
			},/* {
				id : 'rMenu7',
				text : '全部删除',
				handler : del_all,
				hidden : compareAuth('FAC_DEL')
			},*/{
				id : 'rMenu8',
				text : '全部审核',
				hidden : compareAuth('FAC_AUDIT'),
				handler : auditMat
			}]
});
function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/AdvSearchMaterialForBaselib'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "subcid", "name", "spec", "unit", "issueDate", "notes",
				"quotjyj", "quotgcj", "grade", "cid", "addr", "brand",
				'topPhoto', "pricem", "code", "code2012", "updateOn",
				"updateBy" ]),
		baseParams : {
			// type : 'fac_ex',
			type : 'fac',
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
		timeout : 2 * 60 * 1000
	});
	ds.setDefaultSort("updateOn", "DESC");
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});

	var expander = new Ext.ux.grid.RowExpander({
				expandOnDblClick : false,
				tpl : new Ext.Template('<p><b>备注:</b> {notes}</p><br>'),
				expendable : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
		title : "<font color='red'>" + fname + "</font>-未审核材料报价",
		loadMask : true,
		// autoWidth : true,
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		autoScroll : true,
		store : ds,
		plugins : [expander],
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		columns : [new Ext.grid.RowNumberer({
			width : 30
		}), sm, expander, {
				header : 'id',
				sortable : false,
				dataIndex : 'id',
				hidden : true
			},/* {
				header : '二级分类',
				sortable : true,
				dataIndex : 'subcid',
				renderer : function(v){
					if(!v){
						return "";
					}
					var subCidName = getSubCidNameBySubcid(v, true);
					if(subCidName){
						return subCidName;
					}
					return v;
				},
				editor:{
					xtype:'combo',
					mode : 'local',
					store:'',
					editable : false,
					triggerAction : 'all',
					valueField : "value",
					displayField : "text",
					readOnly : true
				}
			},*/ {
				header : '材料名称',
				sortable : false,
				dataIndex : 'name',
				renderer:showName,
				editor : {
					xtype : 'textfield'
				},
				width:250
			}, {
				header : '型号规格',
				sortable : false,
				dataIndex : 'spec',
				editor : {
					xtype : 'textfield'
				}
			
			}, {
				header : '单位',
				sortable : false,
				dataIndex : 'unit',
				editor : {
					xtype : 'textfield'
				}
			
			}, {
				header : '产地',
				sortable : true,
				dataIndex : 'addr'
			}, {
				header : '品牌',
				sortable : true,
				dataIndex : 'brand',
				editor : {
					xtype : 'textfield',
					allowBlank : true
				}
			}, {
				header : '材料档次',
				sortable : true,
				dataIndex : 'grade',
				renderer : function(v){
					return getGradeById(v);
				},
				editor : {
					xtype : 'combo',
					allowBlank : false,
					store : Grade_DB,
					emptyText : "请选择",
					mode : "local",
					triggerAction : "all",
					valueField : "value",
					displayField : "text",
					readOnly : true
				}
			}, {
				header : '建议价系数',
				sortable : false,
				dataIndex : 'quotjyj',
				editor : {
					xtype : 'numberfield'
				}
			}, {
				header : '工程价系数',
				sortable : false,
				dataIndex : 'quotgcj',
				editor : {
					xtype : 'numberfield'
				}
			}, {
				header : "面价",
				sortable : false,
				dataIndex : 'pricem',
				editor : {
					xtype : 'numberfield'
				}
			}, {
				header : '更新日期',
				sortable : true,
				dataIndex : 'updateOn'
			
			}, {
				header : '更新人',
				sortable : true,
				dataIndex : 'updateBy'
			}],
		renderTo : 'mat_grid',
		bbar : pagetool,
		tbar : [{
					text : '图片库',
					icon : '/resource/images/images.png',
					handler : showPicArea
				}, '-', {
					text : '查看/修改',
					icon : '/resource/images/edit.gif',
					handler : function() {
						var row = grid.getSelectionModel().getSelected();
						if (Ext.isEmpty(row)) {
							Info_Tip("请选择一条信息。");
							return;
						}
						//showEditStuff('', row)
						gotoUpdatePage();
					},
					hidden : compareAuth('FAC_MOD')
				}, /*'-', {
					text : '批量修改',
					icon : '/resource/images/edit.gif',
					handler : function() {
						if (grid.getSelectionModel().getCount() > 0) {

							Ext.Msg.show({
								title : '修改',
								msg : '由于您选择了数据，可点击相应按钮执行不同操作。',
							buttons : {yes:' 批量修改所选 ',no:'修改全部',cancel:'取消'}	,
								fn : function(bn, text) {
									if (bn == "yes") {

										var rows = grid.getSelectionModel()
												.getSelections();

										for (var i = 0; i < rows.length; i++) {
											if (i != 0) {
												row += "," + rows[i].get('id');
											} else {
												row = rows[i].get('id');
											}
										}
										showEditStuff('mult', row);
										// Ext.Msg.alert(grid.getSelectionModel().getSelections()[]);

									} else if (bn == "no") {
										showEditStuff('all');
									}
								}
							});

						} else {
							showEditStuff('all');
						}
					},
					hidden : compareAuth('FAC_MOD')
				}, */'-', {
					text : '导出材价',
					icon : '/resource/images/page_excel.png',
					tooltip : '不选择材料则导出全部材料',
					hidden : compareAuth('FAC_DOWNLOAD'),
					handler : downFile
				}, '-', {
					text : '上传材料',
					icon : '/resource/images/page_add.png',
					hidden : compareAuth('FAC_UPLOAD'),
					handler : showUpArea
				}, '-', /**{
					text : '标准文件',
					icon : '/resource/images/page_link.png',
					handler : downTemp
				}, **/'-', {
					text : '批量删除',
					icon : '/resource/images/delete.gif',
					handler : del_sel,
					hidden : compareAuth('FAC_DEL')
				}/*,  '-', {
					text : '全部删除',
					icon : '/resource/images/database_delete.png',
					handler : del_all,
					hidden : compareAuth('FAC_DEL')
				}*/,"-",{
					text : '全部审核',
					id : 'audit_btn',
					icon : '/resource/images/tick.png',
					handler : auditMat,
					hidden : compareAuth('FAC_AUDIT')
				}, "-", {
					text : '进入已审核列表',
					id : 'check_list',
					icon : '/resource/images/application_double.png',
					handler : mat_price
				}]
	});
	
	function showName(value, p, record) {
		var img = record.data.topPhoto;
		var name = record.data.name;
		var stName = "";
		if (img != null && img != "") {
			stName = "<div style='float:left;'><image src='/ext/resource/images/img_default.jpg'/></div><div style='float:left;'>"
					+ name
					+ "</div>";
		} else {
			stName = "&nbsp;&nbsp;&nbsp;&nbsp;"+name;
		}
		return stName;
	}
	
	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items:[{
			xtype : "label",
			text : "名称："
		},{
			id : 'input_name',
			xtype : 'textfield'
		},'-',{
			xtype : "label",
			text : "型号规格："
		},{
			id : 'input_spec',
			xtype : 'textfield'
		},{
			xtype : 'button',
			icon : '/resource/images/zoom.png',
			text : '查询',
			handler : searchlist

		}]
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	ds.load();
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
	grid.on('beforeedit', function(e) {
				if (!compareAuth('FAC_MOD')){
					if(e.field == 'subcid'){
						var ed = this.colModel.getCellEditor(e.column, e.row);
						ed.field.store = subcidStore;
						subcidStore.loadData(getSubCidNameArrayBySubcid(e.value));
					}
					return true;
				}
				else
					return false;
			});
	grid.on("validateedit", function(e) {
				if (e.value.length == 0 && !e.record.data[e.field]) {
					return false;
				}
				switch (e.field) {
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
				if (compareAuth('FAC_MOD')) {

					return;
				}
				saveInfo_list(e.record.id, e.field, e.record.data[e.field]);
			});
};

// 保存列表修改信息
function saveInfo_list(thisid, field, data) {

	var content = "&content=" + field + "~" + handlerSpec(data);
	Ext.lib.Ajax.request("post", "/FacMaterial.do?type=2", {
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
			}, "id=" + thisid + content);
};

// 查询列表
function searchlist() {
	var content = "fid~" + eid + ";name~" + Ext.fly("input_name").getValue() + ";spec~"
			+ Ext.fly("input_spec").getValue();
	ds.baseParams["content"] = content;
	ds.load();
};

// 显示修改材料
function showEditStuff(v, data) {
	var bol = false, bolall = false;
	if (Ext.isEmpty(v)) {
		bol = false;
		bolall = true;
		bolmult = true;

		var path = "";
		if (data.get('topPhoto') != null && data.get('topPhoto') != "") {
			path = data.get('topPhoto').split(".");
			path = path[0] + "_230." + path[1];
		} else {
			path = "/ep/default/eplogo.jpg";
		}
		
		subcidStore.loadData(getSubCidByCid(data.get("cid")));
		
		stuff_form = new Ext.form.FormPanel({
			layout : 'form',
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
						id : 'cid',
						xtype : 'combo',
						fieldLabel : '一级分类',
						allowBlank : false,
						store : cidStore,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						displayField : "text",
						readOnly : true,
						value : data.get("cid"),
						listeners:{
							'select':function(){
								var cid = Ext.getCmp("cid").getValue();
								var subCidArray = getSubCidNameByCid(cid);
								var subCid1 = subCidArray[0][0];
								subcidStore.loadData(subCidArray);
								Ext.getCmp("subcid").setValue(subCid1);
							}
						}
					}, {
						id : 'subcid',
						xtype : 'combo',
						fieldLabel : '二级分类',
						allowBlank : false,
						store : subcidStore,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						displayField : "text",
						readOnly : true,
						value : data.get("subcid")
					},{
						fieldLabel : '国标编码',
						id : 'code2010',
						width : 164,
						xtype : 'textfield',
						maxLength : 10,
						value : data.get("code2010")
					}, {
						fieldLabel : '规格型号',
						id : 'spec',
						width : 164,
						xtype : 'textfield',
						allowBlank : false,
						maxLength : 360,
						value : data.get("spec")
					}, {
						fieldLabel : '单位',
						id : 'unit',
						width : 164,
						xtype : 'textfield',
						allowBlank : false,
						maxLength : 32,
						value : data.get("unit")
					}, {
						fieldLabel : '产地',
						id : 'addr',
						width : 164,
						xtype : 'textfield',
						allowBlank : true,
						maxLength : 12
					}, {
						fieldLabel : '品牌',
						id : 'brand',
						width : 164,
						xtype : 'textfield',
						allowBlank : true,
						maxLength : 36,
						value : data.get("brand")
					}, {
						fieldLabel : '材料档次',
						id : 'grade',
						xtype : 'combo',
						allowBlank : false,
						store : Grade_DB,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						displayField : "text",
						readOnly : true,
						value : data.get("grade")
					},{
						fieldLabel : '建议价系数',
						id : 'quotjyj',
						width : 164,
						xtype : 'numberfield',
						allowBlank : false,
						regex : /^((0.){1}(\d){0,4})|(1)$/,
						regexText : '请正确填写系数!必须大于0,小于等于1.',
						value : data.get("quotjyj")
					}]
				}, {
					columnWidth : 0.5,
					layout : 'form',
					bodyStyle : 'border:none;',
					labelAlign : 'right',
					items : [{
						bodyStyle : 'border:1px solid #ccc;',
						width : 230,
						height : 230,
						html : "<img id='mat_img' width='230' height='230'  src='"
								+ FileSite + path + "'/>"
					}, {
						xtype : 'button',
						text : '更新图片',
						handler : choose
					}]
				}]
			}, {
				layout : 'column',
				bodyStyle : 'border:none;',
				items : [{
							layout : 'form',
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							items : [{
										fieldLabel : '工程价系数',
										id : 'quotgcj',
										width : 164,
										xtype : 'numberfield',
										allowBlank : false,
										regex : /^((0.){1}(\d){0,4})|(1)$/,
										regexText : '请正确填写系数!必须大于0,小于等于1.',
										value : data.get("quotgcj")
									}]
						}, {
							layout : "form",
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							labelWidth : 30,
							items : [{
										fieldLabel : '面价',
										id : 'pricem',
										width : 164,
										xtype : 'numberfield',
										allowBlank : false,
										regex : /^(\d){0,12}(.){0,1}(\d){0,4}$/,
										regexText : '请正确填写价格',
										value : data.get("pricem")
									}]
						}]
			}, {
				xtype : "textarea",
				fieldLabel : '备注',
				id : "notes",
				width : 480,
				value : data.get("notes")
			}]
		});
	} else if (v == "mult") {
		bol = true;
		bolall = true;
		bolmult = false;
		stuff_form = new Ext.form.FormPanel({
					layout : 'form',
					labelWidth : 80,
					bodyStyle : 'padding:6px;',
					items : [{
						layout : 'column',
						bodyStyle : 'border:none;',
						items : [{
							layout : 'form',
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							items : [{
										id : 'cid',
										xtype : 'combo',
										width:160,
										fieldLabel : '一级分类',
										allowBlank : false,
										store : cidStore,
										emptyText : "请选择",
										mode : "local",
										triggerAction : "all",
										valueField : "value",
										displayField : "text",
										readOnly : true,
										listeners : {
											'select' : function() {
												var cid = Ext.getCmp("cid").getValue();
												var subcidArray = getSubCidNameByCid(cid);
												var subcid1 = subcidArray[0][0];
												subcidStore.loadData(subcidArray);
												Ext.getCmp("subcid").setDisabled(false);
												Ext.getCmp("subcid").setValue(subcid1);
											}
										}
										
									}, {
										id : 'subcid',
										xtype : 'combo',
										width:160,
										fieldLabel : '二级分类',
										allowBlank : false,
										emptyText : "请选择",
										store : subcidStore,
										mode : "local",
										disabled:true,
										triggerAction : "all",
										valueField : "value",
										displayField : "text",
										readOnly : true
									},{
										fieldLabel : '国际编码',
										id : 'code2010',
										width : 164,
										xtype : 'textfield',
										allowBlank : true,
										maxLength : 10
									}, {
										fieldLabel : '规格型号',
										id : 'spec',
										width : 164,
										xtype : 'textfield',
										allowBlank : true,
										maxLength : 360
									}, {
										fieldLabel : '单位',
										id : 'unit',
										width : 164,
										xtype : 'textfield',
										allowBlank : true,
										maxLength : 32
									},
									 {
										fieldLabel : '产地',
										id : 'addr',
										width : 164,
										xtype : 'textfield',
										allowBlank : true,
										maxLength : 12
									}, {
										fieldLabel : '品牌',
										id : 'brand',
										width : 164,
										xtype : 'textfield',
										allowBlank : true,
										maxLength : 36
									}]
						}, {
							layout : "form",
							bodyStyle : 'border:none;',
							columnWidth : 0.5,
							labelWidth : 80,
							items : [{
								fieldLabel : '材料档次',
								id : 'grade',
								xtype : 'combo',
								width:160,
								allowBlank : true,
								store : Grade_DB,
								emptyText : "请选择",
								mode : "local",
								triggerAction : "all",
								valueField : "value",
								displayField : "text",
								readOnly : true
							},{
								fieldLabel : '建议价系数',
								id : 'quotjyj',
								width : 164,
								xtype : 'numberfield',
								allowBlank : true,
								regex : /^((0.){1}(\d){0,4})|(1)$/,
								regexText : '请正确填写系数!必须大于0,小于等于1.'
							}, {
								fieldLabel : '工程价系数',
								id : 'quotgcj',
								width : 164,
								xtype : 'numberfield',
								allowBlank : true,
								regex : /^((0.){1}(\d){0,4})|(1)$/,
								regexText : '请正确填写系数!必须大于0,小于等于1.'
							}, {
								fieldLabel : '面价',
								id : 'pricem',
								width : 164,
								xtype : 'numberfield',
								allowBlank : true,
								regex : /^(\d){0,12}(.){0,1}(\d){0,4}$/,
								regexText : '请正确填写价格'
							},{
								xtype : "textarea",
								fieldLabel : '备注',
								id : "notes",
								width : 164,
								height : 75
							}]
						}]
					}]
				});
	} else {
		bol = true;
		bolmult = true;
		bolall = false;
		stuff_form = new Ext.form.FormPanel({
					layout : 'form',
					labelWidth : 80,
					bodyStyle : 'padding:6px;',
					items : [{
						fieldLabel : '材料档次',
						id : 'grade',
						xtype : 'combo',
						allowBlank : true,
						store : Grade_DB,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						displayField : "text",
						readOnly : true
					}, {
						fieldLabel : '面价浮动率',
						id : 'priceRate',
						width : 164,
						xtype : 'numberfield',
						allowBlank : true,
						regex : /^(\d+)$/,
						regexText : '请正确填写系数!必须大于0,小于等于1.'
					}, {
						fieldLabel : '建议价系数',
						id : 'quotjyj',
						width : 164,
						xtype : 'numberfield',
						allowBlank : true,
						regex : /^((0.){1}(\d){0,4})|(1)$/,
						regexText : '请正确填写系数!必须大于0,小于等于1.'
					}, {
						fieldLabel : '工程价系数',
						id : 'quotgcj',
						width : 164,
						xtype : 'numberfield',
						allowBlank : true,
						regex : /^((0.){1}(\d){0,4})|(1)$/,
						regexText : '请正确填写系数!必须大于0,小于等于1.'
					}, {
						fieldLabel : '发布日期',
						id : 'issueDate',
						width : 164,
						xtype : 'datefield',
						format : 'Y-m-d',
						readOnly : true
					}]
				});
	}

	win = new Ext.Window({
				title : bolall?(bolmult?'修改材料':'批量修改材料'):'修改全部材料',
				autoWidth : true,
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
							handler : function() {
								saveMultInfo(data);
							},
							hidden : bolmult
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
			url : '/FacMaterial.do?type=2',
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改材料成功。");
					expander.bodyContent[thisid] = '<p><b>备注:</b>'
							+ stuff_form.getForm().items.map["notes"]
									.getValue() + '</p><br>';
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
// 保存修改多条材料信息
function saveMultInfo(thisid) {
	if (stuff_form.getForm().isValid()) {

		var content = [];
		var len = stuff_form.getForm().items.length;
		for (var i = 0; i < len; i++) {
			if ((stuff_form.getForm().items.map[stuff_form.getForm().items.keys[i]]
					.getValue() + "").length > 0) {
				//if(stuff_form.getForm().items.keys[i] == "comboProvinces"){
				//	province_addr = handlerSpec(stuff_form.getForm().items.map[stuff_form.getForm().items.keys[i]].getValue());
				//}else if(stuff_form.getForm().items.keys[i] == "comboCities"){
				//	city_addr = handlerSpec(stuff_form.getForm().items.map[stuff_form.getForm().items.keys[i]].getValue());
				//}else{
					content.push(stuff_form.getForm().items.keys[i]
							+ "~"
							+ handlerSpec(stuff_form.getForm().items.map[stuff_form
									.getForm().items.keys[i]].getValue()));
				//}
			}
		}
		content = content.toString().replace(/,/g, ";");
		//addr = province_addr + " " + city_addr;
		//if(addr != null && addr != ""){
		//	content += ";addr~" + addr;
		//}
		Ext.Ajax.request({
			url : '/FacMaterial.do?type=2',
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
			url : '/FacMaterial.do?type=3',
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

// 下载材料报价
function downFile() {
	var form = document.downform;
	var content = 'fid~' + eid + ";isDeleted~0;isAudit~0";
	form.action = '/MaterialDownload.do?type=fac_admin&content=' + content;
	form.submit();
};

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
									html : "<a href='javascript:void(0)' onclick='downTemp()'>标准文档下载</a>"
								}
							}]
				}]
	});
	win = new Ext.Window({
				title : '材料报价上传',
				closeable : true,
				width : 640,
				height : 120,
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
function submitForm() {
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/FacMaterialUpload.do?type=1&fid=' + eid,
			waitMsg : '上传文件中...',
			success : function(upload_form, o) {
			}
		});
	} else
		Info_Tip("请正确填写信息。");
};
// 上传返回信息
function getResult(flag, msg) {
	if (flag) {
		Info_Tip("上传成功。");
		win.close();
		ds.reload();
	} else {
		Info_Tip(msg);
	}
};

//批量删除
function del_sel() {
	var ids = [];
	var sels = grid.getSelectionModel().getSelections();
	for (var i = 0; i < sels.length; i++) {
		ids.push(sels[i].get('id'));
	}
	if (ids.length < 1) {
		Info_Tip("请选择材料。");
		return;
	}
	ids = ids.join().replace(/,/g, ";");
	Ext.MessageBox.confirm("确认操作", "你确认删除你所选择的材料吗？", function(o) {
				if (o == "yes") {
					Ext.lib.Ajax.request("post", '/FacMaterial.do?type=25', {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "ids=" + ids.toString() + "&fid=" + eid);
				}
			});

};


/*// 批量删除
function del_sel() {
	var ids = [];
	var sels = grid.getSelectionModel().getSelections();
	for (var i = 0; i < sels.length; i++) {
		ids.push(sels[i].get('id'));
	}
	if (ids.length < 1) {
		Info_Tip("请选择材料。");
		return;
	}
	ids = ids.join().replace(/,/g, ";");
	alert(ids);
	Ext.MessageBox.confirm("确认操作", "你确认删除你所选择的材料吗？", function(o) {
				if (o == "yes") {
					Ext.lib.Ajax.request("post", '/FacMaterial.do?type=8', {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("修改删除成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "ids=" + ids.toString() + "&fid=" + eid + "&isAudit=0");
				}
			});

};*/

// 全部删除
function del_all() {
	Ext.MessageBox.confirm("确认操作", "你确认删除该供应商的未审核的所有材料报价吗？", function(o) {
				if (o == "yes") {
					Ext.lib.Ajax.request("post", '/FacMaterial.do?type=24', {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "fid=" + eid);
				}
			});
};

// 审核材料
function auditMat() {
	var loadMarsk = new Ext.LoadMask(document.body, {    
	    msg:'正在处理数据，请稍候......',    
	    removeMask:true // 完成后移除    
	}); 
	
	Ext.MessageBox.alert("提示","请注意！没有填写二级分类的材料将不会审核通过。",function(){
		loadMarsk.show();
		Ext.lib.Ajax.request("post", '/FacMaterial.do?type=7', {
			success : function(response) {
				var jsondata = eval("("
						+ response.responseText + ")");
				if (getState(jsondata.state,
						commonResultFunc, jsondata.result)) {
					ds.reload();
					if (window.parent.tab_mat_fac_detail_iframe){
						window.parent.tab_mat_fac_detail_iframe.ds.reload();
					}
				}
				loadMarsk.hide();
			},
			failure : function() {
				Warn_Tip();
			}
		}, "fid=" + eid);
	});
};

// 显示图片库区域
function showPicArea() {
	pic_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/FacMaterialPic.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['name', 'path', "id", {
									name : 'size',
									type : 'float'
								}, {
									name : 'upTime',
									type : 'date',
									dateFormat : 'timestamp'
								}]),
				baseParams : {
					type : 4,
					fid : eid
				}
			});
	pic_ds.load();
	var tpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="thumb-wrap" id="pic_{id}">',
			'<div class="thumb"><img src="{changePath}" title="{name}" width="80" height="80" _id="{id}"></div>',
			'<span style="text-align:left;float:left;">名称：</span><span style="text-align:left;float:left;">{shortName}</span>',
			'<div class="x-clear"></div>',
			'<span style="text-align:left;float:left;">描述：</span><span style="display:block;text-align:left;float:left;height:30px;">{shortDescription}</span></div>',
			'</tpl>',
			// '<span class="x-editable">{shortName}</span></div>', '</tpl>',
			'<div class="x-clear"></div>');
	var imgshow = new Ext.Panel({
				id : 'images-view',
				title : "图片显示",
				frame : true,
				autoWidth : true,
				height : 260,
				autoScroll : true,
				collapsible : true,
				layout : 'fit',
				items : new Ext.DataView({
							store : pic_ds,
							tpl : tpl,
							autoHeight : true,
							autoWidth : true,
							multiSelect : true,
							overClass : 'x-view-over',
							itemSelector : 'div.thumb-wrap',
							emptyText : '没有图片显示，请先上传再进行选择。',
							plugins : [new Ext.DataView.DragSelector(),
									new Ext.DataView.LabelEditor({
												dataIndex : 'name'
											})],
							prepareData : function(data) {
								data.shortName = Ext.util.Format.ellipsis(
										data.name, 15);
								data.sizeString = Ext.util.Format
										.fileSize(data.size);
								data.dateString = data.upTime.format("Y-m-d");
								data.changePath = FileSite + data.path;
								return data;
							},
							listeners : {
								selectionchange : {
									fn : function(dv, nodes) {
										pid = Ext.get(nodes[0]).child('img')
												.getAttribute("_id");
									}
								}
							}
						})
			});
	var picup = new Ext.form.TextField({
				inputType : "file",
				id : "upPic",
				height : 26
			});
	picform = new Ext.form.FormPanel({
		laeblAlign : "right",
		frame : true,
		fileUpload : true,
		layout : "form",
		labelWidth : 50,
		hidden : compareAuth('CORP_PIC_ADD'),
		items : [{
			layout : 'table',
			layoutConfig : {
				columns : 4
			},
			items : [{
						xtype : 'label',
						width : 50,
						text : "名称："
					}, {
						xtype : "textfield",
						fieldLabel : "名称",
						id : "name_input"
					}, {
						xtype : 'button',
						text : '上传图片',
						handler : function() {
							FileUpload_Ext.requestId = eid;
							FileUpload_Ext.requestType = "RS_EP";
							FileUpload_Ext.requestMethod = '/file/CommonUpload';
							FileUpload_Ext.callbackFn = '';
							FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif|PNG|png/;
							FileUpload_Ext.initComponent();
						}
					},{
						xtype : 'button',
						text : '批量上传图片',
						handler : function(){
							FileUpload_Ext.requestId = eid;
							FileUpload_Ext.requestType = "RS_EP";
							FileUpload_Ext.requestMethod = '/file/MultiUpload';
							FileUpload_Ext.callbackFn = 'saveMultiPic';
							FileUpload_Ext.fileType = /zip/;
							FileUpload_Ext.initComponent();
						}
					}]
		}, {
			layout : 'table',
			style : 'margin-top:5px;',
			layoutConfig : {
				columns : 1
			},
			items : [{
				html:'<font color="red">（图片类型：jpg,jpeg，建议尺寸300x300，大小不能超过150k。批量上传格式为zip压缩包格式，所含图片格式与单个上传一致）</font>'
			}]
		}]
	});
	win = new Ext.Window({
				title : "材料图片库",
				autoHeight : true,
				width : 780,
				closable : true,
				draggable : true,
				modal : true,
				border : false,
				plain : true,
				closeAction : "close",
				buttonAlign : 'center',
				items : [imgshow, picform],
				buttons : [
						{
							text : '自动匹配图片',
							hidden : compareAuth('CORP_PIC_DEL'),
							handler : markPic
						},
				           {
							text : '删除选定图片',
							handler : del_selpic

						}, {
							text : '删除所有图片',
							handler : del_allpic
						}, {
							text : "关闭",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

//自动匹配图片
function markPic(){
	Ext.Ajax.request({
		url : '/FacMaterial.do',
		params : {
			type : 23,
			fid : eid,
			audit : 1//未审核
		},
		success : function(response) {
			Info_Tip("图片匹配成功。");
			win.close();
			ds.reload();
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

//上传文件自定义操作
function upload_fn() {
	savePicPath(FileUpload_Ext.callbackMsg);
};

function saveMultiPic(){
	var msg = FileUpload_Ext.callbackMsg;
	Ext.Ajax.request({
		url:'/FacMaterialPic.do',
		method:'POST',
		params:{
			type:8,
			fid:eid,
			obj:msg
		},
		success:function(response){
			pic_ds.reload();
		},
		failure:function(){
			Warn_tip();
		}
	});
}

// 保存材料图片
function savePicPath(path) {
	Ext.Ajax.request({
				url : '/FacMaterialPic.do',
				params : {
					type : 1,
					fid : eid,
					path : path,
					name : Ext.fly("name_input").getValue()
				},
				success : function(response) {
					Ext.fly('name_input').dom.value = "";
					pic_ds.reload();

				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 上传图片
function uploadPic() {
	if (picform.getForm().isValid()) {
		picform.getForm().submit({
			url : '/FacMaterialPic.do?fid=' + eid + "&name="
					+ Ext.fly("name_input").getValue() + "&type=1",
			waitMsg : '上传图片中...'
		});
	}
};

// 删除选定图片
function del_selpic() {
	if ((pid || "") == "") {
		Info_Tip("请选择一张图片。");
		return;
	}
	Ext.MessageBox.confirm("确认操作", "您确认要删除选中的图片吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/FacMaterialPic.do',
								params : {
									type : 5,
									pid : pid
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("图片删除成功。");
										Ext.fly("pic_" + pid).remove();
									}
								},
								faliure : function() {
									Warn_Tip();
								}
							})
				}
			})
};

// 删除所有图片
function del_allpic() {
	Ext.MessageBox.confirm("确认操作", "您确认要删除该供应商所有的图片吗？", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
								url : '/FacMaterialPic.do',
								params : {
									type : 2,
									fid : eid
								},
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("图片删除成功。");
										Ext.select(".thumb-wrap").each(
												function(el) {
													Ext.get(el).remove();
												});
									}
								},
								faliure : function() {
									Warn_Tip();
								}
							})
				}
			})
};
// 标准文件下载
function downTemp() {
	window.location.href = FileSite + "/doc/fac_price_sample.xls";
};
// 进入厂商报价已审核列表
function mat_price() {
	window.parent.createNewWidget("mat_fac_detail", '已审核材料列表',
			'/module/mat/mat_fac_detail.jsp?eid=' + eid + "&fname="
					+ encodeURI(fname));
};

var chooser;
function choose() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条材料。");
		return;
	}
	chooser = new ImageDetail({
				url : '/FacMaterialPic.do',
				width : 780,
				height : 470,
				type : 4,
				id : eid,
				mid : row.get('id'),
				row : row
			});

	chooser.show();
};

// 建材分类
function changeCname(v) {
	if (v) {
		var array = v.split('/');
		if (array.length > 1)
			return array[array.length - 2];
	}
	return "";
};