package training.iqgatewaty.backing;

import java.io.Serializable;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmVehicledetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class VehicleDetailsBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String vehicleNo;
    private TmVehicledetails vehicleDetails;
    private String message;

    private ClerkSessionEJBLocal clerkSession;

    public VehicleDetailsBean() {
        try {
            Context ctx = new InitialContext();
            clerkSession = (ClerkSessionEJBLocal) ctx.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
        } catch (NamingException e) {
            e.printStackTrace();
            message = "Error initializing service: " + e.getMessage();
        }
    }

    public void fetchVehicleDetails() {
        try {
            TmRegdetails reg = clerkSession.findByVehicleNumber(vehicleNo);
            if (reg != null && reg.getTmVehicledetails() != null) {
                vehicleDetails = reg.getTmVehicledetails();
                message = null;
            } else {
                message = "Vehicle details not found for vehicle number: " + vehicleNo;
            }
        } catch (Exception e) {
            message = "Error fetching vehicle details: " + e.getMessage();
            e.printStackTrace();
        }
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public TmVehicledetails getVehicleDetails() {
        return vehicleDetails;
    }

    public String getMessage() {
        return message;
    }
}
