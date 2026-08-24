package com.rosteroptimizer.engine.constraint;

import com.rosteroptimizer.model.dto.ConstraintViolationDto;
import com.rosteroptimizer.model.entity.Employee;
import com.rosteroptimizer.model.entity.Roster;
import com.rosteroptimizer.model.entity.Shift;

public interface ConstraintChecker {
    boolean isSatisfied(Employee employee, Shift shift, Roster currentRoster);
    ConstraintViolationDto getViolationDetails();
}
