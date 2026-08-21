package com.smartrostering.service.impl;

import java.time.LocalDate;

import com.smartrostering.repository.RosterRepository;
import com.smartrostering.service.interfaces.IPublishingService;

public class PublishingService implements IPublishingService {
	private RosterRepository rosterRepo;
	
	@Override
	public String generateShareableLink(String businessRegNumber, LocalDate weekStart) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void publishRoster(String businessRegNumber, LocalDate weekStart) {
		// TODO Auto-generated method stub
		
	}
}
