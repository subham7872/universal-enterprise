/**
 * Utility to export CRM leads from localStorage ('ue_crm_leads') to a downloadable CSV format.
 * Columns: Name, Mobile, Email, Company, Product Interested, Source, Status, and Created Date.
 */
export function exportLeadsToCSV(): void {
  try {
    const rawData = localStorage.getItem('ue_crm_leads');
    if (!rawData) {
      console.warn("No CRM leads found in localStorage under key 'ue_crm_leads'.");
      return;
    }

    const leads = JSON.parse(rawData);
    if (!Array.isArray(leads)) {
      console.error("Parsed 'ue_crm_leads' is not a valid array.");
      return;
    }

    const headers = [
      'Name',
      'Mobile',
      'Email',
      'Company',
      'Product Interested',
      'Source',
      'Status',
      'Created Date'
    ];

    const escapeValue = (val: any): string => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [headers.join(',')];

    leads.forEach((l: any) => {
      const row = [
        l.name || '',
        l.mobile || '',
        l.email || '',
        l.company || '',
        l.productInterest || '',
        l.source || '',
        l.status || '',
        l.createdDate || ''
      ];
      csvRows.push(row.map(escapeValue).join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ue_crm_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Failed to export leads to CSV: ", error);
  }
}
