package com.concom.soa.application.app.member.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.member.AppReplyInfoCount;
import com.concom.soa.application.app.member.AppReplyInfoCountService;
import com.concom.soa.infrastructure.persist.app.member.AppReplyInfoCountRepository;

@Service
public class AppReplyInfoCountServiceImpl implements
		AppReplyInfoCountService {

	@Autowired
	private AppReplyInfoCountRepository appReplyInfoCountRepository;
	@Override
	public AppReplyInfoCount get(String memberid) {
		// TODO Auto-generated method stub
		return appReplyInfoCountRepository.get(memberid);
	}

}
