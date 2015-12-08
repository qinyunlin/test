var root, ds, tree, win, grid, form, root_win, tree_win, win_list, select_ds, guideds, hisgrid, hisds;
Ext.onReady(init);
var upload_form;
//var areaMap = new Map();

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

var toolbar = [ {
	text : '新增导入',
	icon : '/resource/images/add.gif',
	tooltip : '增加基础材料数据(导入上限3000条/次)',
	hidden : compareAuth("BASE_MATERIAL_IMPORT"),
	handler : function(){
		//19-新增，60-更新，59-删除
		importBaseMaterial("19");
	}
},{
	text : '更新导入',
	icon : '/resource/images/add.gif',
	tooltip : '更新已存在的基础材料数据(导入上限3000条/次)',
	hidden : compareAuth("BASE_MATERIAL_IMPORT"),
	handler : function(){
		//19-新增，60-更新，59-删除
		importBaseMaterial("60");
	}
},/*{
	text : '删除导入',
	icon : '/resource/images/add.gif',
	tooltip : '将编码对应存在的基础材料删除(导入上限10000条/次)',
	hidden : compareAuth("BASE_MATERIAL_IMPORT"),
	handler : function(){
		//19-新增，60-更新，59-删除
		importBaseMaterial("59");
	}
},*/ {
	text : '导出',
	icon : '/resource/images/add.gif',
	hidden : compareAuth("BASE_MATERIAL_EXPORT"),
	handler : exportBaseMaterial
}, {
	text : '查看/修改',
	icon : '/resource/images/edit.gif',
	hidden : compareAuth("BASE_MATERIAL_VIEW") || compareAuth("BASE_MATERIAL_EDIT"),
	handler : viewBaseMaterial
},{
	text : '删除',
	icon : '/resource/images/add.gif',
	tooltip : '单个删除',
	hidden : compareAuth("BASE_MATERIAL_IMPORT"),
	handler : delBaseMaterial
}, {
	text : '区域批量修改',
	icon : '/resource/images/edit.gif',
	hidden : compareAuth("BASE_MATERIAL_BATCH_UP_AREA"),
	handler : showAreaUpWin
}, {
	text : '查看价格',
	icon : '/resource/images/edit.gif',
	hidden : compareAuth("BASE_MATERIAL_VIEW_PRICE"),
	handler : viewPrice
}/*, {
	text : '同步所选',
	icon : '/resource/images/delete.gif',
	hidden : compareAuth("BASE_MATERIAL_SYSNC"),
	handler : function() {
		sysncBaseMaterial("1");
	}
}, {
	text : '全部同步',
	icon : '/resource/images/delete.gif',
	hidden : compareAuth("BASE_MATERIAL_SYSNC"),
	handler : function() {
		sysncBaseMaterial("0");
	}
}  */];

