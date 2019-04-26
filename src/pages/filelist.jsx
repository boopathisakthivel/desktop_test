import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import FileTable from './../components/filetable';

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

  render = () => {
    return (
      <div className={this.props.classes.filelist}>
        <FileTable directory={INPUT_DIRECTORY} actionHandler={this.handleWidgetAction} />
      </div>
    );
  }
};

FileList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileList);