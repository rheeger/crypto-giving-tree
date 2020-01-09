import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { fetchOrg } from "../../store/actions";

class GrantRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: ""
  };

  componentDidMount() {
    const { fetchOrg, recipient } = this.props;
    fetchOrg(recipient);
  }

  render() {
    const { id, recipient, amount, description, date, gtOrgs } = this.props;
    if (!gtOrgs[recipient]) {
      return <div>Loading...</div>;
    }
    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/orgs/${recipient}`}>{gtOrgs[recipient].name} </Link>
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
    gtOrgs: state.gtOrgs
  };
};

export default connect(mapStateToProps, { fetchOrg })(GrantRow);
