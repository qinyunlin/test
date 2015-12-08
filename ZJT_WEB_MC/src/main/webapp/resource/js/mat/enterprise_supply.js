Ext.onReady(init);
var grid, grid2, mag_grid, ds, ds2, pageSize = 20, win, area, datasel, store, fs;
function init() {
	buildGrid();
};
var area_store1 = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom:false,
			items : [{
						text : '添加企业',
						hidden : compareAuth('CORP_ADD'),
						handler : addEnterprise
					},{
						id : 'rMenu1',
						text : '查看厂商报价',
						hidden : compareAuth("FAC_VIEW"),
						handler : MatDetail
					},{
						id : 'rMenu2',
						text : '设置期刊厂商',
						hidden : compareAuth('CORP_MAG_ADD'),
						handler : setMagazine
					},{
						id : 'rMenu5',
						text : '查看期刊厂商',
						hidden : compareAuth("CORP_MAG_VIEW"),
						handler : function() {
								window.parent
										.createNewWidget(
												"enterprice_supply_mag",
												'查看期刊厂商',
												'/module/mat/enterprice_supply_mag.jsp');
							}
					},{
						id : 'rMenu4',
						text : '查看/设置企业会员',
						hidden : compareAuth('CORP_MEM_MANAGE'),
						handler : EmpMem
					}, {
						id : 'rMenu3',
						text : '设置排名',
						hidden : compareAuth('CORP_SORT'),
						handler : showPaimingArea
					}]
		});
function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"phone", "createOn", "sort"]),
				baseParams : {
					page : 1,
					type : 2,
					types : "fac",
					pageSize : pageSize
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 9,
					types : "fac"
				},
				remoteSort : true
			});
	ds.load();
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	var sm = new Ext.grid.RowSelectionModel({
			singleSelect : true
	});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : false,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : false,
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
							sortable : false,
							dataIndex : 'area'
						}, {
							header : '联系电话',
							sortable : false,
							dataIndex : 'phone'
						}, {
							header : '创建时间',
							sortable : false,
							dataIndex : 'createOn',
							renderer : trimDate
						}, {
							header : '排名',
							sortable : false,
							dataIndex : 'sort',
							renderer : changeLevel
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '添加企业',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth('CORP_ADD'),
							handler : addEnterprise
						}, {
							text : '查看厂商报价',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/application_double.png',
							hidden : compareAuth("FAC_VIEW"),
							handler : MatDetail
						}, {
							text : '设置期刊厂商',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth('CORP_MAG_ADD'),
							handler : setMagazine
						}, {
							text : '查看期刊厂商',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/application_double.png',
							hidden : compareAuth('CORP_MAG_VIEW'),
							handler : function() {
								window.parent
										.createNewWidget(
												"enterprice_supply_mag",
												'查看期刊厂商',
												'/module/mat/enterprice_supply_mag.jsp');
							}
						}, {
							text : '查看/设置企业会员',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('CORP_MEM_MANAGE'),
							handler : EmpMem
						}, {
							text : '设置排名',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/award_star_gold_2.png',
							hidden : compareAuth('CORP_SORT'),
							handler : showPaimingArea
						}],
				bbar : pagetool,
				renderTo : 'grid'
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									transform : "query_con",
									hiddenName : "query_con_val"
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchtitle",
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e){
									if(e.getKey() == e.ENTER){
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
};

// 查询
function searchlist() {
	var query = Ext.fly("query_con_val").getValue() + "~"
			+ Ext.fly("searchtitle").getValue();
	ds.baseParams["content"] = query;
	ds.countParams["content"] = query;
	ds.load();
};

// 添加企业
function addEnterprise() {
	window.parent.createNewWidget("enterprise_add", '添加企业',
			'/module/enterprise/enterprise_add.jsp');
};
// 查看厂商材料
function MatDetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var fid = row.get("eid");
	var fname = encodeURI(row.get("fname"));
	window.parent.createNewWidget("mat_fac_detail", '供应商材料报价',
			'/module/mat/mat_fac_detail.jsp?eid=' + fid + "&fname=" + fname);
};

