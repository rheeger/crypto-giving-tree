import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { updateNCStatus } from "../../store/actions/ncStatus";
import { createFundAndContract } from "../../store/actions/funds";
import BranchForm from "../../components/BranchForm";
import Header from "../../components/Header";
import { updateAppTab } from "../../store/actions/appTab";

class NewFund extends React.Component {
  state = {
    ready: "false",
    loading: false,
    isShowingModal: false
  };

  componentDidMount() {
    this.setState({ ready: "false" });
    this.props.updateAppTab("funds");
  }

  renderStatusChange = async (headline, message, status) => {
    const { updateNCStatus } = this.props;
    await updateNCStatus(headline, message, status);
    return;
  };

  onSubmit = async formValues => {
    this.setState({ loading: true });
    await this.renderStatusChange(
      "Creating Fund...",
      "Please do not refresh this page.",
      "pending"
    );
    await this.props.createFundAndContract(formValues);
    await this.renderStatusChange(
      "Fund Created!",
      "You may now contribute tokens to your new fund.",
      "success"
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
    if (this.state.ready === "true") {
      return (
        <div>
          <Header />

          <div
            style={{
              margin: "1rem auto",
              marginBottom: "5rem",
              textAlign: "left",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
              width: "700px"
            }}
          >
            <div style={{ width: "500px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Start a Fund:</h2>
                <div>
                  <Button
                    onClick={this.renderWhatsThis}
                    className="small ui button compact"
                  >
                    What's this?
                  </Button>
                </div>
              </div>
              <BranchForm
                onSubmit={this.onSubmit}
                loading={this.state.loading}
              />
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
            margin: "5rem auto",
            textAlign: "left",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            maxWidth: "450px"
          }}
        >
          <div>
            <h1>What is this? </h1>
            <p>some things to know...</p>
            <h3>
              1. Each new fund is equivalent to a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Donor-advised_fund"
                target="blank"
              >
                U.S. Donor-Advised Fund
              </a>
              .
            </h3>
            <h3>
              2. You can easily contribute cryptocurrency to your Fund.&nbsp;
              {"  "}
              <span
                style={{
                  fontFamily: "all-round-gothic",
                  fontWeight: "600",
                  fontSize: "1.5rem"
                }}
              >
                endaoment
              </span>
              &nbsp; supports{" "}
              <a href="https://uniswap.info/" target="blank">
                any token with a Uniswap Exchange Contract.
              </a>
            </h3>
            <h3>
              3. Contributed tokens are exchanged by
              {"  "}
              <span
                style={{
                  fontFamily: "all-round-gothic",
                  fontWeight: "600",
                  fontSize: "1.5rem"
                }}
              >
                endaoment
              </span>
              &nbsp; for USDC (
              <a href="https://www.centre.io/usdc" target="blank">
                learn more
              </a>
              ). <br></br>Use the exchanged funds to reccomend grants to any
              501(c)(3) at your own pace.
            </h3>
            <br />

            <Button
              onClick={this.renderBranchForm}
              className="ui button compact green"
            >
              <i className="check icon" />
              Got it
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
    web3: state.web3connect
  };
};

export default connect(mapStateToProps, {
  createFundAndContract,
  updateNCStatus,
  updateAppTab
})(NewFund);