// 主要材料列表
function buildGrid() {
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/material/MaterialServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'bianma', 'code2013', 'subcid', 'name', 'spec', 'unit', 'areas', 'isDeleted','features','createOn','createBy','updateOn','updateBy' ]),
		baseParams : {
			type : 17,
			page : 1,
			pageSize : 20
		},
		countUrl : '/material/MaterialServlet.do',
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
		autoExpandColumn : 'common',
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
			header : '编码',
			width : 40,
			sortable : true,
			dataIndex : 'bianma'
		}, {
			header : '国码(2013)',
			width : 40,
			sortable : true,
			dataIndex : 'code2013'
		}, {
			header : '二级分类',
			sortable : true,
			dataIndex : 'subcid',
			renderer : function(value, meta, record) {
				var subcid = record.get("subcid");
				// var subName = getSubCidNameBySubcid(subCid);
				var subName = getSubCidNameBySubcid(subcid,
						true);
				if (subName == null || "" == subName) {
					return "";
				}
				return subName;
			}
		}, {
			header : '材料名称',
			sortable : false,
			dataIndex : 'name'
		}, {
			header : '规格',
			sortable : false,
			dataIndex : 'spec'
		}, {
			header : '单位',
			sortable : false,
			dataIndex : 'unit'
		}, {
			header : '区域',
			sortable : false,
			dataIndex : 'areas',
			renderer : function(value, meta, record) {
				var areas = record.get("areas");
				if (areas == null || "" == areas) return "";
				/*var areasArr = areas.split(";");
				for (var i = 0, j = areasArr.length ; i < j; i ++){
					if (!areaMap.containsKey(areasArr[i])){
						areaMap.put(areasArr[i],areasArr[i]);
					}
				}*/
				return "<span title='" + areas + "'>" + areas + "</span>";
			}
		}],
		renderTo : 'grid',
		border : false,
		loadMask : true,
		//selModel : new Ext.grid.RowSelectionModel(),
		tbar : toolbar,
		bbar : pagetool
	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
					xtype : "label",
					text : " 编码："
				},{
					xtype : "textfield",
					textLabel : "编码",
					id : "bianma",
					width : 150,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				},{
					xtype : "label",
					text : " 名称："
				},{
					xtype : "textfield",
					textLabel : "名称",
					id : "name",
					width : 150,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				},{
					xtype : "label",
					text : " 规格："
				},{
					xtype : "textfield",
					textLabel : "规格",
					id : "spec",
					width : 150,
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
					handler : searchlist,
					icon : "/resource/images/zoom.png"
				}]
	});
	grid.on('beforeedit', function(e) {
		/*if (compareAuth("MATERIALBASE_LIB_MOD")) {
			Info_Tip("对不起，您暂时不能进行此操作。");
			return false;
		} else
			return true;*/
	});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		viewBaseMaterial();
	});
};

// 搜索
function searchlist() {
	var bianma = Ext.getCmp("bianma").getValue();
	var name = Ext.getCmp("name").getValue();
	var spec = Ext.getCmp("spec").getValue();
	var currId = cid;
	if (subcid != null && "" != subcid) currId = subcid;
	ds.baseParams["content"] = "tBaseMaterial.bianma~" + bianma + ";tBaseMaterial.name~" + name + ";tBaseMaterial.spec~" + spec + ";tBaseMaterial.isDeleted~0;id~" + currId;
	ds.load();
};

function buildView() {
	var view = new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : false
		},
		contentEl : 'view',
		items : [ {
			region : 'west',
			width : 220,
			split : true,
			autoScroll : true,
			items : tree
		}, {
			region : 'center',
			items : grid
		} ]
	});
};

/**
 * 新增/更新/删除导入基础材料
 * type:19-新增，60-更新，59-删除
 */
