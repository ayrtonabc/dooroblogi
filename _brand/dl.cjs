const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Ayrton/Desktop/doorso/_brand/fb';
fs.mkdirSync(dir, { recursive: true });

const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.facebook.com/',
  'Accept': 'image/avif,image/webp,image/*,*/*;q=0.8',
};

const base = [
  ['cover', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/469221483_122167154612261379_6677805615632836113_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s960x960&_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=kZp5vdPss1cQ7kNvwEI_4aN&_nc_oc=AdqQ4Wr-LWAigDhzDfm5YP62Uqyc-mnGz86mHCS2R4PJKXvReMveapAVPt18QiRZkJw&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=Zd-ovkToya4C5zULAn61TA&_nc_ss=79289&oh=00_AQMoD0CXTdNTXcX68SE8xmMEhOZqswhKE-d_3SG1yylj2g&oe=6ADE6BAF'],
  ['avatar', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/469221483_122167154612261379_6677805615632836113_n.jpg?stp=dst-jpg_fb50_s320x320_tt6&_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=kZp5vdPss1cQ7kNvwEI_4aN&_nc_oc=AdqQ4Wr-LWAigDhzDfm5YP62Uqyc-mnGz86mHCS2R4PJKXvReMveapAVPt18QiRZkJw&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=Zd-ovkToya4C5zULAn61TA&_nc_ss=79289&oh=00_AQNVfcL1E34YluJ-3chY9ypDwUY7ThJbwkYcBMmGQQDlLQ&oe=6ADE6BAF'],
  ['sedo1', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/824946271_122257089740261379_958644216419405962_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1539&ctp=s590x590&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ET6mtRqGszYQ7kNvwHCf_8D&_nc_oc=AdqKyYZXHZ72tgrQiBe27_7CtYdL--AC0BPY-HkPfo1UgsCIomZNYR-Ah6xSGZ1iraw&_nc_zt='],
  ['sedo2', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/824287297_122257089698261379_6316962658011906995_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1484&ctp=s590x590&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GNegf1itdt0Q7kNvwGnEqOo&_nc_oc=AdqtXJgCIYSzviW1vfS5_jIOxcrIJ0Xe7LKIi2g4AmoKC8qH2A7sqxrOnv8cFkFQPvs&_nc_zt'],
  ['sedo3', 'https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/821699141_122257089782261379_2829264817293109269_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1545&ctp=s590x590&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=hpRu6VT5ZZQQ7kNvwHhctbj&_nc_oc=AdrkbPv1TvqZSVvCu2qLOOFx9o0JOoMOZC_xIyr6DWAKKuSvdHnD9POmfSFN23K8PF0&_nc_zt'],
  ['sedo4', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/822726575_122257089866261379_1313375115241461027_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1556&ctp=s590x590&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=8UT3xSmlb-EQ7kNvwGFlS7J&_nc_oc=AdompmUt-72MlyIzU1FmWfZN5Lutk3lrbAhFznrtaI_oC4M_Mya1BxRdzT3v0X1tYdc&_nc_zt'],
  ['sedo5', 'https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/825127760_122257089824261379_8805427742163959821_n.jpg?stp=dst-jpg_tt6&cstp=mx1178x1541&ctp=s590x590&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=lBIbWgUljDIQ7kNvwF98kaY&_nc_oc=AdoG2QfJIuzr1luKSOcUggoElMjiz7LNMWPNcMmNQQueL7dvc5Ksxwj0E43Q_Pz7Vy8&_nc_zt'],
];

(async () => {
  const report = [];
  for (const [name, url] of base) {
    const variants = [
      ['full', url],
      ['nocTP', url.replace(/&ctp=s\d+x\d+/, '')],
      ['nosig', url.split('?')[0] + '?stp=dst-jpg_tt6&cstp=mx1178x1539'],
    ];
    let saved = false;
    for (const [tag, v] of variants) {
      try {
        const r = await fetch(v, { headers: H });
        const buf = Buffer.from(await r.arrayBuffer());
        if (r.ok && buf.length > 5000 && buf.slice(0, 3).toString('hex') === 'ffd8ff') {
          fs.writeFileSync(path.join(dir, `${name}.jpg`), buf);
          report.push(`OK   ${name} [${tag}] ${(buf.length / 1024).toFixed(0)}KB`);
          saved = true;
          break;
        }
        report.push(`FAIL ${name} [${tag}] status=${r.status} len=${buf.length}`);
      } catch (e) {
        report.push(`ERR  ${name} [${tag}] ${e.message}`);
      }
    }
    if (!saved) report.push(`MISS ${name}`);
  }
  console.log(report.join('\n'));
  console.log('--- files ---');
  for (const f of fs.readdirSync(dir)) {
    console.log(f, fs.statSync(path.join(dir, f)).size);
  }
})();
