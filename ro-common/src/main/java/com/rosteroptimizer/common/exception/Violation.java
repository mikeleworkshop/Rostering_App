package com.rosteroptimizer.common.exception;

public record Violation(    
		String field,
	    String constraint,
	    String message) 
{}
