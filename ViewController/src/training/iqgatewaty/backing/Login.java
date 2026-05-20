package training.iqgatewaty.backing;

import java.util.List;
import javax.ejb.EJB;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmUsermaster;
import training.iqgateway.services.AdminSessionEJBLocal;

public class Login {
    private String username;
    private String password;
    private String role;
    private String message;

    @EJB
    private AdminSessionEJBLocal adminSessionEJB;

    public Login() {
        try {
            InitialContext ic = new InitialContext();
            Object lookupObject = ic.lookup("java:comp/env/ejb/local/AdminSessionEJB");
            adminSessionEJB = (AdminSessionEJBLocal) lookupObject;
        } catch (NamingException e) {
            e.printStackTrace();
        }
    }

    public String login() {
        if (adminSessionEJB == null) {
            message = "Server error: unable to access service.";
            return null;
        }

        List<TmUsermaster> users = adminSessionEJB.getTmUsermasterFindAll();
        for (TmUsermaster user : users) {
            if (user.getUsername().equals(username) &&
                user.getPassword().equals(password) &&
                user.getTmRolemaster() != null &&
                user.getTmRolemaster().getRolename().equalsIgnoreCase(role)) {
                message = "Login successful!";
                // Redirect based on role
                if ("ADMIN".equalsIgnoreCase(role)) {
                    return "adminDashboard";
                } else if ("CLERK".equalsIgnoreCase(role)) {
                    return "clerkDashboard";
                } else if ("RTO".equalsIgnoreCase(role)) {
                    return "rtoDashboard";
                } else if ("COP".equalsIgnoreCase(role)) {
                    return "copDashboard";
                }
                else if ("USER".equalsIgnoreCase(role)) {
                                    return "ownerDashboard";
                                }
                return "success"; // fallback
            }
        }
        message = "Invalid username, password, or role.";
        return null;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
