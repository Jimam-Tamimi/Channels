import {jwtDecode} from 'jwt-decode';

export const isTokenValid = (token: string) => {
  const decoded: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};