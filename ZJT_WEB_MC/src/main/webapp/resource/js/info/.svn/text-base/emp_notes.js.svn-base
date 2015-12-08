var store, grid;
var infoId = "";
var tagsAll = "";
var infoStore, sortStore;
var expander;

var eidStore;
var eidPanel;
var eidWin;
var province_data=getUser_WenProvince();	
/* 创建企业窗口 */
var buildEidWin = function(msgId, title){
	eidStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"phone", "createOn"]),
				baseParams : {
					page : 1,
					type : 2,
					content : "islock~0",
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					content : "islock~0",
					type : 9
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : eidStore,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel();// 带checkbox选择
	eidPanel = new Ext.grid.GridPanel({
				store : eidStore,
				stripeRows : true,
				loadMask : true,
				width : 638,
				height : 320,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 240,
							dataIndex : 'name'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [
					new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : new Ext.data.SimpleStore({
										data : [["eid", "企业ID"],["name", "企业名称"],["area", "所在地区"]],
										fields : ["value", "text"]
									}),
									valueField : "value",
									displayField : "text",
									hiddenId : 'query_type',
									hiddenName : 'query_type',
									value : "name",
									width : 80
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchtitle",
							width : 220,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e){
									if(e.getKey() == e.ENTER){
										searchEidList();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchEidList
						}, '-', {
							xtype : 'checkbox',
							id : 'ALL'
						}, "所有企业"
				],
				bbar : pagetool
			});
	eidWin = new Ext.Window({
		title : title + '-添加关联企业',
		width : 650,
		height : 390,
		layout : 'table',
		modal : true,
		border : false,
		frame : true,
		items : [
			eidPanel
		],
		buttons : [{
			text : '确定',
			handler : function() {
				var eids = [];
				var empNames = [];
				var tips = "";
				if(!Ext.fly("ALL").dom.checked)
				{
					var rows = eidPanel.getSelectionModel().getSelections();
					if(isEmpty(rows)){
						Ext.Msg.alert("提示", "请选择企业");
						return ;
					}
					for(var i = 0; i < rows.length; i++){
						eids.push(rows[i].get("eid"));
						empNames.push(rows[i].get("name"));
					}
					tips = "您确定要为选中的企业发送公告?"
				}
				else{
					eids.push("全国");
					empNames.push("所有");
					tips = "您确定要为所有企业发送公告?";
				}
				Ext.MessageBox.confirm("提示", tips, function(btn) {
				if (btn == "yes") {
					var data = "";
					data += "id=" + msgId;
					data += "&eids=" + eids.toString();
					data += "&type=8";
					Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Ext.MessageBox.alert("提示", "发送公告成功!");
										eidWin.close();
										var table = document.getElementById(msgId);
										if(table == null){
											return ;
										}
										var tbody = table.children[0];
										for(var i = 0; i < eids.length; i++){
											var tr = document.createElement("tr");
											tr.id = msgId + "_" + eids[i];
											if(document.getElementById(tr.id)){
												continue ;
											}
											tr.ondbclick = function(){
												editEmp(eids[i]);
											};
											tr.onmouseover = function(){
												this.bgColor='#B9B9B9'
											};
											tr.onmouseout = function(){
												this.bgColor='';
											};
											var td1 = document.createElement("td");
											td1.width = "560px";
											td1.innerHTML = empNames[i];
											var td2 = document.createElement("td");
											td2.width = "30px";
											var a = document.createElement("a");
											a.href="javascript:deleteEmp('" + msgId + "', '" + eids[i] + "');"
											a.innerHTML = "删除";
											td2.appendChild(a);
											tr.appendChild(td1);
											tr.appendChild(td2);
											tbody.insertBefore(tr, tbody.children[0]);
										}
									} else {
										Ext.MessageBox.alert("提示", "发送公告失败！");
								}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
				}
				});
			}
		}, {
			text : '取消',
			handler : function() {
				eidWin.close();
			}
		}],
		listeners : {
			"show" : function(){
				eidStore.load();
			}
		}
	});
	
}
var showEidWin = function(){
	var rows = grid.getSelectionModel().getSelections();
	/*
	if(rows.length != 1){
		Ext.Msg.alert("提示", "请选择<font color='red'>1</font>条<font color='red'>企业公告类型<font color='red'>的信息!");
		return ;
	}
	if(rows[0].get("typename") != "企业公告"){
		Ext.Msg.alert("提示", "只有<font color='red'>企业公告类型<font color='red'>的信息才能添加关联企业!");
		return ;
	}
	*/
	if(isEmpty(rows))
	{
		Ext.Msg.alert("提示", "请选择一条信息");
		return ;
	}
	var msgId = rows[0].get("id");
	var title = "<font color='red'>" + rows[0].get("title") + "</font>";
	buildEidWin(msgId, title);
	eidWin.show();
}

