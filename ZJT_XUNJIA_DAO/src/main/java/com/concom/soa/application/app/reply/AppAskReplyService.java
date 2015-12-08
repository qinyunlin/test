package com.concom.soa.application.app.reply;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.entity.dto.xunjia.reply.Comment;


public interface AppAskReplyService {
	
	/**
	 * 取得某条询价下的回复列表
	 * @param id
	 * @return
	 */
	List<AskReply> askRepliesOfAskpriceByAskId(String askId);
	
	/**
	 * 提交报价 
	 * 填写项：零售价、批发价、单位（默认提问者所选择的单位，可手动更改）、供应商信息（默认显示回复者填写的公司信息，可手动更改）
	 * @param offer
	 * @return
	 */
	AskReply offer(AskReply offer);
	
	
	List<Comment> commentsOfAskRepliesByReplyId(String replyId);

	/**
	 * 用户是否回复了一条询价，有则返回
	 * @param uid
	 * @param askId
	 * @return
	 */
	Map<String, Object> askRepliyOfUserReplyByAskId(String uid, String askId);
}
