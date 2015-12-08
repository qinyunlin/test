var ds, grid, ck, ck1, pagetool, askds;
var ids = [];// 选择项
var selectinfo, isFlag;// 标识符;
var webArea = "";
var pageSize = 20;

var zhcn = new Zhcn_Select();

var toolbar = [{
			text : '查看/修改',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth('CORP_VIEW'),
			handler : empDetail
		}, {
			text : '查看/设置企业会员',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth('CORP_MEM_MANAGE'),
			handler : EmpMem
		}, {
			text : '锁定',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/lock.png',
			hidden : compareAuth('CORP_LOCK'),
			handler : lockEmp
		}, {
			text : '添加企业',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/add.gif',
			hidden : compareAuth('CORP_ADD'),
			handler : addEnterprise
		},/* {
			text : '开通商铺',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/cart_add.png',
			hidden : compareAuth('CORP_SHOP_ADD'),
			handler : checkShop
		}, {
			text : '开通所有企业商铺',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/cart_add.png',
			hidden : compareAuth('CORP_SHOP_OPENALL'),
			handler : openAll
		},*/ {
			text : '查看锁定的企业',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/edit.gif',
			hidden : compareAuth('CORP_SHOP_OPENALL'),
			handler : showLock
		}];
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : toolbar
		});
var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type","province","city",
								"phone", "createOn"]),
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
	ds.setDefaultSort('createOn', 'DESC');
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : pageSize
			});
	grid = new xg.GridPanel({
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
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '省份',
							sortable : true,
							width : 240,
							dataIndex : 'province'
						}, {
							header : '城市',
							sortable : true,
							width : 240,
							dataIndex : 'city'
						}, {
							header : '企业名称',
							sortable : true,
							width : 240,
							dataIndex : 'name'
						}, /*{
							header : '企业简称',
							sortable : true,

							dataIndex : 'fname'
						},*/ {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : toolbar,
				bbar : pagetool,
				renderTo : 'grid'
			});
			
			
			
			// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = ["全部城市"];
	var city_area = [];
	comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
				store : pro,
				value:"全部省份",
				width : 100,
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
					}
				},

				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				emptyText : '',
				editable : false,
				triggerAction : 'all',
				allowBlank : false,
				readOnly : true
			});

	comboCities = new Ext.form.ComboBox({
				id : 'comboCities',
				store : city,
				value:'全部城市',
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				emptyText : '',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				readOnly : true,
				name : 'region',
				disabled : true,
				allowBlank : false,
				width : 100

			});
			
			
	var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									transform : "query_type",
									hiddenName : "query_type_val",
									width : 80
								}),"省份", comboProvinces, "城市", comboCities, "-", ck = new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									transform : "query_con",
									hiddenName : "query_con_val",
									width : 80,
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
				var rows = grid.getSelectionModel().getSelections();
				for (var i = 0; i < rows.length; i++) {
					ids.push(rows[i].get("id"));
				}
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				empDetail();
			});
	ds.load();
};

function init() {
	buildGrid();
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/

// 查询信息
function searchlist() {
	var province=Ext.getCmp("comboProvinces").getValue();
	var city=Ext.getCmp("comboCities").getValue();
	var query = Ext.fly("query_con_val").getValue() + "~"
			+ Ext.fly("searchtitle").getValue() + ";islock~0";
   if (parseInt(Ext.fly("query_type_val").getValue()) == 0)
   {
		if(province !="全部省份")
		{
			query += ";province~"+province;
			
	        if(city!="全部城市")
	        {
	        	
					query += ";city~"+city;
				
				
	        }
	       
		}
   }
    else
   {
	   if(province !="全部省份")
	
		{
			query += ";type~" + Ext.fly("query_type_val").getValue()+";province~"+province;
	        if(city!="全部城市")
	        {
	        	
					query += ";city~"+city;
				
				
	        }
	       
		}
		else
        {
	    query += ";type~" + Ext.fly("query_type_val").getValue();
        }
   }
	ds.baseParams["content"] = query;
	ds.countParams["content"] = query;
	ds.load();
};

// 修改信息
function empDetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("id");
	var eid = row.get("eid");
	window.parent.createNewWidget("enterprise_edit", '修改企业信息',
			'/module/enterprise/enterprise_edit.jsp?id=' + thisid + '&eid='
					+ eid);
};

// 添加企业 enterprise_add.jsp
function addEnterprise() {
	window.parent.createNewWidget("enterprise_add", '添加企业',
			'/module/enterprise/enterprise_add.jsp');
};

// 锁定企业
function lockEmp() {
	var ids = [];
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("eid"));
	}
	var con = "ids=" + ids.toString();
	Ext.MessageBox.confirm("确认操作", "您确定要锁定选中的企业吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/ep/EnterpriseServlet?type=4", {
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

// 开通商铺
function openShop(thiseid) {

	Ext.Ajax.request({
		url : '/ep/EpShopServlet',
		params : {
			type : 4,
			eid : thiseid
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.MessageBox.confirm("温馨提示", "商铺已开通，请在商铺管理未审核列表总查看。是否进行查看？",
						function(op) {
							if (op = "yes") {
								window.parent
										.createNewWidget("tab_0305_iframe",
												'商铺管理',
												'/module/enterprise/enterprise_shop_manage.jsp?type=0');
							}
						})
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};

function openAll(){
	Ext.MessageBox.confirm("确认操作", "确定要将符合开通商铺条件的企业全部自动开通商铺吗?", function(op) {
				if (op == "yes") {
					Ext.Ajax.request({
						url : '/ep/EpShopServlet?type=21',
						success : function(response){
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc, data.result)) {
								Info_Tip("操作成功。");
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
				}
	});
}

// 检测商铺
function checkShop() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	isFlag = false;
	var data = {};
	data["type"] = 3;
	data["eid"] = row.get("eid");
	Ext.Ajax.request({
				url : '/ep/EpShopServlet',
				params : data,
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data.result == null) {
						isFlag = true;// 不存在时返回真
						if (isFlag) {
							openShop(row.get("eid"));
						}
					}else{
						Info_Tip("该企业已经开通商铺了");
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

function showLock(){
	window.parent.createNewWidget("enterprise_adv", '查看锁定的企业',
			'/module/enterprise/enterprise_adv.jsp');
}
