package com.smartrostering.engine.constraint;

import com.smartrostering.model.dto.ConstraintViolationDto;
import com.smartrostering.model.entity.Employee;
import com.smartrostering.model.entity.Roster;
import com.smartrostering.model.entity.Shift;

public interface ConstraintChecker {
    boolean isSatisfied(Employee employee, Shift shift, Roster currentRoster);
    ConstraintViolationDto getViolationDetails();
}
