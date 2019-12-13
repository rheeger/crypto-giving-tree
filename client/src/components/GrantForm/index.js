import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'semantic-ui-react';

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
				<input {...input} type={type} /> I Agree
				{this.renderError(meta)}
			</div>
		);
	};

	renderTreeSelect = ({ input, label, options, meta, value, ...rest }) => {
		const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
		const parse = (event) => {
			return JSON.parse(event.target.value);
		};
		return (
			<div className={className}>
				<label>{label}</label>
				<select
					onBlur={(event) => input.onBlur(parse(event))}
					onChange={(event) => input.onChange(parse(event))}
					{...rest}
				>
					<option>select a tree:</option>
					{options.map((option, key) => (
						<option key={key} value={JSON.stringify(option)} >
							{option.branchName} -- (Available Balance: ${option.grantableDAI})
						</option>
					))}
				</select>
				{this.renderError(meta)}
			</div >
		);
	};

	onSubmit = (formValues) => {
		this.props.onSubmit(formValues);
	};

	render() {
		return (
			<form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
				<Field
					name="selectedTree"
					component={this.renderTreeSelect}
					type="ObjectSelect"
					options={Object.values(this.props.gtTrees)}
					label="Sending from:"
				/>
				<Field name="grantAmount" component={this.renderInput} type="number" label="Grant amount:" />
				<Field name="grantDescription" component={this.renderInput} type="text" label="Grant memo:" />
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
	if (!formValues.selectedTree) {
		errors.selectedTree = 'You must select a Giving Tree';
	}
	if (!formValues.grantAmount) {
		errors.grantAmount = 'You must enter a amount to grant';
	}
	if (!formValues.grantDescription) {
		errors.grantDescription = 'You must enter a description';
	}

	if (formValues.selectedTree) {
		if (formValues.grantAmount > formValues.selectedTree.grantableDAI) {
			errors.grantAmount = 'Grant amount exceeds grantable balance. Please lower grant amount';
		}
		if (formValues.selectedTree.grantableDAI < .01) {
			errors.selectedTree = 'Insuficient Funds. Please contribute to this Giving Tree'
		}

	}
	if (!formValues.tncconsent) {
		errors.tncconsent = 'You must accept the terms and conditions';
	}

	return errors;
};

export default reduxForm({ form: 'grantForm', validate })(GrantForm);