function searchEidList() {
	var query = Ext.fly("query_type").getValue() + "~"
			+ Ext.fly("searchtitle").getValue() + ";islock~0;";
	eidStore.baseParams["content"] = query;
	eidStore.countParams["content"] = query;
	eidStore.load();
};

// 关联企业
function see_eid_link(){
	var rows = grid.getSelectionModel().getSelections();
	/*
	if(rows.length != 1){
		Ext.Msg.alert("提示", "请选择<font color='red'>1</font>条<font color='red'>企业公告类型</font>的信息!");
		return ;
	}
	if(rows[0].get("typename") != "企业公告"){
		Ext.Msg.alert("提示", "只有<font color='red'>企业公告类型</font>的信息才有关联企业!");
		return ;
	}
	*/
	if(isEmpty(rows))
	{
		Ext.Msg.alert("提示", "请选择一条信息");
		return ;
	}
	var msgId = rows[0].get("id");
	var info_title = encodeURI(rows[0].get("title"));
	window.parent.createNewWidget("eid_link", '查看关联企业',
		'/module/info/eid_link.jsp?id=' + msgId+'&info_title=' + info_title);
}

// 相关项目
function see_pro_link() {
	var rows = grid.getSelectionModel().getSelections();
	/*
	if(rows.length != 1){
		Ext.Msg.alert("提示", "请选择<font color='red'>1</font>条<font color='red'>项目资讯类型或其子类型</font>的信息!");
		return ;
	}
	var tpath = rows[0].get("tpath");
	
	if(tpath.substring(0, 3) != "/3/"){
		Ext.Msg.alert("提示", "只有<font color='red'>项目资讯类型或其子类型</font>的信息才有相关项目!");
		return ;
	}
	*/
	if(isEmpty(rows))
	{
		Ext.Msg.alert("提示", "请选择一条信息");
		return ;
	}
	var tagsAll = rows[0].get("tags");
	if(isEmpty(tagsAll)){
		tagsAll = "";
		Ext.Msg.alert("提示", "标签为空, 无相关项目");
		return ;
	}
	var title = encodeURI(rows[0].get("title"));
	window.parent.createNewWidget("link_project", '相关项目',
			'/module/project/project_manage.jsp?tagsAll=' + tagsAll + "&link=1");

};

