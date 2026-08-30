/**
 * Utility to export CRM leads to a downloadable CSV file.
 * Columns: ID, Name, Mobile, Email, Company, Product Interest, Source, Status, Lead Score, Created Date.
 * @param {Array} leads - Optional leads array to export. If omitted, falls back to API or localStorage cache.
 */
export function exportLeadsToCSV(leads = null) {
  try {
    let leadsToExport = leads;

    if (!leadsToExport || !Array.isArray(leadsToExport)) {
      const rawData = typeof window !== 'undefined' ? localStorage.getItem('ue_crm_leads') : null;
      if (rawData) {
        leadsToExport = JSON.parse(rawData);
      }
    }

    if (!leadsToExport || !Array.isArray(leadsToExport) || leadsToExport.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = [
      'Lead ID',
      'Name',
      'Mobile',
      'Email',
      'Company',
      'Product Interest',
      'Source',
      'Status',
      'Lead Score',
      'Created Date'
    ];

    const escapeValue = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [headers.join(',')];

    leadsToExport.forEach((l) => {
      const row = [
        l.id || '',
        l.name || '',
        l.mobile || '',
        l.email || '',
        l.company || '',
        l.productInterest || '',
        l.source || '',
        l.status || '',
        l.leadScore !== undefined ? l.leadScore : 50,
        l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : (l.createdDate || '')
      ];
      csvRows.push(row.map(escapeValue).join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `universal_enterprise_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export leads to CSV:', error);
  }
}

export default exportLeadsToCSV;
