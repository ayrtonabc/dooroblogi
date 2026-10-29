const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Ayrton/Desktop/doorso/_brand/fb';
fs.mkdirSync(dir, { recursive: true });

const HDRS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Referer': 'https://www.facebook.com/',
  'Origin': 'https://www.facebook.com',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Accept-Language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
  'Sec-Fetch-Dest': 'image',
  'Sec-Fetch-Mode': 'no-cors',
  'Sec-Fetch-Site': 'cross-site',
  'Sec-Ch-Ua': '"Chromium";v="131", "Not_A Brand";v="24"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
};

const urls = {
  sedo1: 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/824946271_122257089740261379_958644216419405962_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1539&ctp=s590x590&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ET6mtRqGszYQ7kNvwHCf_8D&_nc_oc=AdqKyYZXHZ72tgrQiBe27_7CtYdL--AC0BPY-HkPfo1UgsCIomZNYR-Ah6xSGZ1iraw&_nc_zt=',
  sedo2: 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/824287297_122257089698261379_6316962658011906995_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1484&ctp=s590x590&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GNegf1itdt0Q7kNvwGnEqOo&_nc_oc=AdqtXJgCIYSzviW1vfS5_jIOxcrIJ0Xe7LKIi2g4AmoKC8qH2A7sqxrOnv8cFkFQPvs&_nc_zt',
};

(async () => {
  for (const [name, u] of Object.entries(urls)) {
    const variants = {
      browserHeaders: u,
      withOhOeGuess: u + '&_nc_ht=scontent-waw2-2.xx',
      pathOnly: u.split('?')[0],
    };
    for (const [tag, v] of Object.entries(variants)) {
      try {
        const r = await fetch(v, { headers: HDRS });
        const b = Buffer.from(await r.arrayBuffer());
        console.log(`${name} [${tag}] status=${r.status} len=${b.length} head=${b.slice(0, 4).toString('hex')} body=${b.slice(0, 40).toString('utf8')}`);
        if (r.ok && b.slice(0, 3).toString('hex') === 'ffd8ff' && b.length > 20000) {
          fs.writeFileSync(path.join(dir, `${name}.jpg`), b);
          console.log(`  -> saved ${name}.jpg`);
        }
      } catch (e) {
        console.log(`${name} [${tag}] ERR ${e.message}`);
      }
    }
  }
})();
