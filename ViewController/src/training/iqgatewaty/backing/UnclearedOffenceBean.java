package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class UnclearedOffenceBean implements Serializable {

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
                "SELECT o FROM TmOffenceDetails o WHERE o.offenceStatus = 'pending'", 0, 0);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String selectOffence() {
        // selectedOffence is set by f:setPropertyActionListener
        return null; // stay on the same page
    }
}
