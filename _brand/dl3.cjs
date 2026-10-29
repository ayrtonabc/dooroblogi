const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Ayrton/Desktop/doorso/_brand/fb';

const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Referer: 'https://www.facebook.com/',
  Origin: 'https://www.facebook.com',
  Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'pl-PL,pl;q=0.9,en;q=0.8',
  'Sec-Fetch-Dest': 'image',
  'Sec-Fetch-Mode': 'no-cors',
  'Sec-Fetch-Site': 'cross-site',
};

const items = [
  ['smoked-oak-1', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/848043551_122259736010261379_796561496925229026_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=qedrCf7ForsQ7kNvwG-9cj1&_nc_oc=AdpWdl66kmJYhw0dNvq0HzSbU83jCjvTSDKV2Woz5kCh1_mkZ55LdfZHLQyB9x_p1gw&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=rZEXL02pxxTel87B0LsJPg&_nc_ss=79289&oh=00_AQPO7twF-wFK5iJJwyEcEg_p7JBBiSKCz2sq75T7VjsHKA&oe=6ADE7781'],
  ['smoked-oak-2', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/850328919_122259736292261379_3249906008041109766_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Oe9yirWasygQ7kNvwF5v6P_&_nc_oc=Adre0ycNKJXJ9cDLrMdu0KdYtithYZdDlFfDqAZPo95qeJz8lAihU8hvtTUvhiTC4VM&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=JRRUzgJT6qyDy6e1z3U_hw&_nc_ss=79289&oh=00_AQMe4cwmtY8ej4bEyWdjscHBhLK73XXFx4cUPZmVUHo2YQ&oe=6ADE8EC9'],
];

(async () => {
  for (const [name, url] of items) {
    const r = await fetch(url, { headers: H });
    const b = Buffer.from(await r.arrayBuffer());
    const ok = r.ok && b.slice(0, 3).toString('hex') === 'ffd8ff';
    console.log(`${name}: status=${r.status} len=${(b.length / 1024).toFixed(1)}KB jpg=${ok}`);
    if (ok) fs.writeFileSync(path.join(dir, `${name}.jpg`), b);
  }
})();
