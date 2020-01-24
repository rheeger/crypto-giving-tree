import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button } from "semantic-ui-react";
import web3 from "web3";

class ClaimForm extends React.Component {
  state = {
    isShowingModal: false
  };

  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="description">{error}</div>
        </div>
      );
    }
  }
  renderInput = ({ input, label, meta, ...custom }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} {...custom} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  renderCheckbox = ({ input, label, type, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;

    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} type={type} value="true" /> I Agree
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <form
        className="ui form error"
        onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <Field
          name="orgAdminWallet"
          component={this.renderInput}
          label="Organization's Ethereum Wallet Address:"
          autoComplete="disabled"
        />
        <Field
          name="orgAdminFirstName"
          component={this.renderInput}
          label="First name:"
        />
        <Field
          name="orgAdminLastName"
          component={this.renderInput}
          label="Last name:"
        />
        <Field
          name="orgAdminEmail"
          component={this.renderInput}
          type="email"
          label="eMail:"
        />
        <Field
          name="orgAdminAddress"
          component={this.renderInput}
          label="Address:"
        />
        <Field name="orgAdminCity" component={this.renderInput} label="City:" />
        <Field
          name="orgAdminState"
          component={this.renderInput}
          label="State:"
        />
        <Field
          name="orgAdminZip"
          component={this.renderInput}
          type="number"
          label="ZIP:"
        />
        <Field
          name="tncconsent"
          component={this.renderCheckbox}
          type="checkbox"
          label="Terms and Conditions:"
        ></Field>
        <Button className="ui button primary" disabled={this.props.loading}>
          Submit
        </Button>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.orgAdminWallet) {
    errors.orgAdminWallet = "You must enter an Address";
  }
  if (formValues.orgAdminWallet) {
    try {
      web3.utils.toChecksumAddress(formValues.orgAdminWallet);
    } catch (e) {
      errors.orgAdminWallet = "Please enter a valid ethereum address";
    }
  }
  if (!formValues.orgAdminFirstName) {
    errors.orgAdminFirstName = "You must enter a First Name";
  }
  if (!formValues.orgAdminLastName) {
    errors.orgAdminLastName = "You must enter a Last Name";
  }
  if (!formValues.orgAdminEmail) {
    errors.orgAdminEmail = "You must enter an eMail address";
  }
  if (!formValues.orgAdminAddress) {
    errors.orgAdminAddress = "You must enter a valid address";
  }
  if (!formValues.orgAdminCity) {
    errors.orgAdminCity = "You must enter a city";
  }
  if (!formValues.orgAdminState) {
    errors.orgAdminState = "You must enter a state";
  }
  if (!formValues.orgAdminZip) {
    errors.orgAdminZip = "You must enter a zip code";
  }
  if (!formValues.tncconsent) {
    errors.tncconsent = "You must accept the Terms and Conditions";
  }

  return errors;
};

export default reduxForm({ form: "streamForm", validate })(ClaimForm);
