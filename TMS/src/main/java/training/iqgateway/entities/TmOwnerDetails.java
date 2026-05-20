package training.iqgateway.entities;

import java.util.Date;
import java.util.List;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "TM_OWNERDETAILS")
public class TmOwnerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "owner_seq")
    @SequenceGenerator(name = "owner_seq", sequenceName = "TM_OWNER_ID_SEQ", allocationSize = 1)
    @Column(name = "OWNER_ID")
    private Long ownerId;

    @Column(name = "FNAME", nullable = false)
    private String fname;

    @Column(name = "LNAME", nullable = false)
    private String lname;

    @Column(name = "DATEOFBIRTH", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(name = "LANDLINE_NO")
    private String landlineNo;

    @Column(name = "MOBILE_NO")
    private String mobileNo;

    @Column(name = "GENDER", nullable = false)
    private String gender;

    @Column(name = "TEMP_ADDR")
    private String tempAddr;

    @Column(name = "PERM_ADDR", nullable = false)
    private String permAddr;

    @Column(name = "PINCODE", nullable = false)
    private Integer pincode;

    @Column(name = "OCCUPATION")
    private String occupation;

    @Column(name = "PANCARD_NO", nullable = false)
    private String pancardNo;

    @Column(name = "ADD_PROOF_NAME", nullable = false)
    private String addProofName;

    @OneToMany(mappedBy = "owner")
    @JsonManagedReference(value = "owner-registrations")
    private List<TmRegDetails> registrations;

    public TmOwnerDetails() {}

    public TmOwnerDetails(String fname, String lname, Date dateOfBirth, String landlineNo, String mobileNo,
                          String gender, String tempAddr, String permAddr, Integer pincode, String occupation, String pancardNo,
                          String addProofName) {
        this.fname = fname;
        this.lname = lname;
        this.dateOfBirth = dateOfBirth;
        this.landlineNo = landlineNo;
        this.mobileNo = mobileNo;
        this.gender = gender;
        this.tempAddr = tempAddr;
        this.permAddr = permAddr;
        this.pincode = pincode;
        this.occupation = occupation;
        this.pancardNo = pancardNo;
        this.addProofName = addProofName;
    }

    public TmOwnerDetails(Long ownerId, String fname, String lname, Date dateOfBirth, String landlineNo,
                          String mobileNo, String gender, String tempAddr, String permAddr, Integer pincode,
                          String occupation, String pancardNo, String addProofName) {
        this.ownerId = ownerId;
        this.fname = fname;
        this.lname = lname;
        this.dateOfBirth = dateOfBirth;
        this.landlineNo = landlineNo;
        this.mobileNo = mobileNo;
        this.gender = gender;
        this.tempAddr = tempAddr;
        this.permAddr = permAddr;
        this.pincode = pincode;
        this.occupation = occupation;
        this.pancardNo = pancardNo;
        this.addProofName = addProofName;
    }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }
    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }
    public Date getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(Date dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getLandlineNo() { return landlineNo; }
    public void setLandlineNo(String landlineNo) { this.landlineNo = landlineNo; }
    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getTempAddr() { return tempAddr; }
    public void setTempAddr(String tempAddr) { this.tempAddr = tempAddr; }
    public String getPermAddr() { return permAddr; }
    public void setPermAddr(String permAddr) { this.permAddr = permAddr; }
    public Integer getPincode() { return pincode; }
    public void setPincode(Integer pincode) { this.pincode = pincode; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getPancardNo() { return pancardNo; }
    public void setPancardNo(String pancardNo) { this.pancardNo = pancardNo; }
    public String getAddProofName() { return addProofName; }
    public void setAddProofName(String addProofName) { this.addProofName = addProofName; }
    public List<TmRegDetails> getRegistrations() { return registrations; }
    public void setRegistrations(List<TmRegDetails> registrations) { this.registrations = registrations; }

    @Override
    public String toString() {
        return "TmOwnerDetails [ownerId=" + ownerId + ", fname=" + fname + ", lname=" + lname +
                ", dateOfBirth=" + dateOfBirth + ", landlineNo=" + landlineNo + ", mobileNo=" + mobileNo +
                ", gender=" + gender + ", tempAddr=" + tempAddr + ", permAddr=" + permAddr +
                ", pincode=" + pincode + ", occupation=" + occupation + ", pancardNo=" + pancardNo +
                ", addProofName=" + addProofName + "]";
    }
}
