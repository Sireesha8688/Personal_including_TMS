package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.List;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class ClearOffenceBean implements Serializable {

    private List<TmOffenceDetails> pendingOffences;
    private TmOffenceDetails selectedOffence;

    public List<TmOffenceDetails> getPendingOffences() {
        if (pendingOffences == null) {
            loadPendingOffences();
        }
        return pendingOffences;
    }

    public void setPendingOffences(List<TmOffenceDetails> pendingOffences) {
        this.pendingOffences = pendingOffences;
    }

    public TmOffenceDetails getSelectedOffence() {
        return selectedOffence;
    }

    public void setSelectedOffence(TmOffenceDetails selectedOffence) {
        this.selectedOffence = selectedOffence;
    }

    private ClerkSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (ClerkSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
    }

    @SuppressWarnings("unchecked")
    public void loadPendingOffences() {
        try {
            ClerkSessionEJBLocal sessionBean = getSessionBean();
            pendingOffences = (List<TmOffenceDetails>) sessionBean.queryByRange(
                "SELECT o FROM TmOffenceDetails o WHERE LOWER(o.offenceStatus) = 'pending'", 0, 0);
        } catch (Exception e) {
            e.printStackTrace();
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error loading offences", e.getMessage()));
        }
    }

    public String clearOffence() {
        if (selectedOffence == null) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_WARN, "No offence selected", null));
            return null;
        }
        try {
            ClerkSessionEJBLocal sessionBean = getSessionBean();
            // Remove offence record
            sessionBean.removeTmOffenceDetails(selectedOffence);

            // Alternatively, to mark as cleared instead of deleting:
            // selectedOffence.setOffenceStatus("cleared");
            // sessionBean.mergeTmOffenceDetails(selectedOffence);

            // Refresh list
            loadPendingOffences();

            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_INFO, "Offence cleared successfully", null));
        } catch (Exception e) {
            e.printStackTrace();
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error clearing offence", e.getMessage()));
        }
        return null; // Stay on the same page
    }
}
