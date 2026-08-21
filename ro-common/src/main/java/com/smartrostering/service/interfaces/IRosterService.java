package com.smartrostering.service.interfaces;

import java.util.List;

import com.smartrostering.model.dto.ConstraintViolationDto;
import com.smartrostering.model.dto.RosterGenerationRequest;
import com.smartrostering.model.entity.Assignment;
import com.smartrostering.model.entity.Roster;

public interface IRosterService {
    Roster generateRoster(RosterGenerationRequest request);
    void manuallyModifyAssignment(Assignment assignment);
    List<ConstraintViolationDto> validateRoster(Roster roster);
}
