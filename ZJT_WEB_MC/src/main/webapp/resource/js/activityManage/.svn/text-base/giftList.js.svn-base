var grid_info, ds_info, ds_mem, area_win, fs, query_fs, win, sel_combo;
var giftWin,modifyGiftWin;
var bianma,imgURL;
var modCountRef;
var modUseCount;
var giftRefWin;
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	buildGirid();
	Ext.get("name").on('keypress',function(e){
		if(e.charCode == Ext.EventObject.ENTER){
			alert("deypress");
			return;
			searchlist();
		}
	});
};

ds_mem = new Ext.data.SimpleStore({
			fields : [{
						name : 'value'
					}, {
						name : 'text'
					}],
			data : info_type_combox
		});
var personConfig;
// 右键菜单
var tbar = [{
			text : '添加礼品',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("GIFT_MANAGE_ADD"),
			handler : showAddGift
		}, {
			text : '修改礼品',
			icon : "/resource/images/edit.gif", 
			hidden : compareAuth("GIFT_MANAGE_MOD"),
			handler : showModifyGift
		}, {
			text : '删除礼品',
			icon : "/resource/images/delete.gif",
			hidden : compareAuth("GIFT_MANAGE_DEL"),
			handler : checkRelateActivity
		}];


var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/giftManageServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							fields:[{name:"id",type:'int'},{name:"bianma"},{name:"desc"},{name:"imgURL"},
							        {name:"count"},{name:"usedCount"},{name:"name"},
							        {name:"isDeleted"},{name:"createOn"},{name:"createBy"},
							        {name:"updateOn"},{name:"updateBy"}]	
						}),
				baseParams : {
					type : 1,
					pageNo : 1,
					pageSize : 20,
				},
				countUrl : '/mc/giftManageServlet',
				countParams : {
					type : 2
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
								}),sm, {
							header : '编号',
							sortable : false,
							dataIndex : 'bianma'
						},{
							header : 'id',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '名称',
							sortable : false,
							dataIndex : 'name',
						}, {
							header : '礼品总数',
							sortable : false,
							dataIndex : 'count',
							//renderer : showDegree
						}, {
							header : '已用数量',
							sortable : true,
							dataIndex : 'usedCount'
						}, {
							header : '库存量',
							sortable : true,
							renderer : function(value,meta,record){
								var usedCount = record.get("usedCount");
								var count = record.get("count");
								return count-usedCount;
							}
						}, {
							header : '创建人',
							sortable : true,
							dataIndex : 'createBy'
						}, {
							header : '创建日期',
							sortable : true,
							dataIndex : 'createOn'
						},{
							header : "更新人",
							sortable : true,
							dataIndex:"updateBy",
						},{
							header : "更新日期",
							sortable : true,
							width : 70,
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
					xtype : 'label',
					text : '编号：'
				},"-",{
					xtype : "textfield",
					id : "bianhao",
					width : 130,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, "-",{
					xtype : "label",
					text : '名称'
				}, "-",{
					xtype : "textfield",
					id : "name",
					width : 130,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, "-", {
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
	var name = Ext.getCmp("name").getValue();
	var bianhao=Ext.getCmp("bianhao").getValue();
	if(Ext.isEmpty(name)){
		name = "";
	}
	if(Ext.isEmpty(bianhao)){
		bianhao = "";
	}
	ds_info.baseParams["number"] = bianhao;
	ds_info.baseParams["name"] = name;
	ds_info.load();
};




function checkAll(){
	Ext.select("input[name=webProvince_checkbox]").each(function(el) {
			Ext.getDom(el).checked = Ext.fly("allprovince").dom.checked;
		});
}




function showModifyGiftWin() {
	if (!giftWin)
		buildAddGiftWin();
	giftWin.show();
};
function showAddGiftWin() {
	var mem_rows = grid_info.getSelectionModel().getSelections();
	if (!giftWin)
		buildAddGiftWin();
	giftWin.show();
};

/**
 * 获得选中id集合
 * @returns {Array}
 */
function getSelected(){
	var rows = grid_info.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	return ids;
}


//创建添加礼品窗口
function showAddGift() {

	Ext.lib.Ajax.request("post", "/mc/giftManageServlet?type=4", {
		success : function(response){
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				
				/*alert("kkkkkkkkkk000编号是："+jsondata.result);
				return ;*/
				bianma = jsondata.result;
				buildAddGiftWin(jsondata.result);
				//Info_Tip("邮件已发送...");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

};

function buildAddGiftWin(bianhao) {
	var leftpanl = new Ext.Panel({
		frame : true,
		width : 300,
		height : 199,
		bodyStyle : "margin-right:12px",
		layout : "table",
		layoutConfig : {
			columns : 2
		},
		items : [
		   {
			width : 90,
			// autoHeight : true,
			height : 28,
			bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
			items : [{
						xtype : "label",
						text : "编号："
					}]
		   },
		   {
				width : 160,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;color: red;",
				items : [{
							xtype : "label",
							id : "bianhao_add",
							width : 160,
							text : bianhao
						}]
			},
			{
				width : 90,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "名称："
						}]
		   },
		   {
				width : 160,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textfield",
							id : "name_add",
							maxLength : 180,
							allowBlank : false,
							blankText : "请输入礼品名称",
							width : 160
						}]
			},
			{
				width : 90,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "库存量："
						}]
		   },
		   {
				width : 160,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "numberfield",
							id : "count_add",
							allowNegative : false,
							allowDecimals : false,
							maxValue : 99999,
							minValue : 1,
							width : 160
						}]
			},
			{
				width : 90,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "描述："
						}]
		   },
		   {
				width : 160,
				height : 100,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textarea",
							id : "desc_add",
							maxLength : 1000,
							allowBlank : false,
							blankText : "请输入描述信息",
							width : 160
						}]
			}
				
		]
	});
	
	var rightPanl = new Ext.Panel({
		frame : true,
		width : 160,
		layout : "form",
		height : 199,
		bodyStyle : "margin-right:12px",
		items : [{
			width : 160,
			height : 160,
			items : [{
				align : 'center',
				width : 160,
				height : 160,
				html : "<img id='picPath' src='/resource/images/def_info.jpg' width='160' height='160' />"
			}]
		}, {
			xtype : "tbbutton",
			width : 120,
			text : "选择图片",
			handler : showPic,
			//hidden : compareAuth("MEM_MOD")
		}]
	});
	
	var detail_info = new Ext.Panel({
		frame : true,
		layout : "table",
		layoutConfig : {
			columns : 3
		},
		minHeight : 200,
		items : [leftpanl,{
			bodyStyle : "border:none",
			width : 10
		},rightPanl]
	});

	detail_info_form = new Ext.FormPanel({
		        id:"myForm",
				layout : "form",
				autoWidth : true,
				autoHeight : true,
				align : "center",
				bodyStyle : "border:none",
				items : [detail_info]
			});
	
	giftWin = new Ext.Window({
		title : '添加礼品',
		border : false,
		/*autoWidth : true,
		autoHeight : true,*/
		width : 510,
		height : 300,
		region : 'center',
		autoScroll : true,
		resizable : false,
		layout : 'form',
		modal : true,
		//frame : true,
		closeAction : 'hide',
		layoutConfig : {
			columns : 1
		},
		items : [detail_info_form],
		buttons : [{
					text : '确定',
					handler : function(){
						isHasGifName(Ext.get("name_add").getValue());
						//SaveNewGift
					}
				}, {
					text : '取消',
					handler : function() {
						giftWin.close();
					}
				}]
	});

	giftWin.show();
}

