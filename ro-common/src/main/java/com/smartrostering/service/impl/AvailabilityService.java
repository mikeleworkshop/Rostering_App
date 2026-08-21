package com.smartrostering.service.impl;

import java.util.List;

import com.smartrostering.model.entity.Availability;
import com.smartrostering.repository.AvailabilityRepository;
import com.smartrostering.service.interfaces.IAvailabilityService;

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
