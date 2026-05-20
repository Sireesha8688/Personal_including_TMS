package training.iqgateway.dto;

public class UserLoginDTO {
    private String username;
    private String password;
    private String rolename;

    public UserLoginDTO(String username, String password, String rolename) {
        this.username = username;
        this.password = password;
        this.rolename = rolename;
    }

    // Getters and setters (or use Lombok @Data for brevity)
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRolename() { return rolename; }
    public void setRolename(String rolename) { this.rolename = rolename; }
}
