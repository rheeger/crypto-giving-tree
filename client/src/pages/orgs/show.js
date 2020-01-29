import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Card, Grid, Table } from "semantic-ui-react";
import {
  fetchOrgLifetimeGrants,
  selectOrg,
  fetchOrg,
  fetchOrgs
} from "../../store/actions/orgs";
import { fetchOrgApprovedGrants } from "../../store/actions/grants";
import { createOrgWithdrawl } from "../../store/actions/withdrawls";
import OrgGrantRow from "../../components/tables/OrgGrantRow";
import NavHeader from "../../components/Header";
import moment from "moment";
import { updateAppTab } from "../../store/actions/appTab";

class OrgShow extends React.Component {
  initialState = {};

  componentDidMount() {
    const {
      selectOrg,
      fetchOrgApprovedGrants,
      match,
      fetchOrgLifetimeGrants,
      fetchOrgs,
      updateAppTab
    } = this.props;
    selectOrg(match.params.ein);
    fetchOrgs();
    fetchOrgApprovedGrants(match.params.ein);
    fetchOrgLifetimeGrants(match.params.ein);
    updateAppTab("orgs");
  }

  renderRow() {
    if (Object.keys(this.props.gtGrants).length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          No grants received. Be the first today! &nbsp;
          <Link to={`/orgs/${this.props.match.params.ein}/grants/new`}>
            <Button compact color="green" style={{ marginLeft: "1rem" }}>
              <i className="paper plane icon" />
              send grant
            </Button>
          </Link>
        </div>
      );
    }
    return Object.values(this.props.gtGrants)
      .reverse()
      .map((grant, index) => {
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
              grantApproval={grant.grantApproval}
              approvalDetails={grant.approvalDetails}
            />
          );
        } else {
          return null;
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
          <Button compact color="blue">
            <i className="clipboard check icon" />
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
        <Button onClick={this.onCashOut} floated="left" compact color="green">
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
      return (
        <div>
          <NavHeader />
          Loading...
        </div>
      );
    }
    return (
      <div>
        <NavHeader />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "900px" }}>
            <h2>Organization Details:</h2>
            <Grid style={{ margin: "0 auto" }} className="Container">
              <Grid.Column width={11}>{this.renderOrgDetails()}</Grid.Column>
              <Grid.Column width={5}>
                <Link to={`/orgs/${this.props.match.params.ein}/grants/new`}>
                  <Button floated="left" compact color="green">
                    <i className="paper plane icon" />
                    send grant
                  </Button>
                </Link>
                {this.renderCashOut()}
              </Grid.Column>
              <Grid.Row>
                <h3>Completed Grants:</h3>
                <Table>
                  <Header>
                    <Row>
                      <HeaderCell>Date:</HeaderCell>
                      <HeaderCell>From:</HeaderCell>
                      <HeaderCell>Memo:</HeaderCell>
                      <HeaderCell>Amount:</HeaderCell>
                      <HeaderCell>Status:</HeaderCell>
                      <HeaderCell></HeaderCell>
                    </Row>
                  </Header>
                  <Body>{this.renderRow()}</Body>
                </Table>
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
  createOrgWithdrawl,
  updateAppTab
})(OrgShow);
