package com.rosteroptimizer.service.interfaces;

import com.rosteroptimizer.model.entity.Employee;

public interface IEmployeeService {
    void createEmployee(Employee employee);
    void updateEmployee(Employee employee);
    void deactivateEmployee(String email);
}	
