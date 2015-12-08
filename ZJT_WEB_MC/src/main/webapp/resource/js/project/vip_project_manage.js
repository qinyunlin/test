var ds, grid, ck, pagetool;
var ids = [];// 选择项
var selectinfo;
var tagsAll = "";
var webArea = "";
var sortCombo;
var stageStore, buildTypeStore;
var stageMap, buildTypeMap;
var stageCombo, buildTypeCombo;
var zhcn = new Zhcn_Select();
// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			items : [{
						id : 'rMenu1',
						text : '查看/修改',
						hidden : compareAuth('PROJ_VIEW'),
						handler : prjDetail
					}, {
						id : 'rMenu3',
						text : '锁定',
						hidden : compareAuth('PROJ_LOCK'),
						handler : lockPrj
					},{
						id:'rMenu5',
						text:'查看报名',
						hidden:compareAuth('PROJ_VIEW'),
						handler:selectReply
						},{
						id : 'rMenu7',
						text : '审核',
						handler : auditPrj
					},{
						id:'rMenu8',
						text:'生成工程项目专题静态页面',
						hidden:compareAuth("CREATE_PROJECT_HTML"),
						handler:createProjectHtml
					},{
						id:'rMenu9',
						text:'生成工程项目列表静态页面',
						hidden:compareAuth("CREATE_PROJECT_HTML"),
						handler:createProjectListHtmlShow
					}]
		});
