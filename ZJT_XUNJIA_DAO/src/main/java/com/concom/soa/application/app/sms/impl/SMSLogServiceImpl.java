package com.concom.soa.application.app.sms.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.sms.YoucaiSMSLog;
import com.concom.lang.Page;
import com.concom.soa.application.app.sms.SMSLogService;
import com.concom.soa.infrastructure.persist.app.sms.SMSLogRepository;

@Service("SMSLogService")
public class SMSLogServiceImpl implements SMSLogService {
	
	@Autowired
	SMSLogRepository SMSLogRepository;

	@Override
	public YoucaiSMSLog save(YoucaiSMSLog log) {
		return SMSLogRepository.save(log);
	}

	@Override
	public Page<YoucaiSMSLog> queryPage(Page<YoucaiSMSLog> page) {
		return SMSLogRepository.queryPage(page);
	}

	@Override
	public void log(String mobile, String content, int sendState) {
		YoucaiSMSLog log = new YoucaiSMSLog();
		log.setMobile(mobile);
		log.setContent(content);
		log.setState(sendState);
		log.setCreateOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
		save(log);
	}

}
