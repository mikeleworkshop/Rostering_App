package com.smartrostering.service.impl;

import java.util.List;

import com.smartrostering.engine.RosterOptimizer;
import com.smartrostering.model.dto.ConstraintViolationDto;
import com.smartrostering.model.dto.RosterGenerationRequest;
import com.smartrostering.model.entity.Assignment;
import com.smartrostering.model.entity.Roster;
import com.smartrostering.repository.EmployeeRepository;
import com.smartrostering.repository.RosterRepository;
import com.smartrostering.repository.ShiftRepository;
import com.smartrostering.service.interfaces.IRosterService;

public class RosterService implements IRosterService {
    private RosterOptimizer optimizer;
    private RosterRepository rosterRepo;
    private ShiftRepository shiftRepo;
    private EmployeeRepository empRepo;
    
    
    @Override
    public Roster generateRoster(RosterGenerationRequest request) {
    	// TODO Auto-generated method stub
    	return null;
    }
    
    @Override
    public void manuallyModifyAssignment(Assignment assignment) {
    	// TODO Auto-generated method stub
    	
    }@Override
    public List<ConstraintViolationDto> validateRoster(Roster roster) {
    	// TODO Auto-generated method stub
    	return null;
    }
    
}
