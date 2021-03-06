import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const electron = window.require('electron');
const electronFS = electron.remote.require('fs');


let counter = 0;

function createData(name) {
  counter += 1;
  return { id: counter, name };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'File Name' }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, selectedText, handleSearch, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
            File List
          </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <div>
          <TextField  placeholder="Search" onChange={handleSearch} value={selectedText}/>
        </div>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  selectedText: PropTypes.string.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class FileTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'name',
    selected: [],
    selectedText: "",
    data: [],
    filterData: [],
    page: 0,
    rowsPerPage: 10,
  };

  componentDidMount() {
      generateFileTreeObject(this.props.directory).then((arrayOfFileNameStrings) => {
      console.log(arrayOfFileNameStrings);
      let fileList = [];

      arrayOfFileNameStrings.forEach((file, idx) => {
        fileList.push(createData(file));
      });

      this.setState({ data : fileList, filterData: fileList});
    });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, id, name) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let selectedText = "";

    if (selectedIndex < 0) {
      selectedText = name;
      newSelected.push(id);
    }

    this.setState({ selected: newSelected});
    this.props.actionHandler(null, name);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleSearch = event => {
    const {data} = this.state
    let filteredDatas = []
    filteredDatas = data.filter(e => {
        let mathesItems = Object.values(e)
        let retVal = true;
        mathesItems.forEach(e => {
            const regex = new RegExp(event.target.value, 'gi')
            if (typeof e == 'string')
                retVal = e.match(regex)
        })
        return retVal;
    })
    this.setState({filterData: filteredDatas, selectedText: event.target.value})
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { filterData, order, orderBy, selected, selectedText, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filterData.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} selectedText={selectedText} handleSearch={this.handleSearch}/>

        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={filterData.length}
            />
            <TableBody>
              {stableSort(filterData, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onDoubleClick={event => this.handleClick(event, n.id, n.name)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filterData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

FileTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

class FileTable1 extends React.Component {
  constructor() {
    super();
    this.state = { files: [] };
  };

  componentDidMount() {
      generateFileTreeObject(this.props.directory).then((arrayOfFileNameStrings) => {
      console.log(arrayOfFileNameStrings);
      let fileList = [];

      arrayOfFileNameStrings.forEach((file, idx) => {
        fileList.push({name: file});
      });

      this.setState({ files : fileList});
    });
  };
/*
  render() {
    const files = this.state.files;

    return (
      <MaterialTable
        title="File List"
        columns={[
          { title: 'Name', field: 'name' }
        ]}
        data={files}        
        options={{
          search: true
        }}
        actions={[
          {
            icon: 'save',
            tooltip: 'Save User',
            onClick: (event, rowData) => {
              // Do save operation
            }
          }
        ]}
      />
    )
  }
*/
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

/*
FileTable1.propTypes = {
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
*/

const generateFileTreeObject = directoryString => {
  return new Promise((resolve,reject) => {
    electronFS.readdir(directoryString, (err, arrayOfFileNameStrings) => {
        resolve(arrayOfFileNameStrings);
    });
  });
};

export default withStyles(styles)(FileTable);