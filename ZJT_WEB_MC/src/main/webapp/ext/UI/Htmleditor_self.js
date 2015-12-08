/**
 * 重载EXTJS-HTML编辑器 需与UploadResult_HtmlEditor.jsp配合使用解决信息回调的跨域问题
 */
HTMLEditor = Ext.extend(Ext.form.HtmlEditor, {
	requestURL : '',
	requestId : '',
	requestType : '',
	callbackFn : 'callbackFn_hemleditor',
	callbackPath : '',
	basePath : '/ext/UI/',
	container : null,
	upload_win : null,
	editor : null,
	fileType : /[\w]/,
	addImage : function() {
		var editor = this;
		HTMLEditor.prototype.editor = editor;
		var template = new Ext.Template('<form id="uploadform_htmleditor" name="uploadform_htmleditor" target="uploadtarget_htmleditor" method="post" enctype="multipart/form-data" >'
				+ '<div style="margin:0 auto;padding:6px">上传文件：<input type="file" name="file_input_htmleditor" id="file_input_htmleditor"/></div>'
				+ '<iframe  frameborder="0" id="uploadtarget_htmleditor" name="uploadtarget_htmleditor" src="" width="0" height="0"></iframe></form>');
		editor.container = new Ext.Container({
					bodyStyle : 'padding:6px',
					autoWidth : true,
					autoHeight : true,
					items : template
				});
		editor.upload_win = new Ext.Window({
					title : '文件上传',
					modal : true,
					width : 380,
					autoHeight : true,
					items : template,
					buttons : [{
								text : '上传',
								handler : function() {
									submitAction();
								}
							}, {
								text : '取消',
								handler : function() {
									editor.upload_win.close();
								}
							}]

				});
		var submitAction = function() {
			var file = Ext.fly('file_input_htmleditor').getValue().slice(Ext
					.fly('file_input_htmleditor').getValue().lastIndexOf('.'));
			if (checkFileType(file)) {
				var url = window.location.href.split("/");
				url = "http://" + url[2] + editor.basePath
						+ "UploadResult_HtmlEditor.jsp";
				//editor.requestURL的值是怎么传过来的
				document.uploadform_htmleditor.action = editor.requestURL
						+ "/file/CommonUpload?id=" + editor.requestId
						+ "&rstype=" + editor.requestType + "&path=" + url
						+ "&callbackFn=" + this.callbackFn;
				document.uploadform_htmleditor.submit();
			}
		};
		editor.upload_win.show();
		var checkFileType = function(v) {
			this.v = v.slice(v.lastIndexOf('.'));
			var patrn = editor.fileType;
			if (!patrn.test(this.v)) {
				Info_Tip("你上传的类型错误");
				return false;
			}
			return true;
		};
	},
	createToolbar : function(editor) {
		HTMLEditor.superclass.createToolbar.call(this, editor);
		this.tb.insertButton(16, {
					cls : "x-btn-icon",
					icon : "/ext/resource/images/default/editor/picture.png",
					handler : this.addImage,
					scope : this
				});
	}
});
var upload_result_htmleditor = function(flag, msg, fn) {
	if (flag) {
		var element = document.createElement("img");
		element.src = "http://ftp.zjtcn.com" + msg;
		if (Ext.isIE) {
			HTMLEditor.prototype.editor.insertAtCursor(element.outerHTML);
		} else {
			var selection = HTMLEditor.prototype.editor.win.getSelection();
			if (!selection.isCollapsed) {
				selection.deleteFromDocument();
			}
			selection.getRangeAt(0).insertNode(element);
		}
		HTMLEditor.prototype.editor.upload_win.close();
	}
};
Ext.reg('htmleditorself', HTMLEditor);
