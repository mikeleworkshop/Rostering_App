package com.rosteroptimizer.repository;

import java.util.List;

import com.rosteroptimizer.model.entity.Employee;

public interface EmployeeRepository {
    Employee findByEmail(String email);
    List<Employee> findAllByBusiness(String businessRegNumber);
    void save(Employee employee);
    void deactivate(String email);
}
