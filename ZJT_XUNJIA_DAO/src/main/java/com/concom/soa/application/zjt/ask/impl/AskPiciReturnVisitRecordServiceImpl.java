package com.concom.soa.application.zjt.ask.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPiciReturnVisitRecord;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.ask.AskPiciReturnVisitRecordService;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPiciReturnVisitRecordDao;
/**
 * 询价批次回访记录业务数据接口实现
 * @author rongliangkang
 *
 */
@Service
public class AskPiciReturnVisitRecordServiceImpl implements AskPiciReturnVisitRecordService{
	
	@Autowired
	private AskPiciReturnVisitRecordDao askPiciReturnVisitRecordDao;
	
	@Override
	public int add(AskPiciReturnVisitRecord record) {
		
		return askPiciReturnVisitRecordDao.add(record);
	}

	@Override
	public List<AskPiciReturnVisitRecord> queryList(Map<String, Object> params) {
		return askPiciReturnVisitRecordDao.queryList(params);
	}

	@Override
	public Page<AskPiciReturnVisitRecord> queryPage(Page<AskPiciReturnVisitRecord> page) {
		return askPiciReturnVisitRecordDao.queryPage(page);
	}
	
	
}
