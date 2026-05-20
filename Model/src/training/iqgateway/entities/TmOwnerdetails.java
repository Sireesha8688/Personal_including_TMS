package training.iqgateway.entities;

import java.io.Serializable;

import java.sql.Timestamp;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@NamedQueries({
  @NamedQuery(name = "TmOwnerdetails.findAll", query = "select o from TmOwnerdetails o")
})
@Table(name = "TM_OWNERDETAILS")
public class TmOwnerdetails implements Serializable {
    @Column(name="ADD_PROOF_NAME", nullable = false, length = 20)
    private String addProofName;
    @Column(nullable = false)
    private Timestamp dateofbirth;
    @Column(nullable = false, length = 50)
    private String fname;
    @Column(nullable = false)
    private String gender;
    @Column(name="LANDLINE_NO", length = 20)
    private String landlineNo;
    @Column(nullable = false, length = 50)
    private String lname;
    @Column(name="MOBILE_NO", length = 15)
    private String mobileNo;
    @Column(length = 200)
    private String occupation;
    @Id
    @Column(name="OWNER_ID", nullable = false)
    private Long ownerId;
    @Column(name="PANCARD_NO", nullable = false, length = 20)
    private String pancardNo;
    @Column(name="PERM_ADDR", nullable = false, length = 200)
    private String permAddr;
    @Column(nullable = false)
    private Long pincode;
    @Column(name="TEMP_ADDR", length = 200)
    private String tempAddr;
    @OneToMany(mappedBy = "tmOwnerdetails")
    private List<TmRegdetails> tmRegdetailsList;

    public TmOwnerdetails() {
    }

    public TmOwnerdetails(String addProofName, Timestamp dateofbirth,
                          String fname, String gender, String landlineNo,
                          String lname, String mobileNo, String occupation,
                          Long ownerId, String pancardNo, String permAddr,
                          Long pincode, String tempAddr) {
        this.addProofName = addProofName;
        this.dateofbirth = dateofbirth;
        this.fname = fname;
        this.gender = gender;
        this.landlineNo = landlineNo;
        this.lname = lname;
        this.mobileNo = mobileNo;
        this.occupation = occupation;
        this.ownerId = ownerId;
        this.pancardNo = pancardNo;
        this.permAddr = permAddr;
        this.pincode = pincode;
        this.tempAddr = tempAddr;
    }

    public String getAddProofName() {
        return addProofName;
    }

    public void setAddProofName(String addProofName) {
        this.addProofName = addProofName;
    }

    public Timestamp getDateofbirth() {
        return dateofbirth;
    }

    public void setDateofbirth(Timestamp dateofbirth) {
        this.dateofbirth = dateofbirth;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLandlineNo() {
        return landlineNo;
    }

    public void setLandlineNo(String landlineNo) {
        this.landlineNo = landlineNo;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getPancardNo() {
        return pancardNo;
    }

    public void setPancardNo(String pancardNo) {
        this.pancardNo = pancardNo;
    }

    public String getPermAddr() {
        return permAddr;
    }

    public void setPermAddr(String permAddr) {
        this.permAddr = permAddr;
    }

    public Long getPincode() {
        return pincode;
    }

    public void setPincode(Long pincode) {
        this.pincode = pincode;
    }

    public String getTempAddr() {
        return tempAddr;
    }

    public void setTempAddr(String tempAddr) {
        this.tempAddr = tempAddr;
    }

    public List<TmRegdetails> getTmRegdetailsList() {
        return tmRegdetailsList;
    }

    public void setTmRegdetailsList(List<TmRegdetails> tmRegdetailsList) {
        this.tmRegdetailsList = tmRegdetailsList;
    }

    public TmRegdetails addTmRegdetails(TmRegdetails tmRegdetails) {
        getTmRegdetailsList().add(tmRegdetails);
        tmRegdetails.setTmOwnerdetails(this);
        return tmRegdetails;
    }

    public TmRegdetails removeTmRegdetails(TmRegdetails tmRegdetails) {
        getTmRegdetailsList().remove(tmRegdetails);
        tmRegdetails.setTmOwnerdetails(null);
        return tmRegdetails;
    }
}
