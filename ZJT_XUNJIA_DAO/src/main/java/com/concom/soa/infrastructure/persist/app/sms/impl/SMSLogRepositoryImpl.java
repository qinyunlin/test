package com.concom.soa.infrastructure.persist.app.sms.impl;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.sms.YoucaiSMSLog;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.sms.SMSLogRepository;

@Repository
public class SMSLogRepositoryImpl extends MybatisOperations<String, YoucaiSMSLog> implements
		SMSLogRepository {


}