function importBaseMaterial(type){
	var title = "新增";
	if ("60" == type){
		title = "更新";
	}else if ("59" == type){
		title = "删除";
	}
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [ {
				layout : 'form',
				bodyStyle : 'border:none;',
				items : [{
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : '选择文件',
					allowBlank : false
				},
				{
					columnWidth : 0.5,
					layout : 'form',
					bodyStyle : 'border:none;',
					items : {
						bodyStyle : 'border:none;',
						html : "<a href='" + FileSite + "/doc/baseMaterial.xls"
								+ "' >标准文档下载</a>"
					}
				} ]
			} ]
		} ]
	});
	win = new Ext.Window({
		title : title + '基础材料',
		closeable : true,
		width : 400,
		height : 120,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : function() {
				//19-新增，60-更新，59-删除
				uploadFile(title, type);
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

/**
 * 上传文件
 * @param type
 */
function uploadFile(title, type) {
	if (upload_form.getForm().isValid()) {
		upload_form
				.getForm()
				.submit(
						{
							url : '/material/MaterialServlet.do?type=' + type,
							waitMsg : '上传文件中...',
							success : function(upload_form, o) {
								var returnInfo = o.result;
								if (getState(returnInfo.state,
										commonResultFunc, returnInfo.result)) {
									var sucNum = returnInfo.result;
									var r = /^\+?[1-9][0-9]*$/; //正整数
									if (r.test(sucNum)){
										Info_Tip("基础材料成功" + title + sucNum + "条！");
										win.close();
										ds.reload();
									}else{
										//错误信息
										showErrorWin(sucNum);
									}
								} 
							},
							failure : function() {
								showErrorWin("基础材料导入失败，具体请联系技术人员！");
							}
						});
	} else
		Info_Tip("请正确填写信息。");
}

function showErrorWin(errorMsg){
	Ext.MessageBox.hide();
	//win.close();
	var exceptionMsg = new Ext.form.FormPanel(
			{
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:400px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [ {
					xtype : 'textarea',
					width : 380,
					value : errorMsg,
					style : "min-height:300px;",
					allowBlank : false,
					autoHeight : true
				} ],
				buttons : [ {
					text : '确定',
					handler : function() {
						win1.close();
					}
				} ]
			});
	var win1 = new Ext.Window({
		title : '错误提示',
		closeAction : "close",
		width : 500,
		autoHeight : true,
		bodyStyle : 'padding:6px',
		draggable : true,
		modal : true,
		items : [ exceptionMsg ]
	});
	win1.show();

}

/**
 * 导出
 */
function exportBaseMaterial(){
	var currId = cid;
	if (subcid != null && "" != subcid) currId = subcid;
	if (currId == null || "" == currId){
		Ext.MessageBox.alert("提示", "不支持大类导出！");
		return false;
	}
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for(var i=0;i<rows.length;i++){
		ids.push(rows[i].get("id"));
	}
	if (currId == "0"){
		currId = "";
	}
	var bianma = Ext.getCmp("bianma").getValue();
	var name = Ext.getCmp("name").getValue();
	var spec = Ext.getCmp("spec").getValue();
	var content = "tBaseMaterial.bianma~" + bianma + ";tBaseMaterial.name~" + name + ";tBaseMaterial.spec~" + spec;
	$("#content").val(content);
	window.document.exportform.action = "/material/MaterialServlet.do?type=20&code=" + currId + "&ids=" + ids.toString(); 
	window.document.exportform.submit();
}

/**
 * 查看/修改
 */
function viewBaseMaterial(){
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length != 1) {
		Ext.MessageBox.alert("提示", "请勾选一条材料！");
		return false;
	}
	var row = grid.getSelectionModel().getSelected();
	window.parent.createNewWidget("baseMaterial_detail", '查看/修改材料',
		'/module/mat/baseMaterial_detail.jsp?id=' + row.get("id"));
}

/**
 * 删除基础材料
 */
function delBaseMaterial(){
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length != 1) {
		Ext.MessageBox.alert("提示", "请勾选一条材料！");
		return false;
	}
	var row = grid.getSelectionModel().getSelected();
	var bianma = row.get("bianma");
	var data = {};
	data["type"] = "62";
	data["bianma"] = bianma;
	Ext.MessageBox
	.show({
		title : '提示',
		msg : "确定删除编码为'" + bianma + "'的基础材料?",
		prompt : false,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text){
			if ("ok" == btn){
				doDel(data);
			}
		}}
	);
}

/**
 * 删除基础材料
 */
