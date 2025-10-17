package ar.gob.poderjudicial.pjbackend.web;

import ar.gob.poderjudicial.pjbackend.dto.MoveRecordDto;
import ar.gob.poderjudicial.pjbackend.repo.*;
import ar.gob.poderjudicial.pjbackend.service.EmployeeAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeMoveController {

  private final EmployeeRepository empRepo;
  private final DepartmentRepository depRepo;
  private final EmployeeDepartmentRepository edRepo;
  private final EmployeeAssignmentService assignment;

  public EmployeeMoveController(
      EmployeeRepository empRepo,
      DepartmentRepository depRepo,
      EmployeeDepartmentRepository edRepo,
      EmployeeAssignmentService assignment
  ) {
    this.empRepo = empRepo;
    this.depRepo = depRepo;
    this.edRepo = edRepo;
    this.assignment = assignment;
  }

  public record MoveReq(Long toDepartmentId) {}
  @PostMapping("{id}/move")
  public ResponseEntity<?> move(@PathVariable Long id, @RequestBody MoveReq req) {
    var emp = empRepo.findById(id).orElseThrow(() -> new NotFoundException("Employee " + id + " not found"));
    var to = depRepo.findById(req.toDepartmentId())
        .orElseThrow(() -> new NotFoundException("Department " + req.toDepartmentId() + " not found"));
    assignment.assign(emp, to);
    return ResponseEntity.ok().build();
  }

  @GetMapping("{id}/moves")
  public java.util.List<MoveRecordDto> history(@PathVariable Long id) {
    var emp = empRepo.findById(id).orElseThrow(() -> new NotFoundException("Employee " + id + " not found"));
    var rows = edRepo.findByEmployeeOrderByFromTsDesc(emp);
    return rows.stream().map(ed -> new MoveRecordDto(
        ed.getDepartment().getId(),
        ed.getDepartment().getName(),
        ed.getDepartment().getBuilding().getId(),
        ed.getDepartment().getBuilding().getName(),
        ed.getFromTs(),
        ed.getToTs()
    )).toList();
  }
}
