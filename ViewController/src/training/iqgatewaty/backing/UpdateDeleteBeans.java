package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import training.iqgateway.entities.TmRolemaster;
import training.iqgateway.services.AdminSessionEJBLocal;

public class UpdateDeleteBeans implements Serializable {

    private List<TmRolemaster> roleList;
    private TmRolemaster selectedRole;
    private String message;
    private String messageClass;

    public List<TmRolemaster> getRoleList() {
        if (roleList == null) {
            loadRoles();
        }
        return roleList;
    }

    public void setRoleList(List<TmRolemaster> roleList) {
        this.roleList = roleList;
    }

    public TmRolemaster getSelectedRole() {
        return selectedRole;
    }

    public void setSelectedRole(TmRolemaster selectedRole) {
        this.selectedRole = selectedRole;
    }

    public String getMessage() {
        return message;
    }

    public String getMessageClass() {
        return messageClass;
    }

    private AdminSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (AdminSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/AdminSessionEJB");
    }

    public void loadRoles() {
        try {
            AdminSessionEJBLocal sessionBean = getSessionBean();
            roleList = sessionBean.getTmRolemasterFindAll();
        } catch (Exception e) {
            message = "Error loading roles: " + e.getMessage();
            messageClass = "error";
            e.printStackTrace();
        }
    }

    public String prepareEdit() {
        // selectedRole is already set by f:setPropertyActionListener
        message = null;
        messageClass = null;
        return null;
    }

    public String updateRole() {
        try {
            AdminSessionEJBLocal sessionBean = getSessionBean();
            sessionBean.mergeTmRolemaster(selectedRole);
            message = "Role updated successfully.";
            messageClass = "success";
            loadRoles();
            selectedRole = null;
        } catch (Exception e) {
            message = "Error updating role: " + e.getMessage();
            messageClass = "error";
            e.printStackTrace();
        }
        return null;
    }

    public String deleteRole() {
        try {
            AdminSessionEJBLocal sessionBean = getSessionBean();
            sessionBean.removeTmRolemaster(selectedRole);
            message = "Role deleted successfully.";
            messageClass = "success";
            selectedRole = null;
            loadRoles();
        } catch (Exception e) {
            message = "Error deleting role: " + e.getMessage();
            messageClass = "error";
            e.printStackTrace();
        }
        return null;
    }

    public String cancelEdit() {
        selectedRole = null;
        message = null;
        messageClass = null;
        return null;
    }
}
