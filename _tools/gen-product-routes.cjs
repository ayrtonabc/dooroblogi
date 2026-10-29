/** Generuje trasy produktów (getStaticPaths) dla trzech języków. */
const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Ayrton/Desktop/doorso/src/pages';

const TARGETS = [
  { locale: 'pl', dir: 'produkty' },
  { locale: 'en', dir: 'en/products' },
  { locale: 'de', dir: 'de/produkte' },
];

const SEO = {
  pl: {
    titleSuffix: ' — Doors Obłogi',
    og: '',
  },
  en: { titleSuffix: ' — Doors Obłogi', og: '' },
  de: { titleSuffix: ' — Doors Obłogi', og: '' },
};

for (const target of TARGETS) {
  const { locale, dir } = target;
  const file = path.join(root, dir, '[slug].astro');
  const depth = dir.split('/').length;

  const content = `---
import BaseLayout from '${'../'.repeat(depth)}layouts/BaseLayout.astro';
import ProductView from '${'../'.repeat(depth)}views/ProductView.astro';
import { products } from '${'../'.repeat(depth)}content/products';
import { productPath } from '${'../'.repeat(depth)}i18n';

const locale = '${locale}' as const;

export function getStaticPaths() {
  return products.map((product) => ({
    params: { slug: product.slug.${locale} },
    props: { product },
  }));
}

const { product } = Astro.props;

const alternates = {
  pl: productPath('pl', product.slug.pl),
  en: productPath('en', product.slug.en),
  de: productPath('de', product.slug.de),
};

const path = \`${'${'}productPath(locale, product.slug.${locale})}\`;
---

<BaseLayout
  locale={locale}
  path={path}
  title={\`\${product.seoTitle.${locale}}\${'${'}SEO.${locale}.titleSuffix}\`}
  description={product.seoDescription.${locale}}
  alternates={alternates}
>
  <ProductView locale={locale} product={product} />
</BaseLayout>
`;

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  console.log('wrote', path.relative(root, file).replace(/\\/g, '/'));
}
