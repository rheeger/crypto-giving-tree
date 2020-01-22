import React from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";
import { NotificationSpinner } from "../Spinner";
import { Button } from "semantic-ui-react";
import success from "../../assets/images/success.svg";
import { updateNCStatus } from "../../store/actions";

class NotificationCenter extends React.Component {
  renderClose = async () => {
    const { updateNCStatus } = this.props;
    await updateNCStatus("", "", "");
    return;
  };

  render() {
    const { ncStatus } = this.props;

    if (!ncStatus.headline || !this.props) return null;
    return (
      <NotificationCenterWrapper>
        <NotificationWrapper>
          <LeftBlock>
            <StatusImage status={ncStatus.status} />
            <InfoBlock>
              <NotificationStatus>{ncStatus.headline}</NotificationStatus>
              <NotificationInfo>{ncStatus.message}</NotificationInfo>
            </InfoBlock>
          </LeftBlock>
          <ButtonBlock>
            <Button onClick={this.renderClose}>CLOSE</Button>
          </ButtonBlock>
        </NotificationWrapper>
      </NotificationCenterWrapper>
    );
  }
}

const StatusImage = ({ status }) => {
  if (status === "pending") {
    return <NotificationSpinner isSmall={true} />;
  }
  if (status === "success") {
    return <StatusImageWrapper src={success} />;
  }
  return;
};

const NotificationCenterWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: calc(100% - 100vh + 20px);
  z-index: 100;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NotificationWrapper = styled.div`
  animation: ${fadeIn} 0.1s linear both;
  width: 500px;
  height: 72px;
  background-color: white;
  border: 1px solid white;
  border-radius: 5px;
  box-shadow: 0 4px 11px -3px #a59fb7;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const StatusImageWrapper = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const LeftBlock = styled.div`
  display: flex;
  align-items: center;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationStatus = styled.p`
  font-family: all-round-gothic;
  font-weight: 600;
  line-height: 5px;
  letter-spacing: 0.44px;
  padding-top: 10px;
`;

const NotificationInfo = styled.p`
  font-family: all-round-gothic;
  font-size: 12px;
  color: grey;
  letter-spacing: 0.15px;
  margin-top: -5px;
`;

const ButtonBlock = styled.div`
  display: flex;
  & > :last-child {
    margin-left: 10px;
  }
`;

const mapStateToProps = state => {
  return { ncStatus: state.ncStatus };
};

export default connect(mapStateToProps, { updateNCStatus })(NotificationCenter);
