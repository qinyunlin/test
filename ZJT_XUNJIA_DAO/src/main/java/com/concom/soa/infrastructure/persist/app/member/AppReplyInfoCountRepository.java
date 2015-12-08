package com.concom.soa.infrastructure.persist.app.member;

import com.concom.entity.dto.xunjia.app.member.AppReplyInfoCount;
import com.concom.mybatis.MybatisRepository;

public interface AppReplyInfoCountRepository extends MybatisRepository<String, AppReplyInfoCount> {
	/**
	 * 根据会员id查询信息
	 * @param memberid
	 * @return
	 */
	public AppReplyInfoCount get(String memberid);
}
