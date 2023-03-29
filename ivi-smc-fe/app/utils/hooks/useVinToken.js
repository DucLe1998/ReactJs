export function useVinToken() {
  const token = localStorage.getItem('token');
  const getUrl = (url) => [url, token].filter((o) => o).join('?token=');
  const hostName = process.env.SOCKET_HOST;
  const wsUrl = `${hostName}/?token=${token}`;
  return { token, getUrl, wsUrl };
}
