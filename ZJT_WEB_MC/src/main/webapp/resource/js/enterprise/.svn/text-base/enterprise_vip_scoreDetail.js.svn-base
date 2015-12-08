var grid_info, ds_info;
var eid = getCurArgs("eid");
var detailTypeArr = [['',"全部明细类别"],['1',"获取明细"],['2',"使用明细"]];
var allWayTypeArr = [['',"全部途径"]];
var getWayTypeArr = getVipType;
var useWayTypeArr = useVipType;
var subAccountArr = ["全部子账号"];

var getWayStore = new Ext.data.SimpleStore({
	fields : [{
		name : 'value'
	}, {
		name : 'text'
	}],
     data : getWayTypeArr
});

var useWayStore = new Ext.data.SimpleStore({
	fields : [{
		name : 'value'
	}, {
		name : 'text'
	}],
    data : useWayTypeArr
});

/**
 * 格式化积分
 * @param score
 * @returns
 */
function formatScore(score){
	if ("0" == score || score == null || "" == score){
		return "-";
	}
	return score;
}

/**
 * 
 * @param way
 * @returns
 */
function formatWay(way){
	return score_type[way];
}

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	Ext.Ajax.request({
		url : "/ep/EpMemberServlet",
		async : false,
		params : {
			type : 7,
			eid : eid
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				var result = jsondata.result;
				for(var i=0; i <result.length; i++){
					subAccountArr.push(result[i]["memberID"]);
				}
				buildGirid();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};
// 右键菜单
var tbar = [{
				text : "企业ID：" + eid,
			}];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ask/AskPriceServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"memberid"},{name:"way"},{name:"notes"},{name:"getScore"},{name:"useScore"},{name:"residualScore"},{name:"createOn"}]	
						}),
				baseParams : {
					type : 59,
					pageNo : 1,
					pageSize : 20,
					eid : eid
				},
				countUrl : '/ask/AskPriceServlet.do',
				countParams : {
					type : 60,
					eid : eid
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
								}), {
							header : '途径',
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
							header : '操纵子账号',
							sortable : true,
							dataIndex : 'memberid'
						},{
							header : '获取积分',
							sortable : true,
							dataIndex : 'getScore',
							renderer:function(value,meta,record){
								var score = record.get("getScore");
								return formatScore(score);
							}
						},{
							header : '使用积分',
							sortable : true,
							dataIndex : 'useScore',
							renderer:function(value,meta,record){
								var score = record.get("useScore");
								return formatScore(score);
							}
						},{
							header : '积分余额',
							sortable : true,
							dataIndex : 'residualScore',
							renderer:function(value,meta,record){
								var score = record.get("residualScore");
								if (score == null || "" == score){
									return "0";
								}
								return score;
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
							id : 'scoreDetail_type',
							name : 'scoreDetail_type',
							hiddenName : "scoreDetail_type_input",
							fieldLabel : '明细类别',
							store : detailTypeArr,
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
									var scoreDetail = combo.getValue();
									if(scoreDetail == "") {
										allWayTypeArr = [['',"全部途径"]];
									}else{
										if ("1" == scoreDetail){
											allWayTypeArr = getWayTypeArr;
										}else if ("2" == scoreDetail){
											allWayTypeArr = useWayTypeArr;
										}
									}
									Ext.getCmp('way_type').store.loadData(allWayTypeArr);
									Ext.getCmp('way_type').setValue("全部途径");
									Ext.getCmp('way_type').enable();
								}
							}
						},"-", {
							id : 'way_type',
							name : 'way_type',
							hiddenName : "way_type_input",
							fieldLabel : '途径',
							store : allWayTypeArr,
							typeAhead : true,
							mode : 'local',
							triggerAction : 'all',
							emptyText : '全部途径',
							valueField : "value",
							displayField : "text",
							readOnly : true,
							xtype : "combo",
							value : "",
							width : 120
						},"-", {
							id : 'subAccount',
							store : subAccountArr,
							triggerAction : 'all',
							value : '全部子账号',
							readOnly : true,
							xtype : "combo",
							width : 120
						}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});

	ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				
			});

};

// 查询
function searchlist() {
	var scoreDetail_type =  Ext.getCmp("scoreDetail_type").getValue();
	var way_type =  Ext.getCmp("way_type").getValue();
	var memberId = Ext.getCmp("subAccount").getValue();
	if(memberId == "全部子账号")
		memberId = "";
	ds_info.baseParams["memberID"] =  memberId;
	var allWayType = "";
	if ("1" == scoreDetail_type){
		allWayType = getVipAllType;
	}else if ("2" == scoreDetail_type){
		allWayType = useVipAllType;
	}
	if ("" == way_type || way_type == null || "全部途径" == way_type){
		way_type = allWayType;
	}
	if ("" != way_type && way_type != null){
		ds_info.baseParams["scoreWay"] =  way_type;
	}else{
		ds_info.baseParams["scoreWay"] =  "";
	}
	ds_info.load();
};