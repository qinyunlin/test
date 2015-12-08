package com.concom.soa.application.app.member.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.member.AppMember;
import com.concom.lang.Page;
import com.concom.soa.application.app.member.AppMemberService;
import com.concom.soa.infrastructure.persist.app.member.AppMemberRepository;

@Service
public class AppMemberServiceImpl implements AppMemberService{
	
	@Autowired
	AppMemberRepository memberRepository;
	
	
	public AppMember member(String memberId) {
		return memberRepository.getMemberInfoById(memberId);
	}
	
	public boolean isExist(String memberId) {
		Map<String,Object> params = new HashMap<String, Object>();
		params.put("memberId", memberId);
		return memberRepository.isExist(params);
	}

	@Override
	public boolean isMobileExist(String mobileNumber) {
		Map<String,Object> params = new HashMap<String, Object>();
		params.put("mobile", mobileNumber);
		return memberRepository.isExist(params);
	}


	@Override
	public int update(AppMember member) {
		// TODO Auto-generated method stub
		return memberRepository.update(member);
	}


	/**
	 * 查询app会员列表
	 * @param page
	 * @return
	 */
	public Page<Map<String, Object>> queryPage(Page<Map<String, Object>> page){
		return memberRepository.queryPageMap(page);
	}

	@Override
	public int registerUser(Map<String, Object> params) {
		int i = memberRepository.registerUser(params);
		
		return i;
	}

	@Override
	public AppMember getMemberByMobile(String mobile) {
		// TODO Auto-generated method stub
		return memberRepository.getByMobile(mobile);
	}

	@Override
	public Page<Map<String, Object>> queryPageMapForBillboard(
			Page<Map<String, Object>> page) {
		// TODO Auto-generated method stub
		return memberRepository.queryPageMapForBillboard(page);
	}
	@Override
	public Map<String, Object> rankingWithMe(
			String memberId) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("memberId", memberId);
		return memberRepository.rankingWithMe(param);
	}

	@Override
	public void loginLog(String username) {
		AppMember member = memberRepository.getMemberInfoById(username);
		member.setLoginCount(member.getLoginCount()+1);
		member.setLoginDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
		memberRepository.update(member);
	}

	
}
