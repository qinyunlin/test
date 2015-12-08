package com.concom.soa.infrastructure.persist.app.push;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.push.MessageLog;
import com.concom.mybatis.MybatisOperations;

@Repository
public class MessageLogRepositoryImpl extends MybatisOperations<String, MessageLog>
		implements MessageLogRepository {

	@Override
	public void deleleById(String id) {
		getSqlSession().delete(getNamespace().concat(".delete"), id);
	}

}
