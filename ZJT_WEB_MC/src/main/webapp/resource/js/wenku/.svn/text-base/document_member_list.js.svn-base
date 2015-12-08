var url = "/mc/wenkuServlet.do", grid_info, search_combo;
var search_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["memberID", "会员ID"],["trueName", "会员名称"],["nickName", "会员昵称"],["corpName", "公司名称"]]
});
var memberTypeArr = [["1,3,8,7","全部会员"],["1","普通会员"],["3","正式信息会员"],[7,"试用云造价会员"],["8","云造价会员"],["13","已过期正式信息会员"],["18","已过期云造价会员"]];
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
var city = ["全部城市"];

Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	getDocumentList();
};
var tbar = [{
			text : '查看详情',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("WENKU_MEMBER_INFO"),
			handler : openMemberInfo
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"memberID"},{name:"degree"},{name:"trueName"},{name:"nickName"},{name:"corpName"},{name:"province"},{name:"city"},{name:"uploadNum"},{name:"getScore"},{name:"downloadNum"},{name:"useScore"},{name:"currScore"}]	
			}),
	baseParams : {
		type : 10,
		content : "degree~1,3,8,7",
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 11,
		content : "degree~1,3,8,7"
	},
	remoteSort : true
});
var pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "memberID"
});
//获取活动列表
function getDocumentList(){
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
					header : '会员类型',
					sortable : false,
					dataIndex : 'degree',
					renderer: showDegree
				}, {
					header : '会员名称',
					sortable : false,
					dataIndex : 'trueName'
				},{
					header : '会员昵称',
					sortable : false,
					dataIndex : 'nickName'
				},{
					header : "公司名称",
					sortable : false,
					dataIndex:"corpName"
				},{
					header : '所属城市',
					sortable : false,
					renderer:function(value,meta,record){
						var province = record.get("province");
						var city = record.get("city");
						if(province == null)
							return "";
						return province + " " + city;
					}
				},{
					header : "上传文档",
					sortable : true,
					dataIndex: "uploadNum"
				},{
					header : "赚取积分",
					sortable : true,
					dataIndex: "getScore"
				},{
					header : "下载文档",
					sortable : true,
					dataIndex: "downloadNum"
				},{
					header : "使用积分",
					sortable : true,
					dataIndex: "useScore"
				},{
					header : "当前积分",
					sortable : true,
					dataIndex:"currScore"
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list"
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
		}, {
			xtype : 'combo',
			id : 'city',
			store : city,
			triggerAction : 'all',
			value : '全部城市',
			width:120,
			readOnly : true
		}, {
			id : 'degree',
			name : 'degree',
			fieldLabel : '会员类型',
			store : memberTypeArr,
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			emptyText : '请选择会员类型',
			valueField : "value",
			displayField : "text",
			readOnly : true,
			xtype : "combo",
			value : "1,3,8,7",
			width : 120
		}, "-", search_combo = new Ext.form.ComboBox({
			store : search_type,
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			displayField : "text",
			value : "memberID",
			width : 80
		}), "-", {
			xtype : "textfield",
			id : "searchValue",
			width : 130,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER)
						searchValuelist();
				}
			}
		},{
			text : "查询",
			id : "search",
			icon : "/resource/images/zoom.png",
			handler : searchValuelist
		}]
	});
	ds_info.load();
}
//查询
function searchValuelist(){
	var province = Ext.getCmp("province").getValue();
	if(province == "全部省份")
		province = "";
	var city = Ext.getCmp("city").getValue();
	if(city == "全部城市")
		city = "";
	var degree = Ext.getCmp("degree").getValue();
	var searchType = search_combo.getValue();
	var searchValue = Ext.fly("searchValue").getValue();
	ds_info.baseParams["content"] = "province~"+province+";city~"+city+";degree~"+degree+";" + searchType + "~" + searchValue;
	ds_info.countParams["content"] = "province~"+province+";city~"+city+";degree~"+degree+";" + searchType + "~" + searchValue;
	ds_info.load();
}
//查看详情
function openMemberInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	window.parent.createNewWidget("member_info", '会员信息','/module/member/member_info.jsp?id=' + row.get("memberID"));
}