function doDel(data){
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在删除基础材料，并同步到参考材价库中...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.Ajax.request({
		url:'/material/MaterialServlet.do',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				loadMarsk.hide();
				loadStore = null;
				ds.load();
				Ext.MessageBox.alert("提示", "删除基础材料成功！");
			}else{
				loadMarsk.hide();
			}
		},
		failure : function(response) {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

/**
 * 同步
 * @param flag
 */
function sysncBaseMaterial(flag){
	var param = "";
	if ("1" == flag){ //同步所选
		var rows = grid.getSelectionModel().getSelections();
		if(rows.length < 1){
			Ext.MessageBox.alert("提示","请选择至少一条基础材料！");
			return;
		}
		var ids = [];
		for(var i=0;i<rows.length;i++){
			ids.push(rows[i].get("id"));
		}
		param = ids.toString();
	}
	Ext.Ajax.request({
		url:'/material/MaterialServlet.do',
		method:'POST',
		params:{
			type:'23',
			id:"ids=" + param
		},
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				if(data.result){
					Ext.MessageBox.alert("提示",data.result);
				}else{
					Ext.MessageBox.alert("提示","操作成功");
				}
				ds.reload();
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}

var provinceWin,provincePanel,provinceChk,provinceItems;
var zhcn = new Zhcn_Select();
/**
 * 区域批量修改
 */
function showAreaUpWin(){
	var currId = cid;
	if (subcid != null && "" != subcid) currId = subcid;
	
	if (currId == null || "" == currId){
		Ext.MessageBox.alert("提示", "请至少选择一级分类！");
		return false;
	}
	
	/*var rows = grid.getSelectionModel().getSelections();
	for(var i=0;i < rows.length;i++){
		var areas = rows[i].get("areas");
		if (areas != null && "" != areas){
			areaMap = new Map();
			var areasArr = areas.split(";");
			for (var i = 0, j = areasArr.length ; i < j; i ++){
				if (!areaMap.containsKey(areasArr[i])){
					areaMap.put(areasArr[i],areasArr[i]);
				}
			}
		}
	}*/
	var cidName = "其它分类";
	/*if ("-1" != currId){
		cidName = getStuffName(currId);
	}*/
	if (currId.length == 2){
		cidName = getStuffName(currId);
	}else if (currId.length == 4){
		cidName = getSubCidNameBySubcid(subcid,
					false);
	}else{
		Ext.MessageBox.alert("提示", "请至少选择一级分类！");
		return false;
	}
	
	var provinces = zhcn.getProvince('');
	provinceItems = [];
	var proArr = provinces.split(",");
	var proArrLength = proArr.length;
	for (var i = 0, j = proArrLength; i < j; i ++){
		var pro = proArr[i];
		var chkItem = {};
		chkItem["boxLabel"] = pro;
		chkItem["inputValue"] = pro;
		chkItem["name"] = pro;
		/*if (areaMap.containsKey(pro)){
			chkItem["checked"] = true;
		}*/
		provinceItems.push(chkItem);
	}
	
	provinceChk = new Ext.form.CheckboxGroup({
        xtype: 'checkboxgroup',
        fieldLabel: "区域批量修改",
        name: 'provinceChk',
        allowBlank: false,
        id: 'provinceChk',
        width: 600,
        columns: 6,
        items: provinceItems
    });

	provincePanel = new Ext.Panel(
			{
				layout : "form",
				border : false,
				id : "proForm",
				bodyStyle : 'border:none;padding-left:10px;',
				layoutConfig : {
					columns : 1
				},
				items : [{
					bodyStyle : 'border:none;line-height: 40px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "<input type='checkbox' id='proCheckAll' onclick='proCheckAll()'>&nbsp;全选"
					}, provinceChk]
				}]
			});
	
	//当前已设置的区域默认选中
	/*if (areaMap != null && areaMap.keys().length > 0){
		window.console.log(areaMap);
		for (var i = 0, j = areaMap.keys().length; i < j; i ++){
			var key = areaMap.keys()[i];
			window.console.log("---" + key + "---");
			provinceChk.setValue(key,true);
		}
	}*/
	
	provinceWin = new Ext.Window({
		title : "<font color='red'>" + cidName + "</font>" + "-区域批量修改",
		closeAction : "close",
		width : 660,
		height : 300,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ provincePanel ],
		buttons : [ {
			text : '修改',
			handler : function() {
				var areasNames = "";
				//获取
			    var selectItems = Ext.getCmp('proForm').findById('provinceChk').items;
			    for(var i = 0, j = selectItems.length; i < j; i ++){
			        if(selectItems.itemAt(i).checked){
			        	areasNames += selectItems.itemAt(i).name + ";";
			        }
			    }
			    if (areasNames != null && "" != areasNames){
			    	areasNames = areasNames.substring(0,areasNames.lastIndexOf(";"));
			    }
			    //提交修改
			    commitBatchUpArea(areasNames);
			    //关闭窗体
			    provinceWin.close();
			}
		} ]
	});
	provinceWin.show();
}

/**
 * 全选/取消 全选
 */
function proCheckAll(){
	var checked = $("#proCheckAll").attr("checked");
	var selectItems = Ext.getCmp('proForm').findById('provinceChk').items;
	var checkGroup = Ext.getCmp('provinceChk');
    for(var i = 0, j = selectItems.length; i < j; i ++){
    	checkGroup.setValue(selectItems.itemAt(i).name,checked);
    }
}

var loadMarsk,loadStore;
/**
 * 区域批量修改提交
 * @returns {Boolean}
 */
function commitBatchUpArea(areas){
	var currId = cid;
	if (subcid != null && "" != subcid) currId = subcid;
	if (currId == null || "" == currId){
		Ext.MessageBox.alert("提示", "请至少选择一级分类！");
		return false;
	}
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for(var i=0;i<rows.length;i++){
		ids.push(rows[i].get("id"));
	}
	var data = {};
	data["type"] = "51";
	data["rationId"] = currId;
	data["ids"] = ids.toString();
	data["areas"] = areas;
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在批量修改区域，并同步到参考材价库中...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.Ajax.request({
		url:'/material/MaterialServlet.do',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				loadMarsk.hide();
				loadStore = null;
				//areaMap = new Map();
				ds.load();
				Ext.MessageBox.alert("提示", "区域修改成功！");
			}else{
				loadMarsk.hide();
			}
		},
		failure : function(response) {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

function loadMap(){
	//areaMap = new Map();
}

/**
 * 查看价格
 */
function viewPrice(){
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length != 1) {
		Ext.MessageBox.alert("提示", "请勾选一条材料！");
		return false;
	}
	var row = grid.getSelectionModel().getSelected();
	var bianma = row.get("bianma");
	var areas = row.get("areas");
	if (areas == null || "" == areas){
		Ext.MessageBox.alert("提示", "该条材料暂无价格！");
		return false;
	}
	var view_store = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/material/MaterialServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, ["id", "cbianma", "province", "fromBy", "price"]),
		baseParams : {
			type : 1,
			page : 1,
			//pageSize : 20,
			pageSize : 50,
			sort : "price",
			dir : "desc",
			content : "bianma~" + bianma + ";fromBase~1"
		},
		countUrl : '/material/MaterialServlet.do',
		countParams : {
			type : 2
		},
		remoteSort : true
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	
	var pagetool = new Ext.ux.PagingToolbar({
		store : view_store,
		displayInfo : true,
		pageSize : 20
	});
	
	var columnsItem = [ new Ext.grid.RowNumberer({
		width : 30
	}), {
		header : 'ID',
		sortable : false,
		dataIndex : 'id',
		hidden : true
	}, {
		width : 80,
		header : '地区',
		sortable : true,
		dataIndex : 'province'
	}, {
		width : 150,
		header : '品牌',
		sortable : true,
		dataIndex : 'fromBy',
		renderer : function(value, meta, record) {
			var fromBy = record.get("fromBy");
			if (fromBy == null) return "";
			return fromBy;
		}
	}, {
		width : 120,
		header : '价格',
		sortable : true,
		dataIndex : 'price',
		renderer : function(value, meta, record) {
			var price = record.get("price");
			if (parseFloat(price) >= 100){
				price = parseInt(Math.round(price));
			}else{
				price = parseFloat(price).toFixed(2);
			}
			return price;
		}
	}];

	var name = row.get("name");
	var spec = row.get("spec");
	var view_grid = new Ext.grid.EditorGridPanel({
		title : "材料：<font color='red'>" + bianma + "&nbsp;&nbsp;&nbsp;" + name + "(" + spec + ")</font>",
		id : "view_grid",
		store : view_store,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		height : 550,
		autoScroll : true,
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		columns : columnsItem,
		bbar : pagetool
	});
	
	var view_win = new Ext.Window({
		title : '查看价格',
		closeAction : "close",
		y : "0",
		width : 680,
		autoWidth : false,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ view_grid ],
		buttons : [ {
			text : '关闭',
			handler : function() {
				view_win.close();
			}
		} ]
	});
	view_win.show();
	view_store.load();
}