//显示修改相片区域
function showPic() {
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.callbackFn = 'upload_fn';
	FileUpload_Ext.initComponent("上传图片建议规格：400*400px");
};

//上传图片回调函数
function upload_fn() {
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + FileUpload_Ext.callbackMsg;
	imgURL = FileUpload_Ext.callbackMsg;
};

function SaveNewGift(){
	var picPath =  FileUpload_Ext.callbackMsg;
	var name = Ext.fly("name_add").getValue();
	var count = Ext.fly("count_add").getValue();
	var desc = Ext.fly("desc_add").getValue();
	if(Ext.isEmpty(name) || Ext.isEmpty(count) || Ext.isEmpty(desc)){
		Ext.Msg.alert('提示','请检查输入的数据是否符合要求！');
		return;
	}
	Ext.Ajax.request({
		url : '/mc/giftManageServlet',
		params : {
			type : 5,
			bianma : bianma,
			name : name,
			count : count,
			desc : desc,
			ImgURL : picPath,
		},
		success : function(response) {
			var data = eval("(" + response.responseText
					+ ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				
				Ext.Msg.alert('提示','添加礼品成功');
				giftWin.close();
				ds_info.load();
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	});

}

function buildRelateActivityMsg(obj){
	//var activities = obj;
	var htmltext= "";
	Ext.each(obj,function(item){
		htmltext+= "<p style='color:red'>"+item+"</p>";
	});
	var msgPanl = new Ext.Panel({
		frame : true,
		width : 360,
		layout : "form",
		autoHeight : true,
		bodyStyle : "margin-right:12px",
		items : [{
			align : 'center',
			autoWidth : true,
			height : 30,
			html : "以下进行中的活动使用该礼品，请到对应活动取消礼品后再操作！"
		}, {
			autoWidth : true,
			autoHeight : true,
			html : htmltext
		}]
	});
	giftRefWin = new Ext.Window({
		title : '系统提示',
		border : false,
		/*autoWidth : true,
		autoHeight : true,*/
		width : 390,
		autoHeight : true,
		region : 'center',
		autoScroll : true,
		resizable : false,
		layout : 'form',
		modal : true,
		//frame : true,
		closeAction : 'hide',
		layoutConfig : {
			columns : 1
		},
		items : [msgPanl],
		buttons : [{
					text : '确定',
					handler : function(){
						giftRefWin.close();
					}
				}]
	});
	giftRefWin.show();
	
}

function checkRelateActivity(){
	var row = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Ext.MessageBox.alert("提示", "请选择要删除的礼品");
		return;
	}else if(row.length > 1){
		Ext.MessageBox.alert("提示", "只能选择一个");
		return;
	}
	var bianma = row[0].get("bianma");
	Ext.Ajax.request({
		url : '/mc/giftManageServlet',
		params : {
			type : 11,
			bianma : bianma,
		},
		success : function(response) {
			var data = eval("(" + response.responseText
					+ ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				
				if(Ext.isEmpty(data.result)){
					confirmDelete();
				}else{
					buildRelateActivityMsg(data.result);
					return;
				}
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	});
}

function confirmDelete(){
	
	Ext.Msg.confirm("确认操作", "您确认要删除选中的礼品吗？", function(op) {
		if (op == "yes"){
			var ids = getSelected();
			Ext.Ajax.request({
				url : '/mc/giftManageServlet',
				params : {
					type : 8,
					ids : ids.toString()
				},
				success : function(response) {
					var data = eval("(" + response.responseText
							+ ")");
					if (getState(data.state, commonResultFunc,
							data.result)) {
						
						Ext.Msg.alert('提示','删除礼品成功！');
						ds_info.load();
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			});
		}
	});
}
/**
 * 
 * @param name 
 * @param fn 执行的函数
 */
function isHasGifName(name){
	Ext.Ajax.request({
		url : '/mc/giftManageServlet',
		params : {
			type : 9,
			name : name,
		},
		success : function(response) {
			var data = eval("(" + response.responseText
					+ ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				var isHas = data.result;
				if(isHas=='yet'){
					Ext.Msg.alert('提示','已经存在相同的礼品名称！');
					return;
				}else if(isHas=='no'){
					SaveNewGift();
				}
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '查找是否存在相同名称操作失败！');
		}
	});
	
}
function isHasModGifName(name,id){
	Ext.Ajax.request({
		url : '/mc/giftManageServlet',
		params : {
			type : 10,
			name : name,
			id : id
		},
		success : function(response) {
			var data = eval("(" + response.responseText
					+ ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				var isHas = data.result;
				if(isHas=='yet'){
					Ext.Msg.alert('提示','礼品名称不能和其它礼品名相同！');
					return;
				}else if(isHas=='no'){
					updateGift(id);
				}
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '查找是否存在相同名称操作失败！');
		}
	});
	
}
function updateGift(id){
	var name = Ext.get("name_mod").getValue();
	var stockCount = Ext.get("stockCount_mod").getValue();
	var desc = Ext.get("desc_mod").getValue();
	var count = parseInt(stockCount)+ parseInt(modUseCount);
	if(Ext.isEmpty(name) || Ext.isEmpty(count) || Ext.isEmpty(desc) || (stockCount < (modCountRef-modUseCount))){
		Ext.Msg.alert('提示','请检查输入的数据是否符合要求！');
		return;
	}
	Ext.Ajax.request({
		url : '/mc/giftManageServlet',
		params : {
			type : 6,
			bianma : bianma,
			name : name,
			count : count,
			desc : desc,
			ImgURL : imgURL,
			id : id
		},
		success : function(response) {
			var data = eval("(" + response.responseText
					+ ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				
				Ext.Msg.alert('提示','修改礼品成功！');
				modifyGiftWin.close();
				ds_info.load();
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	});
	
}

function showModifyGift(){
	var row = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Ext.MessageBox.alert("提示", "请选择要修改的礼品");
		return;
	}else if(row.length > 1){
		Ext.MessageBox.alert("提示", "只能选择一个");
		return;
	}
	var id = row[0].get("id");
	Ext.Ajax.request({
		url : '/mc/giftManageServlet',
		params : {
			type : 7,
			id : id
		},
		success : function(response) {
			var data = eval("(" + response.responseText
					+ ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				bianma = data.result["bianma"];
				//修改的不能小于原有的
				modCountRef = data.result["count"];
				modUseCount = data.result["usedCount"];
				buildModifyGiftWin(data.result);
			}
		},
		failure : function() {
			Ext.Msg.alert('警告', '操作失败。');
		}
	});
}

function buildModifyGiftWin(obj) {
	var leftpanl = new Ext.Panel({
		frame : true,
		width : 300,
		height : 199,
		bodyStyle : "margin-right:12px",
		layout : "table",
		layoutConfig : {
			columns : 2
		},
		items : [
		   {
			width : 90,
			// autoHeight : true,
			height : 28,
			bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
			items : [{
						xtype : "label",
						text : "编号："
					}]
		   },
		   {
				width : 160,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;color: red;",
				items : [{
							xtype : "label",
							id : "bianma_mod",
							width : 160,
							text : obj.bianma
						}]
			},
			{
				width : 90,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "名称："
						}]
		   },
		   {
				width : 160,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textfield",
							//fieldLabel : "真实姓名",
							id : "name_mod",
							allowBlank : false,
							blankText : "请输入礼品名称",
							maxLength : 100,
							value : obj["name"],
							width : 160
						}]
			},
			{
				width : 90,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "库存量："
						}]
		   },
		   {
				width : 160,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "numberfield",
							id : "stockCount_mod",
							allowNegative : false,
							allowDecimals : false,
							maxValue : 99999,
							minValue : obj["count"]-obj["usedCount"],
							value : obj["count"]-obj["usedCount"],
							width : 160
						}]
			},
			{
				width : 90,
				// autoHeight : true,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "描述："
						}]
		   },
		   {
				width : 160,
				// autoHeight : true,
				height : 100,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textarea",
							id : "desc_mod",
							maxLength : 1000,
							allowBlank : false,
							blankText : "请输入描述信息",
							value : obj["desc"],
							width : 160
						}]
			}
				
		]
	});
	
	var rightPanl = new Ext.Panel({
		frame : true,
		width : 160,
		layout : "form",
		height : 199,
		bodyStyle : "margin-right:12px",
		items : [{
			width : 160,
			height : 160,
			items : [{
				width : 160,
				height : 160,
				html : "<img id='picPath' src='/resource/images/def_info.jpg' width='160' height='160' />"
			}]
		}, {
			xtype : "tbbutton",
			width : 120,
			text : "选择图片",
			handler : showPic,
			//hidden : compareAuth("MEM_MOD")
		}]
	});
	
	var detail_info = new Ext.Panel({
		frame : true,
		layout : "table",
		layoutConfig : {
			columns : 3
		},
		minHeight : 200,
		items : [leftpanl,{
			bodyStyle : "border:none",
			width : 10
		},rightPanl]
	});

	var detail_info_form = new Ext.FormPanel({
		        id:"modifyForm",
				layout : "form",
				autoWidth : true,
				autoHeight : true,
				align : "center",
				bodyStyle : "border:none",
				items : [detail_info]
			});
	
	modifyGiftWin = new Ext.Window({
		title : '修改礼品',
		border : false,
		width : 510,
		height : 300,
		region : 'center',
		autoScroll : true,
		resizable : false,
		layout : 'table',
		modal : true,
		//frame : true,
		closeAction : 'hide',
		layoutConfig : {
			columns : 1
		},
		items : [detail_info_form],
		buttons : [{
					text : '确定',
					handler : function(){
						isHasModGifName(Ext.get("name_mod").getValue(),obj["id"]);
					}
				}, {
					text : '取消',
					handler : function() {
						modifyGiftWin.close();
					}
				}]
	});
	modifyGiftWin.show();
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + obj["imgURL"];
	imgURL = obj["imgURL"];
}