var buildGrid = function() {

	
	
	// 省份城市级联选择
	var pro =  zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = [];
	var area=[];
	var comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
				store : pro,
				width : 90,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:"全部省份",
				editable : false,
				triggerAction : 'all',
				allowBlank : true,
				readOnly : true,
				fieldLabel : '省',
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						if(province =="全部省份")
						{
						   city=["全部城市"];
						}
						else
						{
							city=zhcn.getCity(province);
							city.unshift("全部城市");
						}
						
						comboCities.store.loadData(city);
						comboCities.enable();
						
					}
				}

			});
	var comboCities = new Ext.form.ComboBox({
				id : 'comboCities',
				store : city,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value : '全部城市',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				allowBlank : true,
				readOnly : true,
				fieldLabel : '市',
				name : 'region'
			});

	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/project/ProjectServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id", "name","starttime","eid", "province","region" ,"stage", "type","state","endtime",
								"buildType", "investment", "updateOn","orderCode","updateBy"]),
				baseParams : {
					method : 'search',
					content : "webProvince~" + webArea,
					pageSize : 20,
					page : 1,
					isreply : true,
					isFocus:0
				
				},
				countUrl : '/project/ProjectServlet',
				countParams : {
					method : 'searchCount'
				},
				remoteSort : true
			});
	ds.setDefaultSort("updateOn", "DESC");
	
	
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});

	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});

	grid = new xg.EditorGridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				clicksToEdit:1,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 40
								}), sm, {
							header : 'ID',
							sortable : true,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '项目名称',
							sortable : true,
							dataIndex : 'name',
							width : 160
						},{
							header : '企业ID',
							sortable : true,
							dataIndex : 'eid',
							width : 40
						}, {
							header : '省份',
							sortable : true,
							dataIndex : 'province',
							width : 40
						}, {
							header : '城市',
							sortable : true,
							dataIndex : 'region',
							width : 40
						}, {
							header : '建筑类型',
							sortable : true,
							dataIndex : 'buildType',
							width : 45
						}, {
							header : '项目阶段',
							sortable : true,
							dataIndex : 'stage',
							forceFit : true,
							width : 85
						}, {
							header : '项目类型',
							sortable : true,
							dataIndex : 'type',
							width : 45
						}, {
							header : '开始时间',
							sortable : true,
							dataIndex : 'starttime',
							width : 45
						}
						, {
							header : '结束时间',
							sortable : true,
							dataIndex : 'endtime',
							width : 45
						}
						, {
						    header:'状态',
						    sortable:true,
						    dataIndex:'state',
						    widht:45,
						    renderer:changeAudit
						},{
							header : '投资额（万元）',
							sortable : true,
							dataIndex : 'investment',
							width : 70
						},{
							header:'序列号',
							sortable:true,
							dataIndex:'orderCode',
							width:100,
							editor : new Ext.form.NumberField({
								allowBlank:true
							})
						}, {
							header : '更新时间',
							sortable : true,
							dataIndex : 'updateOn',
							forceFit : true
						}, {
							header : '更新人',
							sortable : true,
							dataIndex : 'updateBy',
							forceFit : true
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : [{
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('PROJ_VIEW'),
							handler : prjDetail
						}, '-', {
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth('PROJ_LOCK'),
							handler : lockPrj
						},{
						   text:'查看报名',
						   cls:'x-btn-text-icon',
						   icon:'/resource/images/edit.gif',
						   hidden:compareAuth('PROJ_VIEW'),
						   handler:selectReply
						},{
						    id : 'sh_menuItem',
							text : '审核',
							cls : 'x-btn-text-icon',
						    icon: '/resource/images/tick.png',
						    handler:auditPrj
						    
						},{
							text:'生成工程项目静态页面',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/arrow_refresh.png',
							hidden:compareAuth("CREATE_PROJECT_HTML"),
							handler:createProjectHtml
						},{
							text:'生成工程项目列表静态页面',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/arrow_refresh.png',
							hidden:compareAuth("CREATE_PROJECT_HTML"),
							handler:createProjectListHtmlShow
						}, {
							id : 'bj_menuItem',
							text : '标签相关信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							style : 'display: none;',
							handler : linkInfo
						}],
				bbar : pagetool,
				renderTo : 'project_grid'
			});
			
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : ["省份", comboProvinces, "城市", comboCities, "项目类型", {
					xtype : "combo",
					id : 'type',
					hiddenId : 'typeId',
					hiddenName : 'typeId',
					fieldLabel : "项目类型",
					store : new Ext.data.SimpleStore({
								fields : ["value", "text"],
								data : [['', '全部'], ['新建', '新建'], ['改建', '改建'],
										['扩建', '扩建']]
							}),
					valueField : 'value',
					displayField : 'text',
					triggerAction : "all",
					mode : 'local',
					width : 80,
					emptyText : '全部',
					listeners : {
						"select" : function(buildTypeCombo, record, index) {
							searchlist();
						}
					}
				}, "-", {
					xtype : "label",
					text : "项目名称："
				}, {
					xtype : "textfield",
					textLabel : "关键字",
					id : "searchtitle",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, '-', {
					xtype : "label",
					text : "审核状态："
				}, new Ext.form.ComboBox({
							id : 'exStatus',
							name : 'exStatus',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							anchor : '90%',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '已审核'], ['2', '未审核'],['3','全部']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '全部',
							listeners : {
								select : {
									fn : function() {
										if (Ext.fly("exStatus").dom.value == '已审核') {
											
											searchlist();
										} else {
											
											searchlist();
										}
										
									}
								}
							}
						}), {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		var row = grid.getSelectionModel().getSelected();
		// alert(row.get("code"));
		selectinfo = row.get("id");
		showprojectedit(selectinfo);
			// new newwin();
		});
	grid.on("click", function(e) {
				var rows = grid.getSelectionModel().getSelections();
				if (rows.length == 1 && !isEmpty(rows[0].get("tags"))) {
					showEl("bj_menuItem");
				} else {
					hideEl("bj_menuItem");
				}
			});
            
            grid.on('afteredit', function(e){
                Ext.Msg.wait("正在保存...", "提示");
                try {
                    Ext.lib.Ajax.request('post', '/project/ProjectServlet?method=updateOrderCodeById', {
                        success: function(response){
                            Ext.MessageBox.alert("提示", "修改成功！");
                            ds.reload();
                        },
                        failure: function(){
                            Ext.Msg.alert('警告', '操作失败。');
                        }
                    }, "id=" + e.record.data.id + "&orderCode=" + e.record.data.orderCode);
                } 
                catch (e) {
                    Ext.MessageBox.alert("提示", "修改失败！");
                }
            });
	
		ds.load();
	
};
// 相关信息
function linkInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	tagsAll = row.get("tags");
	if (isEmpty(tagsAll)) {
		tagsAll = "";
		Ext.Msg.alert("提示", "标签为空,没有相关信息");
		return;
	}
	window.parent.createNewWidget("link_info", '相关信息',
			'/module/info/info_manage.jsp?link=1&tagsAll=' + tagsAll);
};
// 相关图片
function picInfo() {

	window.parent.createNewWidget("link_info", '相关图片',
			'/module/project/info_link.jsp?tagsAll=' + tagsAll);
};
//查看报名
function selectReply()
{
   var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var id = row.get("id");
	showprojectReply(id);

}
// 查看/修改
function prjDetail() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("id");
	showprojectedit(thisid);
};



