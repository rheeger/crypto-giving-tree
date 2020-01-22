import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button } from "semantic-ui-react";

class GrantForm extends React.Component {
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

  renderCheckbox = ({ input, label, type, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} type={type} /> The suggested distribution does not
        represent the payment of any pledge or other financial obligation. I/we
        will not accept any benefits or privileges offered in connection with
        the above grant distribution(s), including goods or services (including
        auction items), admission to charitable events, dues, or membership,
        other than a synagogue or other religious institution. This grant is not
        intended to be combined with my/our personal check to support my/our
        attendance or that of others at a charity’s event.
        {this.renderError(meta)}
      </div>
    );
  };

  renderFundSelect = ({ input, label, options, meta, value, ...rest }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    const parse = event => {
      return JSON.parse(event.target.value);
    };
    return (
      <div className={className}>
        <label>{label}</label>
        <select
          onBlur={event => input.onBlur(parse(event))}
          onChange={event => input.onChange(parse(event))}
          {...rest}
        >
          <option>select a fund:</option>
          {options.map((option, key) => (
            <option key={option.id} value={JSON.stringify(option)}>
              {option.branchName} -- (Available Balance: ${option.grantableDAI})
            </option>
          ))}
        </select>
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
          name="selectedFund"
          component={this.renderFundSelect}
          type="ObjectSelect"
          options={Object.values(this.props.gtFunds)}
          label="Sending from:"
        />
        <Field
          name="grantAmount"
          component={this.renderInput}
          type="number"
          label="Grant amount:"
        />
        <Field
          name="grantDescription"
          component={this.renderInput}
          type="text"
          label="Grant memo:"
        />
        <Field
          name="tncconsent"
          component={this.renderCheckbox}
          type="checkbox"
          label="Legal Verification:"
        ></Field>
        <Button disabled={this.props.loading} className="ui button primary">
          Submit
        </Button>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.selectedFund) {
    errors.selectedFund = "You must select a Giving Fund";
  }
  if (!formValues.grantAmount) {
    errors.grantAmount = "You must enter a amount to grant";
  }
  if (!formValues.grantDescription) {
    errors.grantDescription = "You must enter a description";
  }

  if (formValues.selectedFund) {
    if (formValues.grantAmount > formValues.selectedFund.grantableDAI) {
      errors.grantAmount =
        "Grant amount exceeds grantable balance. Please lower grant amount";
    }
    if (formValues.selectedFund.grantableDAI < 0.01) {
      errors.selectedFund =
        "Insuficient Funds. Please contribute to this Giving Fund";
    }
  }
  if (!formValues.tncconsent) {
    errors.tncconsent = "You must accept the terms and conditions";
  }

  return errors;
};

export default reduxForm({ form: "grantForm", validate })(GrantForm);
