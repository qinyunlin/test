var url = "/mc/lampManageServlet.do", grid_info, showKeep_win, areaId, boothNum = 0;
Ext.onReady(init);
function init() {
	areaId = getCurArgs("areaId");
	boothNum = getCurArgs("boothNum");
	Ext.QuickTips.init(true);
	getLampBoothList();

};
var tbar = [{
			text : '添加企业',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("LAMP_BOOTH_ADD"),
			handler : function(){
				addLampBooth("添加企业展位");
			}
		}, {
			text : '查看/修改',
			icon : "/resource/images/edit.gif", 
			hidden : compareAuth("LAMP_BOOTH_EDIT"),
			handler : function(){
				editLampBooth();
			}
		},{
			text : "续期",
			icon : '/resource/images/book_open.png',
			hidden : compareAuth("LAMP_BOOTH_EXTENDVALIDDATE"),
			handler : showKeep
		},{
			text : "关停/取消关停",
			icon : '/resource/images/book_open.png',
			hidden : compareAuth("LAMP_BOOTH_STATUS"),
			handler : updateStatus
		},{
			text : "删除",
			icon : "/resource/images/delete.gif",
			hidden : compareAuth("LAMP_BOOTH_DEL"),
			handler : delLampBooth
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id",type:'int'},{name:"name"},{name:"topNum",type:'int'},{name:"facMaterialIds"},{name:"status",type:'int'},{name:"createBy"},{name:"validDate"},{name:"createOn"},{name:"updateBy"}]	
			}),
	baseParams : {
		type : 6,
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 7
	},
	remoteSort : true
});
pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "id",
	singleSelect : true
});
//获取活动列表
function getLampBoothList(){
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
					header : '展位企业',
					sortable : false,
					dataIndex : 'name'
				}, {
					header : '展出产品数',
					sortable : false,
					renderer : function(v,meta,record){
						var topNum = record.get("topNum");
						if(topNum)
							return topNum;
						var facMaterialIds = record.get("facMaterialIds");
						return facMaterialIds.split(";").length;
					}
				}, {
					header : '状态',
					sortable : false,
					renderer : function(v,meta,record){
						var status = record.get("status");
						if(status == "0")
							return "展出";
						else if(status == "1")
							return "关停";
						else
							return "到期";
					}
				}, {
					header : '添加时间',
					sortable : false,
					dataIndex : 'createOn'
				}, {
					header : '截止时间',
					sortable : false,
					dataIndex : 'validDate'
				}, {
					header : '添加人ID',
					sortable : false,
					dataIndex : 'createBy'
				}, {
					header : '更新人ID',
					sortable : false,
					dataIndex : 'updateBy'
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list_info"
	});
	ds_info.baseParams["areaId"] = areaId;
	ds_info.load();
}
//删除展区
function delLampBooth(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	Ext.Msg.confirm("提示", "确定删除该展位下的企业吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 15,
					content : "boothId~"+id+";isDeleted~1"
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						Info_Tip("删除成功。");
						ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}
//续期
function showKeep() {
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var boothId = row.get("id");
	showKeep_win = new Ext.Window({
				title : "续期",
				autoHeight : true,
				width : 300,
				closable : true,
				draggable : true,
				modal : true,
				border : false,
				plain:true,
				layout : 'form',
				closeAction : "close",
				buttonAlign : 'center',
				items : [{
					id : 'dateRadio',
					fieldLabel:'续期时间',
					xtype : 'radiogroup',
					items:[{
						name:'keepMonth',
						xtype:'radio',
						boxLabel:'1个月',
						inputValue:'1'
					},{
						name:'keepMonth',
						xtype:'radio',
						boxLabel:'2个月',
						inputValue:'2'
					},{
						name:'keepMonth',
						xtype:'radio',
						boxLabel:'3个月',
						inputValue:'3'
					}]
				}],
				buttons : [{
							text : "续期",
							handler : function(){
								keepOp(boothId);
							}
						}, {
							text : "取消",
							handler : function() {
								showKeep_win.close();
							}
						}]
			});
	showKeep_win.show();
}
//续期提交
function keepOp(boothId) {
	if(!Ext.getCmp("dateRadio").getValue()){
		return;
	}
	var month = Ext.getCmp("dateRadio").getValue().inputValue;
	var query = "boothId~"+boothId+";addDays~" + (month * 30);
	Ext.Ajax.request({
		url : url,
		params : {
			type : 13,
			content : query
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("续期成功。");
				ds_info.reload();
				showKeep_win.close();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//关停/取消关停
function updateStatus(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选一条企业！");
		return;
	}
	var status = row.get("status");
	var confirm_tip = "确定关停所选企业吗？";
	var info_tip = "关停成功！";
	if(status == "1"){
		confirm_tip = "确定取消关停所选企业吗？";
		info_tip = "取消关停成功！";
		status = "0";
	}else
		status = "1";
		
	Ext.Msg.confirm("提示", confirm_tip, function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 14,
					content : "boothId~"+row.get("id")+";status~"+status
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						if(jsondata.result != null && jsondata.result.length > 0){
							Info_Tip(jsondata.result);
							return;
						}
						Info_Tip(info_tip);
						ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}
//添加企业
function addLampBooth(title,boothId){
	window.parent.createNewWidget("lamp_booth_info", title, '/module/lamp/lamp_booth_info.jsp?areaId='+areaId+'&num='+boothNum+'&boothId='+boothId);
}
//查看/修改企业
function editLampBooth(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	addLampBooth("修改企业展位",id);
}