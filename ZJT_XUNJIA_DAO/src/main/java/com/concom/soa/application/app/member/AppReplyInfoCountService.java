package com.concom.soa.application.app.member;

import com.concom.entity.dto.xunjia.app.member.AppReplyInfoCount;


public interface AppReplyInfoCountService {
  
	/**
	 * 根据会员id查询信息
	 * @param memberid
	 * @return
	 */
	public AppReplyInfoCount get(String memberid);
}
