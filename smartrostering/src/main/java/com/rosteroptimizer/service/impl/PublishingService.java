package com.rosteroptimizer.service.impl;

import java.time.LocalDate;

import com.rosteroptimizer.repository.RosterRepository;
import com.rosteroptimizer.service.interfaces.IPublishingService;

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
