Ext.onReady(init);
function init() {
	buildGrid();
};
var type = new Ext.data.SimpleStore({
			fields : ["value", "name"],
			data : serArray_obj(jf_type)
		});
var tbar = [{
			xtype : "label",
			text : '会员ID:'
		}, {
			xtype : 'textfield',
			id : 'mid_input'
		}, {
			xtype : "label",
			text : '企业ID:'
		}, {
			xtype : 'textfield',
			id : 'eid_input'
		}, {
			text : '搜索',
			icon : "/resource/images/zoom.png",
			handler : searchlist
		}, {
			xtype : 'combo',
			id : 'type_input',
			store : type,
			triggerAction : "all",
			mode : 'local',
			displayField : 'name',
			valueField : 'value',
			forceSelection : true,
			editable : false,
			value : '1',
			listeners : {
				"select" : function(combo) {
					var store = Ext.getCmp("grid_panel").store;
					var type = Ext.getCmp("type_input").getValue().trim();
					store["baseParams"]["content"] = "ruleType~" + type;
					store.load();
				}
			}
		}], rule_store = [];
// 创建列表
function buildGrid() {
	var store = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
					url : '/score/ScoreServlet'
				}),
		reader : new Ext.data.JsonReader(
				{
					root : 'result'
				},
				["id", "memberID", "ruleCode", "ruleName", "ruleType",
						"addScore", "eid", "createBy", "createOn", "totalScore"]),
		baseParams : {
			type : 3
		},
		countUrl : '/score/ScoreServlet',
		countParams : {
			type : 4
		},
		remoteSort : false
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : store,
				displayInfo : true
			});
	var grid = new Ext.grid.GridPanel({
				id : 'grid_panel',
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : store,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				bbar : pagetool,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : true,
							dataIndex : 'memberID'
						}, {
							header : '企业ID',
							sortable : true,
							dataIndex : 'eid'
						}, {
							header : "增减分",
							sortable : true,
							dataIndex : "addScore",
							editor : {
								xtype : 'numberfield'
							}
						}, {
							header : "总积分",
							sortable : true,
							dataIndex : "totalScore"
						}, {
							header : "规则编号",
							sortable : true,
							dataIndex : "ruleCode"
						}, {
							header : "规则名称",
							sortable : true,
							dataIndex : "ruleName"
						}, {
							header : "规则的类型",
							sortable : true,
							dataIndex : "ruleType",
							renderer : function(v) {
								return jf_type[v];
							}
						}, {
							header : "创建人",
							sortable : true,
							dataIndex : "createBy"
						}, {
							header : "创建日期",
							sortable : true,
							dataIndex : "createOn"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				renderTo : "grid"
			});
	store.load();
	// grid.on("rowdblclick", function(grid, rowIndex, r) {
	// score_win();
	// });
};

// 搜索
function searchlist() {
	var store = Ext.getCmp("grid_panel").store;
	var type = Ext.getCmp("type_input").getValue().trim();
	store["baseParams"]["content"] = "memberID~"
			+ Ext.fly("mid_input").getValue().trim() + ";eid~"
			+ Ext.fly("eid_input").getValue().trim() + ";ruleType~" + type;
	store.load();

};