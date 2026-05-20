package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.entities.TmUserMaster;
import training.iqgateway.service.UserMasterService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserMasterService userMasterService;

    @Autowired
    public UserController(UserMasterService userMasterService) {
        this.userMasterService = userMasterService;
    }

    // Get all users
    @GetMapping
    public List<TmUserMaster> getAllUsers() {
        return userMasterService.getAll();
    }

    // Get user by username
    @GetMapping("/{username}")
    public ResponseEntity<TmUserMaster> getUserByUsername(@PathVariable String username) {
        TmUserMaster user = userMasterService.getByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Add new user
    @PostMapping
    public ResponseEntity<TmUserMaster> addUser(@RequestBody TmUserMaster user) {
        userMasterService.addUser(user);
        return ResponseEntity.ok(user);
    }

    // Update user role
    @PutMapping("/{username}")
    public ResponseEntity<TmUserMaster> updateUser(
            @PathVariable String username,
            @RequestBody TmUserMaster updatedUser) {
        try {
            userMasterService.updateRole(username, updatedUser);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete user
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        TmUserMaster user = userMasterService.getByUsername(username);
        if (user != null) {
            userMasterService.deleteUser(username);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
