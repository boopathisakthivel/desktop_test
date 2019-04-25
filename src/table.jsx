import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const electron = window.require('electron');
const fs = electron.remote.require('fs');


class FileTable extends React.Component {
  constructor() {
    super();
    this.state = { files: [] };
  };

  componentDidMount() {
      generateFileTreeObject(this.props.directory).then((arrayOfFileNameStrings) => {
      console.log(arrayOfFileNameStrings);

      this.setState({ files : arrayOfFileNameStrings});
    });
  };


  render() {
    const files = this.state.files;

    return (
      <ul>
        {files && files.map(file => {
          return <li key={file}>{`${file}`}</li>
          })
        }
      </ul>
    );
  }
}

FileTable.propTypes = {
  directory: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const generateFileTreeObject = directoryString => {
  return new Promise((resolve,reject) => {
      fs.readdir(directoryString, (err, arrayOfFileNameStrings) => {
        resolve(arrayOfFileNameStrings);
    });
  });
};

export default withStyles(styles)(FileTable);