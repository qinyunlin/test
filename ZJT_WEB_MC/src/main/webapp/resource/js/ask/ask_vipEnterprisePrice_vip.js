var ds, grid, ck, pagetool, askds;
var ids = [];// 选择项
var selectinfo,window_note;
var isreplyType = {};
/*var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = [];*/


// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu2',
						text : '查看详情',
						handler : showaskinfo,
						hidden : compareAuth('VIP_OFFLINE_PRICE_VIEW')
					}, {
						id : 'rMenu1',
						text : '删除',
						handler : delask,
						hidden : compareAuth('VIP_OFFLINE_ASKPRICE_DEL')
					}]
		});
var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/EpEnterpriseAskPriceServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "subcid", "fname","name", "spec", "unit",
								"price","proName","supplyName","recoveryTime","state","picPath"]),
				baseParams : {
					method : "search",
					page : 1,
					pageSize : 20
				},
				countUrl : '/mc/EpEnterpriseAskPriceServlet',
				countParams : {
					method : "searchCount"
				},
				//sortInfo : {field: "updateOn", direction: "DESC"},
				remoteSort : true

			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				// pageSize:20,
				displayInfo : true
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							width : 20,
							dataIndex : 'id',
								hidden:true
						}, {
							header : '企业名称',
							sortable : false,
							width : 100,
							dataIndex : 'fname'
						},{
							header : '二级分类',
							sortable : false,
							dataIndex : 'subcid',
							renderer:function(data, metadata, record, rowIndex, columnIndex, ds){
								return getSubCidNameBySubcid(data, true);
							}
						},{
							header : '材料名称',
							sortable : false,
							dataIndex : 'name',
							renderer : function(value, meta, record) {
								var epMaterialName = record.get('name'); 
								var picPath = record.get('picPath'); 
								if (picPath != null && "" != picPath){
									return epMaterialName + "<span style='width:15px; height:15px; display:inline-block; background:url(/resource/images/icon_epMaterial_img.gif) no-repeat; vertical-align:middle; margin-left:5px;' title='材料图片' />";
								}
								return epMaterialName;
							}
						},  {
							header : '型号规格',
							sortable : false,
							width : 180,
							dataIndex : 'spec'
						},{
							header : '单位',
							hidden : compareAuth('VIP_OFFLINE_ASKPRICE_EDIT'), //有修改权限，显示可编辑单位列
							sortable : true,
							width : 80,
							dataIndex : 'unit',
							editor : {
								xtype : 'textfield'
							}
						}, {
							header : '单价',
							hidden : compareAuth('VIP_OFFLINE_ASKPRICE_EDIT'), //有修改权限，显示可编辑单价列
							sortable : true,
							width : 60,
							dataIndex : 'price',
							editor : {
								xtype : 'numberfield'
							}
						}, {
							header : '单位',
							hidden : !compareAuth('VIP_OFFLINE_ASKPRICE_EDIT'), //无修改权限，显示不可编辑单位列
							sortable : true,
							width : 80,
							dataIndex : 'unit'
						}, {
							header : '单价',
							hidden : !compareAuth('VIP_OFFLINE_ASKPRICE_EDIT'), //无修改权限，显示不可编辑单价列
							sortable : true,
							width : 60,
							dataIndex : 'price'
						}, {
							header : '供应商',
							sortable : false,
							width : 30,
							dataIndex : 'supplyName'
						}, {
							header : '是否同步',
							sortable : false,
							width : 30,
							dataIndex : 'state',
							renderer: function (data, metadata, record, rowIndex, columnIndex, ds) {  
							      var  state= ds.getAt(rowIndex).get('state');  
							     
							    if(state==0){
							    	 return '否';  
							    }else{
							    	return '是';
							    }
							     
							  
							 }
							
						}, {
							header : '回复时间',
							//hidden : true,
							sortable : false,
							width : 60,
							dataIndex : 'recoveryTime'}],
				tbar : [{
							text : '查看详情',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							handler : function() {
								var rec = grid.getSelectionModel()
										.getSelected();
								showaskinfo(rec.data.id);
							},
							hidden : compareAuth('VIP_OFFLINE_PRICE_VIEW')
						}, {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : delask,
							hidden : compareAuth('VIP_OFFLINE_ASKPRICE_DEL')

						}],
				bbar : pagetool,
				renderTo : 'ask_grid'
			});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [ {
					xtype : "label",
					text : "企业名称："
				}, {
					xtype : "textfield",
					textLabel : "企业名称",
					id : "fname",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : "label",
					text : "材料名称："
				}, {
					xtype : "textfield",
					textLabel : "材料名称",
					id : "name",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : "label",
					text : "供应商："
				}, {
					xtype : "textfield",
					textLabel : "供应商",
					id : "supplyName",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : "label",
					text : "型号规格："
				}, {
					xtype : "textfield",
					//store : emp_store,
					//typeAhead : false,//设置为false，取消自动匹配显示
					//mode : 'remote',
					//mode : 'local',   //设置为local，取消控件自动加载数据，使用store的load方法手动调用
					//forceSelection: true, //设置为true，必须选定一个选项
					triggerAction : 'all',
					displayField : "spec",
					readOnly : false,
					//emptyText : '请选择',
					id : "spec",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	/*grid.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();
				selectinfo = row.get("id");
				showaskinfo(selectinfo);
			});*/
	
	//emp_store.load();
	//单元格编辑之后校验
	grid.on("validateedit", function(e) {
		if (e.value.length == 0 && !e.record.data[e.field]) {
			return false;
		}
		switch (e.field) {
		case 'unit':
			if (e.value.gblen() == 0) {
				Info_Tip("单位不能为空。", function() {
					grid.startEditing(e.row, e.column);
				});
				return false;
			}
			if (e.value.gblen() > 18) {
				Info_Tip("单位长度不能大于18。", function() {
					grid.startEditing(e.row, e.column);
				});
				return false;
			}
			break;
		case 'price':
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
	
	//单元格编辑之后保存
	grid.on("afteredit", function(e) {
		if (compareAuth('VIP_OFFLINE_ASKPRICE_DEL')) {
			return;
		}
		saveInfo_list(e.record.id, e.field, e.record.data[e.field]);
	});
};

//保存列表修改信息
function saveInfo_list(thisid, field, data) {
	var content = "&content=" + field + "~" + handlerSpec(data);
	Ext.lib.Ajax.request("post", "/mc/EpEnterpriseAskPriceServlet?method=update", {
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

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
	
	var ename = getCurArgs("ename");
	if(ename){
		Ext.getCmp("fname").setValue(ename);
		var content= "fname~"+ename+";";
		ds.baseParams["page"] = 1;
		ds.baseParams["content"] = content;
	}
	
	ds.load();
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 删除信息
function delask() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request("post",
								"/mc/EpEnterpriseAskPriceServlet", {
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state,
												commonResultFunc, data.result)) {
											Info_Tip("询价删除成功。");
											ids = [];
											ds.reload();
											pagetool.updateInfo();
										}
									},
									failure : function(response) {
										Ext.MessageBox.alert("提示",
												"非常抱歉，您的操作发生错误。");
									}
								}, "method=del&id=" + ids.toString());
					}
				});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}

};

// 查询信息
function searchlist() {
	var content="";
	var name = Ext.fly("name").getValue().trim();
	if(name!=null && name!=""){
		content+="name~"+name+";";
	}
	var supplyName = Ext.fly("supplyName").getValue().trim();
	if(supplyName!=null && supplyName != ""){
		content+="supplyName~"+supplyName+";";
	}
	var spec=Ext.fly("spec").getValue().trim();
	if(spec!=null && spec != ""){
		content+="spec~"+spec+";";
	}
	var fname = Ext.getCmp("fname").getValue().trim();
	if(fname !=null && fname != ""){
		content += "fname~"+fname+";";
	}
	ds.baseParams["page"] = 1;
	ds.baseParams["content"] = content;
	/*ds.baseParams["province"] = Ext.getCmp("province").getValue().trim();
	ds.baseParams["city"] = Ext.getCmp("city").getValue().trim();*/
	ds.load();
};

// 查看详细信息
function showaskinfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	window.parent.createNewWidget("ask_vipAskPrice_info", '询价材料库-查看详情',
			'/module/ask/ask_vipAskPrice_info.jsp?id=' + row.get("id"));
};
