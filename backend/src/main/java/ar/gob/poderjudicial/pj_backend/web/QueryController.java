package ar.gob.poderjudicial.pjbackend.web;

import ar.gob.poderjudicial.pjbackend.dto.EmployeeDto;
import ar.gob.poderjudicial.pjbackend.mapper.EmployeeMapper;
import ar.gob.poderjudicial.pjbackend.model.Employee;
import ar.gob.poderjudicial.pjbackend.repo.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/query")
public class QueryController {
  private final DepartmentRepository depRepo;
  private final BuildingRepository bldRepo;
  private final EmployeeDepartmentRepository edRepo;

  public QueryController(DepartmentRepository depRepo, BuildingRepository bldRepo, EmployeeDepartmentRepository edRepo) {
    this.depRepo = depRepo;
    this.bldRepo = bldRepo;
    this.edRepo = edRepo;
  }

  @GetMapping("/departments/{depId}/employees")
  public java.util.List<EmployeeDto> employeesByDepartment(@PathVariable Long depId) {
    var dep = depRepo.findById(depId).orElseThrow(() -> new NotFoundException("Department " + depId + " not found"));
    return edRepo.findByDepartmentAndToTsIsNull(dep).stream()
        .map(ed -> {
          Employee e = ed.getEmployee();
          return EmployeeMapper.toDto(e, dep.getId());
        }).toList();
  }

  @GetMapping("/buildings/{bldId}/employees")
  public java.util.List<EmployeeDto> employeesByBuilding(@PathVariable Long bldId) {
    var b = bldRepo.findById(bldId).orElseThrow(() -> new NotFoundException("Building " + bldId + " not found"));
    return b.getId() == null ? java.util.List.of() :
      depRepo.findAll().stream()
        .filter(d -> d.getBuilding() != null && b.getId().equals(d.getBuilding().getId()))
        .flatMap(d -> edRepo.findByDepartmentAndToTsIsNull(d).stream())
        .map(ed -> EmployeeMapper.toDto(ed.getEmployee(), ed.getDepartment().getId()))
        .toList();
  }
}
