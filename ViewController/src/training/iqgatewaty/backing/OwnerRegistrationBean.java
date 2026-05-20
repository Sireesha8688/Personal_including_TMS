package training.iqgatewaty.backing;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.services.RTOSessionEJBLocal;

public class OwnerRegistrationBean implements Serializable {

    private String addProofName;
    private Date dateofbirth;
    private String fname;
    private String gender; 
    private String landlineNo;
    private String lname;
    private String mobileNo;
    private String occupation;
    private String pancardNo;
    private String permAddr;
    private Long pincode;
    private String tempAddr;
    private String message;

    // Getters and setters for all fields except ownerId
    public String getAddProofName() { return addProofName; }
    public void setAddProofName(String addProofName) { this.addProofName = addProofName; }

    public Date getDateofbirth() { return dateofbirth; }
    public void setDateofbirth(Date dateofbirth) { this.dateofbirth = dateofbirth; }

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

    public String getPancardNo() { return pancardNo; }
    public void setPancardNo(String pancardNo) { this.pancardNo = pancardNo; }

    public String getPermAddr() { return permAddr; }
    public void setPermAddr(String permAddr) { this.permAddr = permAddr; }

    public Long getPincode() { return pincode; }
    public void setPincode(Long pincode) { this.pincode = pincode; }

    public String getTempAddr() { return tempAddr; }
    public void setTempAddr(String tempAddr) { this.tempAddr = tempAddr; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    private RTOSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (RTOSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/RTOSessionEJB");
    }

    public String registerOwner() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();

            // Create owner entity WITHOUT setting ownerId
            TmOwnerdetails owner = new TmOwnerdetails();

            owner.setAddProofName(addProofName);
            owner.setDateofbirth(new Timestamp(dateofbirth.getTime()));
            owner.setFname(fname);
            owner.setGender(gender);
            owner.setLandlineNo(landlineNo);
            owner.setLname(lname);
            owner.setMobileNo(mobileNo);
            owner.setOccupation(occupation);
            owner.setPancardNo(pancardNo);
            owner.setPermAddr(permAddr);
            owner.setPincode(pincode);
            owner.setTempAddr(tempAddr);

            sessionBean.persistTmOwnerdetails(owner);

            // After persist, ownerId should be generated and set
            //Long generatedOwnerId = owner.getOwnerId();

            message = "Owner registered successfully ";
            clearFields();

        } catch (Exception e) {
            message = "Error registering owner: " + e.getMessage();
            e.printStackTrace();
        }
        return null;
    }

    private void clearFields() {
        addProofName = null;
        dateofbirth = null;
        fname = null;
        gender = null;
        landlineNo = null;
        lname = null;
        mobileNo = null;
        occupation = null;
        pancardNo = null;
        permAddr = null;
        pincode = null;
        tempAddr = null;
    }
}
