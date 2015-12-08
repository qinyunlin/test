var grid_info, ds_info, ds_mem, area_win, fs, query_fs, win, sel_combo;
var area, area1, area2, area_grid, city_grid, areastore, citystore, highContent = {}, form_gov, win_gov;

var ds_temp;
var tree, root;
var email_grid;
var emailWin = null;

var province_db = ["北京","天津","河北","黑龙江","江西","山东","湖北","湖南","广东","广西","重庆","四川","贵州","云南"];
var memberTypeArr = [['',"全部会员"],[1,"普通会员"],[3,"正式信息会员"],[8,"VIP信息会员"]];

var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = ["全部城市"];
var ask_sel = ["300","600"];

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
			text : '添加',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("MONITOR_ADD"),
			handler : addMonitor
		}, {
			text : '删除',
			icon : '/resource/images/delete.gif', 
			hidden : compareAuth("MONITOR_DEL"),
			handler : delMonitor
		}];


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
							url : '/ask/AskPriceServlet.do?type=35'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"eid"},{name:"memberID"},{name:"memberType"},{name:"degree"},{name:"trueName"},{name:"corpName"},{name:"createOn"},{name:"validDate"},{name:"province"},{name:"city"},{name:"loginNum"},{name:"lastTime"},{name:"webProvince"},{name:"webArea"},{name:"score",type:'int'},{name:"ipAddr"},{name:"askTotal",type:'int'},{name:"inquiryNum",type:'int'},{name:"status",type:'int'},{name:"surplusINum",type:'int'},{name:"currScore",type:'int'},{name:"useScore",type:'int'},{name:"role",type:'int'},{name:"updateOn"},{name:"nickName"}]	
						}/*, ["id","eid","memberID","memberType","degree","trueName","corpName","createOn","validDate","province","city","loginNum","lastTime","webProvince","webArea","score","ipAddr","askTotal","inquiryNum","status"]*/),
				baseParams : {
					type : 35,
					pageNo : 1,
					validDate : 0,
					memberType : 0,
					pageSize : 20
				},
				countUrl : '/ask/AskPriceServlet.do',
				countParams : {
					type : 36,
					role : 1
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
	var sel_type = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [["memberID", "会员ID"], ["trueName", "会员名称"],
						["corpName", "公司名称"], ["regProvince", "注册地区"],
						["webProvince", "信息价地区"]]
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
								}), sm, {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberID'
						}, {
							header : 'eid',
							sortable : false,
							dataIndex : 'EID',
							hidden : true
						},{
							header : '会员名称',
							sortable : true,
							dataIndex : 'trueName'
						},{
							header : '会员昵称',
							sortable : true,
							dataIndex : 'nickName'
						}, {
							header : '公司名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '所属城市',
							sortable : true,
							renderer:function(value,meta,record){
								var province = record.get("province");
								var city = record.get("city");
								if(province == null){
									return "";
								}
								return province + " " + city;
							}
						},{
							header : "设置日期",
							sortable : true,
							dataIndex : "updateOn"
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
					xtype : "textfield",
					id : "search_input",
					width : 130,
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

	ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});

};

// 查询
function searchlist() {
	var temp_query = "";
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		temp_query += "province~" + Ext.getCmp("province").getValue() + ";";
		if(city != "全部城市"){
			temp_query += ";city~" + Ext.getCmp("city").getValue()+";";
		}
	}
	
	temp_query += "memberId~" + Ext.fly("search_input").getValue() + ";";
	ds_info.baseParams["content"] = temp_query;
	ds_info.load();
};

/**
 * 设置堂主
 */
function addMonitor(){
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
														Ext.MessageBox.alert("提示", "该会员未激活，无法设置为堂主！",addMonitor);
													}else if ("3" == data.result){
														Ext.MessageBox.alert("提示", "该会员已被锁定，无法设置为堂主！",addMonitor);
													}else if ("4" == data.result){
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


}

/**
 * 删除堂主
 */
function delMonitor(){
	var ids = getSelected();
	if (ids.length == 0){
		Ext.MessageBox
		.alert(
				"提示",
				"请勾选需要删除的堂主信息！");
		return false;
	}
	Ext.MessageBox
			.show({
				title : '删除堂主',
				msg : "确定要删除勾选的堂主?",
				//width : 600,
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
						Ext.lib.Ajax
								.request(
										"post",
										"/ask/AskPriceServlet.do?type=38",
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
																"删除堂主成功！");
														ds_info.reload();
													}
												}
										},
										"ids="+ ids);
					}
				}
			});
}

function getSelected(){
	var rows = grid_info.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		if ("1" == rows[i].get("role")){
			ids.push(rows[i].get('id'));
		}
	}
	return ids;
}
