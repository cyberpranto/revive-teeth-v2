{/* <script
type="text/x-dc "
data-dc-script=" "
data-props='{   "previewState": { "editor": "enum", "default": "Default", "options": ["Default", "Opted out on this browser", "Request submitted"], "tsType": "string", "section": "Review states", "label": "Preview state" },   "gpcDetected": { "editor": "boolean", "default": false, "tsType": "boolean", "section": "Review states", "label": "Simulate GPC signal" },   "showErrorsDemo": { "editor": "boolean", "default": false, "tsType": "boolean", "section": "Review states", "label": "Preview form errors" } } '
> */}
class Component extends DCLogic { state = { optedOut: false, submitted: false, attempted: false, fullName: '', email: '', stateRes: '', details: '', types: { sale: false, access: false, correct: false, del: false, health: false }, }; US_STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']; TYPE_DEFS = [{ key: 'sale', label: 'Opt out of the sale or sharing of my personal information' }, { key: 'access', label: 'Access a copy of my personal information' }, { key: 'correct', label: 'Correct my personal information' }, { key: 'del', label: 'Delete my personal information' }, { key: 'health', label: 'Withdraw consent for the collection or sharing of my consumer health data (Washington residents)' },]; validate() { const e = {}; if (!this.state.fullName.trim()) e.name = 'Please enter your full name.'; const em = this.state.email.trim(); if (!em) e.email = 'Please enter your email address.'; else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em)) e.email = 'Please enter a valid email address.'; if (!this.state.stateRes) e.stateRes = 'Please select your state of residence.'; if (!Object.values(this.state.types).some(Boolean)) e.types = 'Please select at least one request type.'; return e; } handleOptOut = () => { this.setState({ optedOut: true }, () => { const el = document.getElementById('optout-confirm'); if (el) el.focus(); }); }; handleSubmit = (ev) => { if (ev && ev.preventDefault) ev.preventDefault(); const errors = this.validate(); this.setState({ attempted: true }, () => { if (Object.keys(errors).length === 0) { this.setState({ submitted: true }, () => { const el = document.getElementById('form-confirm'); if (el) el.focus(); }); } else { const order = ['name', 'email', 'stateRes', 'types']; const idMap = { name: 'pr-name', email: 'pr-email', stateRes: 'pr-state', types: 'pr-type-sale' }; const first = order.find((k) => errors[k]); const el = first && document.getElementById(idMap[first]); if (el) el.focus(); } }); }; renderVals() { const p = this.props || {}; const preview = p.previewState || 'Default'; const optedOut = preview === 'Opted out on this browser' || this.state.optedOut; const submitted = preview === 'Request submitted' || this.state.submitted; const attempted = this.state.attempted || !!p.showErrorsDemo; const errors = attempted ? this.validate() : {}; const gpcActive = !!p.gpcDetected; const states = this.US_STATES.map((s) => ({ name: s })); const requestTypes = this.TYPE_DEFS.map((t) => ({ id: 'pr-type-' + t.key, label: t.label, checked: !!this.state.types[t.key], onToggle: () => this.setState((st) => ({ types: { ...st.types, [t.key]: !st.types[t.key] } })), })); return { yes: true, states, requestTypes, nameVal: this.state.fullName, emailVal: this.state.email, stateVal: this.state.stateRes, detailsVal: this.state.details, onName: (e) => this.setState({ fullName: e.target.value }), onEmail: (e) => this.setState({ email: e.target.value }), onState: (e) => this.setState({ stateRes: e.target.value }), onDetails: (e) => this.setState({ details: e.target.value }), onOptOut: this.handleOptOut, onSubmit: this.handleSubmit, errName: errors.name || '', errEmail: errors.email || '', errState: errors.stateRes || '', errTypes: errors.types || '', ariaName: errors.name ? 'true' : 'false', ariaEmail: errors.email ? 'true' : 'false', ariaState: errors.stateRes ? 'true' : 'false', showDevice: !optedOut, showOptedOut: optedOut, showForm: !submitted, showSubmitted: submitted, gpcActive, gpcNotActive: !gpcActive, }; } }
{/* </script> */ }



document.addEventListener("DOMContentLoaded", () => {
    initPrivacyPage();
});

function initPrivacyPage() {
    cacheElements();
    bindEvents();
    loadCustomerPrivacyAPI();
}

const elements = {};

function cacheElements() {
    elements.optOutButton = document.getElementById("optout-button");

    elements.optOutContent = document.getElementById("optout-content");

    elements.optOutConfirm = document.getElementById("optout-confirm");

    elements.form = document.getElementById("privacy-request-form");

    elements.formSuccess = document.getElementById("form-confirm");

    elements.gpcActive = document.getElementById("gpc-active");

    elements.name = document.getElementById("pr-name");

    elements.email = document.getElementById("pr-email");

    elements.state = document.getElementById("pr-state");

    elements.details = document.getElementById("pr-details");
    elements.requestTypes =
        document.querySelectorAll(
            'input[name="request_type"]'
        );
    elements.submitButton =
        document.querySelector(
            ".privacy-form__submit"
        );
    elements.gpcDefault = document.getElementById(
        "gpc-default"
    );
    elements.nameError =
        document.getElementById("pr-name-err");

    elements.emailError =
        document.getElementById("pr-email-err");

    elements.stateError =
        document.getElementById("pr-state-err");

    elements.typesError =
        document.getElementById("pr-types-err");
}

function bindEvents() {

    elements.optOutButton?.addEventListener(
        "click",
        handleOptOut
    );

    elements.form?.addEventListener(
        "submit",
        handleFormSubmit
    );
}

function handleOptOut(event) {

    event.preventDefault();

    if (!window.Shopify?.customerPrivacy) return;

}

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;
}

function loadCustomerPrivacyAPI() {

    if (!window.Shopify?.loadFeatures) {
        console.error("Shopify loadFeatures API not found.");
        return;
    }

    window.Shopify.loadFeatures(
        [
            {
                name: "consent-tracking-api",
                version: "0.1"
            }
        ],
        (error) => {

            if (error) {
                console.error("Failed to load Customer Privacy API", error);
                return;
            }

            console.log("Customer Privacy API Loaded");

            detectGPC();
            checkExistingConsent();
        }
    );
}

function detectGPC() {

}

function checkExistingConsent() {

    if (!window.Shopify?.customerPrivacy) return;

    const consent = window.Shopify.customerPrivacy.getTrackingConsent();

    console.log(consent);

}

function show(element) {
    if (!element) return;
    element.hidden = false;
}

function hide(element) {
    if (!element) return;
    element.hidden = true;
}

function focusElement(element) {

    if (!element) return;

    element.focus();

}


function validateForm() {

    let valid = true;

    // Name
    if (!elements.name.value.trim()) {
        show(elements.nameError);
        valid = false;
    } else {
        hide(elements.nameError);
    }

    // Email
    if (!elements.email.value.trim()) {
        show(elements.emailError);
        valid = false;
    } else {
        hide(elements.emailError);
    }

    // State
    if (!elements.state.value) {
        show(elements.stateError);
        valid = false;
    } else {
        hide(elements.stateError);
    }

    // Request Type
    const checked = [...elements.requestTypes].some(input => input.checked);

    if (!checked) {
        show(elements.typesError);
        valid = false;
    } else {
        hide(elements.typesError);
    }

    return valid;
}