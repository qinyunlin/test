package com.concom.soa.infrastructure.persist.app.push;

import com.concom.entity.dto.xunjia.app.push.CloudPush;
import com.concom.mybatis.MybatisRepository;

public interface CloudPushRepository extends MybatisRepository<String, CloudPush> {
	
	CloudPush getByMemberId(String memberId);

	void deleteByMemberId(String memberId);
	
}
