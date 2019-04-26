import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import FileTable from './../components/filetable';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

const INPUT_DIRECTORY = "./config";

const styles = {
  filelist: {
    padding: "1%",
  }
};

class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.handleWidgetAction = this.handleWidgetAction.bind(this);
  };

  handleWidgetAction = (action) => {
    console.log("Page Action=", action);
    if(this.props.handlePageAction) {
      this.props.handlePageAction(action);
    }
  };

  handleHome = () => {
    this.props.history.push("/");
  };

  render = () => {
    return (
      <div className={this.props.classes.filelist}>
        <IconButton aria-label="Home" onClick={this.handleHome}>
            <HomeIcon />
        </IconButton>
        <FileTable directory={INPUT_DIRECTORY} actionHandler={this.handleWidgetAction} />
      </div>
    );
  }
};

FileList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileList);