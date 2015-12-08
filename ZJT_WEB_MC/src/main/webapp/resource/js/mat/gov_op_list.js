var root, ds, tree, win, grid, form, root_win, tree_win, win_list, select_ds, guideds, hisgrid, hisds,query_combo;
var query_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["createBy", "更新人"], ["title", "标题"]]
});
Ext.onReady(init);
var upload_form;
//var areaMap = new Map();

function init() {
	buildGrid();
}

// 主要材料列表
function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/GovMatTitle.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'title', 'matCount', 'way','createOn','createBy']),
		baseParams : {
			type : 17,
			page : 1,
			pageSize : 20
		},
		countUrl : '/GovMatTitle.do',
		countParams : {
			type : 18
		},
		remoteSort : true
	});
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true
	});
	grid = new Ext.grid.EditorGridPanel({
		store : ds,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		frame : true,
		autoHeight : true,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'ID',
			sortable : true,
			hidden:true,
			dataIndex : 'code'
		}, {
			header : '标题',
			width : 120,
			sortable : true,
			dataIndex : 'title'
		}, {
			header : '材料数',
			width : 50,
			sortable : true,
			dataIndex : 'matCount'
		}, {
			header : '更新人',
			sortable : true,
			dataIndex : 'createBy'
		}, {
			header : '更新时间',
			sortable : false,
			dataIndex : 'createOn'
		}],
		renderTo : 'grid',
		border : false,
		loadMask : true,
		bbar : pagetool,
		tbar : [query_combo = new Ext.form.ComboBox({
			store : query_type,
			mode : "local",
			triggerAction : "all",
			valueField : "value",
			displayField : "text",
			value : "createBy",
			width : 80

		}),{
			xtype : 'textfield',
			id : 'query_text',
			width : 150,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER)
						searchlist();
				}
			}
		},"-",{
			xtype : "label",
			text : " 更新时间：从  "
		},{
			xtype : 'datefield',
			emptyText : '请选择日期',
			format : 'Y-m-d',
			id : "mainDate",
			readOnly : false
		}, 
		{
			xtype : "label",
			text : "  到   "
		},
		{
			xtype : 'datefield',
			emptyText : '请选择日期',
			format : 'Y-m-d',
			id : "maxDate",
			readOnly : false
		},
		{
			text : "查询",
			id : "search",
			icon : "/resource/images/zoom.png",
			handler : searchlist
		}],
	});
	ds.load();
};

/**
 * 查询
 */
function searchlist(){
	ds.baseParams["title"] = "";
	ds.baseParams["createBy"] = "";
	var query_text = Ext.fly("query_text").getValue();
	ds.baseParams[query_combo.getValue()] = query_text;
	var mainDate = Ext.fly("mainDate").getValue();
	var maxDate = Ext.fly("maxDate").getValue();
	if(mainDate!=null && maxDate !=null && maxDate!="" && mainDate!="" && maxDate!="请选择日期" && mainDate!="请选择日期"){
		if (compareDate(mainDate, maxDate)){
			Info_Tip("起始日期不能大于截止日期！");
			return false;
		}
		ds.baseParams["mainDate"] = mainDate;
		ds.baseParams["maxDate"] = maxDate;
	}else{
		ds.baseParams["mainDate"] = "";
		ds.baseParams["maxDate"] = "";
	}
	ds.load();
}
/**
 * 时间比较
 * @param beginDate
 * @param endDate
 * @returns {Boolean}
 */
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
