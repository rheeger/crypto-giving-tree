import React from "react";
import { connect } from "react-redux";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { startWatching, initialize } from "../../store/reducers/web3connect";
import { setAddresses } from "../../store/reducers/swapAddresses";
import NotificationCenter from "../NotificationCenter";
import endaoment from "../../assets/images/endaoment.svg";
import history from "../../history";
import { updateAppTab } from "../../store/actions/appTab";

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
    return account.slice(0, 4) + "..." + account.slice(-4);
  }

  renderAccount() {
    const { account, initialized } = this.props;

    if (!account && !initialized) {
      return (
        <div>
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
      <Link
        className={`ui button ${
          this.props.appTab === "funds" ? "" : "basic"
        } green`}
        to="/funds"
        style={{ margin: "auto 1rem 1rem auto", padding: "10px" }}
      >
        <i className="user circle outline icon" />
        {this.truncateAccount()}
      </Link>
    );
  }

  render() {
    const whitelist = [
      process.env.REACT_APP_MEW_MAIN,
      process.env.REACT_APP_PEEP_ETH,
      process.env.REACT_APP_BRAVE_WALLET,
      process.env.REACT_APP_GT_ADMIN
    ];
    if (
      this.props.web3.account &&
      !whitelist.includes(this.props.web3.account)
    ) {
      history.push("/");
    }
    return (
      <div>
        <Menu style={{ margin: "1rem" }}>
          <Link to="/alpha" className="item">
            {/* <h1
              style={{
                fontFamily: "all-round-gothic, sans-serif",
                fontWeight: "500",
                fontStyle: "normal",
                fontmargin: "0 auto",
                fontSize: "2rem"
              }}
            >
              endaoment
            </h1> */}
            <img
              alt="endaoment"
              style={{ width: "12rem", height: "3rem" }}
              src={endaoment}
            ></img>
          </Link>

          <Menu.Menu position="right">
            <h6 style={{ paddingRight: "2rem", color: "red" }}>
              THIS IS A DEMO, USE AT YOUR OWN RISK!
            </h6>
            <Link
              to="/orgs"
              style={{ margin: "1rem", padding: "10px" }}
              className={`ui button ${
                this.props.appTab === "orgs" ? "" : "basic"
              } blue`}
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

const mapStateToProps = (state, ownProps) => {
  return {
    appTab: state.appTab,
    gtFunds: state.gtFunds,
    web3: state.web3connect,
    account: state.web3connect.account,
    initialized: state.web3connect.initialized
  };
};

export default connect(mapStateToProps, dispatch => ({
  setAddresses: networkId => dispatch(setAddresses(networkId)),
  initialize: () => dispatch(initialize()),
  startWatching: () => dispatch(startWatching()),
  updateAppTab: appTab => dispatch(updateAppTab(appTab))
}))(Header);
