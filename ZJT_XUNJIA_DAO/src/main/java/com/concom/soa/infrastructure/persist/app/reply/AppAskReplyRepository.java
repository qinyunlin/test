package com.concom.soa.infrastructure.persist.app.reply;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.reply.AskReply;


public interface AppAskReplyRepository {

	List<AskReply> askRepliesOfAskpriceByAskId(String askId);


	AskReply offer(AskReply offer);


	Map<String, Object> askRepliyOfUserReplyByAskId(String uid, String askId);

}
