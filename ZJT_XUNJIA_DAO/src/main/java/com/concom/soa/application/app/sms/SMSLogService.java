package com.concom.soa.application.app.sms;

import com.concom.entity.dto.xunjia.app.sms.YoucaiSMSLog;
import com.concom.lang.Page;

public interface SMSLogService {
	
	YoucaiSMSLog save(YoucaiSMSLog log);
	
	Page<YoucaiSMSLog> queryPage(Page<YoucaiSMSLog> page);

	void log(String mobile, String content, int sendState);
}
