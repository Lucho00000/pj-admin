package ar.gob.poderjudicial.pjbackend.service;

import ar.gob.poderjudicial.pjbackend.model.Department;
import ar.gob.poderjudicial.pjbackend.model.Employee;
import ar.gob.poderjudicial.pjbackend.model.EmployeeDepartment;
import ar.gob.poderjudicial.pjbackend.repo.EmployeeDepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class EmployeeAssignmentService {
  private final EmployeeDepartmentRepository edRepo;

  public EmployeeAssignmentService(EmployeeDepartmentRepository edRepo) {
    this.edRepo = edRepo;
  }

  @Transactional
  public void assign(Employee emp, Department toDept) {
    var now = LocalDateTime.now();
    var current = edRepo.findFirstByEmployeeAndToTsIsNullOrderByFromTsDesc(emp);
    if (current.isPresent()) {
      var row = current.get();
      if (row.getDepartment().getId().equals(toDept.getId())) {
        return;
      }
      row.setToTs(now);
      edRepo.save(row);
    }
    var newRow = EmployeeDepartment.builder()
        .employee(emp)
        .department(toDept)
        .fromTs(now)
        .toTs(null)
        .build();
    edRepo.save(newRow);
  }
}
