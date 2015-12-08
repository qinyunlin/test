package com.concom.soa.infrastructure.persist.zjt.reply;

import java.util.Map;

import com.concom.entity.dto.xunjia.reply.UsefulForbidLog;
import com.concom.mybatis.MybatisRepository;

public interface UsefulForbidLogDao extends MybatisRepository<String, UsefulForbidLog> {

	/**
	 * 添加有用无用纪录
	 * @param forbidLog
	 */
	public void add(UsefulForbidLog forbidLog);
	
	/**
	 * 查询是否点击过某条询价有用无用
	 * @param params
	 * @return
	 */
	public int queryCount(Map<String, String> params);
}
