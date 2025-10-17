package ar.gob.poderjudicial.pjbackend.web;

import ar.gob.poderjudicial.pjbackend.model.*;
import ar.gob.poderjudicial.pjbackend.repo.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EmployeeMoveControllerTest {

  @Autowired MockMvc mvc;
  @Autowired ObjectMapper om;
  @Autowired EmployeeRepository empRepo;
  @Autowired BuildingRepository bldRepo;
  @Autowired DepartmentRepository depRepo;

  Long empId, depA, depB;

  @BeforeEach
  void setup() {
    var b = bldRepo.save(Building.builder().name("B").street("Calle").number("1").build());
    var d1 = depRepo.save(Department.builder().name("A").officeNumber("1").building(b).build());
    var d2 = depRepo.save(Department.builder().name("B").officeNumber("2").building(b).build());
    var e = empRepo.save(Employee.builder().legajo("X001").firstName("X").lastName("Y").dni("999").build());
    empId = e.getId(); depA = d1.getId(); depB = d2.getId();
  }

  @Test
  void move_and_history_works() throws Exception {
    // mover a depA
    mvc.perform(post("/api/employees/{id}/move", empId)
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"toDepartmentId\":" + depA + "}"))
        .andExpect(status().isOk());

    // mover a depB
    mvc.perform(post("/api/employees/{id}/move", empId)
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"toDepartmentId\":" + depB + "}"))
        .andExpect(status().isOk());

    // historial: al menos 2 registros y el último vigente
    mvc.perform(get("/api/employees/{id}/moves", empId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
        .andExpect(jsonPath("$[0].toTs", nullValue())); // registro vigente
  }
}