//审核
function auditPrj()
{
	var ids=grid.selModel.selections.keys.toString();
	if(ids=="")
	{
	   Ext.MessageBox.alert("提示","请先选择信息！");
	   return;
	}
	var con="id="+ids.toString();
	Ext.MessageBox.confirm("提示","你确定要审核选择的项目吗?",function (op){
		if(op == "yes"){
		  Ext.lib.Ajax.request("post","/project/ProjectServlet?method=audit",{
		  
		    success : function(response) {
					var json = eval("(" + response.responseText
							+ ")");
					if (getState(json.state, commonResultFunc,
							json.result)) {
						Ext.Ajax.request({
							method : 'post',
							url : "/TemplateHtml.do?type=10",
							params : {
								id : ids.toString(),
								regType :2
							},
							success : function(response) {
								
							}
						});	
						ds.reload();
						createProjectListHtml();
						//window.location.reload();
					}

				},
				failure : function() {
					Warn_Tip();
				}
			}, con)

		}
	})
}

// 锁定
function lockPrj() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var con = "id=" + ids.toString()+ "&isLock=1";
	Ext.MessageBox.confirm("提示", "您确定要锁定选中的项目吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/project/ProjectServlet?method=lock", {
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("锁定成功。");
										ds.reload();
									}

								},
								failure : function() {
									Warn_Tip();
								}
							}, con)
				}
			})
};
function init() {
	tagsAll = getCurArgs("tagsAll");
	buildGrid();
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 删除信息
/*function delask() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/project/ProjectServlet", {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("删除成功。");
										ds.reload();
										pagetool.updateInfo();
									}
								},
								failure : function(response) {
									Ext.MessageBox
											.alert("提示", "非常抱歉，您的操作发生错误。");
								}
							}, "method=delete&id=" + ids);
				}
				ids = [];
			});
};*/

// 查询信息
function searchlist() {
	var es = Ext.fly("exStatus").getValue();
	var content="";
	var province=Ext.fly("comboProvinces").getValue();
	var city=Ext.fly("comboCities").getValue();
	var type = Ext.fly("typeId").getValue();
	if(es!="全部"){
		if(es=="已审核")
		{
		   content="state~"+1;
		}
		else if(es =="未审核")
		{
		     content="state~"+0;
		}
		ds.baseParams["content"] = content+ ";type~" + type + ";"
			+ "name" + "~"
			+ Ext.fly("searchtitle").getValue();
	}else
	{
	   ds.baseParams["content"] = "type~" + type + ";"
			+ "name" + "~"
			+ Ext.fly("searchtitle").getValue();
	}
	
	
	
	if(province !="全部省份")
	{
        ds.baseParams["province"] = province;
	}
	if(city!="全部城市")
	{
	   ds.baseParams["region"] = city;
	}
	ds.baseParams["method"] = "search";
	ds.load();
};

function createProjectListHtmlShow(){
	 Info_Tip("生成工程项目列表页面成功!");
     createProjectListHtml();
}

//生成工程项目列表静态页面
function createProjectListHtml(){
	/*
	 var loadMarsk = new Ext.LoadMask(document.body, {
   	msg : '生成工程项目列表页面处理中.....!',
       disabled : false,
       store : store
     });
     loadMarsk.show();
     */
	var store=Ext.Ajax.request({
		method : 'post',
		url : "/TemplateHtml.do?type=13",
		params : {
			regType :2
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				//loadMarsk.hide();
				//Info_Tip("生成工程项目列表页面成功");
			} else {
				 //Info_Tip("生成工程项目列表页面失败！");
			}
		},
		failure : function() {
			 //Warn_Tip();
		}

	});	
}
//生成工程项目专题静态页面
function createProjectHtml(){
	
	var ids = grid.selModel.selections.keys.toString();
	 var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成工程项目页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
	var store=Ext.Ajax.request({
		method : 'post',
		url : "/TemplateHtml.do?type=10",
		params : {
			id : ids.toString(),
			regType :2
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				loadMarsk.hide();
				Info_Tip("生成工程项目页面成功");
			} else {
				 Info_Tip("生成工程项目页面失败！");
			}
		},
		failure : function() {
			 Warn_Tip();
		}

	});	
	
}

// 查看详细信息
function showprojectedit(id) {
	window.parent.createNewWidget("vip_project_edit", '修改项目信息',
			'/module/project/vip_project_edit.jsp?id=' + id);
};
function showprojectReply(id){
	window.parent.createNewWidget("vip_project_reply",'查看项目报名',
	'/module/project/vip_project_reply.jsp?id='+id);
}


