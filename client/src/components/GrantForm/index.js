import React from 'react';
import { Field, reduxForm } from 'redux-form';

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
					{options.map((option) => (
						<option key={option.id} value={JSON.stringify(option.id)}>
							{option.branchName} -- (Available Balance: ${option.grantableDAI})
						</option>
					))}
				</select>
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
					component={this.renderInput}
					value="null"
					type="radio"
					label="Terms and Conditions:"
				>
					I Agree
				</Field>
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

export default reduxForm({ form: 'branchForm', validate })(GrantForm);
