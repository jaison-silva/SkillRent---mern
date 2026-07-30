import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacements = [
  { file: 'src/features/admin/components/AdminCouponsTab.tsx', find: /\(\$\)/g, replace: '(₹)' },
  { file: 'src/features/admin/components/AdminCouponsTab.tsx', find: /'%' : '\$'/g, replace: "'%' : '₹'" },
  
  { file: 'src/features/admin/components/AdminMembershipsTab.tsx', find: /\$\{plan.price\}/g, replace: '₹{plan.price}' },
  
  { file: 'src/features/admin/components/AdminOffersTab.tsx', find: /\(\$\)/g, replace: '(₹)' },
  { file: 'src/features/admin/components/AdminOffersTab.tsx', find: /'%' : '\$'/g, replace: "'%' : '₹'" },
  
  { file: 'src/features/job/components/CreateJobForm.tsx', find: /Budget \(\$\)/g, replace: 'Budget (₹)' },
  { file: 'src/features/job/components/EditJobForm.tsx', find: /Budget \(\$\)/g, replace: 'Budget (₹)' },
  
  { file: 'src/features/job/components/JobDetailedView.tsx', find: /\$\{job.budget\}/g, replace: '₹{job.budget}' },
  { file: 'src/features/job/pages/JobBoardPage.tsx', find: /\$\{job.budget\}/g, replace: '₹{job.budget}' },
  { file: 'src/features/job/pages/UserJobsPage.tsx', find: /\$\{job.budget\}/g, replace: '₹{job.budget}' },
  
  { file: 'src/features/provider/pages/providerDashboardPage.tsx', find: /Budget: \$\{job\.budget\}/g, replace: 'Budget: ₹{job.budget}' },
  
  { file: 'src/pages/OffersPage.tsx', find: /'%' : '\$'/g, replace: "'%' : '₹'" },
  
  { file: 'src/pages/PricingPage.tsx', find: /\$([0-9]+)/g, replace: '₹$1' },
];

replacements.forEach(({ file, find, replace }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(find, replace);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
