var store, page, sm, tbar1,tbar2, grid, typeStore;

var stateArray = [["0","未审核"],["1","已审核"],["2","全部"]];

Ext.onReady(function() {
	init();
});

function init(){
	buildGrid();
}

function buildGrid(){
	store　=　new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/sunshinePurchase.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","title","holdAddr","phone","startTime","endTime","createOn","createBy","auditor","auditTime","orderCode","CONTENT_TEMPLATE"]),
				baseParams : {
					type : "1",
					pageNo : 1,
					pageSize : 20,
					content:'isLock~0;state~0;'
				},
				countUrl : '/sunshinePurchase.do',
				countParams : {
					type : "2"
				},
				remoteSort : true
			});
		
	page = new Ext.ux.PagingToolbar({
				store : store,
				displayInfo : true

			});
	sm = new Ext.grid.CheckboxSelectionModel({
			dataIndex : "id"
		});
	tbar1 = [{
			text : '增加',
			icon : "/resource/images/add.gif", 
			handler : add
		},'-', {
			text : '修改',
			icon : "/resource/images/edit.gif", 
			handler : edit
		},'-', {
			text : '锁定',
			icon : "/resource/images/lock.png", 
			handler : lock
		},'-',{
			id:'auditButton',
			text : '审核',
			icon : "/resource/images/tick.png", 
			handler : showAddType
		},{
            text: '查看报名',
            icon: "/resource/images/edit.gif",
            handler: viewApplyUsers
        },{
        	text:'生成阳光采购活动静态页面',
        	cls : 'x-btn-text-icon',
			icon : '/resource/images/arrow_refresh.png',
			hidden:compareAuth("CREATE_SUNSHINE_HTML"),
			handler:createSunshineHtml
        }];
	
	grid = new Ext.grid.EditorGridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : store,
				clicksToEdit:1,
				viewConfig : {
					forceFit : true
				},
				//tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '活动名称',
							sortable : false,
							dataIndex : 'title'
						}, {
							header : '举办地址',
							sortable : false,
							dataIndex : 'holdAddr'
						}, {
							header : '联系电话',
							sortable : false,
							dataIndex : 'phone'
						}, {
							header : '开始时间',
							sortable : false,
							dataIndex : 'startTime'
						}, {
							header : '结束时间',
							sortable : false,
							dataIndex : 'endTime'
						},{
							header:'序列号',
							sortable:true,
							dataIndex:'orderCode',
							editor : new Ext.form.NumberField({
								allowBlank:true
							})
						}, {
							header : '创建人',
							sortable : false,
							dataIndex : 'createBy'
						},{
							header : '创建时间',
							sortable : false,
							dataIndex : 'createOn'
						},{
							header:"绑定模版id",
							sortable:true,
							dataIndex:'CONTENT_TEMPLATE',
							editor : new Ext.form.TextField()
						}/*, {
							id:'auditorColumn',
							hidden:true,
							header : '审核人',
							sortable : true,
							dataIndex : 'auditor'
						}, {
							id:'auditTimeColumn',
							hidden:true,
							header : '审核时间',
							sortable : true,
							dataIndex : 'auditTime'
						}*/],
				sm : sm,
				tbar : tbar1,
				bbar : page,
				renderTo : "grid"
			});
			
	bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items:[{
			xtype:'label',
			text:'活动标题：'
		},{
			xtype : 'textfield',
			fieldLabel : '活动标题',
			id : 'keyword',
			name : 'keyword',
			width : 180
		},'-',{
			xtype:'label',
			text:'审核状态'
		},{
			xtype : 'combo',
			id : 'state',
			name : 'state',
			store : stateArray,
			width : 150,
			fieldLabel : '审核状态',
			value:'0',
			valueField : "value",
			displayField : "text",
			mode : 'local',
			forceSelection : true,
			editable : false,
			triggerAction : 'all'
		},{
			text : "查询",
			id : "search",
			icon : "/resource/images/zoom.png",
			handler : search
		}]
	});
	
	grid.on("rowdblclick", function(grid, index){
		var record = grid.store.getAt(index);
		var id = record.get("id");
		window.parent.createNewWidget("sunshinePurchaseEdit", '修改阳光采购活动',
			'/module/sunshinePurchase/sunshinePurchaseEdit.jsp?id=' + id);
	});
	
	
	grid.on('afteredit', function(e){
		Ext.Msg.wait("正在保存...", "提示");
        Ext.lib.Ajax.request('post', '/sunshinePurchase.do', {
            success: function(response){
                var data = eval("(" + response.responseText + ")");
                if (data && data.state == 'success') {
                    Ext.MessageBox.alert("提示", "修改成功！");
                    store.load();
                }else {
                    Ext.MessageBox.alert("提示", "修改失败！");
                }
            },
            failure: function(){
                Ext.Msg.alert('警告', '操作失败。');
            }
        }, "type=10&id=" + e.record.data.id +"&orderCode=" + e.record.data.orderCode+"&templateid="+e.record.data.CONTENT_TEMPLATE);
    });
	
	store.setDefaultSort('createOn','desc');
	store.load();
}

