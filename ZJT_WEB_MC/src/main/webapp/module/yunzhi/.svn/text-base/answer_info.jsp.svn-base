<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="http://c2.zjtcn.com/css/member/reset.css"/>
<link rel="stylesheet" type="text/css" href="http://c2.zjtcn.com/css/member/global.css"/>
<link rel="stylesheet" type="text/css" href="http://c2.zjtcn.com/css/storePage/storePage.css"/>
<script language="javascript" src="http://c2.zjtcn.com/js/common/jyeeda.js"></script>
<script language="javascript" src="http://c2.zjtcn.com/js/common/basic.js"></script>
<script type="text/javascript" src="http://c2.zjtcn.com/js/common/dataStore.js"></script>
<script type="text/javascript" src="http://c2.zjtcn.com/js/common/storePage.js"></script>
<style>
.ht-pl-box{ margin:0; padding:20px; font-size:12px;}
.ht-pl-box h3{ margin:0; padding:0; color:#555; font-size:12px; font-weight:bold;}
.ht-pl-box .pl-con-list{ padding:15px; margin:15px 0;width:570px; border:1px #ccc solid;}
.pl-con-list .pl-co-search{}
.pl-con-list .pl-co-search .input-b-01{ width:180px; height:23px; line-height:23px; padding:0 5px; border:1px #ddd solid; color:#555;}
.pl-con-list ul{ margin:15px 0; padding:0; list-style-type:none;}
.pl-con-list ul li{ padding:10px 0; border-bottom:1px #f0f0f0 solid;}
.pl-con-list ul li p{ margin:0; padding:0;line-height:18px;}
.pl-con-list ul li .p-name{ color:#999;}
.pl-con-list ul li .p-con{ margin:5px 0; color:#333; }
.pl-con-list ul li .p-times{color:#999;}
.ht-pl-box a.link-name,.ht-pl-box a:visited.link-name{ color:#0272b1; text-decoration:none;}
.ht-pl-box a:hover.link-name{ text-decoration:underline;}
.ht-pl-box a.link-sc,.ht-pl-box a:visited.link-sc,.ht-pl-box a:hover.link-sc{ margin-left:15px;color:#0272b1; text-decoration:underline;}
.pl-con-list .page-list-box{ text-align:right;}
.pl-con-list .page-list-box a,.pl-con-list .page-list-box a:visited{color:#0272b1; text-decoration:none; margin-right:10px;}
.pl-con-list .page-list-box a:hover{ text-decoration:underline;}
.pl-con-list .page-list-box span{ color:#333; margin-right:5px;}
.pl-con-list .page-list-box span i{ font-style:normal; color:#f00;}
.pl-con-list .page-list-box .input-b-01{ width:30px; height:23px; line-height:23px; padding:0 5px; border:1px #ddd solid; color:#555;}
</style>
<script type="text/javascript" src="/ext/UI/Store.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<script type="text/javascript" src="/ext/UI/Htmleditor_self.js"></script>
<div id="detail"></div>
<div class="ht-pl-box">
	<h3>评论：</h3>
    <div class="pl-con-list">
    	<div class="pl-co-search">
            <input id="keyword" name="" type="text" class="input-b-01" tip="输入昵称或评论内容搜索..." value="" />
            <input id="searchBtn" name="" type="button"  value="搜索"/>
        </div>
         <div id="listbody"></div>
         <div id="page" class="digg" style="float:none;"></div>
         <div class="com_search_tips" id="com_search_tips" style="display:none;">
   	    	<div class="com_search_tips_jg"><span class="i_tips i_search_jg"></span>未找到该条件下的评论！</div>
        </div>
    </div>
</div>
<div id="templatebody" style="display:none;">
   <ul>
     <li>
     	<p class="p-name"><a href="javascript:void(0)" class="link-name">@{reviewerName}</a> @{commentType|commentTypeUtil}</p>
         <p class="p-con">@{content} </p>
         <p class="p-times"><span>@{createOn}</span><a href="javascript:delComment(@{id});" class="link-sc" style="display:@{id|compareAuthUtil};">删除</a></p>
     </li>
   </ul>
</div>
<script type="text/javascript" src="/resource/js/yunzhi/answer_info.js"></script>

