package training.iqgatewaty.backing;

import javax.faces.context.FacesContext;
import javax.faces.application.FacesMessage; // Import FacesMessage for severity comparison
 
 
public class ViewHelperBean {
 
    /**
     * Attempts to determine if the current request is a postback in a JSF 1.x environment.
     * This relies on a heuristic: if there are any messages (info, warning, error, fatal)
     * in the FacesContext, it's highly likely to be a postback.
     *
     * IMPORTANT: This is a heuristic and might not be 100% accurate for all scenarios.
     * For more robust postback detection in JSF 1.x, consider using a hidden input field
     * on your form and checking for its presence in the request parameters.
     * (See previous explanations for the hidden field approach).
     */
    public boolean isPostback() {
        return FacesContext.getCurrentInstance().getMaximumSeverity() != null;
    }
 
    public boolean isNotPostback() {
        return !isPostback();
    }
 
    /**
     * Checks if validation failed in the current request in a JSF 1.x environment.
     * This is determined by checking if the maximum message severity in the FacesContext
     * is FacesMessage.SEVERITY_ERROR or FacesMessage.SEVERITY_FATAL.
     */
    public boolean isValidationFailed() {
        FacesMessage.Severity maxSeverity = FacesContext.getCurrentInstance().getMaximumSeverity();
        return maxSeverity != null &&
               (maxSeverity.equals(FacesMessage.SEVERITY_ERROR) ||
                maxSeverity.equals(FacesMessage.SEVERITY_FATAL));
    }
}
