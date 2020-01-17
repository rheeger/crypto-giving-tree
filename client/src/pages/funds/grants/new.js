import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
  createGrant,
  selectOrg,
  fetchOrgs,
  createOrgAndContract
} from "../../../store/actions";
import GrantForm from "../../../components/GrantForm";
import Header from "../../../components/Header";

class NewGrant extends React.Component {
  state = {
    ready: "false",
    loading: false
  };

  componentDidMount = async () => {
    const { selectOrg, fetchOrgs, match } = this.props;
    this.setState({ ready: "false" });
    selectOrg(match.params.ein);
    fetchOrgs();
  };

  setupOrg = async id => {
    await this.props.createOrgAndContract(id, this.props.org.organization.name);
    await this.props.fetchOrgs();
  };

  onSubmit = async formValues => {
    this.setState({ loading: true });
    await this.props.createGrant(
      formValues,
      this.props.gtOrgs[`${this.props.match.params.ein}`].contractAddress,
      this.props.match.params.ein,
      this.props.web3.account
    );
    this.setState({ loading: false });
  };

  renderBranchForm = () => {
    this.setState({ ready: "true" });
  };

  renderWhatsThis = () => {
    this.setState({ ready: "false" });
  };

  render() {
    if (!this.props.org.organization || !this.props.gtOrgs) {
      return (
        <div>
          <Header />

          <div>Loading Organization Details</div>
        </div>
      );
    }

    if (
      this.state.ready === "true" &&
      this.props.gtOrgs[`${this.props.match.params.ein}`]
    ) {
      return (
        <div>
          <Header />
          <div
            className="ui container"
            style={{ display: "flex-flow", justifyContent: "center" }}
          >
            <div
              style={{ padding: "1rem", marginBottom: "1rem", width: "700px" }}
            >
              <h4>You're reccomending a grant to:</h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>{this.props.org.organization.name}</h1>
                <div>
                  <Button
                    onClick={this.renderWhatsThis}
                    className="ui button basic yellow"
                  >
                    What's this?
                  </Button>
                  <Link
                    to={`/orgs/${this.props.org.organization.ein}`}
                    className="ui button basic green"
                  >
                    <i className="address card icon" />
                    Org Details
                  </Link>
                </div>
              </div>

              <GrantForm
                onSubmit={this.onSubmit}
                loading={this.state.loading}
                gtFunds={this.props.gtFunds}
              />
            </div>
          </div>
        </div>
      );
    }

    if (
      (this.state.ready === "true" &&
        this.props.gtOrgs &&
        !this.props.gtOrgs[`${this.props.match.params.ein}`]) ||
      (this.state.loading === true &&
        this.props.gtOrgs[`${this.props.match.params.ein}`] === undefined)
    ) {
      this.setupOrg(this.props.match.params.ein);
      return (
        <div>
          <Header />
          <div className="ui container">
            <div
              style={{
                textAlign: "center",
                display: "flex-flow",
                alignContent: "center"
              }}
            >
              <h1>Hang tight!</h1>
              <p>Looks like you'll be the first to reccomend a grant to: </p>
              <h3>{this.props.org.organization.name}</h3>
              <h6>
                We're setting up their account. We'll process your grant
                reccomendation next.
              </h6>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <div
          style={{
            margin: "0px auto",
            textAlign: "left",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "40vh",
            maxWidth: "350px"
          }}
        >
          <div>
            <h1>What is a Grant? </h1>
            <p>some things to know...</p>
            <h3>
              1. Each grant represents an instruction to a Fund to make a
              donation to a qualifyiing 501(c)3 organziation.
            </h3>
            <h3>
              2. Set the amount to grant and provide a short description memo,
              if needed.
            </h3>
            <h3>
              3. The staff at &nbsp;
              <span
                style={{ fontFamily: "all-round-gothic", fontSize: "1.5rem" }}
              >
                endaoment
              </span>
              &nbsp; will review the grant, notify the organization and finalize
              distribution.
            </h3>
            <br />

            <Button
              onClick={this.renderBranchForm}
              floated="left"
              className="ui button basic green"
            >
              Got It!
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds,
    web3: state.web3connect,
    org: state.org,
    gtOrgs: state.gtOrgs
  };
};

export default connect(mapStateToProps, {
  selectOrg,
  fetchOrgs,
  createOrgAndContract,
  createGrant
})(NewGrant);
