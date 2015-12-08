package com.concom.soa.infrastructure.persist.app.feedback.impl;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.feedback.Feedback;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.feedback.FeedbackRepository;

@Repository
public class FeedbackRepositoryImpl extends MybatisOperations<String, Feedback> implements
		FeedbackRepository {


}
