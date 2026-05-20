package training.iqgatewaty.backing;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date; // Still importing Date, as FacesMessage, etc. might use it. TmOwnerdetails handles Timestamp.
import java.util.List;
import java.util.Iterator;
import java.sql.Timestamp; // Import Timestamp for potential internal use if needed, though not strictly required for this scenario with JSF converter.

import javax.annotation.PostConstruct;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import javax.ejb.EJB;

import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.entities.TmVehicledetails;
import training.iqgateway.services.ClerkSessionEJBLocal;
import training.iqgateway.services.RTOSessionEJBLocal;

public class TransferVehicleBean implements Serializable {

    private static final long serialVersionUID = 1L;

    private String vehicleNumber;
    private TmOwnerdetails currentOwner;
    private TmVehicledetails currentVehicle;
    private String transferDate; // Consider changing this to java.util.Date if it represents a date
    private Long selectedNewOwnerId;
    private List<SelectItem> ownerSelectItems;
    private boolean newOwnerOwnsVehicle;
    private String newOwnerVehicleNumber;
    private TmOwnerdetails newOwnerDetails;
    private List<TmOffenceDetails> pendingOffenses;
    private String offensesMessage;

    private double totalPenalty;
    private boolean showClearConfirmation;

    @EJB
    private RTOSessionEJBLocal rtoSessionEJB;

    @EJB
    private ClerkSessionEJBLocal clerkSessionEJB;

    private TmRegdetails currentApplication;

    public TmRegdetails getCurrentApplication() {
        return currentApplication;
    }

    public void setCurrentApplication(TmRegdetails currentApplication) {
        this.currentApplication = currentApplication;
    }

    /**
     * Lazily initializes and returns the RTOSessionEJBLocal.
     * This method is used to look up the EJB if it hasn't been injected or initialized yet.
     * @return An instance of RTOSessionEJBLocal.
     * @throws RuntimeException if the EJB lookup fails.
     */
    private RTOSessionEJBLocal getRtoSessionBean() {
        if (rtoSessionEJB == null) {
            try {
                // Ensure this JNDI name matches your EJB deployment descriptor or configuration
                InitialContext ic = new InitialContext();
                rtoSessionEJB = (RTOSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/RtoSessionEJB");
            } catch (NamingException e) {
                System.err.println("ERROR: RtoSessionEJB lookup failed: " + e.getMessage());
                throw new RuntimeException("RtoSessionEJB lookup failed", e);
            }
        }
        return rtoSessionEJB;
    }

    /**
     * Lazily initializes and returns the ClerkSessionEJBLocal.
     * This method is used to look up the EJB if it hasn't been injected or initialized yet.
     * @return An instance of ClerkSessionEJBLocal.
     * @throws RuntimeException if the EJB lookup fails.
     */
    private ClerkSessionEJBLocal getClerkSessionBean() {
        if (clerkSessionEJB == null) {
            try {
                // Ensure this JNDI name matches your EJB deployment descriptor or configuration
                InitialContext ic = new InitialContext();
                clerkSessionEJB = (ClerkSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/ClerkSessionEJB");
            } catch (NamingException e) {
                System.err.println("ERROR: ClerkSessionEJB lookup failed: " + e.getMessage());
                throw new RuntimeException("ClerkSessionEJB lookup failed", e);
            }
        }
        return clerkSessionEJB;
    }

    /**
     * Post-construct initialization method.
     * Initializes bean properties and loads owner select items for dropdowns.
     */
    @PostConstruct
    public void init() {
        currentOwner = new TmOwnerdetails();
        currentVehicle = new TmVehicledetails(); // Initialize currentVehicle
        newOwnerDetails = new TmOwnerdetails();
        pendingOffenses = new ArrayList(); // Use diamond operator for cleaner code
        offensesMessage = null;
        totalPenalty = 0.0;
        showClearConfirmation = false;
        loadOwnerSelectItems();
    }

    /**
     * Loads all owner details into a list of SelectItem for use in UI dropdowns.
     * Displays an error message if loading fails.
     */
    private void loadOwnerSelectItems() {
        try {
            // Assuming getTmOwnerdetailsFindAll() returns List<TmOwnerdetails>
            List<TmOwnerdetails> owners = getRtoSessionBean().getTmOwnerdetailsFindAll();
            ownerSelectItems = new ArrayList();
            for (TmOwnerdetails o : owners) {
                ownerSelectItems.add(
                    new SelectItem(o.getOwnerId(), o.getFname() + " " + o.getLname() + " (" + o.getOwnerId() + ")")
                );
            }
        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error loading owners for dropdown: " + e.getMessage(), null));
            ownerSelectItems = new ArrayList();
            e.printStackTrace();
        }
    }

    /**
     * Checks for pending offenses associated with the current vehicle number.
     * Populates the pendingOffenses list and calculates total penalty.
     * @return "success" if pending offenses are found, otherwise null.
     */
    public String checkOffenses() {
        System.out.println("DEBUG (TransferVehicleBean): checkOffenses called for vehicleNumber: " + vehicleNumber);

        offensesMessage = null;
        pendingOffenses.clear();
        totalPenalty = 0.0;
        showClearConfirmation = false;

        if (currentVehicle == null || currentVehicle.getVehId() == null || vehicleNumber == null || vehicleNumber.trim().isEmpty()) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_WARN, "Please search for a vehicle first to check offenses.", null));
            return null;
        }

