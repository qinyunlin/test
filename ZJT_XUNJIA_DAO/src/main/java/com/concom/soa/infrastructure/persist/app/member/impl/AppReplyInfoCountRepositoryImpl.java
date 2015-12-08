package com.concom.soa.infrastructure.persist.app.member.impl;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.member.AppReplyInfoCount;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.member.AppReplyInfoCountRepository;

@Repository
public class AppReplyInfoCountRepositoryImpl extends MybatisOperations<String, AppReplyInfoCount> implements
		AppReplyInfoCountRepository {

}
