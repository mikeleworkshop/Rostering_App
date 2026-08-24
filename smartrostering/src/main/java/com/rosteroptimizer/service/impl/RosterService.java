package com.rosteroptimizer.service.impl;

import java.util.List;

import com.rosteroptimizer.engine.RosterOptimizer;
import com.rosteroptimizer.model.dto.ConstraintViolationDto;
import com.rosteroptimizer.model.dto.RosterGenerationRequest;
import com.rosteroptimizer.model.entity.Assignment;
import com.rosteroptimizer.model.entity.Roster;
import com.rosteroptimizer.repository.EmployeeRepository;
import com.rosteroptimizer.repository.RosterRepository;
import com.rosteroptimizer.repository.ShiftRepository;
import com.rosteroptimizer.service.interfaces.IRosterService;

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