var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var buildGrid = function() {

	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else
		webArea = parent.currUser_mc.webProvince;
	infoStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/SearchInfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id',  'tpath', 'title', 'tags', 'typename', 'createBy',
								'addTime', 'isHot', 'isTop','webProvince']),
				baseParams : {
					type : 2,
					content : 'tpath~/4/404/',
					isAuditing : 1,
					province : webArea
				},
				countUrl : '/SearchInfoContent.do',
				countParams : {
					type : '3'
				},
				remoteSort : true
			});
	
	expander = new Ext.ux.grid.RowExpander({
		expandOnDblClick : false,
		expendable : true
	});
	
	expander.beforeExpand = function(record, body, rowIndex){
        if(this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false){
            if(this.lazyRender){
            	Ext.lib.Ajax.request("post", "/SearchInfoContent.do?type=5", {
            			success : function(response){
            				grid.getSelectionModel().selectRow(rowIndex);
            				var jsonResult = eval("(" + response.responseText + ")");
            				var result = jsonResult.result;
            				var htmlText = "<div style='margin-left:80px'><div style=\"height: 20px; width : 600px; background-color : #D5E2F2; font-weight : bold;\">关联企业列表</div>";
            				htmlText = htmlText + "<table id='" + record.id + "' style='border : 1px #FFF2D0 solid;'><tbody>";
            				for(var i = 0; i < result.length; i++){
            					htmlText = htmlText + "<tr id='" + record.id + "_" + result[i].eid + "' ondblclick=\"editEmp('" + result[i].eid +  "')\" onmouseover=\"this.bgColor='#B9B9B9'\" onmouseout=\"this.bgColor=''\"><td width='560px'>" + result[i].name + "</td>";
            					htmlText = htmlText + "<td width='30px'><a href='#' onClick=\"deleteEmp('" + record.id + "', '" + result[i].eid +"')\">删除</a></td></tr>";
            				}	
            				htmlText = htmlText + "</tbody></table></div>";
            				body.innerHTML = htmlText;
            			},
            			failure : function(){
            				Ext.Msg.alert("提示", "获取数据失败");
            			}
            	}, "id=" + record.id);
            }
            return true;
        }else{
            return false;
        }
    };
	
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
	});
	grid = new Ext.grid.GridPanel({
		store : infoStore,
		loadMask : true,
		autoHeight : true,
		sm : sm,
		plugins : [expander],
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, expander, {
					header : '标题',
					sortable : true,
					dataIndex : 'title',
					width : 230
				}, {
					header : 'Tag标签',
					sortable : true,
					dataIndex : 'tags'
				}, {
					header : '信息类型',
					sortable : true,
					dataIndex : 'typename'
				}, {
					header : '发表人',
					sortable : true,
					dataIndex : 'createBy'
				}, {
					header : '发表时间',
					sortable : true,
					dataIndex : 'addTime'
				}, {
					header : '热点',
					sortable : true,
					dataIndex : 'isHot',
					renderer : rederHT
				}, {
					header : '置顶',
					sortable : true,
					dataIndex : 'isTop',
					renderer : rederHT
				}, {
					header : '区域',
					sortable : true,
					dataIndex : 'webProvince'
				}],
		bbar : new Ext.ux.PagingToolbar({
					store : infoStore,
					displayInfo : true
				}),
		viewConfig : {
			forceFit : true
		},
		tbar : [],
		renderTo : 'grid'
	});
	var tbar1 = new Ext.Toolbar({
						id : 'tbar1',
						renderTo : grid.tbar,
						items : [{
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_MOD"),
							handler : function() {
								edit();
							}
						}, '-' , {
							id : 'del',
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						},/* '-', {
							id : 'copycut',
							text : '复制',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/copy.png',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : function() {
								showCopyCutWin();
							}
						},*/ '-', {
							text : '添加公告',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : function() {
								add();
							}
						}, '-', {
							text : '相关项目',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							handler : see_pro_link
						}, '-', {
							text : '添加关联企业',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_CORP"),
							handler : showEidWin
						}, '-', {
							id : 'sh_menuItem',
							text : '审核',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							style : "display : none",
							handler : examine
						}]
						
	});
	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [new Ext.form.ComboBox({
							store : province_data,
							emptyText : "请选择",
							id : 'area_sel',
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							allowBlank : false,
							value : province_data[0]
						}),
				{
					xtype : "label",
					text : "标题："
				}, {
					xtype : "textfield",
					id : "title",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, {
					xtype : "label",
					text : "Tag标签:"
				}, {
					xtype : "textfield",
					id : "tags",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, '-', {
					text : '查询',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/zoom.png',
					id : "search",
					handler : search
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
										data : [['0', '已审核'], ['1', '未审核']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '0',
							listeners : {
								select : {
									fn : function() {
										if(Ext.fly("exStatus").dom.value  == '已审核'){
											hideEl("sh_menuItem");
										}
										else{
											showEl("sh_menuItem");
										}				
										search();
									}
								}
							}
						})]
	});
	

	grid.addListener('rowcontextmenu', rightClickFn);
	grid.on("rowdblclick", function(){
		edit();
	});
	//已审核右键
	var rightClick1 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
					text : '查看/修改',
					hidden : compareAuth("INFO_CONTENT_MOD"),
					handler : edit
				},{
					text : '锁定',
					hidden : compareAuth("INFO_CONTENT_LOCK"),
					handler : function() {
						operateRecord("del")
					}
				},/*{
					text : '复制',
					hidden : compareAuth("INFO_CONTENT_COPY"),
					handler : showCopyCutWin
				},*/{
					text : '添加公告',
					hidden : compareAuth("INFO_CONTENT_ADD"),
					handler : add
				},{
					text :'相关项目',
					handler : see_pro_link
				},{
					text : '添加关联企业',
					hidden : compareAuth("INFO_CONTENT_CORP"),
					handler : showEidWin
				}]
			});
			
	//未审核右键
	/*
	var rightClick2 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [/*{
					text : '查看/修改',
					handler : edit
				},{
					text : '锁定',
					handler : function() {
						operateRecord("del")
					}
				},{
					text : '复制',
					handler : showCopyCutWin
				},{
					text : '添加信息',
					handler : add
				},{
					text :'相关项目',
					handler : see_pro_link
				},{
					text : '添加关联企业',
					handler : showEidWin
				},{
					text : '关联企业',
					handler : see_eid_link
				},{
					text : '添加关联企业',
					handler : showEidWin
				},{
					text : '关联企业',
					handler : see_eid_link
				},{
					text : '审核',
					handler : function() {
						examine();
					}
				}]
			});
		*/
	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
		rightClick1.showAt(e.getXY());
		
	}
	/*
	grid.addListener('rowdblclick', rowDblClick);

	function rowDblClick(grid, rowIndex, e) {
		edit();
	}
	*/
	function rederHT(value) {
		var html;
		if (value == 1) {
			html = "是";
		} else if (value = 0) {
			html = "";
		} else {
			html = "否";
		}
		return html;
	};
	
	infoStore.load();
};

