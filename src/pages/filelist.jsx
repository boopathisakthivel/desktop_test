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

  handleWidgetAction = (action, name) => {
    console.log("Page Action=", action);
    if(this.props.handlePageAction) {
      this.props.handlePageAction(action);
    }
    this.props.history.push("/viewer");
  };

  handleHome = () => {
    this.props.history.push("/");
  };

  render = () => {
    let {history} = this.props.history;

    return (
      <div className={this.props.classes.filelist}>
        <IconButton aria-label="Home" onClick={this.handleHome}>
            <HomeIcon />
        </IconButton>
        <FileTable history={history} directory={INPUT_DIRECTORY} actionHandler={this.handleWidgetAction} />
      </div>
    );
  }
};

FileList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileList);