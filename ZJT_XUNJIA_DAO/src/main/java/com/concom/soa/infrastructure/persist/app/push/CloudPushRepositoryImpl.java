package com.concom.soa.infrastructure.persist.app.push;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.push.CloudPush;
import com.concom.mybatis.MybatisOperations;

@Repository
public class CloudPushRepositoryImpl extends MybatisOperations<String, CloudPush> implements
		CloudPushRepository {


	@Override
	public CloudPush getByMemberId(String memberId) {
		
		return getSqlSession().selectOne(getNamespace().concat(".getByMemberId"), memberId);
	}

	@Override
	public void deleteByMemberId(String memberId) {
		getSqlSession().delete(getNamespace().concat(".delete"), memberId);
		
	}


}
