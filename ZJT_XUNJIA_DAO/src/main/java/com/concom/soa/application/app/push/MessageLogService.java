package com.concom.soa.application.app.push;

import java.util.List;

import com.concom.entity.dto.xunjia.app.push.MessageLog;
import com.concom.lang.Page;

public interface MessageLogService {

	Page<MessageLog> queryPage(Page<MessageLog> page);
	
	MessageLog getById(String id);
	
	void deleleById(String id);
	
	void deleteBatchByIds(List<String> ids);
	
	MessageLog add(MessageLog messageLog);
}
