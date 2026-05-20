package training.iqgatewaty.backing;

import java.util.*;
import javax.naming.*;
import training.iqgateway.entities.*;
import training.iqgateway.services.*;

public class UserBean {
    private List<TmUsermaster> users;
    private String message;

    // Get EJB Session Bean
    public AdminSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (AdminSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/AdminSessionEJB");
    }

    // Return all users
    public List<TmUsermaster> getUsers() {
        if (users == null) {
            refreshUsers();
        }
        return users;
    }

    // Refresh all users list
    private void refreshUsers() {
        try {
            users = getSessionBean().getTmUsermasterFindAll();
        } catch (Exception e) {
            users = new ArrayList<TmUsermaster>();
            message = "Error loading users: " + e.getMessage();
            e.printStackTrace();
        }
    }

    // Return unique roles
    public List<String> getUniqueRoles() {
        if (users == null) {
            refreshUsers();
        }
        Set<String> uniqueRoles = new LinkedHashSet<String>();
        for (TmUsermaster user : users) {
            if (user.getTmRolemaster() != null && user.getTmRolemaster().getRolename() != null) {
                uniqueRoles.add(user.getTmRolemaster().getRolename());
            }
        }
        return new ArrayList<String>(uniqueRoles);
    }

    // Getter and setter for message
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
