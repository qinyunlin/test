package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.AskPiciReturnVisitRecord;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPiciReturnVisitRecordDao;
/**
 * 询价批次回访记录数据操作接口实现
 * @author rongliangkang
 *
 */
@Repository
public class AskPiciReturnVisitRecordDaoImpl extends MybatisOperations<String, AskPiciReturnVisitRecord> implements AskPiciReturnVisitRecordDao{

	@Override
	public int add(AskPiciReturnVisitRecord record) {
		getSqlSession().insert(getNamespace().concat(".insert"), record);
		return Integer.parseInt(record.getId());
	}

	@Override
	public List<AskPiciReturnVisitRecord> queryList(Map<String, Object> params) {
		return getSqlSession().selectList(getNamespace().concat(".queryList"),params);
	}
	
}
