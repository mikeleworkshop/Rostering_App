package com.smartrostering.service.interfaces;

import com.smartrostering.model.entity.Employee;

public interface IEmployeeService {
    void createEmployee(Employee employee);
    void updateEmployee(Employee employee);
    void deactivateEmployee(String email);
}	
