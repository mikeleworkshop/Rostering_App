package com.rosteroptimizer.service.interfaces;

import java.util.List;

import com.rosteroptimizer.model.dto.ConstraintViolationDto;
import com.rosteroptimizer.model.dto.RosterGenerationRequest;
import com.rosteroptimizer.model.entity.Assignment;
import com.rosteroptimizer.model.entity.Roster;

public interface IRosterService {
    Roster generateRoster(RosterGenerationRequest request);
    void manuallyModifyAssignment(Assignment assignment);
    List<ConstraintViolationDto> validateRoster(Roster roster);
}
