package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmRolemaster;
import training.iqgateway.entities.TmUsermaster;
import training.iqgateway.services.AdminSessionEJBLocal;

public class CreateUser1 implements Serializable {
    private String username;
    private String password;
    private String roleName;
    private String message;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    private AdminSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (AdminSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/AdminSessionEJB");
    }

    public String createUser() {
        try {
            AdminSessionEJBLocal sessionBean = getSessionBean();
            // Fetch the role by name
            List<TmRolemaster> roles = sessionBean.getTmRolemasterFindAll();
            TmRolemaster role = null;
            for (TmRolemaster r : roles) {
                if (roleName.equals(r.getRolename())) {
                    role = r;
                    break;
                }
            }
            if (role == null) {
                // Role not found, create it (optional)
                role = new TmRolemaster();
                role.setRolename(roleName);
                // Uncomment below if you want to auto-create missing roles
                // sessionBean.persistTmRolemaster(role);
            }
            TmUsermaster user = new TmUsermaster(password, role, username);
            sessionBean.persistTmUsermaster(user);
            message = "User created successfully!";
            username = null;
            password = null;
            roleName = null;
        } catch (Exception e) {
            message = "Error creating user: " + e.getMessage();
            e.printStackTrace();
        }
        return null;
    }
}
