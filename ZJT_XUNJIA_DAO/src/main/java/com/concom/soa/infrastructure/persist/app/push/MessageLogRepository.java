package com.concom.soa.infrastructure.persist.app.push;

import com.concom.entity.dto.xunjia.app.push.MessageLog;
import com.concom.mybatis.MybatisRepository;

public interface MessageLogRepository extends MybatisRepository<String, MessageLog> {

	void deleleById(String id);

}
