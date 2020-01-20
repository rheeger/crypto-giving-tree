import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Card, Grid, Table } from "semantic-ui-react";
import {
  selectOrg,
  fetchOrg,
  fetchOrgLifetimeGrants,
  fetchOrgApprovedGrants,
  fetchOrgs,
  createOrgWithdrawl
} from "../../store/actions";
import OrgGrantRow from "../../components/tables/OrgGrantRow";
import NavHeader from "../../components/Header";
import moment from "moment";

class OrgShow extends React.Component {
  initialState = {};

  componentWillMount() {
    const {
      selectOrg,
      fetchOrgApprovedGrants,
      match,
      fetchOrgLifetimeGrants,
      fetchOrgs
    } = this.props;
    selectOrg(match.params.ein);
    fetchOrgApprovedGrants(match.params.ein);
    fetchOrgLifetimeGrants(match.params.ein);
    fetchOrgs();
  }

  renderRow() {
    if (Object.keys(this.props.gtGrants).length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          No grants received. Be the first today!
        </div>
      );
    }
    return Object.values(this.props.gtGrants).map((grant, index) => {
      if (
        grant.selectedOrg === this.props.match.params.ein &&
        grant.grantApproval === true
      ) {
        return (
          <OrgGrantRow
            key={grant.id}
            id={grant.id}
            fund={grant.selectedFund}
            amount={grant.grantAmount}
            date={grant.grantDate}
            description={grant.grantDescription}
          />
        );
      } else {
        return (
          <div style={{ textAlign: "center", padding: "10px" }}>
            No grants received. Be the first today!
          </div>
        );
      }
    });
  }

  renderOrgDetails() {
    const {
      name,
      ruling_date,
      address,
      city,
      state,
      zipcode,
      updated_at
    } = this.props.org.organization;
    const { match, gtOrgs } = this.props;

    if (!gtOrgs[match.params.ein]) {
      const items = [
        {
          style: { overflowWrap: "break-word" },
          header: name,
          description: "last updated: " + updated_at,
          extra: "est: " + ruling_date,
          fluid: true
        },
        {
          header: "$0 Donated",
          // header: web3.utils.fromWei(minimumContribution, 'ether'),
          description: "Be the first to Donate!"
        },
        {
          header: address,
          // header: web3.utils.fromWei(balance, 'ether'),
          extra: zipcode,
          description: city + ", " + state
        }
      ];

      return <Card.Group items={items} />;
    }

    const items = [
      {
        style: { overflowWrap: "break-word" },
        header: name,
        description:
          "last updated: " + moment(updated_at).format("MM/DD/YY h:mma"),
        extra: "est: " + ruling_date,
        fluid: true
      },
      {
        header: "$" + gtOrgs[match.params.ein].lifetimeGrants,
        // header: web3.utils.fromWei(minimumContribution, 'ether'),
        description: "Raised to date"
      },
      {
        header: address,
        // header: web3.utils.fromWei(balance, 'ether'),
        extra: zipcode,
        description: city + ", " + state
      }
    ];

    return <Card.Group items={items} />;
  }

  renderCashOut() {
    const { match, gtOrgs, web3connect } = this.props;
    if (!gtOrgs[match.params.ein] || gtOrgs[match.params.ein].claimed === false)
      return (
        <Link to={`/orgs/${this.props.match.params.ein}/claim`}>
          <Button basic color="yellow">
            Claim Org
          </Button>
        </Link>
      );

    if (
      gtOrgs[match.params.ein].claimed &&
      process.env.REACT_APP_GT_ADMIN !== web3connect.account
    ) {
      return;
    }
    if (gtOrgs[match.params.ein].claimed)
      return (
        <Button onClick={this.onCashOut} floated="left" basic color="green">
          <i className="dollar icon" />
          Cash Out
        </Button>
      );
  }

  onCashOut = async () => {
    const { match, gtOrgs, createOrgWithdrawl } = this.props;
    console.log("cashing out");
    await createOrgWithdrawl(
      match.params.ein,
      gtOrgs[match.params.ein].contractAddress,
      gtOrgs[match.params.ein].claimApprovalDetails.orgAdminWallet
    );
  };

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    if (
      !this.props.org.organization ||
      !this.props.gtGrants ||
      !this.props.gtOrgs
    ) {
      return <div> Loading... </div>;
    }
    return (
      <div>
        <NavHeader />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "900px" }}>
            <Grid style={{ margin: "0 auto" }} className="Container">
              <Grid.Column width={11}>{this.renderOrgDetails()}</Grid.Column>
              <Grid.Column width={5}>
                <h3>Actions:</h3>
                <Link to={`/orgs/${this.props.match.params.ein}/grants/new`}>
                  <Button floated="left" basic color="red">
                    <i className="paper plane icon" />
                    send grant
                  </Button>
                </Link>
                {this.renderCashOut()}
              </Grid.Column>
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Completed Grants:</h3>
                  <Table>
                    <Header>
                      <Row>
                        <HeaderCell>Request Date</HeaderCell>
                        <HeaderCell>Issuing Tree</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderRow()}</Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    org: state.org,
    gtGrants: state.gtGrants,
    gtOrgs: state.gtOrgs,
    web3connect: state.web3connect
  };
};

export default connect(mapStateToProps, {
  selectOrg,
  fetchOrgApprovedGrants,
  fetchOrg,
  fetchOrgLifetimeGrants,
  fetchOrgs,
  createOrgWithdrawl
})(OrgShow);
