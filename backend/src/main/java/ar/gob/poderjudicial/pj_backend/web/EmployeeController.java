package ar.gob.poderjudicial.pjbackend.web;

import ar.gob.poderjudicial.pjbackend.dto.EmployeeDto;
import ar.gob.poderjudicial.pjbackend.mapper.EmployeeMapper;
import ar.gob.poderjudicial.pjbackend.model.Employee;
import ar.gob.poderjudicial.pjbackend.repo.EmployeeDepartmentRepository;
import ar.gob.poderjudicial.pjbackend.repo.EmployeeRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

import static ar.gob.poderjudicial.pjbackend.mapper.EmployeeMapper.toDto;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
  private final EmployeeRepository repo;
  private final EmployeeDepartmentRepository edRepo;

  public EmployeeController(EmployeeRepository repo, EmployeeDepartmentRepository edRepo) {
    this.repo = repo;
    this.edRepo = edRepo;
  }

  @GetMapping
  public java.util.List<EmployeeDto> list() {
    return repo.findAll().stream().map(e -> {
      var current = edRepo.findFirstByEmployeeAndToTsIsNullOrderByFromTsDesc(e);
      Long deptId = current.map(ed -> ed.getDepartment().getId()).orElse(null);
      return toDto(e, deptId);
    }).toList();
  }

  @GetMapping("{id}")
  public EmployeeDto get(@PathVariable Long id) {
    var e = repo.findById(id).orElseThrow(() -> new NotFoundException("Employee " + id + " not found"));
    var current = edRepo.findFirstByEmployeeAndToTsIsNullOrderByFromTsDesc(e);
    Long deptId = current.map(ed -> ed.getDepartment().getId()).orElse(null);
    return toDto(e, deptId);
  }

  @PostMapping
  public ResponseEntity<EmployeeDto> create(@RequestBody @Valid EmployeeDto dto) {
    var e = new Employee();
    EmployeeMapper.updateEntity(e, dto);
    e = repo.save(e);
    return ResponseEntity.created(URI.create("/api/employees/" + e.getId()))
        .body(toDto(e, null));
  }

  @PutMapping("{id}")
  public EmployeeDto update(@PathVariable Long id, @RequestBody @Valid EmployeeDto dto) {
    var e = repo.findById(id).orElseThrow(() -> new NotFoundException("Employee " + id + " not found"));
    EmployeeMapper.updateEntity(e, dto);
    e = repo.save(e);
    var current = edRepo.findFirstByEmployeeAndToTsIsNullOrderByFromTsDesc(e);
    Long deptId = current.map(ed -> ed.getDepartment().getId()).orElse(null);
    return toDto(e, deptId);
  }

  @DeleteMapping("{id}")
  public void delete(@PathVariable Long id) {
    if (!repo.existsById(id)) throw new NotFoundException("Employee " + id + " not found");
    repo.deleteById(id);
  }
}
