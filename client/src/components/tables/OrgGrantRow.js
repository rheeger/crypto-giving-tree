import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { fetchTree } from "../../store/actions";
import { connect } from "react-redux";

class OrgGrantRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: ""
  };

  componentDidMount() {
    const { tree, fetchTree } = this.props;
    fetchTree(tree);
  }

  render() {
    const { id, tree, amount, description, date, gtTrees } = this.props;
    if (!gtTrees[tree]) {
      return <div>Loading...</div>;
    }

    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/trees/${tree}`}>{gtTrees[tree].branchName}</Link>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>${amount} DAI</Table.Cell>
        <Table.Cell>
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}.etherscan.io/tx/${id}`}
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
    gtTrees: state.gtTrees
  };
};

export default connect(mapStateToProps, { fetchTree })(OrgGrantRow);
