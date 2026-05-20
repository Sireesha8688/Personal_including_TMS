package training.iqgatewaty.backing;

import java.util.ArrayList;
import java.util.List;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmUsermaster;
import training.iqgateway.services.AdminSessionEJBLocal;

public class UserBean1 {
    private TmUsermaster selectedUser;

    public TmUsermaster getSelectedUser() {
        return selectedUser;
    }
    private List<TmUsermaster> users;
    private List<TmUsermaster> filteredUsers;
    private String message;

    public List<TmUsermaster> getUsers() {
        if (users == null) refreshUsers();
        return users;
    }

    public List<TmUsermaster> getFilteredUsers() {
        if (filteredUsers == null) refreshFilteredUsers();
        return filteredUsers;
    }

    public void setFilteredUsers(List<TmUsermaster> filteredUsers) {
        this.filteredUsers = filteredUsers;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AdminSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (AdminSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/AdminSessionEJB");
    }

    private void refreshUsers() {
        try {
            users = getSessionBean().getTmUsermasterFindAll();
        } catch (Exception e) {
            users = new ArrayList<TmUsermaster>();
        }
    }

    private void refreshFilteredUsers() {
        refreshUsers();
        filteredUsers = new ArrayList<TmUsermaster>();
        for (TmUsermaster user : users) {
            if (user.getTmRolemaster() != null && "USER".equalsIgnoreCase(user.getTmRolemaster().getRolename())) {
                filteredUsers.add(user);
            }
        }
    }
    public void setSelectedUser(TmUsermaster selectedUser) {
        this.selectedUser = selectedUser;
    }
    // New method to delete a user
    public String deleteUser() {
        if (selectedUser == null) {
            message = "No user selected for deletion.";
            return null;
        }
        try {
            AdminSessionEJBLocal ejb = getSessionBean();
            ejb.removeTmUsermaster(selectedUser);
            message = "User " + selectedUser.getUsername() + " deleted successfully.";
            refreshFilteredUsers();
            selectedUser = null;
        } catch (Exception e) {
            message = "Error deleting user: " + e.getMessage();
            e.printStackTrace();
        }
        return null; // stay on the same page
    }

}
