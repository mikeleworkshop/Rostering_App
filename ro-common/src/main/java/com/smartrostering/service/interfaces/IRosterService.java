package com.smartrostering.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import com.smartrostering.model.dto.ConstraintViolationDto;
import com.smartrostering.model.dto.RosterGenerationRequest;
import com.smartrostering.model.entity.Assignment;
import com.smartrostering.model.entity.Roster;

public interface IRosterService {
	void generateRoster(LocalDate weekStart);

    void regenerateRoster(Long rosterId);

    Roster getRosterById(Long rosterId);

    Roster getRosterByWeek(LocalDate weekStart);

    Roster getEmployeeRoster(
            Long employeeId,
            LocalDate weekStart);

    void addAssignment(
            Long rosterId,
            Long employeeId,
            Long shiftId);

    void removeAssignment(Long assignmentId);

    void updateAssignment(
            Long assignmentId,
            Long employeeId,
            Long shiftId);

    boolean validateRoster(Long rosterId);
}
