package com.concom.soa.infrastructure.persist.app.reply.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.Validate;
import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.mybatis.MybatisOperations;
import com.concom.mybatis.exception.DatabaseException;
import com.concom.soa.infrastructure.persist.app.reply.AppAskReplyRepository;
@Repository
public class AppAskReplyRepositoryImpl extends MybatisOperations<String, AskReply>
		implements AppAskReplyRepository {

	public List<AskReply> askRepliesOfAskpriceByAskId(String askId) {
		return getSqlSession().selectList("com.concom.soa.dto.reply.AskReply.askRepliesOfAskpriceByAskId", askId);
	}

	public AskReply offer(AskReply offer) {
		Validate.notNull(offer, "entity must not be null");
		try {
			getSqlSession().insert(getNamespace().concat(".insert"), offer);
		} catch (Exception e) {
			throw new DatabaseException(e.getMessage());
		}
		return offer;
	}

	public Map<String, Object> askRepliyOfUserReplyByAskId(String uid, String askId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("memberid", uid);
		params.put("askId", askId);
		return getSqlSession().selectOne("com.concom.soa.dto.reply.AskReply.askRepliyOfUserReplyByAskId", params);
	}

}
