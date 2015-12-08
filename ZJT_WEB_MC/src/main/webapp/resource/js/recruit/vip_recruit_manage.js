var ds, grid, ck, pagetool;
var ids = [];// 选择项
var win, fs;

Ext.onReady(function(){
    buildGrid();
});

// 加载列表
var buildGrid = function(){

    // 数据源
    ds = new Ext.data.SelfStore({
        proxy: new Ext.data.HttpProxy({
            url: '/mc/RecruitServlet'
        }),
        reader: new Ext.data.JsonReader({
            root: 'result',
            totalProperty: 500,
            id: 'id'
        }, ["id", "eid", "title", "createBy", "startTime", "endTime", "state", "createOn", "auditTime", "auditor","orderCode","CONTENT_TEMPLATE","CONTENT_TEMPLATE1"]),
        baseParams: {
            type: 1,
            page: 1,
            pageSize: 20,
            cid: '1',
            content: 'isLock~1;state~0;isdel~0'
        },
        countUrl: '/mc/RecruitServlet',
        countParams: {
            type: 2
        },
        remoteSort: true
    });
    
    // 分页控件
    pagetool = new Ext.ux.PagingToolbar({
        store: ds,
        displayInfo: true
    });
    
    // 多选
    var sm = new Ext.grid.CheckboxSelectionModel();
    
    // 列表
    grid = new Ext.grid.EditorGridPanel({
        store: ds,
        stripeRows: true,
        loadMask: true,
        autoWidth: true,
        autoHeight: true,
        sm: sm,
        columns: [new Ext.grid.RowNumberer({
            width: 30
        }), sm, {
            header: 'ID',
            sortable: false,
            dataIndex: 'id',
            hidden: true
        }, {
            header: '企业ID',
            sortable: true,
            dataIndex: 'eid',
            width: 150
        }, {
            header: '招募主题',
            dataIndex: 'title',
            sortable: true,
            width: 250
        }, {
            header: '发布人',
            dataIndex: 'createBy',
            sortable: true,
            width: 100
        }, {
            header: '开始时间',
            dataIndex: 'startTime',
            sortable: true,
            width: 130
        }, {
            header: '结束时间',
            dataIndex: 'endTime',
            sortable: true,
            width: 130
        }, {
            header: '状态',
            sortable: true,
            dataIndex: 'state',
            renderer: renderisAudit,
            width: 80
        },{
        	header:"模版内容id",
        	sortable:true,
        	dataIndex:'CONTENT_TEMPLATE',
        	editor : new Ext.form.TextField(),
            width: 100
        },{
        	header:"模版列表id",
        	sortable:true,
        	dataIndex:'CONTENT_TEMPLATE1',
        	editor : new Ext.form.TextField(),
            width: 100
        },{
			header:'序列号',
			sortable:true,
			dataIndex:'orderCode',
			width:100,
			editor : new Ext.form.NumberField({
				allowBlank:true
			})
		}, {
            header: '审核人',
            sortable: true,
            dataIndex: 'auditor',
            width: 100
        },{
            header: '审核时间',
            sortable: true,
            dataIndex: 'auditTime',
            width: 130
        }],
        viewConfig: {
            forceFit: true
        },
		clicksToEdit:1,
        bbar: pagetool,
        renderTo: 'recruit_grid',
        
        view: new Ext.ux.grid.BufferView({
            rowHeight: 10,
            scrollDelay: true
        }),
        tbar: [{
            text: '查看/修改',
            cls: 'x-btn-text-icon',
            icon: '/resource/images/edit.gif',
            handler: showUpdateRecruit
        }, {
            text: '锁定',
            cls: 'x-btn-text-icon',
            icon: '/resource/images/lock.png',
            handler: function(){
                lock('list');
            }
        }, {
            text: '审核通过',
            icon: "/resource/images/tick.png",
            handler: showAddType
        }, {
            text: '查看报名',
            icon: "/resource/images/edit.gif",
            handler: showRecruitApplyUsers
        },{
        	text:'生成供应商招募静态页面',
        	cls : 'x-btn-text-icon',
			icon : '/resource/images/arrow_refresh.png',
        	hidden:compareAuth("CREATE_RECRUIT_HTML"),
        	handler:createRecruitHtml
        },{
        	text:'生成供应商招募列表静态页面',
        	cls : 'x-btn-text-icon',
			icon : '/resource/images/arrow_refresh.png',
        	hidden:compareAuth("CREATE_RECRUIT_HTML"),
        	handler:createRecruitListHtml
        }]
    });
    //行双击事件
    grid.on("rowdblclick", function(grid, rowIndex, r){
        var row = grid.getSelectionModel().getSelected();
        showUpdateRecruit();
    });
	
    grid.on('afteredit', function(e){
		Ext.Msg.wait("正在保存...", "提示");
        Ext.lib.Ajax.request('post', '/mc/RecruitServlet', {
            success: function(response){
                var data = eval("(" + response.responseText + ")");
                if (data && data.state == 'success') {
                    Ext.MessageBox.alert("提示", "修改成功！");
                    ds.load();
                }else {
                    Ext.MessageBox.alert("提示", "修改失败！");
                }
            },
            failure: function(){
                Ext.Msg.alert('警告', '操作失败。');
            }
        }, "type=11&id=" + e.record.data.id +"&orderCode=" 
             + e.record.data.orderCode+"&templateid="
             +e.record.data.CONTENT_TEMPLATE
             +"&templateListId="+e.record.data.CONTENT_TEMPLATE1);
    });
	
    ds.load();
	
    function renderAuditor(value, p, record){
        if (!Ext.isEmpty(record.data.auditTime)) {
            return String.format('{0}&nbsp;{1}', record.data.auditor, record.data.auditTime.slice(0, 10));
        }
        else {
            return "";
        }
    }
    function renderisAudit(value, p, record){
        return changeAudit(record.data.state);
    }
    
    var data = [['eid', '企业ID'], ['title', '招募主题']];
    
    var fd_store = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: data
    });
    
    var bar = new Ext.Toolbar({
        renderTo: grid.tbar,
        items: [ck = new Ext.form.ComboBox({
            id: 'cid_type',
            mode: 'local',
            triggerAction: "all",
            store: fd_store,
            valueField: "value",
            displayField: "text",
            width: 80,
            value: 'eid',
            listeners: {
                select: function(combo, record, index){
                    Ext.fly("searchtitle").dom.value = "";
                }
            }
        }), {
            xtype: "label",
            text: "关键字："
        }, {
            xtype: "textfield",
            textLabel: "关键字",
            id: "searchtitle",
            enableKeyEvents: true,
            listeners: {
                "keyup": function(tf, e){
                    if (e.getKey() == e.ENTER) {
                        searchlist();
                    }
                }
            }
        }, {
            xtype: 'label',
            text: '审核状态：'
        }, {
            xtype: 'combo',
            id: 'audittype',
            store: AuditType,
            width: 80,
            value: '0',
            triggerAction: 'all',
            listeners: {
                select: function(combo, record, index){
                    searchlist();
                }
            }
        }, {
            text: "查询",
            id: "search",
            icon: "/resource/images/zoom.png",
            handler: searchlist
        }]
    });
    
};

