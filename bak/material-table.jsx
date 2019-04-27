import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import MaterialTable from 'material-table';


const electron = window.require('electron');
const XLSX = electron.remote.require('xlsx');

const INPUT_FILE = "./config/data_csv.csv";

const styles = {
  filelist: {
    padding: "1%",
  }
};

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
      cols: []  /* Array of column objects e.g. { name: "C", K: 2 } */
    };
    this.handleFile = this.handleFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  };
  componentDidMount() {
    this.handleFile(INPUT_FILE);
  }
  handleFile(file) {
    var wb = XLSX.readFile(file);
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];

    let data = XLSX.utils.sheet_to_json(ws, { header: 1, skipHeader: true });
    data.shift();
    this.setState({ data: data, cols: make_cols() });
  };
  exportFile() {
    const ws = XLSX.utils.aoa_to_sheet(this.state.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    XLSX.writeFile(wb, "sheetjs.xlsx");
  };

  handleClose = () => {
    this.props.history.push("/");
  };

  render = () => {
    return (
      <div className={this.props.classes.filelist}>
        <IconButton aria-label="Close" onClick={this.handleClose}>
          <HomeIcon />
        </IconButton>
        <div className="row"><div className="col-xs-12">
          <div style={{ maxWidth: '100%' }}>
            <MaterialTable
              columns={[
                { title: 'S.No', field: '0', editable: 'never'},
                { title: 'Name', field: '1', editable: 'never'},
                { title: 'Price', field: '2', type: 'numeric', editable: 'always'},
                { title: 'Qty', field: '3', lookup: { 1: '1', 2: '2' }, editable: 'never'}
              ]}
              options={{pageSize: 10}}
              data={this.state.data}
              title="Entry Viewer"
              editComponent={EditRow}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data;
                        const index = data.indexOf(oldData);
                        data[index] = newData;                
                        this.setState({ data }, () => resolve());
                      }
                      resolve();
                    }, 1000);
                  }),
              }}
            />
          </div>

        </div></div>
      </div>
    );
  }
};

Viewer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const make_cols = () => {
  let o = ["sno", "name", "qty"];

  return o;
};

class EditRow extends React.Component {
  constructor(props) { super(props); };
  render() {
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>{this.props.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
        </table>
      </div>
    );
  };
};

class OutTable extends React.Component {
  constructor(props) { super(props); };
  render() {
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>{this.props.cols.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {this.props.data.map((r, i) => <tr key={i}>
              {this.props.cols.map(c => <td key={c}>{r[c]}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
    );
  };
};

export default withStyles(styles)(Viewer);