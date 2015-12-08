package com.concom.soa.exception;

public class DuplicateReplyException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6973660679767329331L;

	public DuplicateReplyException() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param msg
	 */
	public DuplicateReplyException(String msg) {
		super(msg);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param msg
	 * @param e
	 */
	public DuplicateReplyException(String msg, Throwable e) {
		super(msg, e);
		// TODO Auto-generated constructor stub
	}
}
