package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.List;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class OffenceDetailsBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String vehicleNo;
    private List<TmOffenceDetails> offences;
    private String message;

    private ClerkSessionEJBLocal clerkSession;

    public OffenceDetailsBean() {
        try {
            Context ctx = new InitialContext();
            clerkSession = (ClerkSessionEJBLocal) ctx.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
        } catch (NamingException e) {
            e.printStackTrace();
            message = "Error initializing service: " + e.getMessage();
        }
    }

    public void fetchOffences() {
        try {
            TmRegdetails reg = clerkSession.findByVehicleNumber(vehicleNo);
            if (reg != null && reg.getTmOffenceDetailsList() != null && !reg.getTmOffenceDetailsList().isEmpty()) {
                offences = reg.getTmOffenceDetailsList();
                message = null;
            } else {
                message = "No offences are not found for vehicle number: " + vehicleNo;
                offences = null;
            }
        } catch (Exception e) {
            message = "Error fetching offence details: " + e.getMessage();
            offences = null;
            e.printStackTrace();
        }
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public List<TmOffenceDetails> getOffences() {
        return offences;
    }

    public String getMessage() {
        return message;
    }
}
