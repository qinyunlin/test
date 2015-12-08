package com.concom.soa.infrastructure.persist.wcw.reply;

import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.lang.Page;

/**
 * 
 * @author zhengreat
 * 
 */
public interface WCWAskReplyRepository {

	void askReplyFromSupplier(AskReply askReply);

	int update(AskReply askReply);

	AskReply get(String id);
	
	Page<AskReply> queryPage(Page<AskReply> page);
}
