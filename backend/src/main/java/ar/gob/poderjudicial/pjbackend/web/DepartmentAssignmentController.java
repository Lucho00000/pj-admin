package ar.gob.poderjudicial.pjbackend.web;

import ar.gob.poderjudicial.pjbackend.repo.DepartmentRepository;
import ar.gob.poderjudicial.pjbackend.repo.EmployeeRepository;
import ar.gob.poderjudicial.pjbackend.service.EmployeeAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
public class DepartmentAssignmentController {
  private final DepartmentRepository depRepo;
  private final EmployeeRepository empRepo;
  private final EmployeeAssignmentService service;

  public DepartmentAssignmentController(DepartmentRepository depRepo, EmployeeRepository empRepo, EmployeeAssignmentService service) {
    this.depRepo = depRepo;
    this.empRepo = empRepo;
    this.service = service;
  }

  @PostMapping("{depId}/employees/{empId}")
  public ResponseEntity<?> assign(@PathVariable Long depId, @PathVariable Long empId) {
    var dep = depRepo.findById(depId).orElseThrow(() -> new NotFoundException("Department " + depId + " not found"));
    var emp = empRepo.findById(empId).orElseThrow(() -> new NotFoundException("Employee " + empId + " not found"));
    service.assign(emp, dep);
    return ResponseEntity.ok().build();
  }
}