/* 复制 */
var copyCutWin;
var buildCopyCutWin = function() {
	copyCutWin = new Ext.Window({
				el : 'copy_cut_win',
				width : 365,
				height : 160,
				title : '复制',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				bodyStyle : 'padding: 10px',
				items : [{
							layout : 'form',
							labelAlign : 'right',
							bodyStyle : 'padding: 20px',
							items : [new Ext.form.ComboBox({
										id : 'copyCutCom',
										hiddenId : 'copyCutTid',
										hiddenName : 'copyCutTid',
										store : sortStore,
										typeAhead : true,
										mode : 'remote',
										triggerAction : 'all',
										valueField : "id",
										displayField : "name",
										readOnly : true,
										fieldLabel : '将信息复制到分类',
										emptyText : '请选择'
									})]
						}],
				buttons : [{
							text : '确定',
							handler : function() {
								copyCutInfo();
							}
						}, {
							text : '取消',
							handler : function() {
								copyCutWin.hide();
							}
						}]
			});
};

var showCopyCutWin = function() {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	if (copyCutWin == null) {
		buildCopyCutWin();
		copyCutWin.show();
	} else {
		copyCutWin.show();
	}
};

var copyCutInfo = function() {
	var ids = grid.selModel.selections.keys.toString();
	var data = "id=" + ids;
	data += "&type=6";
	var tid = Ext.fly("tid").getValue();
	var ccTid = Ext.fly("copyCutTid").getValue();
	if (ccTid == "") {
		Ext.MessageBox.alert("提示", "请先选择分类。");
		return;
	} else if (tid == ccTid) {
		Ext.MessageBox.alert("提示", "不能复制到本身的分类。");
		return;
	}
	data += "&tid=" + ccTid;
	var tpath = "";
	sortStore.each(function(s) {
				if (s.data.id == tid) {
					tpath = s.data.path;
				}
			});
	data += "&tpath=" + tpath;
	Ext.lib.Ajax.request('post', '/InfoContent.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "复制成功！");
						infoStore.reload();
					} else {
						Ext.MessageBox.alert("提示", "复制失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
};
/* 复制 */

// 还原 / 删除 / 彻底删除
var operateRecord = function(act) {
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "id=" + ids.toString();
	var actName = "";
	if (act == "del") {
		data += "&type=5";
		actName = "锁定选中信息";
	}
	Ext.MessageBox.confirm("提示", "确定要" + actName + "?", function(btn) {
				if (btn == "yes") {
					Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (data && data.state == 'success') {
										Ext.Msg.alert('提示', '锁定成功!');
										infoStore.reload();
									} else {
										Ext.MessageBox.alert("提示", "锁定失败！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
				}
			});
}

var examine = function() {
	var es = Ext.fly("exStatus").getValue();
	if( es == "已审核" ){
		Ext.Msg.alert("提示", "请选择未审核列表");
		return ;
	}
	var ids = grid.selModel.selections.keys.toString();
	if (ids == "") {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}
	var data = "";
	data += "id=" + ids;
	data += "&type=" + 4;
	data+="&cntent=isAuditing~1";
	Ext.Msg.confirm("提示", "您确定审核选中的信息?", function(op){
		if(op == "yes"){
			Ext.lib.Ajax.request('post', '/InfoContent.do', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data && data.state == 'success') {
						Ext.MessageBox.alert("提示", "审核成功！");
						infoStore.reload();
					} else {
						Ext.MessageBox.alert("提示", "审核失败！");
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, data);
		}
	});
}

// 添加企业公告
function add() {
	window.parent.createNewWidget("info_add", '添加企业公告',
			'/module/info/info_add.jsp?addNote=1&tpath=/4/404/'
			 + "&tid=" + 404 + "&typename=企业公告");
};

// 修改
function edit() {
	var rows = grid.getSelectionModel().getSelections();
	if(isEmpty(rows)){
		Ext.Msg.alert("提示", "请选择信息");
		return ;
	}
	infoId = rows[0].get("id");
	window.parent.createNewWidget("info_edit", '修改信息',
			'/module/info/info_edit.jsp?infoId=' + infoId);
};

// 查找
function search() {
	infoId = "";
	infoStore.baseParams = {};
	var title = Ext.fly("title").getValue();
	var tags = Ext.fly("tags").getValue();
	var content = "";
	var tpath = "tpath~/4/404/";
	content = tpath + ";";
	if (title != "") {
		content += "title~" + title + ";";
	}

	if (tags != "") {
		content += "tags~" + tags + ";";
	}

	var es = Ext.fly("exStatus").getValue();
	// var li = Ext.fly("list").dom.value;
	if(es == "已审核" )
		infoStore.baseParams['isAuditing'] = 1;
	else if(es == "未审核")
		infoStore.baseParams['isAuditing'] = 0;
	infoStore.baseParams['type'] = 2;
	/*
	var li = "列表";
	if (es == "已审核" && li == "列表") {
		infoStore.baseParams['type'] = 2;
	} else if (es == "未审核" && li == "列表") {
		infoStore.baseParams['type'] = 3;
		infoStore.countParams['type'] = 5;
	} else if (es == "" && li == "已删除列表") {
		infoStore.baseParams['type'] = 6;
		infoStore.countParams['type'] = 7;
	}
	if (Ext.isEmpty(Ext.fly("area_sel").getValue())) {
		Info_Tip("请选择区域。");
		return;
	}
	*/
	infoStore.baseParams["province"] = Ext.fly("area_sel").getValue();
	infoStore.baseParams['blur'] = 'yes';
	infoStore.baseParams['content'] = content;
	infoStore.load();
}

function init() {
	buildGrid();
};
//查看/修改关联企业
function editEmp(eid){
	if(eid == "ALL"){
		Ext.Msg.alert("提示", "请到企业管理查看所有企业信息");
		return ;
	}
	window.parent.createNewWidget("enterprise_edit", '修改企业信息',
			'/module/enterprise/enterprise_edit.jsp?eid=' + eid);
}
//删除关联企业
function deleteEmp(infoId, eid){
	var data = "type=9&id=" + infoId + "&eid=" + eid;
	Ext.Msg.confirm("提示", "您确定要删除选中的相关企业?", function(op){
		if(op == "yes"){
			Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									var data = eval("(" + response.responseText + ")");
									if (data && data.state == 'success') {
										Ext.MessageBox.alert("提示", "删除成功!");
										var table = Ext.fly(infoId).dom;
										var tbody = table.children[0];
										var tr = document.getElementById(infoId + "_" + eid);
										tbody.removeChild(tr);
									} else {
										Ext.MessageBox.alert("提示", "删除相关企业失败！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
		}
	});
}
Ext.onReady(function() {
			init();
		});