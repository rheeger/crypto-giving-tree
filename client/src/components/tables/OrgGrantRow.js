import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { fetchFund } from "../../store/actions";
import { connect } from "react-redux";

class OrgGrantRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: ""
  };

  componentDidMount() {
    const { fund, fetchFund } = this.props;
    fetchFund(fund);
  }

  render() {
    const { id, fund, amount, description, date, gtFunds } = this.props;
    if (!gtFunds[fund]) {
      return <div>Loading...</div>;
    }

    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/funds/${fund}`}>{gtFunds[fund].branchName}</Link>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>${amount}</Table.Cell>
        <Table.Cell>
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}etherscan.io/tx/${id}`}
            target="blank"
          >
            <Button color="green" basic>
              View on Etherscan
            </Button>
          </a>
        </Table.Cell>
      </Table.Row>
    );
  }
}
const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds
  };
};

export default connect(mapStateToProps, { fetchFund })(OrgGrantRow);
