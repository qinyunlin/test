var grid;
var mem_info;
function buildGrid() {
	var info = new Ext.form.FieldSet({
				title : '系统日志',
				layout : "form",
				width : 450,
				autoHeight : true,
				defaultType : 'textfield',
				labelWidth : 80,
				labelAlign : 'right',
				items : [{
							id : 'content',
							name : 'content',
							xtype : 'textarea',
							allowBlank : false,
							fieldLabel : '内容',
							width : 300,
							height : 100
						}, {
							id : 'linkman',
							name : 'linkman',
							fieldLabel : '联系人',
							width : 300
						}, {
							id : 'phone',
							name : 'phone',
							fieldLabel : '联系电话',
							width : 300
						}, {
							id : 'email',
							name : 'email',
							fieldLabel : '电子邮箱',
							width : 300
						}]
			});
	grid = new Ext.form.FormPanel({
		renderTo : 'grid',
		autoHeight : true,
		layout : 'form',
		border : false,
		items : [info, {
			width : 450,
			autoHeight : true,
			border : false,
			buttonAlign : 'center',
			buttons : [{
						text : '确定',
						handler : add_diary
					}, {
						text : '取消',
						handler : function() {
							Ext.fly("content").dom.value = "";
							if (mem_info.trueName != null)
								Ext.fly("linkman").dom.value = mem_info.trueName;
							if (mem_info.email != null)
								Ext.fly("email").dom.value = mem_info.email;
							if (mem_info.phone != null)
								Ext.fly("phone").dom.value = mem_info.phone;
						}
					}]
		}]
	});

	initDiary();
};

function initDiary() {
	if (parent.currUser_mc) {
		Ext.lib.Ajax.request("post", "/mc/Member.do?method=getMem", {
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						mem_info = jsondata.result;
						if (mem_info.trueName != null)
							Ext.fly("linkman").dom.value = mem_info.trueName;
						if (mem_info.email != null)
							Ext.fly("email").dom.value = mem_info.email;
						if (mem_info.phone != null)
							Ext.fly("phone").dom.value = mem_info.phone;
					},
					failure : function() {
						Ext.Msg.alert("提示", "获取用户数据失败");
					}
				}, "mid=" + parent.currUser_mc.uid);
	}
};

// 添加系统日志
function add_diary() {
	if (!grid.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按照要求填写表单");
		return;
	}
	var content = Ext.fly("content").getValue();
	var linkman = Ext.fly("linkman").getValue();
	var phone = Ext.fly("phone").getValue();
	var email = Ext.fly("email").getValue();

	var data = "content=" + "content~" + content + ";linkman~" + linkman
			+ ";phone~" + phone + ";email~" + email;
	data = data + ";cid~3;channel~系统日志";

	Ext.lib.Ajax.request('post', '/OpinionServlet.do?type=1', {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						if (parent.tab_0801_iframe)
							parent.tab_0801_iframe.ds.reload();
						Info_Tip("系统日志添加成功。", colseWin);

					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, data);
}

Ext.onReady(function() {
			Ext.QuickTips.init(true);
			buildGrid();
		});

// 关闭指定标签
var colseWin = function() {
	parent.Ext.getCmp('center').remove('0803');
};