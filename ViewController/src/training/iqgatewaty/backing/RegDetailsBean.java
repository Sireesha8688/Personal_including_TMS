package training.iqgatewaty.backing;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import javax.faces.model.SelectItem;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.entities.TmVehicledetails;
import training.iqgateway.services.RTOSessionEJBLocal;

public class RegDetailsBean implements Serializable {

    // Removed appNo field since it's DB generated
    private String vehNo;
    private Date dateOfPurchase;
    private String distrubuterName;
    private Long selectedOwnerId;
    private Long selectedVehId;

    private List<TmOwnerdetails> ownerList;
    private List<TmVehicledetails> vehicleList;

    private List<SelectItem> ownerSelectItems;
    private List<SelectItem> vehicleSelectItems;

    private String message;

    // Getters and setters
    public String getVehNo() { return vehNo; }
    public void setVehNo(String vehNo) { this.vehNo = vehNo; }

    public Date getDateOfPurchase() { return dateOfPurchase; }
    public void setDateOfPurchase(Date dateOfPurchase) { this.dateOfPurchase = dateOfPurchase; }

    public String getDistrubuterName() { return distrubuterName; }
    public void setDistrubuterName(String distrubuterName) { this.distrubuterName = distrubuterName; }

    public Long getSelectedOwnerId() { return selectedOwnerId; }
    public void setSelectedOwnerId(Long selectedOwnerId) { this.selectedOwnerId = selectedOwnerId; }

    public Long getSelectedVehId() { return selectedVehId; }
    public void setSelectedVehId(Long selectedVehId) { this.selectedVehId = selectedVehId; }

    public List<SelectItem> getOwnerSelectItems() {
        if (ownerSelectItems == null) {
            ownerSelectItems = new ArrayList<SelectItem>();
            loadOwners();
        }
        return ownerSelectItems;
    }

    public List<SelectItem> getVehicleSelectItems() {
        if (vehicleSelectItems == null) {
            vehicleSelectItems = new ArrayList<SelectItem>();
            loadVehicles();
        }
        return vehicleSelectItems;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    private RTOSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (RTOSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/RTOSessionEJB");
    }

    private void loadOwners() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();
            ownerList = sessionBean.getTmOwnerdetailsFindAll();
            ownerSelectItems.clear();
            for (TmOwnerdetails o : ownerList) {
                ownerSelectItems.add(new SelectItem(o.getOwnerId(), o.getFname() + " " + o.getLname() + " (ID: " + o.getOwnerId() + ")"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void loadVehicles() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();
            vehicleList = sessionBean.getTmVehicledetailsFindAll();
            vehicleSelectItems.clear();
            for (TmVehicledetails v : vehicleList) {
                vehicleSelectItems.add(new SelectItem(v.getVehId(), v.getVehName() + " (ID: " + v.getVehId() + ")"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String register() {
        try {
            // Validate vehicle number format: e.g. KR75EF203
            String vehicleNoPattern = "^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$";
            Pattern pattern = Pattern.compile(vehicleNoPattern);
            Matcher matcher = pattern.matcher(vehNo);

            if (!matcher.matches()) {
                message = "Invalid Vehicle Number format. It must be like KR75EF203.";
                return null; // Stay on the same page
            }

            RTOSessionEJBLocal sessionBean = getSessionBean();

            // Find Owner and Vehicle by selected IDs
            TmOwnerdetails owner = null;
            TmVehicledetails vehicle = null;

            for (TmOwnerdetails o : ownerList) {
                if (o.getOwnerId().equals(selectedOwnerId)) {
                    owner = o;
                    break;
                }
            }
            for (TmVehicledetails v : vehicleList) {
                if (v.getVehId().equals(selectedVehId)) {
                    vehicle = v;
                    break;
                }
            }

            if (owner == null || vehicle == null) {
                message = "Please select valid Owner and Vehicle.";
                return null;
            }

            TmRegdetails reg = new TmRegdetails();
            // Do NOT set appNo; DB will generate via sequence
            reg.setVehNo(vehNo);
            reg.setDateOfPurchase(new Timestamp(dateOfPurchase.getTime()));
            reg.setDistrubuterName(distrubuterName);
            reg.setTmOwnerdetails(owner);
            reg.setTmVehicledetails(vehicle);

            sessionBean.persistTmRegdetails(reg);

            message = "Registration details saved successfully!";
            clearFields();

        } catch (Exception e) {
            message = "Error saving registration details: " + e.getMessage();
            e.printStackTrace();
        }
        return null;
    }

    private void clearFields() {
        vehNo = null;
        dateOfPurchase = null;
        distrubuterName = null;
        selectedOwnerId = null;
        selectedVehId = null;
    }
}
