import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import HomeCard from './../components/homecard';

const styles = {
  hcard: {
    padding: "20%",
  }
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.handleWidgetAction = this.handleWidgetAction.bind(this);
  };

  handleWidgetAction = (action) => {
    console.log("Page Action=", action);
    this.props.history.push("/files");
    
    if(this.props.handlePageAction) {
      this.props.handlePageAction(action);
    }
  };

  render = () => {
    return (
      <div className={this.props.classes.hcard}>
        <HomeCard actionHandler={this.handleWidgetAction} />
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);