        try {
            // Assuming findPendingOffencesByVehicleNo returns List<TmOffenceDetails>
            List<TmOffenceDetails> allOffensesForVehicle = getClerkSessionBean().findPendingOffencesByVehicleNo(vehicleNumber.trim());
            System.out.println("DEBUG (TransferVehicleBean): findPendingOffencesByVehicleNo returned " + (allOffensesForVehicle != null ? allOffensesForVehicle.size() : 0) + " total offenses for " + vehicleNumber);

            if (allOffensesForVehicle == null) {
                allOffensesForVehicle = new ArrayList();
            }

            for (TmOffenceDetails o : allOffensesForVehicle) {
                System.out.println("DEBUG (TransferVehicleBean): Checking offense ID: " + o.getOffenceDetailId() + ", Status: " + o.getOffenceStatus());
                if (o.getOffenceStatus() != null && o.getOffenceStatus().equalsIgnoreCase("pending")) {
                    pendingOffenses.add(o);
                    // ASSUMPTION: TmOffence entity (related via tmOffence) has a getPenalty() method.
                    if (o.getTmOffence() != null) {
                        totalPenalty += o.getTmOffence().getPenalty(); // Corrected access
                    }
                }
            }

            System.out.println("DEBUG (TransferVehicleBean): After filtering, pendingOffenses size: " + this.pendingOffenses.size());
            System.out.println("DEBUG (TransferVehicleBean): Calculated totalPenalty: " + this.totalPenalty);

            if (!this.pendingOffenses.isEmpty()) {
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_INFO, this.pendingOffenses.size() + " pending offense(s) found. Navigating to details.", null));
                return "success"; // Or a specific navigation rule name for the offense page
            } else {
                offensesMessage = "No pending offenses found for this vehicle.";
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_INFO, offensesMessage, null));
                return null;
            }

        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error checking offenses: " + e.getMessage(), null));
            pendingOffenses = new ArrayList();
            totalPenalty = 0.0;
            offensesMessage = "Error checking offenses.";
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Prepares the confirmation dialog for clearing all pending offenses.
     * Recalculates total penalty to ensure it's up-to-date.
     * @return null (stays on the current page to show confirmation).
     */
    public String prepareClearAllOffenses() {
        System.out.println("DEBUG (TransferVehicleBean): prepareClearAllOffenses called.");
        if (pendingOffenses.isEmpty()) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_WARN, "No pending offenses to clear.", null));
            showClearConfirmation = false;
            return null;
        }

        totalPenalty = 0.0;
        for (TmOffenceDetails offense : pendingOffenses) {
            // ASSUMPTION: TmOffence entity (related via tmOffence) has a getPenalty() method.
            if (offense.getTmOffence() != null) {
                totalPenalty += offense.getTmOffence().getPenalty(); // Corrected access
            }
        }

        showClearConfirmation = true;
        return null;
    }

    /**
     * Confirms and clears all pending offenses for the current vehicle.
     * Updates the status of each pending offense to "resolved".
     * @return "backToTransferVehicle" on success, otherwise null.
     */
    public String confirmClearAllOffenses() {
        System.out.println("DEBUG (TransferVehicleBean): confirmClearAllOffenses called. Total Penalty: " + totalPenalty);
        if (pendingOffenses.isEmpty()) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_WARN, "No pending offenses to clear.", null));
            showClearConfirmation = false;
            return null;
        }

        try {
            int clearedCount = 0;
            // Iterate over a copy to avoid ConcurrentModificationException if needed,
            // though merging typically doesn't modify the list being iterated.
            List<TmOffenceDetails> offensesToClear = new ArrayList(pendingOffenses);
            double actualClearedPenalty = 0.0; // Track actual cleared penalty

            for (TmOffenceDetails offense : offensesToClear) {
                offense.setOffenceStatus("cleared");
                getClerkSessionBean().mergeTmOffenceDetails(offense); // Assuming mergeTmOffenceDetails updates the entity
                clearedCount++;
                if (offense.getTmOffence() != null) {
                    actualClearedPenalty += offense.getTmOffence().getPenalty();
                }
            }

            pendingOffenses.clear();
            totalPenalty = 0.0; // Reset total penalty after clearing
            offensesMessage = null;
            showClearConfirmation = false;

            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_INFO, clearedCount + " pending offense(s) cleared successfully for a total penalty of $" + String.format("%.2f", actualClearedPenalty) + ".", null));

            return "backToTransferVehicle"; // Navigate back to the main transfer page or relevant page
        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Failed to clear offenses: " + e.getMessage(), null));
            e.printStackTrace();
            showClearConfirmation = false;
            return null;
        }
    }

    /**
     * Cancels the offense clearing process and hides the confirmation dialog.
     * @return null (stays on the current page).
     */
    public String cancelClearAll() {
        System.out.println("DEBUG (TransferVehicleBean): cancelClearAll called.");
        showClearConfirmation = false;
        FacesContext.getCurrentInstance().addMessage(null,
            new FacesMessage(FacesMessage.SEVERITY_INFO, "Offense clearing cancelled.", null));
        return null;
    }


    /**
     * Searches for vehicle details based on the provided vehicle number.
     * Populates currentOwner and currentVehicle if found.
     * Displays messages for success or failure.
     */
    public void searchVehicle() {
        System.out.println("DEBUG (TransferVehicleBean): searchVehicle called for vehNo: " + vehicleNumber);

        // Clear previous messages to avoid clutter
        Iterator<FacesMessage> messages = FacesContext.getCurrentInstance().getMessages(null);
        while (messages.hasNext()) {
            messages.next();
            messages.remove();
        }

        offensesMessage = null;
        totalPenalty = 0.0;
        showClearConfirmation = false;


        if (vehicleNumber == null || vehicleNumber.trim().isEmpty()) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_WARN, "Please enter a vehicle number.", null));
            currentOwner = new TmOwnerdetails();
            currentVehicle = new TmVehicledetails();
            currentApplication = null;
            pendingOffenses = new ArrayList();
            return;
        }

        try {
            // Assuming findByVehicleNumber returns TmRegdetails which links owner and vehicle
            TmRegdetails foundApplication = getRtoSessionBean().findByVehicleNumber(vehicleNumber.trim());

            if (foundApplication != null) {
                currentApplication = foundApplication;
                currentOwner = foundApplication.getTmOwnerdetails(); // Assuming TmRegdetails has getTmOwnerdetails()
                currentVehicle = foundApplication.getTmVehicledetails(); // Assuming TmRegdetails has getTmVehicledetails()
                pendingOffenses = new ArrayList(); // Clear any previous offenses
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_INFO, "Vehicle details loaded successfully.", null));
                System.out.println("DEBUG (TransferVehicleBean): Vehicle application found for: " + vehicleNumber);
            } else {
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "No application found for this vehicle number.", null));
                currentOwner = new TmOwnerdetails();
                currentVehicle = new TmVehicledetails();
                currentApplication = null;
                pendingOffenses = new ArrayList();
            }
        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error searching vehicle: " + e.getMessage(), null));
            currentOwner = new TmOwnerdetails();
            currentVehicle = new TmVehicledetails();
            currentApplication = null;
            pendingOffenses = new ArrayList();
            e.printStackTrace();
        }
    }

    /**
     * Searches for new owner details based on a vehicle number they currently own.
     * Populates newOwnerDetails if found.
     * Displays messages for success or failure.
     */
    public void searchNewOwnerVehicle() {
        System.out.println("DEBUG (TransferVehicleBean): searchNewOwnerVehicle called for vehNo: " + newOwnerVehicleNumber);
        if (newOwnerVehicleNumber == null || newOwnerVehicleNumber.trim().isEmpty()) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_WARN, "Please enter a vehicle number for new owner.", null));
            newOwnerDetails = new TmOwnerdetails();
            return;
        }

        try {
            // Assuming findByVehicleNumber returns TmRegdetails and you then get the owner from it
            TmRegdetails reg = getClerkSessionBean().findByVehicleNumber(newOwnerVehicleNumber.trim());
            TmOwnerdetails found = null;
            if (reg != null) {
                found = reg.getTmOwnerdetails();
            }

            if (found != null) {
                newOwnerDetails = found;
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_INFO, "New owner details loaded from vehicle number.", null));
                System.out.println("DEBUG (TransferVehicleBean): New owner found by vehicle number: " + newOwnerVehicleNumber);
            } else {
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "No owner found for this vehicle number.", null));
                newOwnerDetails = new TmOwnerdetails();
            }
        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error searching new owner's vehicle: " + e.getMessage(), null));
            newOwnerDetails = new TmOwnerdetails();
            e.printStackTrace();
        }
    }

    /**
     * Submits the vehicle ownership transfer request.
     * Validates if the new owner exists and if there are no pending offenses.
     * Updates the current vehicle's ownership in the database.
     * @return null (stays on the current page or navigates based on outcome).
     */
    public String submitTransfer() {
        System.out.println("DEBUG (TransferVehicleBean): submitTransfer called.");
        if (currentApplication == null) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Please search for a vehicle first.", null));
            return null;
        }

        String panCardNo = newOwnerDetails.getPancardNo();
        if (panCardNo == null || panCardNo.trim().isEmpty()) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Please enter the new owner's PAN card number.", null));
            return null;
        }

        try {
            // Assuming findOwnerByPanCardNo returns TmOwnerdetails
            TmOwnerdetails persistedNewOwner = getRtoSessionBean().findOwnerByPanCardNo(panCardNo.trim());
            if (persistedNewOwner == null) {
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "No owner found with this PAN card number. Please create the owner first if they are new.", null));
                return null;
            }

            // Re-check for offenses to ensure data is up-to-date before transfer
            List<TmOffenceDetails> latestAllOffenses = getClerkSessionBean().findPendingOffencesByVehicleNo(vehicleNumber.trim());
            List<TmOffenceDetails> filteredLatestPending = new ArrayList();
            if (latestAllOffenses != null) {
                for (TmOffenceDetails o : latestAllOffenses) {
                    if (o.getOffenceStatus() != null && o.getOffenceStatus().equalsIgnoreCase("pending")) {
                        filteredLatestPending.add(o);
                    }
                }
            }

            if (!filteredLatestPending.isEmpty()) {
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Vehicle has pending offenses. Cannot transfer ownership.", null));
                this.pendingOffenses = filteredLatestPending;
                totalPenalty = 0.0;
                for(TmOffenceDetails o : pendingOffenses) {
                    // ASSUMPTION: TmOffence entity (related via tmOffence) has a getPenalty() method.
                    if (o.getTmOffence() != null) {
                        totalPenalty += o.getTmOffence().getPenalty(); // Corrected access
                    }
                }
                showClearConfirmation = true; // Show confirmation to clear offenses
                return null;
            }

            // Update the owner in the current application (registration details)
            currentApplication.setTmOwnerdetails(persistedNewOwner); // Corrected setter name
            getRtoSessionBean().mergeTmRegdetails(currentApplication); // Assuming this merges TmRegdetails

            // Reset bean state after successful transfer
            currentOwner = persistedNewOwner; // Current owner is now the new owner
            // currentVehicle = new TmVehicledetails(); // Keep current vehicle details as they are for the new owner
            // currentApplication = null; // Don't clear application details immediately if showing them
            pendingOffenses = new ArrayList();
            offensesMessage = null;
            totalPenalty = 0.0;
            showClearConfirmation = false;


            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_INFO, "Vehicle ownership transferred to new owner successfully!", null));

        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Transfer failed: " + e.getMessage(), null));
            e.printStackTrace();
        }
        return null; // Stay on the same page for now, or navigate to a success page
    }


    /**
     * Creates a new owner record in the database.
     * Validates required fields and checks for existing owners by PAN card number.
     * @return null (stays on the current page).
     */
    public String createOwner() {
        System.out.println("DEBUG (TransferVehicleBean): createOwner called.");
        try {
            if (newOwnerDetails.getFname() == null || newOwnerDetails.getFname().trim().isEmpty() ||
                newOwnerDetails.getLname() == null || newOwnerDetails.getLname().trim().isEmpty() ||
                newOwnerDetails.getPancardNo() == null || newOwnerDetails.getPancardNo().trim().isEmpty() ||
                newOwnerDetails.getDateofbirth() == null || newOwnerDetails.getGender() == null || newOwnerDetails.getGender().trim().isEmpty() ||
                newOwnerDetails.getPermAddr() == null || newOwnerDetails.getPermAddr().trim().isEmpty() ||
                newOwnerDetails.getAddProofName() == null || newOwnerDetails.getAddProofName().trim().isEmpty() ||
                newOwnerDetails.getPincode() == null) {
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "All fields (First Name, Last Name, Pancard No, Date of Birth, Gender, Permanent Address, Address Proof Name, Pincode) are required to create a new owner.", null));
                return null;
            }

            // Check if an owner with this PAN card already exists
            // Assuming findOwnerByPanCardNo returns TmOwnerdetails
            TmOwnerdetails existingOwner = getRtoSessionBean().findOwnerByPanCardNo(newOwnerDetails.getPancardNo().trim());
            if (existingOwner != null) {
                FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_WARN, "An owner with this PAN card number already exists. Details loaded.", null));
                newOwnerDetails = existingOwner; // Load existing owner details into the form
                return null;
            }

            // Persist the new owner
            getRtoSessionBean().persistTmOwnerdetails(newOwnerDetails); // Assuming persistOwner takes TmOwnerdetails
            loadOwnerSelectItems(); // Reload dropdowns to include the new owner
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_INFO, "New owner created successfully!", null));

        } catch (Exception e) {
            FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_ERROR, "Failed to create owner: " + e.getMessage(), null));
            e.printStackTrace();
        }
        return null;
    }


    // --- Getters and Setters ---

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public TmOwnerdetails getCurrentOwner() { return currentOwner; }
    public void setCurrentOwner(TmOwnerdetails currentOwner) { this.currentOwner = currentOwner; }

    public TmVehicledetails getCurrentVehicle() { return currentVehicle; }
    public void setCurrentVehicle(TmVehicledetails currentVehicle) { this.currentVehicle = currentVehicle; }

    public String getTransferDate() { return transferDate; }
    public void setTransferDate(String transferDate) { this.transferDate = transferDate; }

    public Long getSelectedNewOwnerId() { return selectedNewOwnerId; }
    public void setSelectedNewOwnerId(Long selectedNewOwnerId) { this.selectedNewOwnerId = selectedNewOwnerId; }

    public List<SelectItem> getOwnerSelectItems() { return ownerSelectItems; }
    public void setOwnerSelectItems(List<SelectItem> ownerSelectItems) { this.ownerSelectItems = ownerSelectItems; }

    public boolean isNewOwnerOwnsVehicle() { return newOwnerOwnsVehicle; }
    public void setNewOwnerOwnsVehicle(boolean newOwnerOwnsVehicle) { this.newOwnerOwnsVehicle = newOwnerOwnsVehicle; }

    public String getNewOwnerVehicleNumber() { return newOwnerVehicleNumber; }
    public void setNewOwnerVehicleNumber(String newOwnerVehicleNumber) { this.newOwnerVehicleNumber = newOwnerVehicleNumber; }

    public TmOwnerdetails getNewOwnerDetails() { return newOwnerDetails; }
    public void setNewOwnerDetails(TmOwnerdetails newOwnerDetails) { this.newOwnerDetails = newOwnerDetails; }

    public List<TmOffenceDetails> getPendingOffenses() {
        return pendingOffenses;
    }

    public void setPendingOffenses(List<TmOffenceDetails> pendingOffenses) {
        this.pendingOffenses = pendingOffenses;
    }

    public String getOffensesMessage() {
        return offensesMessage;
    }

    public void setOffensesMessage(String offensesMessage) {
        this.offensesMessage = offensesMessage;
    }

    public double getTotalPenalty() {
        return totalPenalty;
    }

    public void setTotalPenalty(double totalPenalty) {
        this.totalPenalty = totalPenalty;
    }

    public boolean isShowClearConfirmation() {
        return showClearConfirmation;
    }

    public void setShowClearConfirmation(boolean showClearConfirmation) {
        this.showClearConfirmation = showClearConfirmation;
    }
}