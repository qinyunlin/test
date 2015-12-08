package com.concom.soa.infrastructure.helper;

import org.apache.commons.lang.StringUtils;


/**
 * @author Dylan
 * @time 2013-9-17
 */
public final class StopSignalHelper {

	public final static String [] STOP_SIGNAL={"/",";",",","'",":","(","[",")","]","!","%","&","|","@","<",">","（","）"};
	
	/**
	 * @param word
	 * @return
	 */
	public static String filter(String word){

		for(String signal : STOP_SIGNAL){
			word = StringUtils.remove(word, signal);
		}
		return word;
	}
}
