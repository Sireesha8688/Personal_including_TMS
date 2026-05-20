package training.iqgatewaty.backing;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.entities.TmUsermaster;
import training.iqgateway.services.ClerkSessionEJBLocal;

public class AddOffenceBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<TmOffence> offenceList;
    private List<SelectItem> offenceSelectItems;

    private Long selectedOffenceId;
    private String vehicleNo;
    private String place;
    private Date time = new Date(); 

    private ClerkSessionEJBLocal sessionBean;

    public AddOffenceBean() {
        try {
            InitialContext ic = new InitialContext();
            Object lookup = ic.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
            sessionBean = (ClerkSessionEJBLocal) lookup;
            loadOffences();
        } catch (NamingException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    public void loadOffences() {
        try {
            offenceList = (List<TmOffence>) sessionBean.queryByRange("SELECT o FROM TmOffence o", 0, 0);
            offenceSelectItems = new ArrayList<SelectItem>();

            offenceSelectItems.add(new SelectItem("", "-- Select Offence --"));
            if (offenceList != null) {
                for (TmOffence offence : offenceList) {
                    offenceSelectItems.add(new SelectItem(offence.getOffenceId(), offence.getOffenceType()));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error loading offences", e.getMessage()));
        }
    }

    public String addOffenceDetail() {
        FacesContext context = FacesContext.getCurrentInstance();

        Map<String, Object> sessionMap = context.getExternalContext().getSessionMap();
        Login loginBean = (Login) sessionMap.get("loginBean");
        if (loginBean == null || loginBean.getUsername() == null) {
            context.addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR,
                "User session expired. Please login again.", null));
            return "login"; 
        }
        String loggedInUsername = loginBean.getUsername();

        try {
            if (selectedOffenceId == null || selectedOffenceId == 0L ||
                vehicleNo == null || vehicleNo.trim().isEmpty() ||
                place == null || place.trim().isEmpty() ||
                time == null) {
                context.addMessage(null, new FacesMessage(FacesMessage.SEVERITY_WARN,
                    "Please fill all required fields.", null));
                return null;
            }

            TmOffence offence = sessionBean.findTmOffenceById(selectedOffenceId);
            TmRegdetails reg = sessionBean.findByVehicleNumber(vehicleNo);
            TmUsermaster user = sessionBean.findTmUsermasterByUsername(loggedInUsername);

            if (offence == null) {
                context.addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR,
                    "Selected offence type not found.", null));
                return null;
            }
            if (reg == null) {
                context.addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR,
                    "Vehicle number not found.", null));
                return null;
            }
            if (user == null) {
                context.addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR,
                    "Reporting user not found.", null));
                return null;
            }

            TmOffenceDetails newOffenceDetail = new TmOffenceDetails();
            newOffenceDetail.setTmOffence(offence);
            newOffenceDetail.setTmRegdetails(reg);
            newOffenceDetail.setTmUsermaster(user);
            newOffenceDetail.setOffenceStatus("pending");
            newOffenceDetail.setPlace(place);
            newOffenceDetail.setTime(new Timestamp(time.getTime()));

            sessionBean.persistTmOffenceDetails(newOffenceDetail);

            context.addMessage(null, new FacesMessage(FacesMessage.SEVERITY_INFO,
                "Offence detail added successfully!", null));

            reset();

        } catch (Exception e) {
            e.printStackTrace();
            context.addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR,
                "Error adding offence detail: " + e.getMessage(), null));
        }
        return null;
    }

    public void reset() {
        selectedOffenceId = null;
        vehicleNo = null;
        place = null;
        time = new Date();
    }


    public List<SelectItem> getOffenceSelectItems() {
        return offenceSelectItems;
    }

    public void setOffenceSelectItems(List<SelectItem> offenceSelectItems) {
        this.offenceSelectItems = offenceSelectItems;
    }

    public Long getSelectedOffenceId() {
        return selectedOffenceId;
    }

    public void setSelectedOffenceId(Long selectedOffenceId) {
        this.selectedOffenceId = selectedOffenceId;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
