import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'semantic-ui-react';

class BranchForm extends React.Component {
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
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		return (
			<div className={className}>
				<label>{label}</label>
				<input {...input} type={type} autoComplete="off" />
				{this.renderError(meta)}
			</div>
		);
	};

	renderCheckbox = ({ input, label, type, meta }) => {
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;

		return (
			<div className={className}>
				<label>{label}</label>
				<input {...input} type={type} value='true' /> I Agree
				{this.renderError(meta)}
			</div>
		);
	};

	onSubmit = async (formValues) => {
		this.props.onSubmit(formValues);
	};

	render() {
		return (
			<form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
				<Field name="branchName" component={this.renderInput} label="Give your tree a name:" />
				<Field name="primaryAdvisorFirstName" component={this.renderInput} label="First name:" />
				<Field name="primaryAdvisorLastName" component={this.renderInput} label="Last name:" />
				<Field name="primaryAdvisorEmail" component={this.renderInput} type="email" label="eMail:" />
				<Field name="primaryAdvisorAddress" component={this.renderInput} label="Address:" />
				<Field name="primaryAdvisorCity" component={this.renderInput} label="City:" />
				<Field name="primaryAdvisorState" component={this.renderInput} label="State:" />
				<Field name="primaryAdvisorZip" component={this.renderInput} type="number" label="ZIP" />
				<Field name="primaryAdvisorBirthday" component={this.renderInput} type="date" label="Birthdate:" />
				<Field
					name="tncconsent"
					component={this.renderCheckbox}
					type="checkbox"
					label="Terms and Conditions:"
				>
				</Field>
				<Button loading={this.props.loading} className="ui button primary">
					Submit
				</Button>
			</form>
		);
	}
}

const validate = (formValues) => {
	const errors = {};
	if (!formValues.branchName) {
		errors.branchName = 'Please type in a name for your Giving Tree.';
	}
	if (!formValues.primaryAdvisorFirstName) {
		errors.primaryAdvisorFirstName = 'You must enter a First Name';
	}
	if (!formValues.primaryAdvisorLastName) {
		errors.primaryAdvisorLastName = 'You must enter a Last Name';
	}
	if (!formValues.primaryAdvisorEmail) {
		errors.primaryAdvisorEmail = 'You must enter an eMail address';
	}
	if (!formValues.primaryAdvisorAddress) {
		errors.primaryAdvisorAddress = 'You must enter an address';
	}
	if (!formValues.primaryAdvisorCity) {
		errors.primaryAdvisorCity = 'You must enter a city';
	}
	if (!formValues.primaryAdvisorState) {
		errors.primaryAdvisorState = 'You must enter a State';
	}
	if (!formValues.primaryAdvisorZip) {
		errors.primaryAdvisorZip = 'You must enter a Zip';
	}
	if (!formValues.primaryAdvisorBirthday) {
		errors.primaryAdvisorBirthday = 'You must enter a birthday';
	}
	if (!formValues.tncconsent) {
		errors.tncconsent = 'You must agree to the Terms and Conditions';
	}

	return errors;
};

export default reduxForm({ form: 'branchForm', validate })(BranchForm);
