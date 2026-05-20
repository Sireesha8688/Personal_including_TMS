package training.iqgateway.backing;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class ClearOffenceBean1 implements Serializable {

    private static final long serialVersionUID = 1L;

    private String vehicleNumber;
    private List<TmOffenceDetails> pendingOffences;
    private TmOffenceDetails selectedOffence;
    private String message;
    private String messageClass; // "info" or "error"

    private ClerkSessionEJBLocal sessionBean;

    public ClearOffenceBean1() {
        try {
            InitialContext ic = new InitialContext();
            sessionBean = (ClerkSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
        } catch (NamingException e) {
            message = "Failed to initialize session bean: " + e.getMessage();
            messageClass = "error";
            e.printStackTrace();
        }
    }

    public void searchPendingOffences() {
        if (vehicleNumber == null || vehicleNumber.trim().isEmpty()) {
            message = "Please enter a vehicle number.";
            messageClass = "error";
            pendingOffences = Collections.emptyList();
            return;
        }
        try {
            String vehNo = vehicleNumber.trim().toLowerCase();
            TmRegdetails reg = sessionBean.findByVehicleNumber(vehNo);
            if (reg == null) {
                message = "Vehicle number not found: " + vehicleNumber.trim();
                messageClass = "info";
                pendingOffences = Collections.emptyList();
                return;
            }

            List<TmOffenceDetails> allOffences = reg.getTmOffenceDetailsList();
            if (allOffences == null || allOffences.isEmpty()) {
                message = "No offences found for vehicle number: " + vehicleNumber.trim();
                messageClass = "info";
                pendingOffences = Collections.emptyList();
                return;
            }

            // Filter offences with status starting with "pend" (case-insensitive)
            pendingOffences = new ArrayList<TmOffenceDetails>();
            for (TmOffenceDetails o : allOffences) {
                String status = o.getOffenceStatus();
                if (status != null && status.trim().toLowerCase().startsWith("pend")) {
                    pendingOffences.add(o);
                }
            }

            if (pendingOffences.isEmpty()) {
                message = "No pending offences found for vehicle number: " + vehicleNumber.trim();
                messageClass = "info";
            } else {
                message = null;
                messageClass = null;
            }

            // Debug output
            System.out.println("Pending offences count: " + pendingOffences.size());
            for (TmOffenceDetails od : pendingOffences) {
                System.out.println("Offence ID: " + od.getOffenceDetailId() + ", Status: " + od.getOffenceStatus());
            }

        } catch (Exception e) {
            message = "Error fetching pending offences: " + e.getMessage();
            messageClass = "error";
            pendingOffences = Collections.emptyList();
            e.printStackTrace();
        }
    }

    public void clearOffence() {
        if (selectedOffence == null) {
            message = "No offence selected.";
            messageClass = "error";
            return;
        }
        try {
            sessionBean.removeTmOffenceDetails(selectedOffence);
            message = "Offence cleared successfully.";
            messageClass = "info";
            searchPendingOffences(); // Refresh list
        } catch (Exception e) {
            message = "Error clearing offence: " + e.getMessage();
            messageClass = "error";
            e.printStackTrace();
        }
    }

    // Getters and setters

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public List<TmOffenceDetails> getPendingOffences() {
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

    public String getMessage() {
        return message;
    }

    public String getMessageClass() {
        return messageClass;
    }
}
