Ext.onReady(init);
var win, grid, ds, sid, fs, win;
function init() {
	sid = getCurArgs("sid");
	buildGrid();
};

// 
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpTempSupMaterialServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id :["id","spec","price"]
						}, ['name', 'spec', "unit", "price", "brand",
								"discount", "mid", "sid", 'issueDate', "id"]),
				baseParams : {
					type : 5,
					pageSize : 20,
					sid : sid
				},
				countUrl : '/ep/EpTempSupMaterialServlet',
				countParams : {
					type : 4
				},
				remoteSort : true
			});
	ds.load();
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '材料名称',
							sortable : false,
							width : 160,
							dataIndex : 'name'
						}, {
							header : '型号',
							sortable : false,
							width : 240,
							dataIndex : 'spec'
						}, {
							header : '单位',
							sortable : true,

							dataIndex : 'unit'
						}, {
							header : '品牌',
							sortable : false,
							dataIndex : 'brand'
						}, {
							header : '价格',
							sortable : false,
							dataIndex : 'price'
						}, {
							header : '折扣率',
							sortable : false,
							dataIndex : 'discount',
							editor : new Ext.form.NumberField({
										allowBlank : false,
										allowNegative : false,
										maxValue : 1
									})
						}, {
							header : '发布时间',
							sortable : false,
							dataIndex : 'issueDate',
							renderer : trimDate
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				border : false,
				tbar : [{
							text : '修改',
							icon : '/resource/images/edit.gif',
							handler : showEditArea
						}],
				bbar : pagetool,
				renderTo : 'grid'
			});
	ds.on('update', function(thisds) {
				var row = grid.getSelectionModel().getSelected();
				var len = parseInt(thisds.modified.length) - 1;
				// debugger;
				editDiscount(thisds.modified[len].data);

			}, ds);
};
// 显示批量修改区域
function showEditArea() {
	fs = new Ext.FormPanel({
				layout : 'form',
				buttonAlign : 'right',
				labelWidth : 60,
				labelAlign : 'right',
				autoWidth : true,
				height : 60,
				bodyStyle : 'padding:6px',
				items : [{
							xtype : 'numberfield',
							id : 'discount',
							fieldLabel : '折扣率',
							allowBlank : false,
							maxValue : 1
						}
				// , {
				// xtype : 'checkbox',
				// id : 'isCorp',
				// boxLabel : '是否修改该企业折扣率'
				// }
				]
			});
	win = new Ext.Window({
				title : '修改折扣率',
				width : 320,
				autoHeight : true,
				modal : true,
				items : fs,
				buttons : [{
							text : '修改',
							handler : editDiscountMulti
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]

			});
	win.show();
};

// edit discount
function editDiscount(obj) {
	var row = grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < row.length; i++) {
		mids.push(row[i].get("id"));
	}
	var temp;
	if (!obj)
		temp = fs.getForm().items.map["discount"].getValue();
	else
		temp = obj['discount'];
	Ext.Ajax.request({
				url : '/ep/EpTempSupMaterialServlet',
				params : {
					type : 9,
					id : mids.toString(),
					discount : temp
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("修改成功");
						ds.reload();
						win.close();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 批量修改
function editDiscountMulti() {
	if (fs.getForm().isValid()) {
		var row = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(row)) {
			Ext.Msg.confirm("确认操作", "您并未选中任何一条材料信息，请问你是要修改该供应商所有材料折扣率吗？",
					function(op) {
						if (op == 'yes') {
							Ext.Ajax.request({
								url : '/ep/EpTempSupMaterialServlet',
								params : {
									type : 8,
									sid : sid,
									discount : fs.getForm().items.map["discount"]
											.getValue()
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("修改成功");
										ds.reload();
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
						} else {
							win.close();
						}
					})
		} else {
			editDiscount();
		}
	} else
		Info_Tip("请填写必要信息。");
};