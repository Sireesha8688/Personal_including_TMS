package training.iqgatewaty.backing;

import java.util.ArrayList;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmRolemaster;
import training.iqgateway.services.AdminSessionEJBLocal;

public class RoleBean {
    private String rolename;
    private String roleDesc;
    private List<TmRolemaster> roles;
    private String message;
    private TmRolemaster selectedRole;
    public String getRolename() {
        return rolename;
    }

    public void setRolename(String rolename) {
        this.rolename = rolename;
    }

    public String getRoleDesc() {
        return roleDesc;
    }

    public void setRoleDesc(String roleDesc) {
        this.roleDesc = roleDesc;
    }

    public List<TmRolemaster> getRoles() {
        if (roles == null) {
            refreshRoles();
        }
        return roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    public TmRolemaster getSelectedRole() { return selectedRole; }
        public void setSelectedRole(TmRolemaster selectedRole) { this.selectedRole = selectedRole; }
    public AdminSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        Object lookupObject = ic.lookup("java:comp/env/ejb/local/AdminSessionEJB");
        return (AdminSessionEJBLocal) lookupObject;
    }

    private void refreshRoles() {
        try {
            roles = getSessionBean().getTmRolemasterFindAll();
        } catch (Exception e) {
            roles = new ArrayList<TmRolemaster>();
        }
    }

    public String addRole() {
        try {
            AdminSessionEJBLocal sessionBean = getSessionBean();
            TmRolemaster newRole = new TmRolemaster(roleDesc, rolename);
            sessionBean.persistTmRolemaster(newRole);
            refreshRoles();
            message = "Role added successfully!";
            rolename = null;
            roleDesc = null;
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            message = "Error adding role: " + e.getMessage();
            return null;
        }
    }
   
}
