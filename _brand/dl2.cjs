const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Ayrton/Desktop/doorso/_brand/fb';
fs.mkdirSync(dir, { recursive: true });

const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Referer': 'https://www.facebook.com/',
  'Origin': 'https://www.facebook.com',
  'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'pl-PL,pl;q=0.9,en;q=0.8',
  'Sec-Fetch-Dest': 'image',
  'Sec-Fetch-Mode': 'no-cors',
  'Sec-Fetch-Site': 'cross-site',
};

const items = [
  ['cover-hero', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/469221483_122167154612261379_6677805615632836113_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s960x960&_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=kZp5vdPss1cQ7kNvwEI_4aN&_nc_oc=AdqQ4Wr-LWAigDhzDfm5YP62Uqyc-mnGz86mHCS2R4PJKXvReMveapAVPt18QiRZkJw&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=Zd-ovkToya4C5zULAn61TA&_nc_ss=79289&oh=00_AQMoD0CXTdNTXcX68SE8xmMEhOZqswhKE-d_3SG1yylj2g&oe=6ADE6BAF'],
  ['logo-avatar', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/469221483_122167154612261379_6677805615632836113_n.jpg?stp=dst-jpg_fb50_s320x320_tt6&_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=kZp5vdPss1cQ7kNvwEI_4aN&_nc_oc=AdqQ4Wr-LWAigDhzDfm5YP62Uqyc-mnGz86mHCS2R4PJKXvReMveapAVPt18QiRZkJw&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=Og2omzsK4wDnRoqqbE7JCQ&_nc_ss=79289&oh=00_AQOhV3RoD798qVgVBHxRLAdZjtwWGO8CQiJxxDKWXCqRsQ&oe=6ADE6BAF'],
  ['finishing-variants', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/824287297_122257089698261379_6316962658011906995_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1484&ctp=s1178x1484&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GNegf1itdt0Q7kNvwGnEqOo&_nc_oc=AdqtXJgCIYSzviW1vfS5_jIOxcrIJ0Xe7LKIi2g4AmoKC8qH2A7sqxrOnv8cFkFQPvs&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=fuxKn3tNBtRhF33DW7I4RQ&_nc_ss=79289&oh=00_AQOFSGxluSck-F1ssX2bUVKefW3c4mZFrRaBmuyr5bzkwA&oe=6ADE78BD'],
  ['barn-sliding-door', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/824946271_122257089740261379_958644216419405962_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1539&ctp=s1178x1539&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ET6mtRqGszYQ7kNvwHCf_8D&_nc_oc=AdqKyYZXHZ72tgrQiBe27_7CtYdL--AC0BPY-HkPfo1UgsCIomZNYR-Ah6xSGZ1iraw&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=Yx4zE3VZHN6NJh4eGpBCrQ&_nc_ss=79289&oh=00_AQPBip0rhuT7Rc_zMSIILjpS6ZquU13gLNb6QvskL_c7ig&oe=6ADE5DC4'],
  ['oak-wood', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/821699141_122257089782261379_2829264817293109269_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1545&ctp=s1178x1545&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=hpRu6VT5ZZQQ7kNvwHhctbj&_nc_oc=AdrkbPv1TvqZSVvCu2qLOOFx9o0JOoMOZC_xIyr6DWAKKuSvdHnD9POmfSFN23K8PF0&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=Ry-bom7nhmr2o_q-fE3w6A&_nc_ss=79289&oh=00_AQO943mqefjR47QvMegUjRp7JOPZcleY4DSeSZusZZ0kpg&oe=6ADE6B6A'],
  ['plank', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/825127760_122257089824261379_8805427742163959821_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1541&ctp=s1178x1541&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=lBIbWgUljDIQ7kNvwF98kaY&_nc_oc=AdoG2QfJIuzr1luKSOcUggoElMjiz7LNMWPNcMmNQQueL7dvc5Ksxwj0E43Q_Pz7Vy8&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=banmjg374vfpJOyWKwh_GA&_nc_ss=79289&oh=00_AQOQRysyQt5XzKYCll9QRM4E4ZfbvE-FPpBz7soe87dMVg&oe=6ADE8924'],
  ['oak-wood-2', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/822726575_122257089866261379_1313375115241461027_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1556&ctp=s1178x1556&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=8UT3xSmlb-EQ7kNvwGFlS7J&_nc_oc=AdompmUt-72MlyIzU1FmWfZN5Lutk3lrbAhFznrtaI_oC4M_Mya1BxRdzT3v0X1tYdc&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=Gg48cTwFVutzWkQt6l_H_w&_nc_ss=79289&oh=00_AQPs-OLrjJSIweF3GQGy9UgaUXR8hm2DzYqOB7qapS_QlA&oe=6ADE6392'],
  ['panel-1', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/825178137_122257089908261379_516640299443547562_n.jpg?stp=dst-jpg_tt6&cstp=mx1179x1553&ctp=s1179x1553&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=sg6ukHZiEZAQ7kNvwFUkHTa&_nc_oc=AdpSrAayCRqBzHa6ds28fE_0dc4CAEgzRHy6HF2_ZJOnjKll8acHSE5kkafQ7d7KA1E&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=4-2CIxyZ56zT5tfq6t4FBQ&_nc_ss=79289&oh=00_AQOdnZ8kacxdMhxTe9lETghaZ0WDU_gOm_vLobzfn5RKQg&oe=6ADE856E'],
  ['panel-2', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/824179875_122257089950261379_8501353018986171609_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1551&ctp=s1178x1551&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-f-DYTGi3U8Q7kNvwHdT44f&_nc_oc=AdqPVkzzx6EYWIoRA1_v7SAVSUZEf9x7TGswalJO0JdmnKrVPZq_z3VX_jTn8kCnghM&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=wZwCP-Y8LeoWcJ1kWvSh3g&_nc_ss=79289&oh=00_AQPiar3tr2mGEoteRRCq4TGbaRa8EvpasBol5-06qLC8kw&oe=6ADE861B'],
  ['plank-2', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/824401116_122257089992261379_8052463573929283779_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1541&ctp=s1178x1541&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=onm88t3G4zsQ7kNvwEk-B6G&_nc_oc=AdrveqkLvNk-KQGMXqe_EGoDR0QCrd5yhbO-I0YBkhYHCkpGaqAsD64hUvc0wgNZDmc&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=8Q3hczFDKnCPXBzHDSva_A&_nc_ss=79289&oh=00_AQPtK8oTBqOx_UWVYEz2fbcsS_Y021e4WKpcxaL7bqAbIw&oe=6ADE7095'],
];

(async () => {
  for (const [name, url] of items) {
    try {
      const r = await fetch(url, { headers: H });
      const b = Buffer.from(await r.arrayBuffer());
      const isJpg = b.slice(0, 3).toString('hex') === 'ffd8ff';
      console.log(`${name}: status=${r.status} len=${(b.length / 1024).toFixed(1)}KB jpg=${isJpg}`);
      if (r.ok && isJpg && b.length > 8000) {
        fs.writeFileSync(path.join(dir, `${name}.jpg`), b);
      }
    } catch (e) {
      console.log(`${name}: ERR ${e.message}`);
    }
  }
  console.log('--- saved ---');
  for (const f of fs.readdirSync(dir)) console.log(' ', f, (fs.statSync(path.join(dir, f)).size / 1024).toFixed(1) + 'KB');
})();
