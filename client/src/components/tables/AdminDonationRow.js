import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

class AdminDonationRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: "",
    donorName: "Unknown Donor",
    fundName: this.props.recipient
  };

  componentDidMount() {
    this.renderDonorName();
    this.renderFundName();
  }

  renderDonorName() {
    const { gtFunds, from } = this.props;
    return Object.values(gtFunds).map((gtFunds, key) => {
      if (from === gtFunds.managerAddress) {
        return this.setState({
          donorName: `${gtFunds.primaryAdvisorFirstName} ${gtFunds.primaryAdvisorLastName}`
        });
      } else {
        return this.props.recipient;
      }
    });
  }

  renderFundName() {
    const { gtFunds, recipient } = this.props;
    return Object.values(gtFunds).map((gtFunds, key) => {
      if (recipient === gtFunds.id) {
        return this.setState({ fundName: gtFunds.branchName });
      } else return null;
    });
  }

  renderStatus() {
    const { transStatus } = this.props;

    if (transStatus === "failure") {
      return (
        <div>
          <i className="times circle icon red"></i> Failure
        </div>
      );
    }

    if (transStatus === "success") {
      return (
        <div>
          <i className="check circle icon green"></i> Completed
        </div>
      );
    } else
      return (
        <div>
          <i className="clock icon yellow"></i> In Progress
        </div>
      );
  }

  render() {
    const {
      id,
      finalTradeOutput,
      donationAmount,
      inputCurrency,
      date,
      recipient
    } = this.props;

    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>{this.state.donorName}</Table.Cell>
        <Table.Cell>
          <Link to={`/funds/${recipient}`}>{this.state.fundName}</Link>
        </Table.Cell>
        <Table.Cell>
          {donationAmount} {inputCurrency}
        </Table.Cell>
        <Table.Cell>${finalTradeOutput}</Table.Cell>
        <Table.Cell>{this.renderStatus()}</Table.Cell>
        <Table.Cell>
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}etherscan.io/tx/${id}`}
            target="blank"
          >
            <Button compact>
              <i className="external alternarte icon" />
              View on Etherscan
            </Button>
          </a>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default AdminDonationRow;
