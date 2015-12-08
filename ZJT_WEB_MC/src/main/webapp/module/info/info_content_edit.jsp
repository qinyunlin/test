<%@ page language="java" pageEncoding="UTF-8"%>
<head>
	<script type="text/javascript" src="/ext/UI/Store.js"></script>
	<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
	<script type="text/javascript" src="/ext/UI/Htmleditor_self.js"></script>
	
	<link rel="stylesheet" type="text/css" href="/ext/UI/css/TipSelf.css" />
	<link rel="stylesheet" type="text/css" href="/ext/UI/css/data-view.css" />
	<link rel="stylesheet" type="text/css" href="/ext/UI/css/chooser.css" />
	
	<script type="text/javascript" src="/ext/UI/TipSelf.js"></script>
	<script type="text/javascript" src="/resource/js/common_mc.js"></script>
	<script type="text/javascript" src="http://c2.zjtcn.com/js/zjt/commonJS/zhcn_db.js"></script>
	<script type="text/javascript" src="/resource/js/zhcn_select.js"></script>
	<script type="text/javascript" src="/resource/plugins/file_upload_ext/upload_file.js"></script>
	<script type="text/javascript" src="/resource/plugins/FCKeditor/jquery.FCKEditor.js"></script>
	<script type="text/javascript" src="/resource/plugins/FCKeditor/fckeditor.js"></script>	
	<script type="text/javascript" src="/resource/js/info/info_pic_base.js"></script>
	<script type="text/javascript" src="/resource/js/info/info_content_edit/project.js"></script>
	<script type="text/javascript" src="/resource/js/info/info_content_edit/enterpriceLink.js"></script>
	<script type="text/javascript" src="/resource/js/info/info_content_edit/fileUpload.js"></script>
	<script type="text/javascript" src="/resource/js/info/info_content_edit.js"></script>
	<script type="text/javascript" src="/resource/js/info/info_content_add/ConfigCatalog.js"></script>
	<script type="text/javascript" src="/resource/js/info/info_content_edit/handleFunction.js"></script>
	
	<script type="text/javascript" src="/resource/js/info/info_content_edit/treeCatalog.js"></script>
</head>
<body>
	<div id="info_add"></div>
	<div id="eidWin"></div>
	<div id="uploadI_win" style="display: none">
		<div id="uploadI">
			<form method="post" enctype="multipart/form-data"
				target="uplogotarget" name="uplogoform" id="uplogoform">
				<iframe id="uplogotarget" name="uplogotarget" width="0px;"
					height="0px;" frameborder="0"></iframe>
				<span id="logospan"><input type="file" name="uplogo"
						id="uplogo" /> </span>
				<input type="button" value="上传" onclick="upPic();" class="submit" />
				<br />
				<span style="color: red">图片类型：jpg,jpeg,大小不能超过150K。</span>
			</form>
		</div>
	</div>
	<div id="uploadF_win" style="display: none">
		<div id="uploadF">
			<form method="post" enctype="multipart/form-data"
				target="upfiletarget" name="upfileform" id="upfileform">
				<span><strong>上传文件:</strong> </span>
				<span id="filespan"> <iframe id="upfiletarget"
						name="upfiletarget" width="0px;" height="0px;" frameborder="0"></iframe>
					<span id="filespan"><input type="file" name="upflie"
							id="upfile"> </span> <input type="button" value="上传"
						onclick="upFile();" class="submit">
					<div style="color: red">
						支持格式:txt|doc|xls|zip|rar|jpg|gif|htm|
					</div> </span>
			</form>
		</div>
	</div>
	<div id="related_pro_win"></div>
	<input id="tid_temp" type="hidden" value="" />
	<input id="path_temp" type="hidden" value="" />
	<input id="typename_temp" type="hidden" value="" />

</body>