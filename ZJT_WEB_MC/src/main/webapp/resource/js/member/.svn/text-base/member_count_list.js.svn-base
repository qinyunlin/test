var root, ds1,ds3,ds8, tree, win, grid1,grid3, grid8, form, root_win, tree_win, win_list, select_ds, guideds, hisgrid, hisds;
Ext.onReady(init);
var upload_form;
var yearItem, comboYear1, comboYear3, comboYear8;

function init() {
	loadYear();
	buildGrid1();
	buildGrid3();
	buildGrid8();
};

function selectChange(degree,obj){
	var val = $(obj).val();
	if (val == null || "" == val) return;
	if ("1" == degree){
		ds1.baseParams["year"] = val;
		ds1.load();
	}else if ("3" == degree){
		ds3.baseParams["year"] = val;
		ds3.load();
	}else if ("8" == degree){
		ds8.baseParams["year"] = val;
		ds8.load();
	}
}

function loadYear(){
	yearItem = [];
	var data = {};
	data["method"] = "memberCountYear";
	$.ajax({
		type : 'POST',
		url : '/account/Member.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				for (var i = 0, j = data.result.length; i < j; i ++){
					//yearItem.push([data.result[i],data.result[i] + "年"]);
					$("#yearSelect1").append("<option value='" + data.result[i] + "'>" + data.result[i] + "年</option>");
					$("#yearSelect3").append("<option value='" + data.result[i] + "'>" + data.result[i] + "年</option>");
					$("#yearSelect8").append("<option value='" + data.result[i] + "'>" + data.result[i] + "年</option>");
				}
			}
		}
	});
	$("#yearSelect1").val(new Date().getFullYear());
	$("#yearSelect3").val(new Date().getFullYear());
	$("#yearSelect8").val(new Date().getFullYear());
	/*
	comboYear1  = new Ext.form.ComboBox({
		id : 'comboYear1',
		store : yearItem,
		width : 160,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择年份',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '年份',
		listeners : {
			"select" : function(combo) {
				ds1.baseParams["year"] = combo.getValue();
				ds1.load();
			}
		}
	});
	
	comboYear3  = new Ext.form.ComboBox({
		id : 'comboYear3',
		store : yearItem,
		width : 160,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择年份',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '年份',
		listeners : {
			"select" : function(combo) {
				ds3.baseParams["year"] = combo.getValue();
				ds3.load();
			}
		}
	});
	
	comboYear8  = new Ext.form.ComboBox({
		id : 'comboYear8',
		store : yearItem,
		width : 160,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择年份',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '年份',
		listeners : {
			"select" : function(combo) {
				ds8.baseParams["year"] = combo.getValue();
				ds8.load();
			}
		}
	});*/
}

