package com.rosteroptimizer.service.interfaces;

import java.util.List;

import com.rosteroptimizer.model.entity.Availability;

public interface IAvailabilityService {
    void submitRegularAvailability(String employeeEmail, List<Availability> availabilities);
    void submitExceptionAvailability(String employeeEmail, List<Availability> exceptions);

}
