package com.rosteroptimizer.service.impl;

import java.util.List;

import com.rosteroptimizer.model.entity.Availability;
import com.rosteroptimizer.repository.AvailabilityRepository;
import com.rosteroptimizer.service.interfaces.IAvailabilityService;

public class AvailabilityService implements IAvailabilityService{
	private AvailabilityRepository availRepo;
	
	@Override
	public void submitExceptionAvailability(String employeeEmail, List<Availability> exceptions) {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public void submitRegularAvailability(String employeeEmail, List<Availability> availabilities) {
		// TODO Auto-generated method stub
		
	}
}
