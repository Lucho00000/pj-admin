package ar.gob.poderjudicial.pjbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(
  name = "employees",
  uniqueConstraints = {
    @UniqueConstraint(name = "uk_employees_legajo", columnNames = "legajo"),
    @UniqueConstraint(name = "uk_employees_dni", columnNames = "dni")
  }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank private String legajo;   
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank private String dni;      
}
