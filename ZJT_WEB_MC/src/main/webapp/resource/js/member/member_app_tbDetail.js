var grid_info, ds_info,memberId,url="/mc/appMember.do";

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	memberId = getCurArgs("memberId");
	buildGirid();
};

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : url
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"memberId"},{name:"way"},{name:"notes"},{name:"useTB"},{name:"getTB"},{name:"residueTB"},{name:"createOn"}]	
						}),
				baseParams : {
					type : 15,
					way : "0,1,2,3",
					pageNo : 1,
					pageSize : 20,
					memberId : memberId
				},
				countUrl : url,
				countParams : {
					type : 16
				},
				remoteSort : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	var tbar = [{
		text : "会员ID：" + memberId,
	}];
	grid_info = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}),{
							header : '明细类别',
							sortable : true,
							dataIndex : 'way',
							renderer:function(value,meta,record){
								var way = record.get("way");
								return formatWay(way);
							}
						},{
							header : '备注',
							sortable : true,
							dataIndex : 'notes'
						},{
							header : '收入T币',
							sortable : true,
							dataIndex : 'getTB',
							renderer:function(value,meta,record){
								var tb = record.get("getTB");
								return formatTB(tb);
							}
						},{
							header : '支出T币',
							sortable : true,
							dataIndex : 'useTB',
							renderer:function(value,meta,record){
								var tb = record.get("useTB");
								return formatTB(tb);
							}
						},{
							header : 'T币余额',
							sortable : true,
							dataIndex : 'residualTB',
							renderer:function(value,meta,record){
								var tb = record.get("residueTB");
								if (tb == null || "" == tb){
									return "0";
								}
								return tb;
							}
						},{
							header : "变动时间",
							sortable : true,
							dataIndex : "createOn"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});
			
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [{
							id : 'way_type',
							name : 'way_type',
							hiddenName : "way_type_input",
							fieldLabel : '全部明细类别',
							store : getTBType,
							typeAhead : true,
							mode : 'local',
							triggerAction : 'all',
							emptyText : '全部明细类别',
							valueField : "value",
							displayField : "text",
							readOnly : true,
							xtype : "combo",
							value : "",
							width : 120,
							listeners : {
								select : function(combo, record, index) {
									ds_info.baseParams["way"] =  combo.getValue();
									ds_info.load();
								}
							}
						}]
	});
	ds_info.load();
};
//格式化TB
function formatTB(tb){
	if ("0" == tb || tb == null || "" == tb){
		return "-";
	}
	return tb;
}

function formatWay(way){
	return tb_type[way];
}