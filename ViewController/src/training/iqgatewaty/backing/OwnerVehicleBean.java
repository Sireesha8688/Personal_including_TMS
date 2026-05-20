package training.iqgatewaty.backing;

import java.io.Serializable;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmVehicledetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class OwnerVehicleBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String vehicleNo;
    private TmOwnerdetails ownerDetails;
    private TmVehicledetails vehicleDetails;
    private String message;

    private ClerkSessionEJBLocal clerkSession;

    public OwnerVehicleBean() {
        try {
            Context ctx = new InitialContext();
            clerkSession = (ClerkSessionEJBLocal) ctx.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
        } catch (NamingException e) {
            e.printStackTrace();
            message = "Error initializing service: " + e.getMessage();
        }
    }

    public void viewOwnerDetails() {
        clearDetails();
        if (vehicleNo == null || vehicleNo.trim().isEmpty()) {
            message = "Please enter a vehicle number.";
            return;
        }
        TmRegdetails reg = clerkSession.findByVehicleNumber(vehicleNo);
        if (reg != null && reg.getTmOwnerdetails() != null) {
            ownerDetails = reg.getTmOwnerdetails();
            message = null;
        } else {
            message = "Owner details not found for vehicle number: " + vehicleNo;
        }
    }

    public void viewVehicleDetails() {
        clearDetails();
        if (vehicleNo == null || vehicleNo.trim().isEmpty()) {
            message = "Please enter a vehicle number.";
            return;
        }
        TmRegdetails reg = clerkSession.findByVehicleNumber(vehicleNo);
        if (reg != null && reg.getTmVehicledetails() != null) {
            vehicleDetails = reg.getTmVehicledetails();
            message = null;
        } else {
            message = "Vehicle details not found for vehicle number: " + vehicleNo;
        }
    }

    private void clearDetails() {
        ownerDetails = null;
        vehicleDetails = null;
        message = null;
    }

    // Getters and setters

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public TmOwnerdetails getOwnerDetails() {
        return ownerDetails;
    }

    public TmVehicledetails getVehicleDetails() {
        return vehicleDetails;
    }

    public String getMessage() {
        return message;
    }
}
