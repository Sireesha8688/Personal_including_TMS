package com.example.bean;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.*;

import training.iqgateway.entities.*;
import training.iqgateway.services.RTOSessionEJBLocal;

import javax.naming.InitialContext;

public class TransferBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String vehicleNumber;
    private TmRegdetails vehicle;
    private String vehicleMessage;
    private String vehicleMessageClass;

    private boolean useExistingOwner;
    private Long existingOwnerId;
    private TmOwnerdetails existingOwner;
    private String ownerMessage;
    private String ownerMessageClass;

    private String newOwnerFname;
    private String newOwnerLname;
    private String newOwnerGender;
    private String newOwnerMobileNo;
    private String newOwnerLandlineNo;
    private Timestamp newOwnerDateofbirth;
    private String newOwnerAddProofName;
    private String newOwnerPancardNo;
    private String newOwnerPermAddr;
    private String newOwnerTempAddr;
    private Long newOwnerPincode;
    private String newOwnerOccupation;

    private List<TmOffenceDetails> offences = new ArrayList<TmOffenceDetails>();
    private Map<Long, Boolean> offenceSelection = new HashMap<Long, Boolean>();
    private String transferMessage;
    private String transferMessageClass;

    private RTOSessionEJBLocal rtoSession;

    public TransferBean() {
        try {
            InitialContext ic = new InitialContext();
            rtoSession = (RTOSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/RTOSessionEJB");
        } catch (Exception e) {
            vehicleMessage = "Failed to initialize session bean: " + e.getMessage();
            vehicleMessageClass = "error";
            e.printStackTrace();
        }
    }

    public void searchVehicle() {
        System.out.println("Vehicle search");
        if (vehicleNumber == null || vehicleNumber.trim().isEmpty()) {
            vehicleMessage = "Please enter a vehicle number.";
            vehicleMessageClass = "error";
            vehicle = null;
            offences.clear();
            offenceSelection.clear();
            return;
        }
        try {
            String vehNo = vehicleNumber.trim();
            vehicle = rtoSession.findByVehicleNumber(vehNo);
            if (vehicle == null) {
                vehicleMessage = "Vehicle number not found: " + vehNo;
                vehicleMessageClass = "info";
                offences.clear();
                offenceSelection.clear();
                return;
            }
            offences = rtoSession.getPendingOffencesByVehicleNo(vehNo);
            if (offences == null) offences = new ArrayList<TmOffenceDetails>();
            offenceSelection.clear();
            vehicleMessage = null;
            vehicleMessageClass = null;
        } catch (Exception e) {
            vehicleMessage = "Error fetching vehicle details: " + e.getMessage();
            vehicleMessageClass = "error";
            vehicle = null;
            offences.clear();
            offenceSelection.clear();
            e.printStackTrace();
        }
    }

    public void fetchExistingOwner() {
        System.out.println("Fetching existing owner..............");
        if (!useExistingOwner || existingOwnerId == null) {
            ownerMessage = "Please enter owner ID.";
            ownerMessageClass = "error";
            existingOwner = null;
            return;
        }
        try {
            existingOwner = rtoSession.findTmOwnerdetailsById(existingOwnerId);
            if (existingOwner == null) {
                ownerMessage = "Owner not found for ID: " + existingOwnerId;
                ownerMessageClass = "info";
            } else {
                ownerMessage = null;
                ownerMessageClass = null;
            }
        } catch (Exception e) {
            ownerMessage = "Error fetching owner details: " + e.getMessage();
            ownerMessageClass = "error";
            existingOwner = null;
            e.printStackTrace();
        }
    }

    public void clearSelectedOffences() {
        System.out.println("Clearing selected offences");
        List<Long> toRemove = new ArrayList<Long>();
        for (Map.Entry<Long, Boolean> entry : offenceSelection.entrySet()) {
            if (Boolean.TRUE.equals(entry.getValue())) {
                toRemove.add(entry.getKey());
            }
        }
        if (toRemove.isEmpty()) {
            transferMessage = "No offences selected.";
            transferMessageClass = "info";
            return;
        }
        try {
            for (Long id : toRemove) {
                TmOffenceDetails offence = rtoSession.findTmOffenceDetailsById(id);
                if (offence != null) {
                    rtoSession.removeTmOffenceDetails(offence);
                }
            }
            offences = rtoSession.getPendingOffencesByVehicleNo(vehicleNumber.trim());
            if (offences == null) offences = new ArrayList<TmOffenceDetails>();
            offenceSelection.clear();
            transferMessage = "Selected offences cleared successfully.";
            transferMessageClass = "info";
        } catch (Exception e) {
            transferMessage = "Error clearing offences: " + e.getMessage();
            transferMessageClass = "error";
            e.printStackTrace();
        }
    }

    public void transferVehicle() {
        System.out.println("Transferring vehicle");
        if (vehicle == null) {
            transferMessage = "Vehicle not found.";
            transferMessageClass = "error";
            return;
        }
        try {
            // Clear all offences before transfer
            for (TmOffenceDetails offence : offences) {
                rtoSession.removeTmOffenceDetails(offence);
            }
            offences.clear();
            offenceSelection.clear();

            TmOwnerdetails newOwner;
            if (useExistingOwner) {
                newOwner = rtoSession.findTmOwnerdetailsById(existingOwnerId);
                if (newOwner == null) {
                    transferMessage = "Owner not found for ID: " + existingOwnerId;
                    transferMessageClass = "error";
                    return;
                }
            } else {
                newOwner = new TmOwnerdetails();
                // Do NOT set ownerId manually; let DB generate it
                newOwner.setFname(newOwnerFname);
                newOwner.setLname(newOwnerLname);
                newOwner.setGender(newOwnerGender);
                newOwner.setMobileNo(newOwnerMobileNo);
                newOwner.setLandlineNo(newOwnerLandlineNo);
                newOwner.setDateofbirth(newOwnerDateofbirth);
                newOwner.setAddProofName(newOwnerAddProofName);
                newOwner.setPancardNo(newOwnerPancardNo);
                newOwner.setPermAddr(newOwnerPermAddr);
                newOwner.setTempAddr(newOwnerTempAddr);
                newOwner.setPincode(newOwnerPincode);
                newOwner.setOccupation(newOwnerOccupation);
                rtoSession.persistTmOwnerdetails(newOwner);
            }
            vehicle.setTmOwnerdetails(newOwner);
            rtoSession.mergeTmRegdetails(vehicle);

            transferMessage = "Vehicle transferred successfully.";
            transferMessageClass = "info";
        } catch (Exception e) {
            transferMessage = "Error transferring vehicle: " + e.getMessage();
            transferMessageClass = "error";
            e.printStackTrace();
        }
    }

//    public void updateCheckbox() {
//   
//    }

    // Getters and setters for all properties (generate accordingly)
    // ...



    // Getters and setters for all fields
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public TmRegdetails getVehicle() { return vehicle; }
    public void setVehicle(TmRegdetails vehicle) { this.vehicle = vehicle; }
    public String getVehicleMessage() { return vehicleMessage; }
    public void setVehicleMessage(String vehicleMessage) { this.vehicleMessage = vehicleMessage; }
    public String getVehicleMessageClass() { return vehicleMessageClass; }
    public void setVehicleMessageClass(String vehicleMessageClass) { this.vehicleMessageClass = vehicleMessageClass; }
    public boolean isUseExistingOwner() { return useExistingOwner; }
    public void setUseExistingOwner(boolean useExistingOwner) { this.useExistingOwner = useExistingOwner; }
    public Long getExistingOwnerId() { return existingOwnerId; }
    public void setExistingOwnerId(Long existingOwnerId) { this.existingOwnerId = existingOwnerId; }
    public TmOwnerdetails getExistingOwner() { return existingOwner; }
    public void setExistingOwner(TmOwnerdetails existingOwner) { this.existingOwner = existingOwner; }
    public String getOwnerMessage() { return ownerMessage; }
    public void setOwnerMessage(String ownerMessage) { this.ownerMessage = ownerMessage; }
    public String getOwnerMessageClass() { return ownerMessageClass; }
    public void setOwnerMessageClass(String ownerMessageClass) { this.ownerMessageClass = ownerMessageClass; }
    public String getNewOwnerFname() { return newOwnerFname; }
    public void setNewOwnerFname(String newOwnerFname) { this.newOwnerFname = newOwnerFname; }
    public String getNewOwnerLname() { return newOwnerLname; }
    public void setNewOwnerLname(String newOwnerLname) { this.newOwnerLname = newOwnerLname; }
    public String getNewOwnerGender() { return newOwnerGender; }
    public void setNewOwnerGender(String newOwnerGender) { this.newOwnerGender = newOwnerGender; }
    public String getNewOwnerMobileNo() { return newOwnerMobileNo; }
    public void setNewOwnerMobileNo(String newOwnerMobileNo) { this.newOwnerMobileNo = newOwnerMobileNo; }
    public String getNewOwnerLandlineNo() { return newOwnerLandlineNo; }
    public void setNewOwnerLandlineNo(String newOwnerLandlineNo) { this.newOwnerLandlineNo = newOwnerLandlineNo; }
    public Timestamp getNewOwnerDateofbirth() { return newOwnerDateofbirth; }
    public void setNewOwnerDateofbirth(Timestamp newOwnerDateofbirth) { this.newOwnerDateofbirth = newOwnerDateofbirth; }
    public String getNewOwnerAddProofName() { return newOwnerAddProofName; }
    public void setNewOwnerAddProofName(String newOwnerAddProofName) { this.newOwnerAddProofName = newOwnerAddProofName; }
    public String getNewOwnerPancardNo() { return newOwnerPancardNo; }
    public void setNewOwnerPancardNo(String newOwnerPancardNo) { this.newOwnerPancardNo = newOwnerPancardNo; }
    public String getNewOwnerPermAddr() { return newOwnerPermAddr; }
    public void setNewOwnerPermAddr(String newOwnerPermAddr) { this.newOwnerPermAddr = newOwnerPermAddr; }
    public String getNewOwnerTempAddr() { return newOwnerTempAddr; }
    public void setNewOwnerTempAddr(String newOwnerTempAddr) { this.newOwnerTempAddr = newOwnerTempAddr; }
    public Long getNewOwnerPincode() { return newOwnerPincode; }
    public void setNewOwnerPincode(Long newOwnerPincode) { this.newOwnerPincode = newOwnerPincode; }
    public String getNewOwnerOccupation() { return newOwnerOccupation; }
    public void setNewOwnerOccupation(String newOwnerOccupation) { this.newOwnerOccupation = newOwnerOccupation; }
    public List<TmOffenceDetails> getOffences() { return offences; }
    public void setOffences(List<TmOffenceDetails> offences) { this.offences = offences; }
    public Map<Long, Boolean> getOffenceSelection() { return offenceSelection; }
    public void setOffenceSelection(Map<Long, Boolean> offenceSelection) { this.offenceSelection = offenceSelection; }
    public String getTransferMessage() { return transferMessage; }
    public void setTransferMessage(String transferMessage) { this.transferMessage = transferMessage; }
    public String getTransferMessageClass() { return transferMessageClass; }
    public void setTransferMessageClass(String transferMessageClass) { this.transferMessageClass = transferMessageClass; }
    public int getOffencesSize() { return offences != null ? offences.size() : 0; }
}
