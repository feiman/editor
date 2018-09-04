const UP_API = '/api/oss-up';

export default async function upload(file) {
  const fd = new FormData();
  fd.append('upimg', file);

  const req = await fetch(UP_API, {
    method: 'POST',
    body: fd,
  });

  const res = await req.json();
  res.url = `https://sc.seeyouyima.com/${res.name}`;

  return res;
}
