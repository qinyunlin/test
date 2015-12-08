package com.concom.soa.application.wcw.reply;

import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.lang.Page;

/**
 * 询价回复
 * 
 * @author zhengreat
 * 
 */
public interface AskReplyService {

	public void askReplyFromSupplier(AskReply askReply);

	int update(AskReply askReply);

	AskReply get(String id);
	
	Page<AskReply> queryPage(Page<AskReply> page);
	
}
