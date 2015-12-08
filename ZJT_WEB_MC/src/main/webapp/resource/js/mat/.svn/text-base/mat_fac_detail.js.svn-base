Ext.onReady(init);
var grid, ds, win, eid, stuff_form, upload_form, pagesize = 30, pic_ds, pid;
var fname;
var picView;
var temp = new Ext.Template('<p><b>备注:</b> {notes}</p><br>');
var expander;
var opFlag = false;
var mName;
var mSpec;
var mCode;
var appContent = "";

// 全局变量，标识是否修改企业的所有材料信息，在点击功能按钮后设置该值的状态
var isAllMat = false;

var cidArray = getCidNameArray();
var cgCidArray = getCgCidNameArray();
var cidStore = new Ext.data.ArrayStore({
	fields : [ 'value', 'text' ],
	data : cidArray
});

var subcidStore = new Ext.data.ArrayStore({
	fields : [ 'value', 'text' ],
	data : []
});

var cgCidStore = new Ext.data.ArrayStore({
	fields : [ 'value', 'text' ],
	data : cgCidArray
});

var cgSubcidStore = new Ext.data.ArrayStore({
	fields : [ 'value', 'text' ],
	data : []
});

function init() {
	eid = getCurArgs("eid");
	fname = decodeURI(getCurArgs("fname"));
	mName = getCurArgs("mName");
	mSpec = getCurArgs("mSpec");
	mCode =  getCurArgs("mCode");
	if ("undefined" != mCode && mCode != null && "" != mCode){
		appContent = ";code~" + mCode;
	}
	Ext.Ajax.timeout = 900000;
	buildGrid();

	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '双击信息可以显示备注详细，再次双击可以编辑列表信息。');
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
	id : 'rightClickCont',
	shadom : false,
	items : [
			{
				id : 'rMenu1',
				text : '图片库',
				hidden : compareAuth('CORP_PIC_MANAGE'),
				handler : function() {
					showPicArea();
				}
			},
			{
				id : 'rMenu2',
				text : '查看/修改',
				hidden : compareAuth('FAC_MOD'),
				handler : function() {
					gotoUpdatePage();
					// showEditStuff('', row);
				}
			},
			{
				id : 'rMenu3',
				text : '修改所有材料',
				hidden : compareAuth('FAC_MOD'),
				handler : function() {
					if (grid.getSelectionModel().getCount() > 0) {
						Ext.Msg.show({
							title : '修改',
							msg : '由于您选择了数据，可点击相应按钮执行不同操作。',
							buttons : {
								yes : ' 批量修改所选 ',
								no : '修改全部',
								cancel : '取消'
							},
							fn : function(bn, text) {
								if (bn == "yes") {

									var rows = grid.getSelectionModel()
											.getSelections();

									for ( var i = 0; i < rows.length; i++) {
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
					// showEditStuff('all');
				}
			}, {
				id : 'rMenu4',
				text : '导出材价',
				hidden : compareAuth('FAC_DOWNLOAD'),
				handler : downFile
			}, {
				id : 'rMenu5',
				text : '上传材价',
				hidden : compareAuth('FAC_UPLOAD'),
				handler : showUpArea
			} 
			, { id : 'rMenu6', text : '删除', handler : del_sel, hidden :
				  compareAuth('FAC_DEL') }, /*{ id : 'rMenu7', text : '全部删除',
				 * handler : del_all, hidden : compareAuth('FAC_DEL') }, { text :
				 * '查看材料图片', handler : choose }
				 */]
});

// 跳转到查看/修改
function gotoUpdatePage() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条材料");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一条材料");
		return;
	}

	var row = grid.getSelectionModel().getSelected();
	var id = row.get("id");
	window.parent.createNewWidget("matFacUpdate", '查看/修改',
			'/module/mat/mat_fac_update.jsp?id=' + id);
}

function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/AdvSearchMaterialForBaselib'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "subcid", "name", "spec", "unit", "issueDate", "notes",
				"quotjyj", "quotgcj", "grade", "cid", "cgCid", "cgSubcid", "addr", "brand",
				"topPhoto", "pricem", "code", "code2012", "createOn",
				"createBy", "updateOn", "updateBy", "cityCircleId","cbianma" ]),
		baseParams : {
			type : 'fac',
			page : 1,
			pageSize : pagesize,
			content : 'fid~' + eid + ";isDeleted~0" + appContent,
			isaudit : 1
		},
		countUrl : '/CountMaterialForBaselib',
		countParams : {
			types : 1
		},
		remoteSort : true,
		timeout : 2 * 60 * 1000
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
	grid = new Ext.grid.EditorGridPanel(
			{
				title : "<font color='red'>" + fname + "</font>-材价",

				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				autoScroll : true,
				store : ds,
				loadMask : true,
				plugins : [ expander ],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [ new Ext.grid.RowNumberer({
					width : 30
				}), sm, expander, {
					header : 'id',
					sortable : false,
					dataIndex : 'id',
					hidden : true
				}, {
					header : '材料编码',
					sortable : true,
					dataIndex : 'code',
					width : 160
				}, {
					header : '造价二级分类',
					sortable : true,
					dataIndex : 'subcid',
					width : 160,
					renderer : function(v) {
						if (!v) {
							return "";
						}
						var subCidName = getSubCidNameBySubcid(v, true);
						if (subCidName) {
							return subCidName;
						}
						return v;
					},
					editor : {
						xtype : 'combo',
						mode : 'local',
						store : '',
						editable : false,
						triggerAction : 'all',
						valueField : "value",
						displayField : "text",
						readOnly : true
					}
				},{
					header : '采购二级分类',
					sortable : true,
					dataIndex : 'cgSubcid',
					width : 160,
					renderer : function(v,mata,record){
						var cgSubcid = record.get("cgSubcid");
						var cgSubCidName = getCgSubCidNameByCgSubcid(cgSubcid, true);
						if (cgSubCidName) {
							return cgSubCidName;
						}
						return "";
					},
					editor : {
						xtype : 'combo',
						mode : 'local',
						store : '',
						editable : false,
						triggerAction : 'all',
						valueField : "value",
						displayField : "text",
						readOnly : true
					}
				}, {
					header : '材料名称',
					sortable : false,
					dataIndex : 'name',
					renderer : showName,
					editor : {
						xtype : 'textfield'
					},
					width : 250
				}, {
					header : '型号规格',
					sortable : false,
					dataIndex : 'spec',
					width : 160,
					editor : {
						xtype : 'textfield'
					}

				}, {
					header : '单位',
					sortable : false,
					dataIndex : 'unit',
					width : 65,
					editor : {
						xtype : 'textfield'
					}

				}, {
					header : '产地',
					sortable : true,
					dataIndex : 'addr',
					width : 110
				}, {
					header : '品牌',
					sortable : true,
					dataIndex : 'brand',
					width : 65,
					editor : {
						xtype : 'textfield',
						allowBlank : true
					}
				}, {
					header : '材料档次',
					sortable : true,
					dataIndex : 'grade',
					renderer : getGradeById,
					width : 65,
					editor : {
						xtype : 'combo',
						allowBlank : false,
						store : Grade_DB,
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
					renderer : function(value, meta, record) {
						var price = record.get("pricem");
						if (price == null) {
							price = "0.0000";
						}
						var rPrice = price;
						/*if (parseFloat(price) > 100){
							rPrice = parseInt(Math.round(price));
						}else{
							rPrice = Math.round(price).toFixed(2);
						}*/
						return rPrice;
					},
					editor : {
						xtype : 'numberfield'
					}
				}, {
					header : '更新日期',
					sortable : true,
					width : 160,
					dataIndex : 'updateOn',
					renderer : function(v) {
						if (!v) {
							return "";
						}
						
						//return v.split(" ")[0];
						return v;
					},

				}, {
					header : '更新人',
					sortable : true,
					dataIndex : 'updateBy'
				} ],
				renderTo : 'mat_grid',
				bbar : pagetool,
				tbar : [
						{
							text : '图片库',
							icon : '/resource/images/images.png',
							hidden : compareAuth('CORP_PIC_MANAGE'),
							handler : showPicArea
						},
						'-',
						{
							text : '查看/修改',
							icon : '/resource/images/edit.gif',
							tooltip : '单条材料修改',
							handler : function() {

								var row = grid.getSelectionModel()
										.getSelected();
								if (Ext.isEmpty(row)) {
									Info_Tip("请选择一条信息。");
									return;
								}
								// showEditStuff('', row);
								gotoUpdatePage();
							},
							hidden : compareAuth('FAC_MOD')
						},
						'-',
						{
							text : '批量修改',
							icon : '/resource/images/edit.gif',
							tooltip : '该供应商所有材料修改',
							handler : function() {
								if (grid.getSelectionModel().getCount() > 0) {

									Ext.Msg
											.show({
												title : '修改',
												msg : '由于您选择了数据，可点击相应按钮执行不同操作。',
												buttons : {
													yes : ' 批量修改所选 ',
													no : '修改全部',
													cancel : '取消'
												},
												fn : function(bn, text) {
													if (bn == "yes") {

														var rows = grid
																.getSelectionModel()
																.getSelections();

														for ( var i = 0; i < rows.length; i++) {
															if (i != 0) {
																row += ","
																		+ rows[i]
																				.get('id');
															} else {
																row = rows[i]
																		.get('id');
															}
														}
														showEditStuff('mult',
																row);

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
						},
						'-',
						{
							text : '导出材价',
							icon : '/resource/images/page_excel.png',
							hidden : compareAuth('FAC_DOWNLOAD'),
							handler : downFile
						},
						'-',
						{
							text : '上传材价',
							icon : '/resource/images/page_add.png',
							hidden : compareAuth('FAC_UPLOAD'),
							handler : showUpArea
						}/*
							 * , '-', { text : '标准文件', icon :
							 * '/resource/images/page_link.png', handler :
							 * downTemp },  '-', { text :
							 * '全部删除', icon :
							 * '/resource/images/database_delete.png', handler :
							 * del_all, hidden : compareAuth('FAC_DEL') }
							 */,
							 '-', { text : '删除', icon :
								  '/resource/images/delete.gif', handler : del_sel,
								  hidden : compareAuth('FAC_DEL') },
						"-",
						{
							text : '查看未审核材价',
							id : 'check_list',
							icon : '/resource/images/application_double.png',
							hidden : compareAuth('FAC_AUDIT'),
							handler : mat_price
						},
						"-",
						{
							text : '查看历史报价',
							id : 'she_list',
							icon : '/resource/images/application_double.png',
							handler : showHistoryPrice
						},
						"-",
						{
							text : '取消参考价材料',
							id : 'set_rMaterialPrice',
							icon : '/resource/images/application_double.png',
							hidden : compareAuth('FAC_REFERENCEMATERIALPRICE_SET_OR_CANCLE'),
							handler : function() {
								settingRefMatPrice();
							}
						}
						/*{
							text : '设置/取消 参考价材料',
							id : 'set_rMaterialPrice',
							icon : '/resource/images/application_double.png',
							hidden : compareAuth('FAC_REFERENCEMATERIALPRICE_SET_OR_CANCLE'),
							handler : function() {
								setReferenceMaterialPrice("0");
							}
						},
						{
							text : '全部设置参考价材价',
							id : 'set_all_rMaterialPrice',
							icon : '/resource/images/application_double.png',
							hidden : compareAuth('FAC_REFERENCEMATERIALPRICE_SET_ALL'),
							handler : function() {
								setReferenceMaterialPrice("1");
							}
						} */]
			});

	function showName(value, p, record) {
		var img = record.data.topPhoto;
		var name = record.data.name;
		var cbianma = record.data.cbianma;
		var icon = "";
		if (img != null && img != "") {
			icon = "<span><image src='/ext/resource/images/img_default.jpg'/></span>";
		}
		if (cbianma != null && "" != cbianma) {
			icon += "<span><img src='/resource/images/icon_can.gif' title='参考价材料' /></span>";
		}
		return icon + name;
	}

	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [ {
			xtype : "label",
			text : "名称："
		}, {
			id : 'input_name',
			xtype : 'textfield'
		}, '-', {
			xtype : "label",
			text : "型号规格："
		}, {
			id : 'input_spec',
			xtype : 'textfield'
		}, "-", {
			xtype : "label",
			text : '材料编码'
		}, {
			id : 'input_code',
			xtype : 'textfield'
		}, {
			xtype : 'button',
			icon : '/resource/images/zoom.png',
			text : '查询',
			handler : searchlist
		} ]
	});

	ds.load();
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	ds.on("load", function(ds, records, option) {
		var len = records.length;
		var temp = "";
		for ( var i = 0; i < len; i++) {
			temp += records[i].json;
		}
		if (temp == "您的权限不足") {
			Ext.MessageBox.alert("温馨提示", temp, function() {
				window.parent.Ext.getCmp('center').remove("mat_fac_detail");
			});
			return;
		}
	});

	grid.on('beforeedit', function(e) {
		if (!compareAuth('FAC_MOD')) {
			if (e.field == 'subcid') {
				var ed = this.colModel.getCellEditor(e.column, e.row);
				ed.field.store = subcidStore;
				subcidStore.loadData(getSubCidNameArrayBySubcid(e.value));
			}
			if (e.field == 'cgSubcid') {
				var ed = this.colModel.getCellEditor(e.column, e.row);
				ed.field.store = cgSubcidStore;
				cgSubcidStore.loadData(getCgSubCidNameArrayByCgSubcid(e.value));
			}
			return true;
		} else {
			return false;
		}
	});

	grid.on("validateedit", function(e) {
		if (e.value.length == 0 && !e.record.data[e.field]) {
			return false;
		}
		switch (e.field) {
		case 'code':
			if (e.value.gblen() == 0) {
				Info_Tip("公司编码不能为空。", function() {
					grid.startEditing(e.row, e.column);
				});
				return false;
			}
			if (e.value.gblen() > 10) {
				Info_Tip("公司编码长度不能大于10", function() {
					grid.startEditing(e.row, e.column);
				});
				return false;
			}
			break;
		case 'code2012':
			if (e.value.gblen() == 0) {
				Info_Tip("国际编码不能为空。", function() {
					grid.startEditing(e.row, e.column);
				});
				return false;
			}
			if (e.value.gblen() > 10) {
				Info_Tip("国际编码长度不能大于10", function() {
					grid.startEditing(e.row, e.column);
				});
				return false;
			}
		case 'name':
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
		case 'spec':
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
		case 'unit':
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
		case 'quotjyj':
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
		case 'quotgcj':
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
		case 'pricem':
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

	var content = "&fid=" + eid + "&content=" + field + "~" + handlerSpec(data);
	Ext.lib.Ajax.request("post", "/FacMaterial.do?type=2", {
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
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
	var content = "fid~" + eid + ";code~" + Ext.fly("input_code").getValue()
			+ ";name~" + Ext.fly("input_name").getValue() + ";spec~"
			+ Ext.fly("input_spec").getValue() + ";isDeleted~0";
	ds.baseParams["content"] = content;
	ds.load();
};

// 显示修改材料
function showEditStuff(v, data) {
	var bol = false, bolall = false, bolmult = false;
	// 修改材料
	if (Ext.isEmpty(v)) {
		bol = false;
		bolall = true;
		bolmult = true;

		var path = "";
		if (data.get('topPhoto') != null && data.get('topPhoto') != "") {
			path = data.get('topPhoto').split(".");
			path = path[0] + "_80." + path[1];
		} else {
			path = "/ep/default/eplogo.jpg";
		}
		if (!data.get("cid") || data.get("cid") == 0) {
			// subcidStore.loadData(subcidStore);
		} else {
			subcidStore.loadData(getSubCidByCid(data.get("cid")));
		}
		stuff_form = new Ext.form.FormPanel(
				{
					layout : 'form',
					bodyStyle : 'padding:6px;',
					labelAlign : 'right',
					labelWidth : 80,
					items : [
							{
								layout : 'column',
								bodyStyle : 'border:none;',
								items : [
										{
											layout : 'form',
											bodyStyle : 'border:none;',
											columnWidth : 0.5,
											items : [
													{
														id : 'cid',
														xtype : 'combo',
														fieldLabel : '一级分类',
														store : cidStore,
														emptyText : "请选择",
														mode : "local",
														triggerAction : "all",
														valueField : "value",
														displayField : "text",
														readOnly : true,
														value : data.get("cid"),
														listeners : {
															'select' : function() {
																var cid = Ext
																		.getCmp(
																				"cid")
																		.getValue();
																var subCidArray = getSubCidNameByCid(cid);
																var subCid1 = subCidArray[0][0];
																subcidStore
																		.loadData(subCidArray);
																Ext
																		.getCmp(
																				"subcid")
																		.setValue(
																				subCid1);
															}
														}
													},
													{
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
														value : data
																.get("subcid")
													}, /*
														 * { fieldLabel :
														 * '公司编码', id : 'code',
														 * width : 164, xtype :
														 * 'textfield',
														 * maxLength : 10, value :
														 * data.get("code") }, {
														 * fieldLabel : '国际编码',
														 * id : 'code2010',
														 * width : 164, xtype :
														 * 'textfield',
														 * maxLength : 10, value :
														 * data.get("code2010") },
														 */
													{
														fieldLabel : '规格型号',
														id : 'spec',
														width : 164,
														xtype : 'textfield',
														maxLength : 360,
														value : data
																.get("spec")
													},
													{
														fieldLabel : '单位',
														id : 'unit',
														width : 164,
														xtype : 'textfield',
														maxLength : 32,
														value : data
																.get("unit")
													},
													{
														fieldLabel : '产地',
														id : 'addr',
														width : 164,
														xtype : 'textfield',
														maxLength : 12,
														value : data
																.get("addr")
													},
													{
														fieldLabel : '品牌',
														id : 'brand',
														width : 164,
														xtype : 'textfield',
														maxLength : 36,
														value : data
																.get("brand")
													},
													{
														fieldLabel : '材料档次',
														id : 'grade',
														xtype : 'combo',
														store : Grade_DB,
														emptyText : "请选择",
														mode : "local",
														triggerAction : "all",
														valueField : "value",
														displayField : "text",
														readOnly : true,
														value : data
																.get("grade")
													},
													{
														fieldLabel : '建议价系数',
														id : 'quotjyj',
														width : 164,
														xtype : 'numberfield',
														regex : /^((0.){1}(\d){0,4})|(1)$/,
														regexText : '请正确填写系数!必须大于0,小于等于1.',
														value : data
																.get("quotjyj")
													} ]
										},
										{
											columnWidth : 0.5,
											layout : 'form',
											bodyStyle : 'border:none;',
											labelAlign : 'right',
											items : [
													{
														bodyStyle : 'border:1px solid #ccc;',
														width : 230,
														height : 230,
														html : "<img id='mat_img' width='230' height='230'  src='"
																+ FileSite
																+ path + "'/>"
													}, {
														xtype : 'button',
														text : '更新图片',
														handler : choose
													} ]
										} ]
							},
							{
								layout : 'column',
								bodyStyle : 'border:none;',
								items : [
										{
											layout : 'form',
											bodyStyle : 'border:none;',
											columnWidth : 0.5,
											items : [ {
												fieldLabel : '工程价系数',
												id : 'quotgcj',
												width : 164,
												xtype : 'numberfield',
												regex : /^((0.){1}(\d){0,4})|(1)$/,
												regexText : '请正确填写系数!必须大于0,小于等于1.',
												value : data.get("quotgcj")
											} ]
										},
										{
											layout : "form",
											bodyStyle : 'border:none;',
											columnWidth : 0.5,
											labelWidth : 30,
											items : [ {
												fieldLabel : '面价',
												id : 'pricem',
												width : 164,
												xtype : 'numberfield',
												regex : /^(\d){0,12}(.){0,1}(\d){0,4}$/,
												regexText : '请正确填写价格',
												value : data.get("pricem")
											} ]
										} ]
							}, {
								xtype : "textarea",
								fieldLabel : '备注',
								id : "notes",
								width : 480,
								value : data.get("notes")
							} ]
				});
	} else if (v == "mult") { // 批量修改
		bol = true;
		bolall = true;
		bolmult = false;
		stuff_form = new Ext.form.FormPanel({
			layout : 'form',
			labelWidth : 80,
			bodyStyle : 'padding:6px;',
			items : [ {
				layout : 'column',
				bodyStyle : 'border:none;',
				items : [ {
					layout : 'form',
					bodyStyle : 'border:none;',
					columnWidth : 0.5,
					items : [ {
						id : 'cid',
						xtype : 'combo',
						width : 160,
						fieldLabel : '一级分类',
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
						width : 160,
						fieldLabel : '二级分类',
						allowBlank : false,
						emptyText : "请选择",
						store : subcidStore,
						mode : "local",
						disabled : true,
						triggerAction : "all",
						valueField : "value",
						displayField : "text",
						readOnly : true
					}, /*******************************************************
						 * { fieldLabel : '国际编码', id : 'code2010', width : 164,
						 * xtype : 'textfield', allowBlank : true, maxLength :
						 * 10 },
						 ******************************************************/
					{
						fieldLabel : '规格型号',
						id : 'spec',
						width : 164,
						xtype : 'textfield',
						maxLength : 360
					}, {
						fieldLabel : '单位',
						id : 'unit',
						width : 164,
						xtype : 'textfield',
						maxLength : 32
					}, {
						fieldLabel : '产地',
						id : 'addr',
						width : 164,
						xtype : 'textfield',
						maxLength : 12
					}, {
						fieldLabel : '品牌',
						id : 'brand',
						width : 164,
						xtype : 'textfield',
						maxLength : 36
					} ]
				}, {
					layout : "form",
					bodyStyle : 'border:none;',
					columnWidth : 0.5,
					labelWidth : 80,
					items : [ {
						fieldLabel : '材料档次',
						id : 'grade',
						xtype : 'combo',
						width : 160,
						store : Grade_DB,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						displayField : "text",
						readOnly : true
					}, {
						fieldLabel : '建议价系数',
						id : 'quotjyj',
						width : 164,
						xtype : 'numberfield',
						regex : /^((0.){1}(\d){0,4})|(1)$/,
						regexText : '请正确填写系数!必须大于0,小于等于1.'
					}, {
						fieldLabel : '工程价系数',
						id : 'quotgcj',
						width : 164,
						xtype : 'numberfield',
						regex : /^((0.){1}(\d){0,4})|(1)$/,
						regexText : '请正确填写系数!必须大于0,小于等于1.'
					}, {
						fieldLabel : '面价',
						id : 'pricem',
						width : 164,
						xtype : 'numberfield',
						regex : /^(\d){0,12}(.){0,1}(\d){0,4}$/,
						regexText : '请正确填写价格'
					}, {
						xtype : "textarea",
						fieldLabel : '备注',
						id : "notes",
						width : 164,
						height : 75
					} ]
				} ]
			} ]
		});
	} else { // 修改全部
		bol = true;
		bolall = false;
		bolmult = true;
		stuff_form = new Ext.form.FormPanel({
			layout : 'form',
			labelWidth : 80,
			bodyStyle : 'padding:6px;',
			items : [ {
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
				maxValue:1.5,
				minValue:0.5,
				allowBlank : true
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
			} ]
		});
	}
	win = new Ext.Window({
		title : bolall ? (bolmult ? '修改材料' : '批量修改材料') : '修改全部材料',
		autoWidth : true,
		// height : 480,
		autoHeight : true,
		closeable : true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		items : [ stuff_form ],
		buttonAlign : 'center',
		bodyStyle : 'padding:6px;',
		buttons : [ {
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
		} ]
	});
	win.show();
};
// 保存修改材料信息
function saveEditInfo(thisid) {
	if (stuff_form.getForm().isValid()) {
		var content = [];
		var len = stuff_form.getForm().items.length;
		for ( var i = 0; i < len; i++) {
			content.push(stuff_form.getForm().items.keys[i]
					+ "~"
					+ handlerSpec(stuff_form.getForm().items.map[stuff_form
							.getForm().items.keys[i]].getValue()));
		}
		content = content.toString().replace(/,/g, ";");
		Ext.Ajax
				.request({
					url : '/FacMaterial.do?type=2&fid=' + eid,
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc,
								jsondata.result)) {
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
function saveMultInfo(thisid) {

	// var province_addr = "";
	// var city_addr = "";
	// var addr = "";

	if (stuff_form.getForm().isValid()) {
		var content = [];
		var len = stuff_form.getForm().items.length;
		for ( var i = 0; i < len; i++) {
			// if(stuff_form.getForm().items.keys[i] == "comboProvinces"){
			// province_addr =
			// handlerSpec(stuff_form.getForm().items.map[stuff_form.getForm().items.keys[i]].getValue());
			// }else if(stuff_form.getForm().items.keys[i] == "comboCities"){
			// city_addr =
			// handlerSpec(stuff_form.getForm().items.map[stuff_form.getForm().items.keys[i]].getValue());
			// }else{
			if ((stuff_form.getForm().items.map[stuff_form.getForm().items.keys[i]]
					.getValue() + "").length > 0) {
				content.push(stuff_form.getForm().items.keys[i]
						+ "~"
						+ handlerSpec(stuff_form.getForm().items.map[stuff_form
								.getForm().items.keys[i]].getValue()));
			}
			// }
		}
		content = content.toString().replace(/,/g, ";");
		// addr = province_addr + " " + city_addr;
		// if(addr != null && addr != ""){
		// content += ";addr~" + addr;
		// }
		Ext.Ajax
				.request({
					url : '/FacMaterial.do?type=2&fid=' + eid,
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc,
								jsondata.result)) {
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
// 保存修改所有材料信息
function saveAllInfo() {
	if (stuff_form.getForm().isValid()) {
		var ids = [];
		var len = stuff_form.getForm().items.getCount();
		for ( var i = 0; i < len; i++) {
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
		Ext.Ajax
				.request({
					url : '/FacMaterial.do?type=3',
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc,
								jsondata.result)) {
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
	var content = 'fid~' + eid + ";isDeleted~0;isAudit~1";
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
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : '上传文件',
							allowBlank : false
						}
					},
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							bodyStyle : 'border:none;',
							html : "<a href='" + FileSite
									+ "/doc/fac_price_sample.xls"
									+ "' >标准文档下载</a>"
						}
					} ]
		} ]
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
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : uploadFile
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
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
		Info_Tip("上传成功。", mat_price);
		win.close();
		// ds.reload();
	} else {
		Info_Tip(msg);
	}
};

// 删除
function del_sel() {
	var ids = [];
	var sels = grid.getSelectionModel().getSelections();
	for ( var i = 0; i < sels.length; i++) {
		ids.push(sels[i].get('id'));
	}
	if (ids.length < 1) {
		Info_Tip("请选择材料。");
		return;
	}
	ids = ids.join().replace(/,/g, ";");
	Ext.MessageBox.confirm("确认操作", "你确认删除你所选择的材料吗？", function(o) {
		if (o == "yes") {
			Ext.lib.Ajax.request("post", '/FacMaterial.do?type=8', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("删除成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "ids=" + ids.toString() + "&fid=" + eid + "&isAudit=1");
		}
	});

};

// 全部删除
function del_all() {
	Ext.MessageBox.confirm("确认操作", "你确认删除该供应商的所有材料报价吗？", function(o) {
		if (o == "yes") {
			Ext.lib.Ajax.request("post", '/FacMaterial.do?type=5', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
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
	Ext.MessageBox.confirm("确认操作", "您确认审核通过该厂商的材料吗？", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post", '/FacMaterial.do?type=7', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("材料审核成功。");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "fid=" + eid);
		}
	})

};

// 显示图片库区域
function showPicArea() {
	pic_ds = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/FacMaterialPic.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'name', 'path', "id", 'description', {
			name : 'size',
			type : 'float'
		}, {
			name : 'upTime',
			type : 'date',
			dateFormat : 'timestamp'
		} ]),
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

	var imgshow = new Ext.Panel(
			{
				id : 'images-view',
				title : "图片显示",
				frame : true,
				// width : 500,
				autoWidth : true,
				height : 260,
				autoScroll : true,
				collapsible : true,
				style : 'overflow-x:hidden;',
				layout : 'fit',
				items : picView = new Ext.DataView(
						{
							store : pic_ds,
							tpl : tpl,
							id : 'mai_view',
							// autoHeight : true,
							autoWidth : true,
							multiSelect : true,
							overClass : 'x-view-over',
							itemSelector : 'div.thumb-wrap',
							emptyText : '没有图片显示，您可以先上传再进行选择。',
							plugins : [ new Ext.DataView.DragSelector(),
									new Ext.DataView.LabelEditor({
										dataIndex : 'name'
									}) ],
							prepareData : function(data) {
								data.shortName = Ext.util.Format.ellipsis(
										data.name, 15);
								data.sizeString = Ext.util.Format
										.fileSize(data.size);
								data.dateString = data.upTime.format("Y-m-d");
								data.changePath = FileSite + data.path;
								if (data.description)
									data.shortDescription = data.description.length > 50 ? Ext.util.Format
											.ellipsis(data.description, 50)
											+ "..."
											: data.description;
								else
									data.shortDescription = "";
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

	picform = new Ext.form.FormPanel(
			{
				laeblAlign : "right",
				frame : true,
				fileUpload : true,
				layout : "form",
				labelWidth : 50,
				buttonAlign : 'center',
				hidden : compareAuth('CORP_PIC_ADD'),
				items : [
						{
							layout : 'table',
							layoutConfig : {
								columns : 4
							},
							items : [
									{
										xtype : 'label',
										width : 50,
										text : "名称："
									},
									{
										xtype : "textfield",
										fieldLabel : "名称",
										id : "name_input"
									},
									{
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
									},
									{
										xtype : 'button',
										text : '批量上传图片',
										handler : function() {
											FileUpload_Ext.requestId = eid;
											FileUpload_Ext.requestType = "RS_EP";
											FileUpload_Ext.requestMethod = '/file/MultiUpload';
											FileUpload_Ext.callbackFn = 'saveMultiPic';
											FileUpload_Ext.fileType = /zip/;
											FileUpload_Ext.initComponent();
										}
									} ]
						},
						{
							layout : 'table',
							style : 'margin-top:5px;',
							layoutConfig : {
								columns : 1
							},
							items : [ {
								html : '<font color="red">（图片类型：jpg,jpeg，建议尺寸300x300，大小不能超过150k。批量上传格式为zip压缩包格式，所含图片格式与单个上传一致）</font>'
							} ]
						} ]
			});
	win = new Ext.Window({
		title : "材料图片库",
		autoHeight : true,
		width : 780,
		height : 700,
		closable : true,
		// autoScroll : true,
		draggable : true,
		modal : true,
		border : false,
		plain : true,
		closeAction : "close",
		buttonAlign : 'center',
		items : [ imgshow, picform ],
		buttons : [ {
			text : '自动匹配图片',
			hidden : compareAuth('CORP_PIC_DEL'),
			handler : markPic
		}, {
			text : '删除选定图片',
			hidden : compareAuth('CORP_PIC_DEL'),
			handler : del_selpic

		}, {
			text : '删除所有图片',
			hidden : compareAuth('CORP_PIC_DEL'),
			handler : del_allpic
		}, {
			text : "关闭",
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
};
// 自动匹配图片
function markPic() {
	Ext.Ajax.request({
		url : '/FacMaterial.do',
		params : {
			type : 23,
			fid : eid,
			audit : 2
		// 已审核
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

// 上传文件自定义操作
function upload_fn() {
	savePicPath(FileUpload_Ext.callbackMsg);
};

function saveMultiPic() {
	var msg = FileUpload_Ext.callbackMsg;
	Ext.Ajax.request({
		url : '/FacMaterialPic.do',
		method : 'POST',
		params : {
			type : 8,
			fid : eid,
			obj : msg
		},
		success : function(response) {
			pic_ds.reload();
		},
		failure : function() {
			Warn_tip();
		}
	});
}

// 保存材料图片
function savePicPath(path) {
	var fileName = Ext.fly("name_input").getValue();
	if (Ext.isEmpty(fileName)) {
		fileName = FileUpload_Ext.fileName;
	}
	Ext.Ajax.request({
		url : '/FacMaterialPic.do',
		params : {
			type : 1,
			fid : eid,
			path : path,
			name : fileName
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

// 删除选定图片
function del_selpic() {
	/*
	 * if ((pid || "") == "") { Info_Tip("请选择一张图片。"); return; }
	 */
	var nodes = picView.getSelectedNodes();
	if (Ext.isEmpty(nodes)) {
		Info_Tip("请选择图片。");
		return;
	}
	pic = Ext.get(nodes[0]).child('img').getAttribute("_id");

	Ext.MessageBox.confirm("确认操作", "您确认要删除选中的图片吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/FacMaterialPic.do',
				params : {
					type : 5,
					pid : pid
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("删除图片成功。");
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
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("图片删除成功。");
						Ext.select(".thumb-wrap").each(function(el) {
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

// 进入厂商报价未审核列表
function mat_price() {
	window.parent.createNewWidget("mat_fac_detail_u", '未审核材料列表',
			'/module/mat/mat_fac_detail_u.jsp?eid=' + eid + "&fname="
					+ encodeURI(fname));
};

// 标准文件下载
function downTemp() {
	window.location.href = FileSite + "/doc/fac_price_sample.xls";
};

// 显示单条材料图片
var chooser;
function choose() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条材料。");
		return;
	}
	chooser = new ImageDetail({
		url : '/FacMaterialPic.do',
		width : 760,
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
var matPriceEditForm;
// 批量与全部修改材料价格的公共方法
function base_mat_price_edit() {
	matPriceEditForm = new Ext.form.FormPanel({
		layout : 'form',
		labelWidth : 80,
		bodyStyle : 'padding:6px;',
		items : [ {
			fieldLabel : '价格浮动率',
			id : 'mat_price_edit',
			width : 164,
			xtype : 'numberfield',
			allowBlank : true
		} ]
	});
	win = new Ext.Window({
		title : "设置材料价格浮动率",
		width : 300,
		autoHeight : true,
		closeable : true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		items : [ matPriceEditForm ],
		buttonAlign : 'center',
		bodyStyle : 'padding:6px;',
		buttons : [ {
			text : '修改价格',
			handler : function() {
				mat_price_editProcess();
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

function showHistoryPrice() {

	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条材料。");
		return;
	}

	var code = row.get("code");
	
/*	var jyj = row.get("quotjyj");
	var gcj= row.get("quotgcj");*/
	if (eid.substring(0, 3) != "CCF") {
		Info_Tip("该供应商无历史报价！");
		return;
	}

	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/FacMaterialHisyoryPrice.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'price', 'updateOn','quotjyj','quotgcj' ]),
		baseParams : {
			type : 1,
			code : code
		}
	});
	store.load();

	var gridHistoryPrice = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : store,
		// sm : sm,
		viewConfig : {
			forceFit : true
		},
		columns : [ {
			header : '历史材价',
			sortable : false,
			dataIndex : 'price'
		},{
			header : '建议价',
			sortable : false,
			dataIndex : 'quotjyj'
		},{
			header : '工程价',
			sortable : false,
			dataIndex : 'quotgcj'
		}, {
			header : '更新时间',
			sortable : false,
			dataIndex : 'updateOn',
		} ]
	});

	var base_info = new Ext.form.FieldSet(
			{
				layout : "table",
				border : false,
				frame : true,
				layoutConfig : {
					columns : 2
				},
				items : [
						{
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:right;font-size:12px",
							items : [ {
								xtype : "label",
								text : "材料编码："
							} ]
						},
						{
							width : 240,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [ {
								xtype : "label",
								text : code
							} ]
						},
						{
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:right;font-size:12px",
							items : [ {
								xtype : "label",
								text : "材料名称："
							} ]
						},
						{
							width : 240,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [ {
								xtype : "label",
								text : row.get("name")
							} ]
						} ]
			});

	win = new Ext.Window({
		title : "查看历史报价",
		width : 400,
		autoHeight : true,
		closeable : true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		items : [ base_info, gridHistoryPrice ],
		buttonAlign : 'center',
		bodyStyle : 'padding:6px;',
		buttons : [ {
			text : '关闭',
			handler : function() {
				ds.reload();
				win.close();
			}
		} ]
	});
	win.show();
}
// 根据浮动率修改材料的价格
function mat_price_editProcess() {
	// 获取设置的浮动率
	var priceRate = matPriceEditForm.getForm().items.map["mat_price_edit"]
			.getValue();
	// 批量设置浮动率
	if (!isAllMat) {
		// 获取选择的材料ID
		var rows = grid.getSelectionModel().getSelections();
		if (rows.length < 1) {
			Info_Tip("请至少选择一条材料。");
			return;
		}
		var chooseId;
		for ( var i = 0; i < rows.length; i++) {
			if (i != 0) {
				chooseId += "," + rows[i].get('id');
			} else {
				chooseId = rows[i].get('id');
			}
		}
		Ext.Ajax
				.request({
					url : '/FacMaterial.do?type=16',
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc,
								jsondata.result)) {
							Info_Tip("批量修改厂商材料浮动率成功。");
							ds.reload();
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					},
					params : {
						priceRate : priceRate,
						chooseId : chooseId
					}
				});
	}
	// 设置企业的所有材料的浮动率
	else {
		Ext.Ajax
				.request({
					url : '/FacMaterial.do?type=17',
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc,
								jsondata.result)) {
							Info_Tip("厂商所有材料设置浮动率成功。");
							ds.reload();
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					},
					params : {
						priceRate : priceRate,
						eid : eid
					}
				});
	}
}

/**
 * 设置/取消参考价材料
 */
function setReferenceMaterialPrice(isAll) {
	//防止重复操作
	if (opFlag){
		Ext.MessageBox.alert("提示", "参考价材料设置/取消操作正在进行中，不能进行其它操作！");
		return false;
	}
	var rMaterialStatus = "1"; // 默认设置参考价材料
	var rows = grid.getSelectionModel().getSelections();
	if (!"1" == isAll) {
		if (rows.length == 0) {
			Ext.MessageBox.alert("提示", "请选择一种状态的材价进行操作！");
			return false;
		}
		var ids = [];
		for ( var i = 0; i < rows.length; i++) {
			var cityCircleId1 = rows[i].get("cityCircleId");
			for ( var j = 0; j < rows.length; j++) {
				var cityCircleId2 = rows[j].get("cityCircleId");
				if ((cityCircleId1 != null && cityCircleId2 == null)
						|| (cityCircleId1 == null && cityCircleId2 != null)) {
					Ext.MessageBox.alert("提示", "请选择一种状态的材价进行操作！");
					return false;
				}
			}
			ids.push(rows[i].get('id'));
		}
		// 由于未设置参考价材料，则cityCircleId为空，所以当操作时cityCircleId为空，则是需要进行设置参考价材料操作
		if (rows[0].get("cityCircleId") != null
				&& "" != rows[0].get("cityCircleId")) { // 表示取消参考价材料
			rMaterialStatus = "0";
		}
	}
	var showWin = null;
	var showCityCirclePanel = null;
	var cityCircleId = null;
	var cityCircleCode = null;
	var cityCircleName = null;
	if ("1" == rMaterialStatus) { // 设置参考价材料
		// 获取城市圈列表
		var cityCircleList = null;
		$.ajax({
			type : 'POST',
			url : '/cityRingServlet',
			async : false,
			data : "type=9&content=isDeleted~0",
			success : function(response) {
				var data = eval("(" + response + ")");
				cityCircleList = data.result;
			}
		});
		showCityCirclePanel = new Ext.Panel(
				{
					layout : 'table',
					bodyStyle : 'border:none;background-color:',
					buttonAlign : 'left',
					//width : 500,
					layoutConfig : {
						columns : 5
					},
					items : [ {
						colspan : 5,
						bodyStyle : 'border:none;padding-bottom:10px;padding-left:10px;padding-top:5px;',
						items : [ {
							xtype : "label",
							border : false,
							text : "选择城市圈:"
						} ]
					} ],
					buttons : [ {
						text : '确定',
						handler : function() {
							var cityCircleArr = document
									.getElementsByName("cityCircleCheckbox");
							for ( var i = 0; i < cityCircleArr.length; i++) {
								if (cityCircleArr[i].checked) {
									var cityCircle = cityCircleArr[i].value
											.split(";");
									cityCircleId = cityCircle[0];
									cityCircleCode = cityCircle[1];
									cityCircleName = cityCircle[2];
									break;
								}
							}
							if (cityCircleId == null || "" == cityCircleId) {
								Ext.MessageBox.alert("提示", "请选择城市圈！");
								return false;
							}
							if ("1" == isAll) { // 全部设置参考价材料
								Ext.MessageBox
										.show({
											title : '提示',
											msg : "确定要全部设置为参考价材料吗？已被设置的参考材价将不会被重新设置，设置过程中可能会有几分钟的等待，请不要重复操作，继续请确定，取消则退出！",
											prompt : false,
											buttons : {
												"ok" : "确定",
												"cancel" : "取消"
											},
											multiline : false,
											fn : function(btn, text) {
												if ("ok" == btn) {
													var loadMarsk = new Ext.LoadMask(document.body, {
												    	msg : '参考价材料设置正在处理中.....!',
												        disabled : false,
												        store : loadStore
												      });	
													loadMarsk.show();
													opFlag = true;
													//关闭城市圈窗口，防止重复操作
													showWin.close();
													Ext.Ajax.timeout = 900000;
													var loadStore = Ext.lib.Ajax
															.request(
																	"post",
																	"/material/MaterialServlet.do?type=11",
																	{
																		success : function(
																				response) {
																			var data = eval("("
																					+ response.responseText
																					+ ")");
																			if (getState(
																					data.state,
																					commonResultFunc,
																					data.result)) {
																				Ext.MessageBox
																						.alert(
																								"提示",
																								"全部设置成功！");
																				loadMarsk.hide();
																				opFlag = false;
																				showWin
																						.close();
																				ds
																						.reload();
																			}else{
																				loadMarsk.hide();
																				opFlag = false;
																				showWin
																						.close();
																				ds
																						.reload();
																			}
																		}
																	},
																	"fid="
																			+ eid
																			+ "&isAudit=1&cityCircleId="
																			+ cityCircleId);
												} else {
													opFlag = false;
													showWin.close();
												}
											}
										});
							} else {
								showWin.close();
								// 组装参数
								var param = "rMaterialStatus=1&cityCircleId="
										+ cityCircleId;
								opFlag = true;
								var loadMarsk = new Ext.LoadMask(document.body, {
							    	msg : '参考价材料设置正在处理中.....!',
							        disabled : false,
							        store : loadStore
							      });
								loadMarsk.show();
								// 设置 参考价材料
								var loadStore = Ext.lib.Ajax.request("post",
										"/material/MaterialServlet.do?type=5&"
												+ param, {
											success : function(response) {
												var data = eval("("
														+ response.responseText
														+ ")");
												if (getState(data.state,
														commonResultFunc,
														data.result)) {
													Ext.MessageBox.alert("提示",
															"设置成功！");
													loadMarsk.hide();
													opFlag = false;
													showWin.close();
													ds.reload();
												}else{
													loadMarsk.hide();
													opFlag = false;
													showWin.close();
													ds.reload();
												}
											}
										}, "ids=" + ids + "&fid=" + eid);
							}
						}
					} ]
				});
		// 显示城市圈列表
		for ( var i = 0; i < cityCircleList.length; i++) {
			showCityCirclePanel
					.add([ {
						id : "item" + i,
						bodyStyle : "border:none;padding-bottom:10px;padding-left:10px;",
						items : [ {
							xtype : "label",
							html : "<input type='radio' id='cityCircle" + i
									+ "' name='cityCircleCheckbox' value='"
									+ cityCircleList[i].id + "; "
									+ cityCircleList[i].code + "; "
									+ cityCircleList[i].name + "' />&nbsp;"
									+ cityCircleList[i].name
									+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						} ]
					} ]);
		}
		showCityCirclePanel.doLayout();
		showCityCirclePanel.show();
		showWin = new Ext.Window({
			title : '设置为参考材料',
			closeAction : "close",
			x : "450",
			y : "150",
			autoWidth : true,
			autoHeight : true,
			autoScroll : true,
			bodyStyle : 'padding:6px',
			draggable : true,
			modal : true,
			items : [ showCityCirclePanel ]
		});
		showWin.show();
	} else { // 取消参考价材料
		// 组装参数
		var param = "rMaterialStatus=0";
		opFlag = true;
		// 设置 参考价材料
		Ext.lib.Ajax
				.request(
						"post",
						"/material/MaterialServlet.do?type=5&batchOp=1&op=facMaterial&"
								+ param,
						{
							success : function(response) {
								var data = eval("(" + response.responseText
										+ ")");
								if (!getState(data.state, commonResultFunc,
										data.result)) {
									if (data.result != null) {
										Ext.MessageBox
												.show({
													title : '提示',
													msg : data.result
															+ '材料的参考材价将同时取消，确定取消此批参考材料？',
													prompt : false,
													buttons : {
														"ok" : "确定",
														"cancel" : "取消"
													},
													multiline : false,
													fn : function(btn, text) {
														if ("ok" == btn) {
															var loadMarsk = new Ext.LoadMask(document.body, {
														    	msg : '参考价材料取消正在处理中.....!',
														        disabled : false,
														        store : loadStore
														      });
															loadMarsk.show();
															opFlag = true;
															var loadStore = Ext.lib.Ajax
																	.request(
																			"post",
																			"/material/MaterialServlet.do?type=5&batchOp=0"
																					+ param,
																			{
																				success : function(
																						msgResponse) {
																					var msgData = eval("("
																							+ msgResponse.responseText
																							+ ")");
																					if (getState(
																							msgData.state,
																							commonResultFunc,
																							msgData.result)) {
																						Ext.MessageBox
																								.alert(
																										"提示",
																										"取消成功！");
																						loadMarsk.hide();
																						opFlag = false;
																						ds
																								.reload();
																					}
																				}
																			},
																			"ids="
																					+ ids + "&fid=" + eid);
														}else{
															opFlag = false;
														}
													}
												});
									} else {
										opFlag = false;
										Ext.MessageBox.alert("提示", "取消成功！");
										ds.reload();
									}
								} else {
									opFlag = false;
									Ext.MessageBox.alert("提示", "取消成功！");
									ds.reload();
								}
							}
						}, "ids=" + ids + "&fid=" + eid);
	}
}

/**
 * 取消参考材价
 */
function settingRefMatPrice(){
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length == 0) {
		Ext.MessageBox.alert("提示", "请至少选择一条参考材料！");
		return false;
	}
	var cbianmas = [];
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		var currBianma = rows[i].get('cbianma');
		if (currBianma == null || "" == currBianma) continue;
		cbianmas.push(currBianma);
		ids.push(rows[i].get('id'));
	}
	
	if (ids.length == 0) {
		Ext.MessageBox.alert("提示", "请至少选择一条参考材料！");
		return false;
	}
	
	Ext.MessageBox.show({
		title : '提示',
		msg : '所选的材料将会取消参考材料设置，确定取消该参考材料？',
		prompt : false,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(btn, text) {
			if ("ok" == btn) {
				var newData = {};
				newData["type"] = "41";
				newData["bianma"] = cbianmas.toString();
				newData["ids"] = ids.toString();
				newData["fid"] = eid;
				Ext.Ajax.request({
					url : '/material/MaterialServlet.do',
					params : newData,
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
							Ext.MessageBox.alert("提示",
									'取消参考材料成功！');
							ds.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			}
		}
	});


}