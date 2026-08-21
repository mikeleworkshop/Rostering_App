package com.smartrostering.exception;

import java.util.List;

import com.smartrostering.model.dto.ConstraintViolationDto;

public class ConstraintViolationException extends RuntimeException {
    private List<ConstraintViolationDto> violations;
    
    public ConstraintViolationException() {
		// TODO Auto-generated constructor stub
	}
}
