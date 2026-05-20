package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.entities.TmRoleMaster;
import training.iqgateway.service.RoleMasterService;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleMasterService roleMasterService;

    @Autowired
    public RoleController(RoleMasterService roleMasterService) {
        this.roleMasterService = roleMasterService;
    }

    // Get all roles
    @GetMapping
    public List<TmRoleMaster> getAllRoles() {
        return roleMasterService.getAllRoles();
    }

    // Get role by rolename
    @GetMapping("/{rolename}")
    public ResponseEntity<TmRoleMaster> getRoleByRolename(@PathVariable String rolename) {
        TmRoleMaster role = roleMasterService.getByRolename(rolename);
        if (role != null) {
            return ResponseEntity.ok(role);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Add a new role
    @PostMapping
    public ResponseEntity<TmRoleMaster> addRole(@RequestBody TmRoleMaster role) {
        roleMasterService.addRole(role);
        return ResponseEntity.ok(role);
    }

    // Update an existing role
    @PutMapping("/{rolename}")
    public ResponseEntity<TmRoleMaster> updateRole(
            @PathVariable String rolename,
            @RequestBody TmRoleMaster updatedRole) {
        TmRoleMaster existingRole = roleMasterService.getByRolename(rolename);
        if (existingRole != null) {
            updatedRole.setRolename(rolename); // Ensure path and body match
            roleMasterService.updateRole(updatedRole);
            return ResponseEntity.ok(updatedRole);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a role
    @DeleteMapping("/{rolename}")
    public ResponseEntity<Void> deleteRole(@PathVariable String rolename) {
        TmRoleMaster existingRole = roleMasterService.getByRolename(rolename);
        if (existingRole != null) {
            roleMasterService.deleteRole(rolename);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
