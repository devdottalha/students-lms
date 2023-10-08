import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal,
  TextField,
  Grid,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { createDocument, getCollectionDetails } from '../redux/firebaseHelper';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'studentName', label: 'Name', alignRight: false },
  { id: 'fatherName', label: 'Father Name', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'age', label: 'Age', alignRight: false },
  { id: 'courseName', label: 'Course Id', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function UserPage() {
  const [studentList, setStudentsList] = useState([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = studentList?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected?.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - studentList?.length) : 0;

  const filteredUsers = applySortFilter(studentList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    console.log('user');
    setIsOpen(true);
  };

  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    age: '',
    phone: '',
    email: '',
    courseName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const selectedCourse = courseOptions.find((course) => course.id === formData.courseId);
    // Handle form submission here, e.g., dispatch an action to save the data
    console.log('Form Data:', formData);

    // Reset the form after submission
    const student = await createDocument('Students', formData);
    setFormData({
      studentName: '',
      fatherName: '',
      age: '',
      phone: '',
      email: '',
      courseName: '',
    });
    setIsOpen(false);
  };

  const courseOptions = [
    { id: '1', name: 'Math', description: 'Mathematics Course' },
    { id: '2', name: 'Science', description: 'Science Course' },
    { id: '3', name: 'History', description: 'History Course' },
    // Add more courses as needed
  ];
  useEffect(() => {
    getCollectionDetails('Students', setStudentsList);
  }, []);
  return (
    <>
      <Helmet>
        <title> Students </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Students
          </Typography>
          <Button variant="contained" onClick={toggleModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Student
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected?.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={studentList?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                    console.log('row', row);
                    const { id, studentName, fatherName, email, phone, age, courseName } = row;
                    const selectedUser = selected.indexOf(studentName) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, studentName)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {studentName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{fatherName}</TableCell>

                        <TableCell align="left">{phone}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{age}</TableCell>
                        <TableCell align="left">{courseName}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={studentList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Card style={{ padding: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Age" name="age" value={formData.age} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Course Name</InputLabel>
                <Select name="courseName" value={formData.courseName} onChange={handleChange}>
                  {courseOptions.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Modal>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
