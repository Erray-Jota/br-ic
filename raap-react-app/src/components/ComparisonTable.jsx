import { FONTS, COLORS, SPACING } from '../styles/theme';

const ComparisonTable = ({ headerBg, borderColor, rows, columns = ['Metric', 'RaaP', 'Status Quo'] }) => {
  return (
    <div style={{ background: COLORS.white, padding: SPACING['2xl'], borderRadius: '12px', marginBottom: SPACING.lg, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: FONTS.sizes.lg, fontFamily: FONTS.system }}>
        <thead>
          <tr style={{ background: headerBg, borderBottom: `4px solid ${borderColor}` }}>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: FONTS.weight.black, color: COLORS.white, fontSize: FONTS.sizes.lg }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} style={{ borderBottom: `2px solid ${COLORS.gray.border}`, background: index % 2 === 0 ? COLORS.gray.bg : COLORS.white }}>
              <td style={{ padding: SPACING.lg, fontWeight: FONTS.weight.heavy, color: COLORS.gray.dark, fontSize: FONTS.sizes.lg }}>{row.label}</td>
              <td style={{ padding: SPACING.lg, color: COLORS.green.dark, fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>✓ {row.smart}</td>
              <td style={{ padding: SPACING.lg, color: '#6b7280', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>✗ {row.traditional}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
