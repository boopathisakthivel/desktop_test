import React from 'react';
import ReactDOM from 'react-dom';
import { Editors } from "react-data-grid-addons";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import ReactDataGrid from 'react-data-grid';
import './viewer.css';

import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

import printJS from 'print-js';

import { HotKeys } from "react-hotkeys";


const electron = window.require('electron');
const XLSX = electron.remote.require('xlsx');
const fs = electron.remote.require('fs');
const { BrowserWindow } = electron.remote;
const PDFWindow = electron.remote.require('electron-pdf-window');


const INPUT_FILE = "./config/data_csv.csv";

const keyMap = {
  delete: ["del", { sequence: "backspace", action: "keyup" }],
  expand: ["ctrl+p", "command+option+n"],
  contract: "alt+down",
  konami: "up up down down left right left right b a enter",
  commandDown: { sequence: "command", action: "keydown" },
  commandUp: { sequence: "command", action: "keyup" }
};


const generatePdf = () => {
  const doc = new jsPDF();
  doc.text(20, 20, 'This is the default font.');
	
  doc.setFont("courier");
  doc.text(20, 30, 'This is courier normal.');
    
  doc.setFont("times");
  doc.setFontType("italic");
  doc.text(20, 40, 'This is times italic.');
    
  doc.setFont("helvetica");
  doc.setFontType("bold");
  doc.text(20, 50, 'This is helvetica bold.');
    
  doc.setFont("courier");
  doc.setFontType("bolditalic");
  doc.text(20, 60, 'This is courier bolditalic.');

  doc.autoTable({
      styles: {fillColor: [255, 0, 0]},
      columnStyles: {0: {halign: 'center', fillColor: [0, 255, 0]}}, // Cells in first column centered and green
      margin: {top: 10},
      body: [['Sweden', 'Japan', 'Canada'], ['Norway', 'China', 'USA'], ['Denmark', 'China', 'Mexico']]
  });
  fs.writeFileSync('./output.pdf', doc.output());
  doc.autoPrint({variant: 'non-conform'});
  //doc.save('table.pdf');
  //doc.output('pdfobjectnewwindow');
  //window.open(doc.output('datauristring'));
  let win = new BrowserWindow(
    { width: 800, height: 600 ,
    webPreferences: {
      modal: true,
      parent: electron.remote.getCurrentWindow(),
      nodeIntegration: false,
      plugins: true,
      resizable:  false,
                            'skip-taskbar': true,
                            alwayOnTop: true
    }});
 
  PDFWindow.addSupport(win);
  win.setMenu(null);

  win.loadURL(`file://D:/dev/learning/desktop_test/output.pdf`);

  win.webContents.on('did-finish-load', () => {
    win.webContents.print({silent: false});
    win = null;
  });

  //fs.writeFileSync('./output.pdf', doc.output());

  //printJS({printable: l});
}

const styles = {
  filelist: {
    padding: "1%",
  }
};

const header = {
  textAlign: 'right',
  borderRadius: 0,
  borderBottom: 0,
  boxSizing: 'border-box',
  top: '10px',
}

const row = {
  padding: '10px 0',
}

const iRow = {
}

const footer = {
  textAlign: 'right',
  borderRadius: 0 ,
  borderBottom: 0,
  boxSizing: 'border-box',
}

const  root = {
  flexGrow: 1,
}

const { DropDownEditor } = Editors;

function fillDropdown(min, max) {
  let series = [];

  for(let i=min; i<=max; i++) {
    series.push({ id: i, value: i });
  }
  return series;
}

const issueTypes = fillDropdown(1, 150);

const IssueTypeEditor = <DropDownEditor options={issueTypes} />;

class QtyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { val: props.value };
  }

  getValue() {
    return { labelVal: this.state.val };
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
  }

  handleChangeComplete = inputVal => {
    this.setState({ val: inputVal }, () => this.props.onCommit());
  };
  render() {
    return (
      <input value={this.state.val} onChange={this.handleChangeComplete}/>
    );
  }
}

const center = {
  textAlign: 'center'
}

const ProgressBarFormatter = ({ value }) => {
  return <div now={value} label={`${value}%`} />;
};

const columns = [
  { key: '0', name: 'S.No', resizable: true, width: 50, cellClass: {center}},
  { key: '1', name: 'Name' },
  { key: '2', name: 'Price'},
  { key: '3', name: 'Qty', editable: true}
];

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
      cols: []  /* Array of column objects e.g. { name: "C", K: 2 } */
    };
    this.handleFile = this.handleFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
    this.handleRowUpdate = this.handleRowUpdate.bind(this);
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

  handleRowUpdate = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const data = state.data.slice();
      for (let i = fromRow; i <= toRow; i++) {
        data[i] = { ...data[i], ...updated };
      }
      return { data };
    });
  };

  commandUp() {
    console.log("command up");
    generatePdf();
  }
  render = () => {
    this.commandUp = this.commandUp.bind(this);

    const handlers = {
      expand: this.commandUp
    };

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
      <div style={root}>
          <div>
              <div  item xs={12}>
                <div style={header}>
                  <IconButton aria-label="Close" onClick={this.handleClose}>
                    <HomeIcon />
                  </IconButton>
                </div>
              </div>
              <div style={row}>
                <ReactDataGrid
                    columns={columns}
                    rowGetter={i => this.state.data[i]}
                    rowsCount={this.state.data.length}
                    minHeight={window.outerHeight - 150}
                    onGridRowsUpdated={this.handleRowUpdate}
                    enableCellSelect={true}
                  />
              </div>
              <div>
                <div style={footer}>
                  <Button onClick={generatePdf}> Print </Button>
                  <Button> Save </Button>
                  <Button> Close </Button>
                </div>
              </div>
          </div>
      </div>
      </HotKeys>
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


export default withStyles(styles)(Viewer);