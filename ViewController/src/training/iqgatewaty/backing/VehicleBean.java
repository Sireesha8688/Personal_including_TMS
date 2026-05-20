package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmVehicledetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class VehicleBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<TmVehicledetails> vehicles;
    private Long selectedVehId;
    private String message;

    public ClerkSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        Object lookupObject = ic.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
        return (ClerkSessionEJBLocal) lookupObject;
    }

    public List<TmVehicledetails> getVehicles() {
        if (vehicles == null) {
            refreshVehicles();
        }
        return vehicles;
    }

    public Long getSelectedVehId() {
        return selectedVehId;
    }

    public void setSelectedVehId(Long selectedVehId) {
        this.selectedVehId = selectedVehId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private void refreshVehicles() {
        try {
            vehicles = getSessionBean().getTmVehicledetailsFindAll();
        } catch (Exception e) {
            vehicles = new ArrayList<TmVehicledetails>();
            message = "Error loading vehicles: " + e.getMessage();
        }
    }

    public String deleteVehicle() {
        if (selectedVehId == null) {
            message = "No vehicle selected for deletion.";
            return null;
        }
        try {
            ClerkSessionEJBLocal sessionBean = getSessionBean();
            TmVehicledetails vehicle = sessionBean.findTmVehicledetailsById(selectedVehId);
            if (vehicle != null) {
                sessionBean.removeTmVehicledetails(vehicle);
                message = "Vehicle deleted successfully!";
                refreshVehicles(); // Reload the list after deletion
            } else {
                message = "Vehicle not found.";
            }
        } catch (Exception e) {
            message = "Error deleting vehicle: " + e.getMessage();
        }
        return null; // Stay on the same page
    }
}