function search(){
	var name = Ext.fly("keyword").getValue();
	var state = Ext.getCmp("state").getValue();
	
	//是否隐藏部分内容
	if(state == '0'){
		//审核按钮
		Ext.getCmp("auditButton").show();
		/*//审核人列
		grid.getColumnModel().getColumnById("auditorColumn").hidden = true;
		//审核时间列
		grid.getColumnModel().getColumnById("auditTimeColumn").hidden = true;*/
	}else{
		//审核按钮
		Ext.getCmp("auditButton").hide();
		/*//审核人列
		grid.getColumnModel().getColumnById("auditorColumn").hidden = false;
		//审核时间列
		grid.getColumnModel().getColumnById("auditTimeColumn").hidden = false;*/
	}
   store.baseParams["content"]="title~"+name+";isLock~"+0;
	if(state!="2")
	{
	   store.baseParams["content"] +=";state~"+state;
	}
	store.baseParams["isBlur"] = true;
	store.reload();
}

function add(){
	window.parent.createNewWidget("sunshinePurchaseAdd", '添加阳光采购活动',
			'/module/sunshinePurchase/sunshinePurchaseAdd.jsp');
}

function edit(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Ext.MessageBox.alert("提示","请选择需要修改的活动");
		return;
	}
	var id = row.get("id");
	window.parent.createNewWidget("sunshinePurchaseEdit", '修改阳光采购活动',
			'/module/sunshinePurchase/sunshinePurchaseEdit.jsp?id=' + id);
}

function lock(){
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert("提示","请选中需要锁定的活动");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("id"));
	}
	Ext.Msg.confirm("提示", "您确定要锁定选中的活动吗?", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/sunshinePurchase.do',
				params : {
					ids : ids,
					isLock:1,
					type:7
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data.state == 'success') {
						Ext.MessageBox.alert("提示", "锁定成功");
						store.reload();
					}else{
						Ext.MessageBox.alert("警告", "系统出错");
					}
				},
				failure : function() {
					Ext.MessageBox.alert("警告", data.result);
				}
			});
		}
	});
}

//生成阳光采购活动静态页面方法
function createSunshineHtml(){
	var ids = grid.selModel.selections.keys.toString();
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '生成阳光采购页面处理中.....!',
	        disabled : false,
	        store : store
	      });
	      loadMarsk.show();
		var store=Ext.Ajax.request({
			method : 'post',
			url : "/TemplateHtml.do?type=10",
			params : {
				id : ids.toString(),
				regType : 3
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					loadMarsk.hide();
					Info_Tip("生成阳光采购页面成功");
				} else {
					 Info_Tip("生成阳光采购页面失败！");
				}
			},
			failure : function() {
				 Warn_Tip();
			}

		});	
}


function audit(templateid){
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert("提示","请选择需要审核的活动");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("id"));
		
	}
	Ext.Msg.confirm("提示", "您确定要审核选中的活动吗?", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/sunshinePurchase.do',
				params : {
					type : '9',
					isAudit:'1',
					ids : ids,
					templateid:templateid
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data.state == 'success') {
						Ext.MessageBox.alert("提示", "审核成功");
						addTypeWin.hide()
						store.reload();
						
						createSunshineHtml();
					}else{
						Ext.MessageBox.alert("警告", "系统出错");
					}
				},
				failure : function() {
					Ext.MessageBox.alert("警告", data.result);
				}
			});
		}
	});
}

/* 新增分类 */
var addTypeWin;
var addTypeForm;
var buildAddType = function() {
	addTypeForm = new Ext.form.FormPanel({
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				frame : true,
				labelAlign : 'right',
				height : 66,
				autoWidth : true,
				hideBorders : true,
				items : [ {
							layout : 'form',
							items : {
								id : 'templateid',
								fieldLabel : '指定阳光采购模版id',
								name : 'templateid',
								xtype : "textfield"
						}
					}]
			});

	addTypeWin = new Ext.Window({
				//el : 'add_type_win',
				width : 370,
				height : 138,
				title : '绑定阳光采购活动模版',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				modal : true,
				items : [{
							columnWidth : 1,
							items : {
								items : addTypeForm
							}
						}],
				buttons : [{
							text : '确定',
							handler : function() {
								//alert(addTypeForm.getForm().getEl().dom.templateid.value);
								audit(addTypeForm.getForm().getEl().dom.templateid.value);
										
							}
						}, {
							text : '取消',
							handler : function() {
								addTypeWin.hide();
							}
						}],
				listeners : {
					"hide" : function(){
						addTypeForm.getForm().reset();
					}
				}
			});
};

var showAddType = function() {
	if (addTypeWin == null) {
		buildAddType();
		addTypeWin.show();
	} else {
		addTypeWin.show();
	}
};


function viewApplyUsers(){
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert("提示","请选择需要审核的活动");
		return;
	}
	if(rows.length>1){
		Ext.MessageBox.alert("提示","只能查看一个活动的报名列表");
		return;
	}
	window.parent.createNewWidget("sunshineApplyUserView", '查看阳光采购报名',
			'/module/sunshinePurchase/sunshineApplyUserView.jsp?id=' + rows[0].id);
}