//生成供应商招募列表静态页面
function createRecruitListHtml(){
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '生成供应商招募页面处理中.....!',
	        disabled : false,
	        store : store
	      });
	      loadMarsk.show();
		var store=Ext.Ajax.request({
			method : 'post',
			url : "/TemplateHtml.do?type=13",
			params : {
				regType : 1
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					loadMarsk.hide();
					Info_Tip("生成供应商招募页面成功");
				} else {
					 Info_Tip("生成供应商招募页面失败！");
				}
			},
			failure : function() {
				 Warn_Tip();
			}

		});	
}
//生成供应商招募静态页面
function createRecruitHtml(){
	var ids = grid.selModel.selections.keys.toString();
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '生成供应商招募页面处理中.....!',
	        disabled : false,
	        store : store
	      });
	      loadMarsk.show();
		var store=Ext.Ajax.request({
			method : 'post',
			url : "/TemplateHtml.do?type=10",
			params : {
				id : ids.toString(),
				regType : 1
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					loadMarsk.hide();
					Info_Tip("生成供应商招募页面成功");
				} else {
					 Info_Tip("生成供应商招募页面失败！");
				}
			},
			failure : function() {
				 Warn_Tip();
			}

		});	
}


//审核通过
function auditPass(templateid,templateListId){
    var rows = grid.getSelectionModel().getSelections();
    
    if (Ext.isEmpty(rows)) {
        Info_Tip("请选择信息。");
        return;
    }
    if(Ext.isEmpty(templateid)){
    	Info_Tip("请填写模版内容id");
    	return;
    }
    if(Ext.isEmpty(templateListId)){
    	Info_Tip("请填写模版列表id");
    	return;
    }
    
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].get('id'));
    }
    if (ids.length == 0) {
        ids = "";
    }
    else {
        ids = ids.toString();
    }
    
    
    
    Ext.Msg.confirm("确认操作", "您确认要审核选中的信息吗？", function(op){
        if (op == "yes") {
            Ext.Ajax.request({
                url: '/mc/RecruitServlet',
                params: {
                    type: 3,
                    id: ids,
                    templateid:templateid,
                    templateListId:templateListId
                },
                success: function(response){
                    var json = eval("(" + response.responseText +
                    ")");
                    if (getState(json.state, commonResultFunc, json.result)) {
                    	Ext.Ajax.request({
                			method : 'post',
                			url : "/TemplateHtml.do?type=10",
                			params : {
                				id : ids.toString(),
                				regType : 1
                			},
                			success : function(response) {
                				var data = eval("(" + response.responseText + ")");
                				if (getState(data.state, commonResultFunc, data.result)) {
                					Info_Tip("审核成功并生成对应供应商招募页面");
                				
                				} else {
                					 Info_Tip("审核成功但生成供应商招募页面失败！");
                				}
                			}
                		});	
                        addTypeWin.hide();
                        ds.reload();
                   	   createRecruitListHtml();
                    }
                },
                failure: function(){
                    Warn_Tip();
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
				height : 100,
				autoWidth : true,
				hideBorders : true,
				items : [ {
							layout : 'form',
							items : {
								id : 'templateid',
								fieldLabel : '招募内容模版id',
								name : 'templateid',
								xtype : "textfield"
						}
					},{
						layout : 'form',
						items : {
							id : 'templateListId',
							fieldLabel : '招募列表模版id',
							name : 'templateListId',
							xtype : "textfield"
					}
				}]
			});

	addTypeWin = new Ext.Window({
				//el : 'add_type_win',
				width : 370,
				height : 158,
				title : '绑定招募模版',
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
								auditPass(addTypeForm.getForm().getEl().dom.templateid.value,addTypeForm.getForm().getEl().dom.templateListId.value);
										
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


//取得状态
function changeAudit(state){
    if (state == "1") {
        return "<span>已审核</span>";
    }
    else {
        return "<span style='color:red;'>未审核</span>";
    }
}

// 查看详细信息
function showUpdateRecruit(){
    var row = grid.getSelectionModel().getSelected();
    if (Ext.isEmpty(row)) {
        Info_Tip("请选择一条信息.");
        return;
    }
    
    var thisid = row.get("id");
    showRecruitEdit(thisid);
};

// 查看详细信息
function showRecruitEdit(id){
    window.parent.createNewWidget("vip_recruit_update", '修改招募信息', '/module/recruit/vip_recruit_update.jsp?id=' + id);
};

// 锁定信息
function lock(){
    var rows = grid.getSelectionModel().getSelections();
    
    if (Ext.isEmpty(rows)) {
        Info_Tip("请选择信息。");
        return;
    }
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].get('id'));
    }
    Ext.Msg.confirm("确认操作", "您确认要锁定选中的信息吗？", function(op){
        if (op == "yes") {
            Ext.Ajax.request({
                url: '/mc/RecruitServlet',
                params: {
                    type: 4,
                    id: ids.toString(),
                    isLock: 0
                    // 锁定状态为0
                },
                success: function(response){
                    var json = eval("(" + response.responseText +
                    ")");
                    if (getState(json.state, commonResultFunc, json.result)) {
                        Info_Tip("锁定成功。");
                        
                        ds.reload();
                        
                    }
                },
                failure: function(){
                    Warn_Tip();
                }
            });
        }
    });
};

// 查询信息
function searchlist(){
    var cid = "eid";
    var state = "";
    if (!Ext.isEmpty(ck.getValue())) {
        cid = ck.getValue();
    }
    if (!Ext.isEmpty(Ext.getCmp('audittype').getValue())) {
        state = Ext.getCmp('audittype').getValue();
    }
    ds.baseParams["content"] = cid + "~" + Ext.fly('searchtitle').getValue() + ';state~' + state + ';isLock~1;isdel~0';
    ds.load();
};

//查看招募报名
function showRecruitApplyUsers(){
    var row = grid.getSelectionModel().getSelected();
    if (Ext.isEmpty(row)) {
        Info_Tip("请选择一条信息。");
        return;
    }
    var id = row.get("id");
    window.parent.createNewWidget("vip_recruit_reply", '查看招募报名', '/module/recruit/vip_apply_users.jsp?id=' + id);
}
