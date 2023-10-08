import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { signin } from '../../../redux/userSlice';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigateToHome = () => {
    navigate('/dashboard', { replace: true });
  };
  const handleClick = () => {
    if (!email) {
      alert('Please enter email');
      return;
    }
    if (!password) {
      alert('Please enter password');
      return;
    }
    if (password.length < 8) {
      alert('Password must be 8 characters long.');
      return;
    }
    dispatch(signin({ email, password, callback: navigateToHome }));
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            setPass(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Login
        </LoadingButton>
      </Stack>
    </>
  );
}
