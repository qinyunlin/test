package com.concom.soa.application.app.reply.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.entity.dto.xunjia.reply.Comment;
import com.concom.soa.application.app.reply.AppAskReplyService;
import com.concom.soa.exception.DuplicateReplyException;
import com.concom.soa.infrastructure.persist.app.reply.AppAskReplyRepository;
@Service
public class AppAskReplyServiceImpl implements AppAskReplyService {

	@Autowired
	private AppAskReplyRepository askReplyRepository;

	public List<AskReply> askRepliesOfAskpriceByAskId(String askId) {
		return askReplyRepository.askRepliesOfAskpriceByAskId(askId);
	}

	public AskReply offer(AskReply offer) {
		 Map<String, Object> askReply = askReplyRepository.askRepliyOfUserReplyByAskId(offer.getMemberID(), offer.getPid());
		if(askReply != null){
			throw new DuplicateReplyException();
		}
		return askReplyRepository.offer(offer);
	}

	public List<Comment> commentsOfAskRepliesByReplyId(String replyId) {
		// TODO Auto-generated method stub
		return null;
	}

	public Map<String, Object> askRepliyOfUserReplyByAskId(String uid, String askId) {
		if(uid == null){
			return null;
		}
		return askReplyRepository.askRepliyOfUserReplyByAskId(uid,askId);
	}

}
