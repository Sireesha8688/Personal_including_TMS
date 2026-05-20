package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmOffence;
import training.iqgateway.services.RTOSessionEJBLocal;

public class OffenceTypeBean implements Serializable {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(OffenceTypeBean.class.getName());

    private List<TmOffence> offenceList;
    private TmOffence selectedOffence = new TmOffence();
    private boolean editing = false;
    private String message;
    private String messageClass;

    public List<TmOffence> getOffenceList() {
        if (offenceList == null) {
            refreshList();
        }
        return offenceList;
    }

    public void setOffenceList(List<TmOffence> offenceList) {
        this.offenceList = offenceList;
    }

    public TmOffence getSelectedOffence() {
        if (selectedOffence == null) {
            selectedOffence = new TmOffence();
        }
        return selectedOffence;
    }

    public void setSelectedOffence(TmOffence selectedOffence) {
        this.selectedOffence = selectedOffence;
    }

    public boolean isEditing() {
        return editing;
    }

    public void setEditing(boolean editing) {
        this.editing = editing;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessageClass() {
        return messageClass;
    }

    public void setMessageClass(String messageClass) {
        this.messageClass = messageClass;
    }

    private RTOSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (RTOSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/RTOSessionEJB");
    }

    public void refreshList() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();
            offenceList = sessionBean.getTmOffenceFindAll();
        } catch (Exception e) {
            message = "Error loading offences: " + e.getMessage();
            messageClass = "error";
            LOGGER.log(Level.SEVERE, "Error loading offences", e);
        }
    }

    public String addOffence() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();
            selectedOffence.setOffenceId(null); // DB generates ID
            sessionBean.persistTmOffence(selectedOffence);
            message = "OffenceType added successfully!";
            messageClass = "success";
            selectedOffence = new TmOffence();
            refreshList();
        } catch (Exception e) {
            message = "Error adding offence: " + e.getMessage();
            messageClass = "error";
            LOGGER.log(Level.SEVERE, "Error adding offence", e);
        }
        return null;
    }

    public String prepareUpdate() {
        editing = true;
        return null;
    }

    public String cancelEdit() {
        editing = false;
        selectedOffence = new TmOffence();
        clearMessage();
        return null;
    }

    public String saveOffence() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();
            sessionBean.mergeTmOffence(selectedOffence);
            message = "Offence updated successfully.";
            messageClass = "success";
            editing = false;
            selectedOffence = new TmOffence();
            refreshList();
        } catch (Exception e) {
            message = "Error updating offence: " + e.getMessage();
            messageClass = "error";
            LOGGER.log(Level.SEVERE, "Error updating offence", e);
        }
        return null;
    }

    public String deleteOffence() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();
            sessionBean.removeTmOffence(selectedOffence);
            message = "Offence deleted successfully.";
            messageClass = "success";
            selectedOffence = new TmOffence();
            refreshList();
        } catch (Exception e) {
            message = "Error deleting offence: " + e.getMessage();
            messageClass = "error";
            LOGGER.log(Level.SEVERE, "Error deleting offence", e);
        }
        return null;
    }

    private void clearMessage() {
        message = null;
        messageClass = null;
    }
}
