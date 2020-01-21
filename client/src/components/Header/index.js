import React from "react";
import { connect } from "react-redux";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
  Web3Connect,
  startWatching,
  initialize
} from "../../store/reducers/web3connect";
import { setAddresses } from "../../store/reducers/swapAddresses";
import NotificationCenter from "../NotificationCenter";

class Header extends React.Component {
  componentDidMount() {
    const { initialize, startWatching } = this.props;
    try {
      initialize().then(startWatching);
    } catch (err) {
      console.log(err);
    }
  }

  componentDidUpdate() {
    const { web3, setAddresses } = this.props;

    if (
      this.hasSetNetworkId ||
      !web3 ||
      !web3.eth ||
      !web3.eth.net ||
      !web3.eth.net.getId
    ) {
      return;
    }

    web3.eth.net.getId((err, networkId) => {
      if (!err && !this.hasSetNetworkId) {
        setAddresses(networkId);
        this.hasSetNetworkId = true;
      }
    });
  }

  truncateAccount() {
    const { account } = this.props;
    return account.substring(0, 4) + "..." + account.substring(39, 42);
  }

  renderAccount() {
    const { account, initialized } = this.props;

    if (!account && !initialized) {
      return (
        <div>
          <Web3Connect />
          <Button
            style={{ margin: "1rem 1rem 1rem auto", padding: "10px" }}
            className="ui button basic grey"
            loading
          >
            Connecting
          </Button>
        </div>
      );
    }

    return (
      <Button
        className="ui button basic black"
        disabled
        style={{ margin: "auto 1rem 1rem auto", padding: "10px" }}
      >
        <i className="user circle outline icon" />
        {this.truncateAccount()}
      </Button>
    );
  }
  renderFundsButton() {
    if (!this.props.gtFunds) {
      return;
    }
    if (Object.keys(this.props.gtFunds).length === 0) {
      return (
        <Link
          to="/funds/new"
          className="ui button basic green"
          style={{ margin: "1rem auto", padding: "10px" }}
        >
          <i className="plus circle icon" />
          Start a Fund
        </Link>
      );
    }
    if (Object.keys(this.props.gtFunds).length > 0) {
      return (
        <Link
          to="/funds"
          className="ui button basic green"
          style={{ margin: "1rem auto", padding: "10px" }}
        >
          <i className="eye icon" />
          My Funds
        </Link>
      );
    }
  }

  render() {
    return (
      <div>
        <Menu style={{ margin: "1rem" }}>
          <Link to="/alpha" className="item">
            <h1
              style={{
                fontFamily: "all-round-gothic, sans-serif",
                fontWeight: "500",
                fontStyle: "normal",
                fontmargin: "0 auto",
                fontSize: "2rem"
              }}
            >
              endaoment
            </h1>
          </Link>

          <Menu.Menu position="right">
            <h6 style={{ paddingRight: "2rem", color: "red" }}>
              THIS IS A DEMO, USE AT YOUR OWN RISK!
            </h6>
            {this.renderFundsButton()}
            <Link
              to="/orgs"
              style={{ margin: "1rem", padding: "10px" }}
              className="ui button basic blue"
            >
              <i className="sistrix medium icon" />
              Organizations
            </Link>
            {this.renderAccount()}
          </Menu.Menu>
        </Menu>
        <NotificationCenter></NotificationCenter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds,
    web3: state.web3connect,
    account: state.web3connect.account,
    initialized: state.web3connect.initialized
  };
};

export default connect(mapStateToProps, dispatch => ({
  setAddresses: networkId => dispatch(setAddresses(networkId)),
  initialize: () => dispatch(initialize()),
  startWatching: () => dispatch(startWatching())
}))(Header);