// 普通会员列表
function buildGrid1() {
	//ds1 = new Ext.data.SelfStore({
	ds1 = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/account/Member.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'year', 'degree', 'type', 'm1', 'm2', 'm3', 'm4', 'm5','m6','m7','m8','m9','m10', 'm11', 'm12' ]),
		baseParams : {
			method : "memberCountList",
			degree : 1,
			year : new Date().getFullYear(),
			page : 1,
			pageSize : 20
		},
		/*countUrl : '/account/Member.do',
		countParams : {
			method : "memberCountNum"
		},*/
		remoteSort : false
	});
	/*var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds1,
		displayInfo : true
	});*/
	grid1 = new Ext.grid.EditorGridPanel({
		store : ds1,
		//sm : sm,
		viewConfig : {
			forceFit : true
		},
		//autoExpandColumn : 'common',
		//frame : true,
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,    
		loadMask : true,
		columns : [/* new Ext.grid.RowNumberer({
			width : 30
		}), */{
			header : 'ID',
			sortable : false,
			hidden:true,
			dataIndex : 'id'
		}, {
			header : '',
			width : 40,
			sortable : false,
			dataIndex : 'type',
			renderer : function(value, meta, record) {
				var type = record.get("type");
				//1-会员总数,2-新注册会员,3邮箱验证会员,4-新开通会员,5-续期会员
				if ("1" == type){
					return "会员总数";
				}else if ("2" == type){
					return "新注册会员";
				}else if ("3" == type){
					return "邮箱验证会员";
				}else if ("4" == type){
					return "新开通会员";
				}else if ("5" == type){
					return "续期会员";
				}
				return "其它";
			}
		}, {
			header : '1月',
			width : 30,
			sortable : false,
			dataIndex : 'm1'
		}, {
			header : '2月',
			width : 30,
			sortable : false,
			dataIndex : 'm2'
		}, {
			header : '3月',
			width : 30,
			sortable : false,
			dataIndex : 'm3'
		}, {
			header : '4月',
			width : 30,
			sortable : false,
			dataIndex : 'm4'
		}, {
			header : '5月',
			width : 30,
			sortable : false,
			dataIndex : 'm5'
		}, {
			header : '6月',
			width : 30,
			sortable : false,
			dataIndex : 'm6'
		}, {
			header : '7月',
			width : 30,
			sortable : false,
			dataIndex : 'm7'
		}, {
			header : '8月',
			width : 30,
			sortable : false,
			dataIndex : 'm8'
		}, {
			header : '9月',
			width : 30,
			sortable : false,
			dataIndex : 'm9'
		}, {
			header : '10月',
			width : 30,
			sortable : false,
			dataIndex : 'm10'
		}, {
			header : '11月',
			width : 30,
			sortable : false,
			dataIndex : 'm11'
		}, {
			header : '12月',
			width : 30,
			sortable : false,
			dataIndex : 'm12'
		}],
		renderTo : 'grid1',
		//border : false
	});
	/*var bar2 = new Ext.Toolbar({
		renderTo : grid1.tbar,
		items : [{
					text : "普通会员统计"
				}, comboYear1]
	});*/
	ds1.load();
};


//正式会员列表
function buildGrid3() {
	//ds1 = new Ext.data.SelfStore({
	ds3 = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/account/Member.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'year', 'degree', 'type', 'm1', 'm2', 'm3', 'm4', 'm5','m6','m7','m8','m9','m10', 'm11', 'm12' ]),
		baseParams : {
			method : "memberCountList",
			degree : 3,
			year : new Date().getFullYear(),
			page : 1,
			pageSize : 20
		},
		/*countUrl : '/account/Member.do',
		countParams : {
			method : "memberCountNum"
		},*/
		remoteSort : false
	});
	/*var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds3,
		displayInfo : true
	});*/
	grid3 = new Ext.grid.EditorGridPanel({
		store : ds3,
		//sm : sm,
		viewConfig : {
			forceFit : true
		},
		//autoExpandColumn : 'common',
		//frame : true,
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,    
		loadMask : true,
		columns : [/* new Ext.grid.RowNumberer({
			width : 30
		}), */{
			header : 'ID',
			sortable : false,
			hidden:true,
			dataIndex : 'id'
		}, {
			header : '',
			width : 40,
			sortable : false,
			dataIndex : 'type',
			renderer : function(value, meta, record) {
				var type = record.get("type");
				//1-会员总数,2-新注册会员,3邮箱验证会员,4-新开通会员,5-续期会员
				if ("1" == type){
					return "会员总数";
				}else if ("2" == type){
					return "新注册会员";
				}else if ("3" == type){
					return "邮箱验证会员";
				}else if ("4" == type){
					return "新开通会员";
				}else if ("5" == type){
					return "续期会员";
				}
				return "其它";
			}
		}, {
			header : '1月',
			width : 30,
			sortable : false,
			dataIndex : 'm1'
		}, {
			header : '2月',
			width : 30,
			sortable : false,
			dataIndex : 'm2'
		}, {
			header : '3月',
			width : 30,
			sortable : false,
			dataIndex : 'm3'
		}, {
			header : '4月',
			width : 30,
			sortable : false,
			dataIndex : 'm4'
		}, {
			header : '5月',
			width : 30,
			sortable : false,
			dataIndex : 'm5'
		}, {
			header : '6月',
			width : 30,
			sortable : false,
			dataIndex : 'm6'
		}, {
			header : '7月',
			width : 30,
			sortable : false,
			dataIndex : 'm7'
		}, {
			header : '8月',
			width : 30,
			sortable : false,
			dataIndex : 'm8'
		}, {
			header : '9月',
			width : 30,
			sortable : false,
			dataIndex : 'm9'
		}, {
			header : '10月',
			width : 30,
			sortable : false,
			dataIndex : 'm10'
		}, {
			header : '11月',
			width : 30,
			sortable : false,
			dataIndex : 'm11'
		}, {
			header : '12月',
			width : 30,
			sortable : false,
			dataIndex : 'm12'
		}],
		renderTo : 'grid3',
		//border : false
	});
	/*var bar2 = new Ext.Toolbar({
		renderTo : grid1.tbar,
		items : [{
					text : "普通会员统计"
				}, comboYear1]
	});*/
	ds3.load();
};


