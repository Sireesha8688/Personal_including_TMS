package training.iqgatewaty.backing;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class OwnerBean implements Serializable {
    private static final long serialVersionUID = 1L;

    // Owner details (not used in table, but kept for compatibility)
    private String addProofName;
    private Timestamp dateofbirth;
    private String fname;
    private String gender;
    private String landlineNo;
    private String lname;
    private String mobileNo;
    private String occupation;
    private Long ownerId;
    private String pancardNo;
    private String permAddr;
    private Long pincode;
    private String tempAddr;
    private TmRegdetails tmRegdetails;

    // Owner list for table
    private List<TmOwnerdetails> owner;
    // Selected owner ID for deletion
    private Long selectedOwnerId;
    // Status message
    private String message;

    // EJB session bean
    public ClerkSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        Object lookupObject = ic.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
        return (ClerkSessionEJBLocal) lookupObject;
    }

    // Getters and setters for owner list and selected ID
    public List<TmOwnerdetails> getowner() {
        if (owner == null) {
            refreshRoles();
        }
        return owner;
    }

    public Long getSelectedOwnerId() {
        return selectedOwnerId;
    }

    public void setSelectedOwnerId(Long selectedOwnerId) {
        this.selectedOwnerId = selectedOwnerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Delete owner action
    public String deleteOwner() {
        if (selectedOwnerId == null) {
            message = "No owner selected for deletion.";
            return null;
        }
        try {
            ClerkSessionEJBLocal sessionBean = getSessionBean();
            TmOwnerdetails ownerToDelete = sessionBean.findTmOwnerdetailsById(selectedOwnerId);
            if (ownerToDelete != null) {
                sessionBean.removeTmOwnerdetails(ownerToDelete);
                message = "Owner deleted successfully!";
                refreshRoles(); // Reload the list after deletion
            } else {
                message = "Owner not found.";
            }
        } catch (Exception e) {
            message = "Error deleting owner: " + e.getMessage();
        }
        return null; // Stay on the same page
    }

    // Refresh owner list
    private void refreshRoles() {
        try {
            owner = getSessionBean().getTmOwnerdetailsFindAll();
        } catch (Exception e) {
            owner = new ArrayList<TmOwnerdetails>();
            message = "Error loading owners: " + e.getMessage();
        }
    }

    // Other getters and setters (for form compatibility)
    // ... [your existing getters/setters for addProofName, dateofbirth, etc.] ...

    public String getAddProofName() { return addProofName; }
    public void setAddProofName(String addProofName) { this.addProofName = addProofName; }
    public Timestamp getDateofbirth() { return dateofbirth; }
    public void setDateofbirth(Timestamp dateofbirth) { this.dateofbirth = dateofbirth; }
    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getLandlineNo() { return landlineNo; }
    public void setLandlineNo(String landlineNo) { this.landlineNo = landlineNo; }
    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }
    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getPancardNo() { return pancardNo; }
    public void setPancardNo(String pancardNo) { this.pancardNo = pancardNo; }
    public String getPermAddr() { return permAddr; }
    public void setPermAddr(String permAddr) { this.permAddr = permAddr; }
    public Long getPincode() { return pincode; }
    public void setPincode(Long pincode) { this.pincode = pincode; }
    public String getTempAddr() { return tempAddr; }
    public void setTempAddr(String tempAddr) { this.tempAddr = tempAddr; }
    public TmRegdetails getTmRegdetails() { return tmRegdetails; }
    public void setTmRegdetails(TmRegdetails tmRegdetails) { this.tmRegdetails = tmRegdetails; }
}
