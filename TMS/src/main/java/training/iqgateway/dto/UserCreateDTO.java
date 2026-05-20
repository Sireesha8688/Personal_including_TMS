// src/main/java/training/iqgateway/dto/UserCreateDTO.java
package training.iqgateway.dto;

public class UserCreateDTO {
    private String username;
    private String password;
    private String rolename;

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRolename() { return rolename; }
    public void setRolename(String rolename) { this.rolename = rolename; }
}