//VIP信息会员列表
function buildGrid8() {
	//ds8 = new Ext.data.SelfStore({
	ds8 = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/account/Member.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'year', 'degree', 'type', 'm1', 'm2', 'm3', 'm4', 'm5','m6','m7','m8','m9','m10', 'm11', 'm12' ]),
		baseParams : {
			method : "memberCountList",
			degree : 8,
			year : new Date().getFullYear(),
			page : 1,
			pageSize : 20
		},
		/*countUrl : '/account/Member.do',
		countParams : {
			method : "memberCountNum"
		},*/
		remoteSort : false
	});
	/*var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds8,
		displayInfo : true
	});*/
	grid8 = new Ext.grid.EditorGridPanel({
		store : ds8,
		//sm : sm,
		viewConfig : {
			forceFit : true
		},
		//autoExpandColumn : 'common',
		//frame : true,
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,    
		loadMask : true,
		columns : [/* new Ext.grid.RowNumberer({
			width : 30
		}), */{
			header : 'ID',
			sortable : false,
			hidden:true,
			dataIndex : 'id'
		}, {
			header : '',
			width : 40,
			sortable : false,
			dataIndex : 'type',
			renderer : function(value, meta, record) {
				var type = record.get("type");
				//1-会员总数,2-新注册会员,3邮箱验证会员,4-新开通会员,5-续期会员
				if ("1" == type){
					return "会员总数";
				}else if ("2" == type){
					return "新注册会员";
				}else if ("3" == type){
					return "邮箱验证会员";
				}else if ("4" == type){
					return "新开通会员";
				}else if ("5" == type){
					return "续期会员";
				}
				return "其它";
			}
		}, {
			header : '1月',
			width : 30,
			sortable : false,
			dataIndex : 'm1'
		}, {
			header : '2月',
			width : 30,
			sortable : false,
			dataIndex : 'm2'
		}, {
			header : '3月',
			width : 30,
			sortable : false,
			dataIndex : 'm3'
		}, {
			header : '4月',
			width : 30,
			sortable : false,
			dataIndex : 'm4'
		}, {
			header : '5月',
			width : 30,
			sortable : false,
			dataIndex : 'm5'
		}, {
			header : '6月',
			width : 30,
			sortable : false,
			dataIndex : 'm6'
		}, {
			header : '7月',
			width : 30,
			sortable : false,
			dataIndex : 'm7'
		}, {
			header : '8月',
			width : 30,
			sortable : false,
			dataIndex : 'm8'
		}, {
			header : '9月',
			width : 30,
			sortable : false,
			dataIndex : 'm9'
		}, {
			header : '10月',
			width : 30,
			sortable : false,
			dataIndex : 'm10'
		}, {
			header : '11月',
			width : 30,
			sortable : false,
			dataIndex : 'm11'
		}, {
			header : '12月',
			width : 30,
			sortable : false,
			dataIndex : 'm12'
		}],
		renderTo : 'grid8',
		//border : false
	});
	/*var bar2 = new Ext.Toolbar({
		renderTo : grid1.tbar,
		items : [{
					text : "普通会员统计"
				}, comboYear1]
	});*/
	ds8.load();
};
