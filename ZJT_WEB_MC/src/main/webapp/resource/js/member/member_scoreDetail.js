var grid_info, ds_info, ds_mem, area_win, fs, query_fs, win, sel_combo;
var area, area1, area2, area_grid, city_grid, areastore, citystore, highContent = {}, form_gov, win_gov;

var ds_temp;
var tree, root;
var email_grid;
var emailWin = null;

var memberid = getCurArgs("memberid");

var province_db = ["北京","天津","河北","黑龙江","江西","山东","湖北","湖南","广东","广西","重庆","四川","贵州","云南"];
var memberTypeArr = [['',"全部会员类型"],['1',"普通会员"],['3',"正式信息会员"],['8',"VIP信息会员"]];
var detailTypeArr = [['',"全部明细类别"],['1',"获取明细"],['2',"使用明细"]];
var allWayTypeArr = [['',"全部途径"]];
//var getWayTypeArr = [['1,6,0,5,7,8,10,15',"全部途径"],['1',"询价中获取"],['6',"购买套餐赠送"],['0',"签到"],['5',"注册赠送"],['7',"排行赠送"],['8',"返回积分"],['10',"解冻"],['15',"购买积分"]];
//var useWayTypeArr = [['3,2,4,9,16',"全部途径"],['3',"询价中使用"],['2',"兑换服务天数"],['4',"兑换奖品"],['9',"冻结"],['16',"下载材价"]];
var getWayTypeArr = getType;
var useWayTypeArr = useType;

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


var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = ["全部城市"];
var ask_sel = ["300","600"];

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
 * 格式化会员类型
 * @param degree
 */
function formatDegree(degree){
	if ("1" == degree){
		return "普通会员";
	}else if ("3" == degree){
		return "正式信息会员";
	}else if ("7" == degree){
		return "试用云造价会员";
	}else if ("8" == degree){
		return "云造价会员";
	}
	return degree;
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
	buildGirid();
};

ds_mem = new Ext.data.SimpleStore({
			fields : [{
						name : 'value'
					}, {
						name : 'text'
					}],
			data : info_type_combox
		});
