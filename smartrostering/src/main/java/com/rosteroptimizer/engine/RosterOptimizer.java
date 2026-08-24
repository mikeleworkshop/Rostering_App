package com.rosteroptimizer.engine;

import java.util.List;

import com.rosteroptimizer.engine.constraint.ConstraintChecker;
import com.rosteroptimizer.engine.scoring.FairnessScorer;
import com.rosteroptimizer.engine.scoring.LabourCostCalculator;
import com.rosteroptimizer.model.dto.RosterGenerationRequest;
import com.rosteroptimizer.model.entity.Employee;
import com.rosteroptimizer.model.entity.Shift;

public class RosterOptimizer {
    private List<ConstraintChecker> hardConstraints;
    private LabourCostCalculator costCalculator;
    private FairnessScorer fairnessScorer;
    
    public void generateOptimalRoster(RosterGenerationRequest request, List<Shift> shifts, List<Employee> employees) {}
    public void addConstraint(ConstraintChecker constraints) {}
}
