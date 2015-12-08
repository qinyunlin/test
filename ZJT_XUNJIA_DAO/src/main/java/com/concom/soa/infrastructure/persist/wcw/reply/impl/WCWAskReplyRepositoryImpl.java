package com.concom.soa.infrastructure.persist.wcw.reply.impl;

import org.springframework.stereotype.Repository;


import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.wcw.reply.WCWAskReplyRepository;

/**
 * 
 * @author zhengreat
 *
 */
@Repository
public class WCWAskReplyRepositoryImpl extends MybatisOperations<String, AskReply>
		implements WCWAskReplyRepository {


	public void askReplyFromSupplier(AskReply askReply) {
		getSqlSession().insert(getNamespace().concat(".insert"), askReply);
	}

}
