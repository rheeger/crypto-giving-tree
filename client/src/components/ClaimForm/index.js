import React from 'react';
import { Field, reduxForm } from 'redux-form';

class ClaimForm extends React.Component {
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
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		return (
			<div className={className}>
				<label>{label}</label>
				<input {...input} {...custom} autoComplete="off" />
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
				<Field
					name="orgAdminWallet"
					component={this.renderInput}
					label="Organization's Ethereum Wallet Address:"
					autoComplete="disabled"
				/>
				<Field name="orgAdminFirstName" component={this.renderInput} label="First name:" />
				<Field name="orgAdminLastName" component={this.renderInput} label="Last name:" />
				<Field name="orgAdminEmail" component={this.renderInput} type="email" label="eMail:" />
				<Field name="orgAdminAddress" component={this.renderInput} label="Address:" />
				<Field name="orgAdminCity" component={this.renderInput} label="City:" />
				<Field name="orgAdminState" component={this.renderInput} label="State:" />
				<Field name="orgAdminZip" component={this.renderInput} type="number" label="ZIP:" />
				<Field
					name="verificationUpload"
					component={this.renderInput}
					label="Upload Verification Letter:"
					type="file"
					accept=".jpg, .png, .jpeg, .pdf"
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

export default reduxForm({ form: 'streamForm', validate })(ClaimForm);
