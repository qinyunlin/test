package com.concom.soa.application.app.push.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.push.MessageLog;
import com.concom.lang.Page;
import com.concom.soa.application.app.push.MessageLogService;
import com.concom.soa.infrastructure.persist.app.push.MessageLogRepository;

@Service
public class MessageLogServiceImpl implements MessageLogService {
	
	@Autowired
	private MessageLogRepository messageLogRepository;

	@Override
	public Page<MessageLog> queryPage(Page<MessageLog> page) {
		return messageLogRepository.queryPage(page);
	}

	@Override
	public MessageLog getById(String id) {
		return messageLogRepository.get(id);
	}

	@Override
	public void deleleById(String id) {
		messageLogRepository.deleleById(id);

	}

	@Override
	public void deleteBatchByIds(List<String> ids) {
		for(String id : ids){
			deleleById(id);
		}

	}

	@Override
	public MessageLog add(MessageLog messageLog) {
		return messageLogRepository.save(messageLog);
	}

}
