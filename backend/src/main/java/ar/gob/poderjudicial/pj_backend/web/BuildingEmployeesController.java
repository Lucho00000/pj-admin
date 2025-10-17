package ar.gob.poderjudicial.pjbackend.web;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buildings/{id}/employees")
public class BuildingEmployeesController {
  @GetMapping
  public Object listEmployeesByBuilding(@PathVariable Long id) {
    return java.util.List.of(); 
  }
}