// 设置期刊厂商
function setMagazine() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var pro = new Ext.data.ArrayStore({
		fields : ['value', 'text'],
		data : eval("(" + getPro() + ")")
			// from area_coed.js
		});
	datasel = Ext.util.JSON.decode(getCity('25'))
	store = new Ext.data.Store({
				proxy : new Ext.data.MemoryProxy(datasel),
				reader : new Ext.data.ArrayReader({}, [{
									name : "code"
								}, {
									name : "value"
								}])
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				//handleMouseDown : Ext.emptyFn()
			});
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : "地区编码",
				dataIndex : "code"
			}, {
				header : "地区名称",
				dataIndex : "value"
			}]);

	grid2 = new Ext.grid.GridPanel({
				store : store,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : 400,
				cm : cm,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : ["区域选择：", area = new Ext.form.ComboBox({
									fieldLabel : "区域选择",
									name : "area",
									id : "area",
									store : pro,
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									readOnly : true,
									forceSelection : true,
									selectOnFocus : true,
									displayField : "text",
									value : 25
								}), "-", "省直:", {
							xtype : "checkbox",
							id : "sel_province"
						}]
			});

	win = new Ext.Window({
				closeAction : "close",
				title : "<font style='color:red'>" + row.get("name")
						+ "</font> &nbsp;设置期刊厂商",
				width : 720,
				autoHeight:true,
				autoScroll : true,
				layout : "form",
				items : [grid2],
				buttons : [{
							text : "确定",
							handler : submitMagazine
						}, {
							text : "取消",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	area.on("select", function(combobox) {
				var province = combobox.getValue();
				datasel = Ext.util.JSON.decode(getCity(province));
				store.proxy = new Ext.data.MemoryProxy(datasel);
				store.load();

			})
	store.load();
};

// 提交期刊区域
function submitMagazine() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var sels = grid2.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("value"));
	}
	var query = "addr=" + mids.toString();
	if (Ext.fly("sel_province").dom.checked == true) {
		if(query != "addr=")
			query += ",";
		query += city_map.get(area.getValue());
	}
	if(query == "addr="){
		Ext.Msg.alert("提示", "请选择你要设置的期刊地区");
		return ;
	}
	query += "&eid=" + row.get("eid");
	query += "&province=" + Ext.fly("area").getValue();
	Ext.lib.Ajax.request("post", "/MagFacServlet?method=add", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("期刊区域设置成功.");
						win.close();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};
// 设置排名区域
function showPaimingArea() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	fs = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'padding:6px',
				items : [{
					xtype : 'combo',
					fieldLabel : '排名级数',
					id : 'level_sort',
					store : [["50", "一级"], ["40", "二级"], ["30", "三级"],
							["20", "四级"], ["10", "五级"], ["0", "六级"]],
					triggerAction : 'all',
					valueField : "value",
					displayField : "text",
					value : '50'
				}, {
					xtype : "label",
					text : '级数越低，排名越高！'
				}]
			});
	win = new Ext.Window({
				title : '设置排名',
				width : 320,
				modal : true,
				border : false,
				items : [fs],
				buttons : [{
							text : '设置',
							handler : function() {
								savePaiming(row.get('id'));
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};
// 保存排名
function savePaiming(thisid) {
	Ext.Msg.confirm("提示", "您确定要修改该供应商排名?", function(op){
		if(op == "yes"){
			Ext.Ajax.request({
				url : '/ep/EnterpriseServlet',
				params : {
					type : 28,
					id : thisid,
					sortLevel : Ext.getCmp("level_sort").getValue()
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("排名设置成功.");
						ds.reload();
						win.close();
					}
				},
				failure : function() {
				}
			});
		}
	});
};
// 查看/设置企业会员
function EmpMem() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("eid");
	var ename = encodeURI(row.get("name"));
	window.parent.createNewWidget("enterprise_memToemp", '查看企业会员',
			'/module/enterprise/enterprise_mem_add.jsp?eid=' + thisid
					+ "&ename=" + ename);
};