// 右键菜单
var tbar = [{
				text : "会员ID：" + memberid,
			}/*, {
			text : '删除',
			icon : '/resource/images/delete.gif', 
			hidden : compareAuth("MEM_LOCK"),
			handler : addMonitor
		}*/];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else {

		webArea = parent.currUser_mc.accessStie;
		if (webArea == "ALL") {
			webArea = '全部';
		}
	}
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ask/AskPriceServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"memberid"},{name:"degree"},{name:"way"},{name:"notes"},{name:"getScore"},{name:"useScore"},{name:"residualScore"},{name:"createOn"},{name:"province"},{name:"city"}]	
						}),
				baseParams : {
					type : 43,
					pageNo : 1,
					pageSize : 20,
					memberID : memberid
				},
				countUrl : '/ask/AskPriceServlet.do',
				countParams : {
					type : 44,
					memberID : memberid
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
								}), /*sm, {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberid'
						}, {
							header : '会员类型',
							sortable : true,
							dataIndex : 'degree',
							renderer:function(value,meta,record){
								var degree = record.get("degree");
								return formatDegree(degree);
							}
						},*/ {
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
								//return formatScore(score);
							}
						},{
							header : "变动时间",
							sortable : true,
							dataIndex : "createOn"
						}/*,{
							header : '区域',
							sortable : true,
							renderer:function(value,meta,record){
								var province = record.get("province");
								var city = record.get("city");
								if(province == null){
									return "";
								}
								return province + "&nbsp;&nbsp;&nbsp;" + city;
							}
						}*/],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});
			
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [/*{
							xtype : 'combo',
							id : 'province',
							store : pro,
							value:'全部省份',
							triggerAction : 'all',
							readOnly : true,
							width:90,
							listeners : {
								select : function(combo, record, index) {
									var province = combo.getValue();
									if(province == "全部省份") {
										city = ["全部城市"];
									}else{
										city = zhcn.getCity(province).concat();;
										city.unshift("全部城市");
									}
									Ext.getCmp('city').store.loadData(city);
									Ext.getCmp('city').setValue("全部城市");
									Ext.getCmp('city').enable();
								}
							}
						}, 
							{
							xtype : 'combo',
							id : 'city',
							store : city,
							triggerAction : 'all',
							value : '全部城市',
							width:120,
							readOnly : true
						}, "-", {
							id : 'degree_type',
							name : 'degree_type',
							hiddenName : "degree_type_input",
							fieldLabel : '会员类型',
							store : memberTypeArr,
							typeAhead : true,
							mode : 'local',
							triggerAction : 'all',
							emptyText : '全部会员类型',
							valueField : "value",
							displayField : "text",
							readOnly : true,
							xtype : "combo",
							value : "",
							width : 120
						}, "-",*/ {
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
										//allWayTypeArr.unshift("全部途径");
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
						}, /*"起始日期：", {
							id : 'beginDate',
							xtype : 'datefield',
							format : 'Y-m-d',
							editable : false,
							maxValue : new Date(),
							emptyText : '请选择'
						}, "截止日期：", {
							id : 'endDate',
							xtype : 'datefield',
							format : 'Y-m-d',
							editable : false,
							maxValue : new Date(),
							emptyText : '请选择'
						},*/{
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

function compareDate(beginDate,endDate){
	var beginDateArr = beginDate.split("-");
	var endDateArr = endDate.split("-");
	var nowBeginDate = new Date(beginDateArr[0],beginDateArr[1],beginDateArr[2]);
	var nowEndDate =  new Date(endDateArr[0],endDateArr[1],endDateArr[2]);
	if (nowBeginDate > nowEndDate){
		return true;
	}
	return false;
}

// 查询
function searchlist() {
	var scoreDetail_type =  Ext.getCmp("scoreDetail_type").getValue();
	var way_type =  Ext.getCmp("way_type").getValue();
	var allWayType = "";
	if ("1" == scoreDetail_type){
		//allWayType = "1,6,0,5,7,8,10";
		allWayType = getAllType;
	}else if ("2" == scoreDetail_type){
		//allWayType = "3,2,4,9";
		allWayType = useAllType;
	}
	if ("" == way_type || way_type == null || "全部途径" == way_type){
		way_type = allWayType;
	}
	if ("" != way_type && way_type != null){
		ds_info.baseParams["scoreWay"] =  way_type;
	}else{
		ds_info.baseParams["scoreWay"] =  "";
	}
	ds_info.baseParams["memberID"] =  memberid;
	ds_info.load();
};

/**
 * 设置堂主
 */
function addMonitor(){/*
	Ext.MessageBox
			.show({
				title : '添加堂主',
				msg : "</br>&nbsp;&nbsp;&nbsp;"
					+ "会员ID：<input type='text' id='memberID' name='memberID' value='' /></br></br>"
					+ "会员名称：<input type='text' id='memberName' name='memberName' value='' /></br>",
				width : 250,
				prompt : false,
				buttons : {
					"ok" : "确定",
					"cancel" : "取消"
				},
				multiline : false,
				fn : function(
						btn,
						text) {
					if ("ok" == btn) {
						var memberID = document.getElementById("memberID").value;
						var memberName = document.getElementById("memberName").value;
						if ("" == memberID || memberID == null || "" == memberName || memberName ==null){
							Ext.MessageBox.alert("提示", "请填写会员ID和会员名称！",addMonitor);
							return false;
						}
						Ext.lib.Ajax
								.request(
										"post",
										"/ask/AskPriceServlet.do?type=37",
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
													if ("1" == data.result){
														Ext.MessageBox.alert("提示", "请填写正确的会员ID及名称！",addMonitor);
													}else if ("2" == data.result){
														Ext.MessageBox.alert("提示", "该会员目前已经是堂主，无需进行重复设置！");
													}else{
														Ext.MessageBox
														.alert(
																"提示",
																"添加成功！");
														ds_info.reload();
													}
												}
											}
										},
										"memberID="
												+ memberID
												+ "&memberName="
												+ memberName);
					}
				}
			});


*/}


function getSelected(){
	var rows = grid_info.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	return ids;
}
