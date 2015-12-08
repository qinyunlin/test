package com.concom.soa.infrastructure.persist.app.member;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.app.commission.Commission;
import com.concom.mybatis.MybatisRepository;

public interface CommissionRepository extends MybatisRepository<String, Commission> {

	/**
	 * 保存佣金比例
	 * @param commission
	 * @return
	 */
	public int add(Commission commission);
	
	/**
	 * 更新佣金比例
	 * @param commission
	 * @return
	 */
	public int update(Commission commission);
	
	/**
	 * 根据条件获取佣金比例信息
	 * @param id
	 * @return
	 */
	public List<Commission> queryList(Map<String, String> params);
}
