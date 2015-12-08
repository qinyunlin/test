package com.concom.soa.application.zjt.reply.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.reply.UsefulForbidLog;
import com.concom.soa.application.zjt.reply.UsefulForbidLogService;
import com.concom.soa.infrastructure.persist.zjt.reply.UsefulForbidLogDao;

@Service
public class UsefulForbidLogServiceImpl implements
		UsefulForbidLogService {
	
	@Autowired
	private UsefulForbidLogDao usefulForbidLogDao;

	public void add(UsefulForbidLog forbidLog) {
		// TODO Auto-generated method stub
		usefulForbidLogDao.add(forbidLog);
	}

	public int queryCount(Map<String, String> params) {
		// TODO Auto-generated method stub
		return usefulForbidLogDao.queryCount(params);
	}

}
