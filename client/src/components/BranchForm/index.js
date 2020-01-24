import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button } from "semantic-ui-react";
import { CSSTransitionGroup } from "react-transition-group";
import Modal from "../uniSwap/Modal";
import ReCAPTCHA from "react-google-recaptcha";

import "./branch-form.scss";

class BranchForm extends React.Component {
  state = {
    isShowingModal: false
  };

  componentDidMount() {
    this.setState({ isShowingModal: false });
  }

  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="description">{error}</div>
        </div>
      );
    }
  }
  renderInput = ({ input, label, meta, type }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} type={type} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  renderCheckbox = ({ input, label, type, meta, rest }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;

    return (
      <div className={className}>
        <label>
          {" "}
          <p
            href=""
            onClick={() => this.setState({ isShowingModal: true })}
            style={{ cursor: "hand", color: "blue" }}
          >
            {" "}
            {label}
          </p>
        </label>
        <input {...input} type={type} value="true" /> {rest}
        {this.renderError(meta)}
      </div>
    );
  };

  Captcha = props => {
    return (
      <div>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={props.input.onChange}
        />
      </div>
    );
  };

  renderModal = () => {
    if (!this.state.isShowingModal) {
      return null;
    }

    return (
      <Modal onClose={() => this.setState({ isShowingModal: false })}>
        <CSSTransitionGroup
          transitionName="token-modal"
          transitionAppear={true}
          transitionLeave={true}
          transitionAppearTimeout={200}
          transitionLeaveTimeout={200}
          transitionEnterTimeout={200}
        >
          <div className="token-modal">
            <div className="token-modal__token-list">
              <h4>TERMS, CONDITIONS, AND SIGNATURES </h4>
              The Fund shall be a charitable Donor-Advised Fund, as defined in
              Section 4966 of the Internal Revenue Code of 1986, as amended
              (“Code”) and the Fund shall be administered under and subject to
              the Federation’s policies, including the Federation's
              Donor-Advised Fund Policies and Procedures as may be amended from
              time to time (the “Fund Policies”). The date on which the initial
              contribution is received by the Federation constitutes the
              "establish date" of the Fund. The Fund shall consist of the
              property listed in the Initial Contribution section of this
              document (the “Property”), and such other property as may, from
              time to time, be transferred to the Federation by the Donor or
              other persons and accepted by the Federation for inclusion in the
              Fund, and all income from the foregoing property. Delivery of the
              Property constitutes an irrevocable gift by the Donor to the
              Federation. The Fund shall be the property of the Federation; it
              shall not be deemed a trust fund held by it in a trustee capacity.
              The Federation in its normal corporate capacity shall have the
              ultimate ownership, authority and control over all property in the
              Fund, and the income derived therefrom, for the charitable,
              educational and religious purposes of the Federation. The assets
              of the Fund shall be used for charitable, educational or religious
              purposes within the exempt purposes of the Federation, either
              directly or by contributions to other organizations for such
              purposes. Distributions from the Fund of the income or principal
              or both, within the limitations provided for in this agreement,
              shall be made at such times, in such amounts, in such ways, and
              for such charitable, educational or religious purposes as the
              Federation shall determine. The Fund Advisor(s) may from time to
              time submit to the Federation recommendations with respect to
              distributions, which recommendations shall be solely advisory and
              the Federation is not bound by such recommendations. It is
              intended that the Fund shall be a component part of the
              Federation's, and not a separate trust, and that nothing in this
              Agreement shall affect the status of the Federation as an
              organization described in Section 501(c)(3) of the Internal
              Revenue Code of 1986 and as an organization which is not a private
              foundation within the meaning of Section 509(a) of the Code. This
              agreement shall be interpreted in a manner consistent with the
              foregoing provisions of the federal tax laws and any regulations
              issued pursuant thereto. The Federation is authorized to amend
              this Agreement to conform to the provisions of any applicable law
              or government regulation in order to carry out the foregoing
              intention. Reference herein to provisions of the Internal Revenue
              Code of 1986 shall be deemed references to the corresponding
              provisions of any future Internal Revenue Code. Upon the
              termination, by death or otherwise, of the privilege of a Fund
              Advisor to make recommendations, the Fund shall cease to be a
              Donor-Advised Fund but shall become a part of the Unrestricted
              Endowment Fund of the Federation. Fees will be assessed to the
              Fund as follows: 1.0% on the first $3 million; 0.75% on the next
              $7 million; 0.5% on the next $15 million; 0.25% over $25 million.
              Fees are charged on a quarterly basis, and are based on the
              average daily value of all cash and non-cash assets held in the
              fund. Fees are subject to change. Any such changes will be
              communicated to you in writing. $100 minimum fee per year. In
              compliance with the Internal Revenue Code, grants are not
              permitted to individuals for non-charitable purposes; for
              political contributions or to support political campaign
              activities; or for any purpose that would provide benefits, goods
              or services to a donor to the Fund, the Fund’s advisor(s) or other
              related parties. A Fund Advisor is subject to IRS penalties if the
              Fund’s donor(s), advisor(s) or other related parties receive
              benefits, goods or services in connection with a grant
              recommendation. This includes grants to satisfy pledges made by
              any person including a fund advisor and non-deductible (or
              partially tax-deductible) memberships, event tickets,
              sponsorships, registration fees in tournaments, and cause-related
              marketing activities. Grants are not allowed to private
              non-operating foundations. Inactive Funds – If a Fund shows no
              activity (grants or contributions) for three years or more, the
              Federation will attempt to contact the Primary Advisor(s), other
              Fund Advisor(s), and/or any Interested Parties. If the Fund
              remains inactive for another year after this notification, and the
              Fund is inactive for a total of four years, the Fund may be closed
              and the Fund assets may be distributed according to this
              agreement. Zero and Negative Balance Funds – If a Fund has a zero
              or negative balance, the Federation will contact the Primary
              Advisor(s). If the zero or negative balance persists more than
              three months after this contact, the Fund will be closed unless
              other arrangements are made. This Agreement may be executed in one
              or more counterparts, each of which shall be considered an
              original, but all of which together shall constitute one and the
              same agreement.
            </div>
          </div>
        </CSSTransitionGroup>
      </Modal>
    );
  };

  onSubmit = async formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <div>
        <form
          className="ui form error"
          onSubmit={this.props.handleSubmit(this.onSubmit)}
        >
          <Field
            name="branchName"
            component={this.renderInput}
            label="Give your fund a name:"
          />
          <Field
            name="primaryAdvisorFirstName"
            component={this.renderInput}
            label="First name:"
          />
          <Field
            name="primaryAdvisorLastName"
            component={this.renderInput}
            label="Last name:"
          />
          <Field
            name="primaryAdvisorEmail"
            component={this.renderInput}
            type="email"
            label="eMail:"
          />
          <Field
            name="primaryAdvisorAddress"
            component={this.renderInput}
            label="Address:"
          />
          <Field
            name="primaryAdvisorCity"
            component={this.renderInput}
            label="City:"
          />
          <Field
            name="primaryAdvisorState"
            component={this.renderInput}
            label="State:"
          />
          <Field
            name="primaryAdvisorZip"
            component={this.renderInput}
            type="number"
            label="ZIP"
          />
          <Field
            name="primaryAdvisorBirthday"
            component={this.renderInput}
            type="date"
            label="Birthdate:"
          />
          <Field
            name="tncconsent"
            component={this.renderCheckbox}
            type="checkbox"
            label="Terms and Conditions:"
            rest="I acknowledge that I have read the Federation’s Fund Agreement Terms and Conditions, and I agree to the fees, terms and conditions described therein.
						I hereby certify, to the best of my knowledge, all information presented here in connection with this form is accurate, and I will notify the Federation
						promptly of any changes."
          ></Field>
          <Field
            name="pnpconsent"
            component={this.renderCheckbox}
            type="checkbox"
            label="Policies and Procedures:"
            rest="I acknowledge that I have read the Federation's Fund Policies and Procedures, and I agree to the fees, terms and conditions described therein"
          ></Field>
          <Field name="captcharesponse" component={this.Captcha} />
          <br />
          <Button disabled={this.props.loading} className="ui button primary">
            Submit
          </Button>
        </form>
        {this.renderModal()}
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.branchName) {
    errors.branchName = "Please type in a name for your fund.";
  }
  if (!formValues.primaryAdvisorFirstName) {
    errors.primaryAdvisorFirstName = "You must enter a First Name";
  }
  if (!formValues.primaryAdvisorLastName) {
    errors.primaryAdvisorLastName = "You must enter a Last Name";
  }
  if (!formValues.primaryAdvisorEmail) {
    errors.primaryAdvisorEmail = "You must enter an eMail address";
  }
  if (!formValues.primaryAdvisorAddress) {
    errors.primaryAdvisorAddress = "You must enter an address";
  }
  if (!formValues.primaryAdvisorCity) {
    errors.primaryAdvisorCity = "You must enter a city";
  }
  if (!formValues.primaryAdvisorState) {
    errors.primaryAdvisorState = "You must enter a State";
  }
  if (!formValues.primaryAdvisorZip) {
    errors.primaryAdvisorZip = "You must enter a Zip";
  }
  if (!formValues.primaryAdvisorBirthday) {
    errors.primaryAdvisorBirthday = "You must enter a birthday";
  }
  if (!formValues.tncconsent) {
    errors.tncconsent = "You must agree to the Terms and Conditions";
  }
  if (!formValues.pnpconsent) {
    errors.pnpconsent = "You must agree to the Procedures and Policies";
  }
  if (!formValues.captcharesponse) {
    errors.captcharesponse = "Please confirm you are not a robot";
  }

  return errors;
};

export default reduxForm({ form: "branchForm", validate })(BranchForm);
