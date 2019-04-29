import React from 'react';
import { Field, reduxForm } from 'redux-form';

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
	onSubmit = (formValues) => {
		this.props.onSubmit(formValues);
	};

	render() {
		return (
			<form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
				<Field name="creationDate" component={this.renderInput} type="date" label="Creation Date:" />
				<Field name="branchName" component={this.renderInput} label="Give your branch a name:" />
				<Field name="primaryAdvisorFirstName" component={this.renderInput} label="First name:" />
				<Field name="primaryAdvisorLastName" component={this.renderInput} label="Last name:" />
				<Field name="primaryAdvisorEmail" component={this.renderInput} type="email" label="eMail:" />
				<Field name="primaryAdvisorAddress" component={this.renderInput} label="Address:" />
				<Field name="primaryAdvisorCity" component={this.renderInput} label="City:" />
				<Field name="primaryAdvisorState" component={this.renderInput} label="State:" />
				<Field name="primaryAdvisorZip" component={this.renderInput} type="number" label="ZIP" />
				<Field name="primaryAdvisorBirthday" component={this.renderInput} type="date" label="Birthdate:" />
				<Field name="publicityConsent" component={this.renderInput} type="radio" label="Publicity Consent:" />
				<Field
					name="description"
					component={this.renderInput}
					type="textarea"
					label="Layout some goals for your branch:"
				/>
				<button className="ui button primary">Submit</button>
			</form>
		);
	}
}

const validate = (formValues) => {
	const errors = {};
	if (!formValues.title) {
		errors.title = 'You must enter a Title';
	}
	if (!formValues.description) {
		errors.description = 'You must enter a description';
	}

	return errors;
};

export default reduxForm({ form: 'branchForm', validate })(BranchForm);
